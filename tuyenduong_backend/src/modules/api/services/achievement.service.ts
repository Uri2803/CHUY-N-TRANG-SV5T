import * as moment from 'moment'
import { Result } from './../../../models/Achievement/result.entity';
import { Department } from './../../../models/Achievement/department.entity';
import { Lock, Role } from './../../../common/enum';
import { Criteria } from 'src/models/Achievement/criteria.entity';
import { Achievement } from '../../../models/Achievement/achievement.entity';
import { User } from './../../../models/Achievement/user.entity';
import { Submission } from 'src/models/Achievement/submission.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import {
  DeleteResult,
  ILike,
  Repository,
  getRepository,
  In,
  Raw,
} from 'typeorm';
import { SubmissionService } from './submission.service';
import { UsersService } from './users.service';

import { AchievementDto } from 'src/Dto/achievement.dto';
import postgresErrorCode from 'src/database/postgresErrorCode.enum';
import { Auditors } from 'src/Dto/auditor.dto';
import { Auditor } from 'src/models/Achievement/auditor.entity';

@Injectable()
export class AchievementService extends TypeOrmQueryService<Achievement> {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Auditor)
    private auditorRepository: Repository<Auditor>,
    @InjectRepository(Criteria)
    private criteriaRepository: Repository<Criteria>,
    private submissionService: SubmissionService,
    private userService: UsersService,
  ) {
    super(achievementRepository, { useSoftDelete: true });
  }

  async getAll(type: string) {
    const result = this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      order: { createdAt: 'DESC' },
      where: { type },
    });
    return result;
  }

  async getListAchievementAuditorByUserId(id: number) {
    try { 
      const all = await this.getAll('ACHIEVEMENT')
      const result = []
      for (let i = 0; i < all.length; i++) 
      {
        if (all[i].auditorFinal && all[i].auditorFinal.id == id){
          result.push(all[i].id)
        } else if (all[i].auditors && all[i].auditors.map((r) => r.id).includes(id)){
          result.push(all[i].id)
        }
      }
      return result
    }
    catch (error) {
      console.log('Error achievement', error.message);
      throw new error();
    }
  }

  async getStatisticAchievement(achievement: number): Promise<any> {
    try {
      const isAchievement = await this.achievementRepository.findOne({id: achievement});
      if (!isAchievement) {
        throw new HttpException(
        'Achievement with id not found',
        HttpStatus.NOT_FOUND,
      );}

      const { data, count } = await this.userService.getUserSubmissionStatistic(
        +achievement,
        1,
        999,
        '',
      );
      if (!data) {
        throw new HttpException(
        'Cannot get submission',
        HttpStatus.BAD_REQUEST,
      );}
      const department = await this.departmentRepository.find({});
      const result = []
      for (let i = 0; i < department.length; i++) {
        result.push({
          name: department[i].name,
          no_confirmed: data.filter(function (value) { 
            return value.isVerified == true 
              && value.departmentid == department[i].id
          }).length,
          no_unconfirmed: data.filter(function (value) { 
            return value.isVerified == false 
              && value.departmentid == department[i].id
          }).length,
          no_all: data.filter(function (value) { 
            return value.departmentid == department[i].id
          }).length,
          no_result_0: data.filter(function (value) {
            return value.departmentid == department[i].id && value.result_result == 0 && value.isVerified == true 
          }).length,
          no_result_1: data.filter(function (value) {
            return value.departmentid == department[i].id && value.result_result == 1 && value.isVerified == true 
          }).length,
          no_result_2: data.filter(function (value) {
            return value.departmentid == department[i].id && value.result_result == 2 && value.isVerified == true 
          }).length,
        });
      }
      return result;
    } catch (error) {
      console.log('Error get statistic for achievement', error.message);
      throw new error();
    }
     
  }

  async getStatisticAchievementDepartment(achievement: number, departmentID: number): Promise<any> {
    try {
      const isAchievement = await this.achievementRepository.findOne({id: achievement});
      if (!isAchievement) {
        throw new HttpException(
        'Achievement with id not found',
        HttpStatus.NOT_FOUND,
      );}

      const { data, count } = await this.userService.getUserSubmissionStatistic(
        +achievement,
        1,
        999,
        '',
      );
      if (!data) {
        throw new HttpException(
        'Cannot get submission',
        HttpStatus.BAD_REQUEST,
      );}
      const department = await this.departmentRepository.findOne({ where: {id: departmentID}});
      const result = []
      result.push({
        name: department.name,
        no_confirmed: data.filter(function (value) { 
          return value.isVerified == true 
            && value.departmentid == department.id
        }).length,
        no_unconfirmed: data.filter(function (value) { 
          return value.isVerified == false 
            && value.departmentid == department.id
        }).length,
        no_all: data.filter(function (value) { 
          return value.departmentid == department.id
        }).length,
        no_result_0: data.filter(function (value) {
          return value.departmentid == department.id && value.result_result == 0 && value.isVerified == true 
        }).length,
        no_result_1: data.filter(function (value) {
          return value.departmentid == department.id && value.result_result == 1 && value.isVerified == true 
        }).length,
        no_result_2: data.filter(function (value) {
          return value.departmentid == department.id && value.result_result == 2 && value.isVerified == true 
        }).length,
      });
      return result[0];
    } catch (error) {
      console.log('Error get statistic for achievement', error.message);
      throw new error();
    }
     
  }

  async getQueryCheckAuditor(
    page: number,
    limit: number,
    keyword = '',
    user: User,
    type: string,
    running: boolean,
  ) {
    const newPage = page <= 0 ? 1 : page;
    const achievementList = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: { type },
    });

    var data = achievementList.reduce((pre, cur) => {
      const isExist = cur.auditors.find((aud) => aud.id === user.id);

      const isExistFinal = cur.auditorFinal
        ? cur.auditorFinal.id === user.id
        : false;
      if (isExistFinal) return [...pre, cur.id];
      if (isExist && cur.lock !== Lock.FOREVER) return [...pre, cur.id];
      return pre;
    }, []);
    if (running) {
      const runningAchievement = await this.getRunningAchievement(page, limit, keyword, user, type, true)
      data = [...new Set(runningAchievement.data.map(a => a.id).concat(data))]
    }
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: { name: ILike(`%${keyword}%`), id: In(data) },
      order: { createdAt: 'DESC' },
    });
    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getQuery(page: number, limit: number, keyword = '', type: string) {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
        endAt: Raw((alias) => `${alias} < NOW()`),
      },
      order: { createdAt: 'DESC' },
    });

    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getQueryAll(page: number, limit: number, keyword = '', type: string) {
    const newPage = page <= 0 ? 1 : page;
    const result = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
      },
      order: { createdAt: 'DESC' },
    });
    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getRunningAchievement(page: number, limit: number, keyword = '', user: User, type: string, isDepartment: boolean) {
    const newPage = page <= 0 ? 1 : page;
    const data = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
      },
      order: { createdAt: 'ASC' },
    });
    const now = moment()
    const result = data.filter(function (value) {
      const end = isDepartment ? moment(value.endAt) : moment(value.endSubmitAt);
      const start = moment(value.startAt);
      return (now.diff(end) <= 0 && now.diff(start) >= 0);
    })
    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getEndAchievement(page: number, limit: number, keyword = '', user: User, type: string, isDepartment: boolean) {
    const newPage = page <= 0 ? 1 : page;
    const data = await this.achievementRepository.find({
      relations: ['auditors', 'auditorFinal'],
      where: {
        type,
        name: ILike(`%${keyword}%`),
      },
      order: { createdAt: 'ASC' },
    });
    const now = moment()
    const result = data.filter(function (value) {
      const end = isDepartment ? moment(value.endAt) : moment(value.endSubmitAt);
      const start = moment(value.startAt);
      return (now.diff(end) >= 0 && now.diff(start) >= 0);
    })
    return {
      data: result.slice((newPage - 1) * limit, newPage * limit),
      count: result.length,
    };
  }

  async getStatus(id: number, userRequest: User) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors'],
      where: { id },
    });
    if (!achievement)
      throw new HttpException(
        'danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    if (achievement.lock === Lock.UNAVAILABLE)
      return { status: achievement.lock };
    if (achievement.auditorFinal.id === userRequest.id)
      return { status: Lock.UNLOCK };
    const user = achievement.auditors.find(
      (user) => user.id === userRequest.id,
    );
    if (!user && userRequest.role !== Role.MANAGER)
      throw new HttpException(
        'Người dùng không được phép truy cập',
        HttpStatus.BAD_REQUEST,
      );
    return { status: achievement.lock };
  }

  async setStatus(
    status: string,
    achievementId: number,
    userId: number,
    manager = false,
  ) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal'],
      where: { id: achievementId },
    });
    if (!achievement)
      throw new HttpException(
        'danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    if (achievement.auditorFinal.id !== userId) {
      if (!manager)
        throw new HttpException(
          'Không có quyền chỉnh sửa',
          HttpStatus.BAD_REQUEST,
        );
    }
    if (achievement.lock === Lock.FOREVER)
      throw new HttpException(
        'Thẩm định danh hiệu đã kết thúc',
        HttpStatus.BAD_REQUEST,
      );
    if (status === 'FOREVER') {
      const { count } = await this.submissionService.getSubmissionExamer(
        achievementId,
        1,
        1,
        '',
      );

      const resultUser = await this.getSummary(achievementId);
      if (resultUser.length !== count)
        throw new HttpException(
          'Phải duyệt hết hồ sơ mới có thể khóa phiên thẩm định hồ sơ này',
          HttpStatus.BAD_REQUEST,
        );
      achievement.lock = Lock[status];
    }
    achievement.lock = Lock[status];
    return await this.achievementRepository.save(achievement);
  }

  async saveAuditorFinal(id: number, user: User) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors'],
      where: { id },
    });
    if (achievement.auditorFinal?.email && user) {
      if (
        achievement.auditors.some(
          (user) => user.email === achievement.auditorFinal.email,
        )
      ) {
        throw new HttpException(
          'Không thể vừa là thành viên vừa là chủ tịch hội đồng xét duyệt',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Không thể có 2 chủ tịch hội đồng xét duyệt',
        HttpStatus.BAD_REQUEST,
      );
    }
    achievement.auditorFinal = user;
    return await this.achievementRepository.save(achievement);
  }

  async checkAuditorFinal(id: number, users: Auditors[]) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal'],
      where: { id },
    });
    if (achievement.auditorFinal?.email) {
      if (users.some((user) => user.label === achievement.auditorFinal.email))
        return true;
    }
    return false;
  }

  async saveUsers(id: number, users: User[], auditor: any) {
    const auditors = await this.auditorRepository.find({achievementID: id});
    await this.auditorRepository.remove(auditors);
    for (let i = 0; i < auditor.auditor.length; i++) {
      for (let j = 0; j < auditor.auditor[i].department.length; j++) {
        await this.auditorRepository.save({
          userID: auditor.auditor[i].value,
          departmentID: auditor.auditor[i].department[j],
          achievementID: id
        })
      }
    }
    const achievement = await this.getOne(id);
    achievement.auditors = users;
    return await this.achievementRepository.save(achievement);
  }

  async getChileById(id: number) {
    const achievement = await this.achievementRepository.findOne({
      relations: ['criterias'],
      where: {
        id,
      },
    });
    return achievement.criterias.map((cri) => cri.id);
  }

  async getOne(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      relations: ['auditorFinal', 'auditors', 'criterias'],
      where: { id },
    });
    if (!achievement)
      throw new HttpException(
        'Danh hiệu không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    return achievement;
  }

  async getDepartmentList(id: number, achievementId: number): Promise<any> {
    const auditor = await this.auditorRepository.find({
      where: { userID: id , achievementID: achievementId },
    });
    return auditor.map((au) => {return au.departmentID});
  }

  async manageUnit(
    id: number,
    data: { email: string; codeDepartment: string },
  ) {
    const achievement = await this.getOne(id);
    achievement.manageUnit = [
      ...achievement.manageUnit,
      `${data.email},${data.codeDepartment}`,
    ];
    return await this.achievementRepository.save(achievement);
  }

  async add(achievementDto: AchievementDto): Promise<Achievement> {
    try {
      return await this.achievementRepository.save(achievementDto);
    } catch (error) {
      if (error?.code === postgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Tên danh hiệu bị trùng',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('achievement-add', error.message);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addChildCriteria(id: number, Criterias: Criteria[]) {
    const achievement = await this.getOne(id);
    achievement.criterias = Criterias;
    return await this.achievementRepository.save(achievement);
  }

  async getAuditors(id: number) {
    const auditors = await this.achievementRepository.findOne({
      relations: ['auditors', 'auditorFinal'],
      where: { id },
    });
    return auditors;
  }

  async getAuditorsDepartment(id: number, achievemnetId: number) {
    const auditors = await this.auditorRepository.find({
      relations: ['department'],
      where: { userID: id, achievementID: achievemnetId },
    });
    const departments = []
    for (const auditor of auditors) {
      departments.push(auditor.department);
    }
    return departments
  }

  async getSummary(achievementId: number) {
    try {
      const data = await getRepository(User)
        .createQueryBuilder('user')
        .select('user.email', 'email')
        .addSelect('department.name', 'department')
        .addSelect('department.id', 'department_id')
        .addSelect('result.result', 'result')
        .innerJoin(
          Department,
          'department',
          `department.id = user.department.id`,
        )
        .innerJoin(
          Result,
          'result',
          `result.examer.id = user.id AND result.achievement.id = ${achievementId} AND result.final = ${true}`,
        )
        .orderBy('user.createdAt')
        .getRawMany();
      return data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async updateAuditors(achievementId: number, userFinal: User, users: User[]) {
    try {
      const achievement = await this.getOne(achievementId);
      achievement.auditorFinal = userFinal;
      achievement.auditors = users;
      return await this.achievementRepository.save(achievement);
    } catch (error) {
      console.log(error.message);
    }
  }

  async update(id: number, achievementDto: AchievementDto) {
    try {
      let updatingAchievement: Achievement =
        await this.achievementRepository.findOne(id);
      if (!updatingAchievement) throw { code: 'Achievement_NOT_FOUND' };
      updatingAchievement = { ...updatingAchievement, ...achievementDto };
      return await this.achievementRepository.save(updatingAchievement);
    } catch (error) {
      if (error?.code === postgresErrorCode.UniqueViolation) {
        return {
          statusCode: 400,
          message: 'Tên danh hiệu bị trùng',
        };
      }
      console.log('Lỗi trong lúc update tiêu chí', error.message);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteManageUnit(id: number, str: string) {
    const achievement = await this.getOne(id);
    achievement.manageUnit = achievement.manageUnit.filter(
      (item) => item != str,
    );
    return await this.achievementRepository.save(achievement);
  }

  async delete(id: number): Promise<DeleteResult> {
    const deletingAchievement: Achievement =
      await this.achievementRepository.findOne(id);
    if (!deletingAchievement) throw { code: 'Achievement_NOT_FOUND' };
    return await this.achievementRepository.softDelete(id);
  }
}
