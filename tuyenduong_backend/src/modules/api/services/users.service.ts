import { Department } from 'src/models/Achievement/department.entity';
import { Submission } from 'src/models/Achievement/submission.entity';
import { Result } from 'src/models/Achievement/result.entity';
import { Role } from './../../../common/enum';
import { Auditors } from './../../../Dto/auditor.dto';
import { ContactInfo } from './../../../models/Achievement/contactInfo.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  // InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Connection,
  In,
  DeleteResult,
  Like,
  Not,
  ILike,
  getRepository,
} from 'typeorm';
import User from 'src/models/Achievement/user.entity';
import * as bcrypt from 'bcrypt';

import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class UsersService extends TypeOrmQueryService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ContactInfo)
    private contactInfoRepository: Repository<ContactInfo>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private connection: Connection,
  ) {
    super(usersRepository, { useSoftDelete: true });
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException('Tài khoản không tồn tại ', HttpStatus.NOT_FOUND);
  }

  async checkAndCreateUser(auditors: Auditors[]) {
    return await Promise.all(
      auditors.map(async (user) => {
        const findUser: User = await this.getByEmail(user.label);
        if (findUser.role === Role.ADMIN)
          throw new HttpException(
            'không thể phân admin vào hội đồng xét duyệt',
            HttpStatus.BAD_REQUEST,
          );
        return findUser;
      }),
    );
  }

  async getAll(keyword?: string, except?: string) {
    if (keyword !== undefined) {
      if (keyword === '') keyword = '2309u4wejjsdflkjs';
      const [result, total] = await this.usersRepository.findAndCount({
        where: { email: Like(`%${keyword}%`) },
        order: { createdAt: 'ASC' },
      });
      return result;
    }
    if (except !== undefined) {
      return await this.usersRepository.find({
        where: { role: Not(except) },
        order: { createdAt: 'ASC' },
      });
    }
    return await this.usersRepository.find();
  }

  async getByIds(ids: number[]) {
    return this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async getById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['department'],
        where: { id },
      });
      const info = await this.contactInfoRepository.findOne({
        where: { user: { id } },
      });
      if (user) {
        user.contactInfoId = info;
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getNameAndEmailById(id: number) {
    try {
      const user = await this.usersRepository.findOne({
        select: ['name', 'surName', 'email'],
        where: { id },
      });

      if (user) {
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserByDepartment(id: number) {
    try {
      if (id === undefined) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Id are required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const department = await this.departmentRepository.findOne({
        where: { id },
      });

      if (!department) {
        return new HttpException(
          'Department does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      const users = await this.usersRepository.find({
        where: {department: id}
      });
      if (!users) {
        return new HttpException(
          'Users with this department Id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      return users;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(
        'Users with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getByMssv(mssv: string) {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['department'],
        where: { id: mssv },
      });
      const info = await this.contactInfoRepository.findOne({
        where: { user: { id: user?.id } },
      });
      if (user) {
        user.contactInfoId = info;
        return user;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserSubmission(
    achievement: number,
    page: number,
    limit: number,
    keyword = '',
  ) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surName AS surName',
        'user.email AS email',
        'user.mssv AS mssv',
      ])
      .addSelect('department.name', 'department')
      .addSelect('department.id', 'departmentid')
      .addSelect('submission.updatedAt', 'updatedAt')
      .addSelect('submission.isVerified', 'isVerified')
      .innerJoin(
        Submission,
        'submission',
        `submission.user.id = user.id AND submission.achievement.id = ${achievement}`,
      )
      .innerJoin(Department, 'department', `department.id = user.department.id`)
      .where(
        ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email OR department.name ILIKE :department`,
        {
          fullName: `%${keyword}%`,
          mssv: `%${keyword}%`,
          email: `%${keyword}%`,
          department: `%${keyword}%`,
        },
      )
      .orderBy('submission.updatedAt', 'DESC')
      .getRawMany();

    const dataUnique = data.filter(
      (item, index, self) =>
        self.map((item) => item.id).indexOf(item.id) === index,
    );

    return {
      data: dataUnique.slice((newPage - 1) * limit, page * limit),
      count: dataUnique.length,
    };
  }

  async getUserSubmissionStatistic(
    achievement: number,
    page: number,
    limit: number,
    keyword = '',
  ) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surName AS surName',
        'user.email AS email',
        'user.mssv AS mssv',
        'result.result'
      ])
      .addSelect('department.name', 'department')
      .addSelect('department.id', 'departmentid')
      .addSelect('submission.updatedAt', 'updatedAt')
      .addSelect('submission.isVerified', 'isVerified')
      .innerJoin(
        Submission,
        'submission',
        `submission.user.id = user.id AND submission.achievement.id = ${achievement}`,
      )
      .leftJoin(
        Result,
        'result',
        `result.examer.id = user.id AND result.final = true`,
      )
      .innerJoin(Department, 'department', `department.id = user.department.id`)
      .where(
        ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email OR department.name ILIKE :department`,
        {
          fullName: `%${keyword}%`,
          mssv: `%${keyword}%`,
          email: `%${keyword}%`,
          department: `%${keyword}%`,
        },
      )
      .orderBy('submission.updatedAt', 'DESC')
      .getRawMany();

    const dataUnique = data.filter(
      (item, index, self) =>
        self.map((item) => item.id).indexOf(item.id) === index,
    );

    return {
      data: dataUnique.slice((newPage - 1) * limit, page * limit),
      count: dataUnique.length,
    };
  }

  async getUserUnit(
    page: number,
    limit: number,
    keyword = '',
    codeDepartment: string,
    role = Role.PARTICIPANT,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.surName AS surName',
        'user.email AS email',
        'user.mssv AS mssv',
      ])
      .addSelect('department.name', 'department')
      .innerJoin(Department, 'department', `department.id = user.department.id`)
      .where(
        `department.code = :codeDepartment AND user.role = :role AND (user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email) `,
        {
          fullName: `%${keyword}%`,
          mssv: `%${keyword}%`,
          email: `%${keyword}%`,
          codeDepartment: codeDepartment,
          role: role,
        },
      )
      .orderBy('user.updatedAt', 'DESC')
      .getRawMany();

    const dataUnique = data.filter(
      (item, index, self) =>
        self.map((item) => item.id).indexOf(item.id) === index,
    );

    return {
      data: dataUnique.slice((newPage - 1) * limit, page * limit),
      count: dataUnique.length,
    };
  }

  async createWithGoogle(email: string, name: string) {
    try {
      const newUser = this.usersRepository.create({
        email,
        name,
        isRegisteredWithGoogle: true,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('Error creating user with google', error.message);
      throw new error();
    }
  }

  async createAdminWithGoogle(email: string, name: string) {
    try {
      const newUser = this.usersRepository.create({
        email,
        name,
        role: Role.ADMIN,
        isRegisteredWithGoogle: true,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('Error creating admin with google', error.message);
      throw new error();
    }
  }

  async update(id: number, manager: any) {
    try {
      if (manager.role != Role.DEPARTMENT) {
        await this.usersRepository.save({
          id: id,
          role: manager.role,
          isUpdatedInformation: false,
        });
      } else {
        await this.usersRepository.save({ id: id, role: manager.role, department: manager.department });
      }
      return this.usersRepository.findOne(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  async allowUpdate(id: number) {
    try {
      const user = await this.usersRepository.findOne(id);

      await this.usersRepository.save({
        id: id,
        email: user.email,
        isUpdatedInformation: false,
      });

      return this.usersRepository.findOne(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  async create(email: string, role: Role) {
    try {
      const user = await this.usersRepository.findOne({ email });

      if (user) {
        if (role === Role.PARTICIPANT) {
          await this.usersRepository.save({
            id: user.id,
            role: role,
            isUpdatedInformation: false,
          });
        } else {
          await this.usersRepository.save({ id: user.id, role: role });
        }
        return { ...user, role: role };
      } else return await this.usersRepository.save({ email, role });
    } catch (error: any) {
      try {
        const user = await this.findDeletedWithEmail(email);
        if (user.length === 0) return null;
        await this.usersRepository.save({
          id: user[0].id,
          role: role,
          deletedAt: null,
        });
        return { ...user[0], role: role };
      } catch (e: any) {
        console.log('Error when restoring user', e.message);
      }
      console.error('error in user create service:', error.message);
    }
  }

  async createUserForDepartment(email: string, role: Role, department: number) {
    try {
      if (
        email === undefined || role === undefined || department === undefined
      ) {
        return new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Id, Role and department are required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (role !== Role.DEPARTMENT) {
        return new HttpException('Given wrong role', HttpStatus.CONFLICT);
      }

      const user = await this.usersRepository.findOne({ email });
      if (user) {
        return new HttpException('User have been created', HttpStatus.CONFLICT);
      }

      const deparment = await this.departmentRepository.findOne({ id: department });
      if (!deparment) {
        return new HttpException('Deparment does not found', HttpStatus.NOT_FOUND);
      }

      const newUser = await this.usersRepository.save({
        email: email,
        role: role,
        department: deparment,
      });
      if (!newUser) {
        return new HttpException(
          'Cannot create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newUser;
    } catch (error: any) {
      throw new HttpException(
        'Cannot create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async createSV(id: number, info: ContactInfo) {
  //   try {
  //     await this.update(id, info);
  //     const contactInfo = this.contactInfoRepository.create({
  //       user: this.usersRepository.create({ id }),
  //       ...info,
  //     });
  //     return await this.contactInfoRepository.save(contactInfo);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async createInfoSV(user: User, info: any) {
    try {
      //console.log('Info create: ', info);
      const contactInfo = this.contactInfoRepository.create({
        user: user,
        ...info,
      });
      await this.usersRepository.update(user.id, {
        hasContactInfo: true,
      });
      return await this.contactInfoRepository.save(contactInfo);
    } catch (error) {
      console.log('Error creating info student:', error.message);
    }
  }

  async getContactinfo(id: number) {
    try {
      const data = await this.contactInfoRepository.find({
        relations: ['user'],
      });

      return data.filter((item) => item.user !== null && item.user.id === id);
    } catch (err: any) {
      console.log('Error get contact data:', err);
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserWithDY(userId: number) {
    try {
      const data = await this.usersRepository.find({
        relations: ['department'],
      });
      return data.filter((item) => item.id === userId);
    } catch (err: any) {
      console.log(
        'Error getting user data with department: ',
        err,
      );
    }
  }

  async createInfoTeacher(user: User, info: any) {
    try {
      //console.log('Info create: ', info);
      const contactInfo = this.contactInfoRepository.create({
        user: user.id,
        ...info,
      });
      await this.usersRepository.update(user.id, {
        hasContactInfo: true,
      });
      return await this.contactInfoRepository.save(contactInfo);
    } catch (error) {
      console.log('Error when creating info teacher', error);
    }
  }

  async updateInfo(user: User, info: any) {
    try {
      //console.log(user);
      //console.log(info);
      await this.contactInfoRepository.update(info.id, info);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.log('error updating user', error.message);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    try {
      const user = await this.getById(userId);

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken,
      );

      if (isRefreshTokenMatching) {
        return user;
      }
    } catch (error: any) {
      throw new HttpException(
        'Đã có lỗi xảy ra,vui lòng đăng nhập lại!',
        HttpStatus.CONFLICT,
      );
      console.log(error.message);
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    try {
      const deletingUser: User = await this.usersRepository.findOne(id);
      if (!deletingUser) throw { code: 'USER_NOT_FOUND' };
      return await this.usersRepository.softDelete(id);
    } catch (error: any) {
      console.error(error.message);
    }
  }
  async getQuery(page: number, limit: number, keyword = '', except = '') {
    const newPage = page <= 0 ? 1 : page;
    const [result, total] = await this.usersRepository.findAndCount({
      where: [
        { name: ILike(`%${keyword}%`), role: Not(except) },
        { email: ILike(`%${keyword}%`), role: Not(except) },
        { surName: ILike(`%${keyword}%`), role: Not(except) },
      ],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: (newPage - 1) * limit,
    });
    return {
      data: result,
      count: total,
    };
  }

  async getQueryUser(
    page: number,
    limit: number,
    keyword = '',
    role = Role.PARTICIPANT,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const [result, total] = await this.usersRepository.findAndCount({
      where: [
        { name: ILike(`%${keyword}%`), role: role },
        { email: ILike(`%${keyword}%`), role: role },
        { surName: ILike(`%${keyword}%`), role: role },
      ],
      order: { updatedAt: 'DESC' },
      take: limit,
      skip: (newPage - 1) * limit,
    });
    return {
      data: result,
      count: total,
    };
  }

  async countRow(): Promise<User[]> {
    return await this.usersRepository.query('SELECT * FROM public.user');
  }
  async findDeletedWithEmail(email: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: { email: email },
      withDeleted: true,
    });
  }
}
