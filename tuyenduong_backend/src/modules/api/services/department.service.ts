import { DepartmentDto } from 'src/Dto/department.dto';
import { Department } from './../../../models/Achievement/department.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class DepartmentService extends TypeOrmQueryService<Department> {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {
    super(departmentRepository, { useSoftDelete: true });
  }

  async getAll() {
    return await this.departmentRepository.find({
      order: { name: 'ASC' },
    });
  }

  async get(page: number, limit: number, keyword = '') {
    const newPage = page <= 0 ? 1 : page;
    const data = await getRepository(Department)
      .createQueryBuilder('department')
      .select([
        'department.id AS id',
        'department.name AS name',
        'department.code AS code',
      ])
      .where(` department.code ILIKE :code OR department.name ILIKE :name`, {
        code: `%${keyword}%`,
        name: `%${keyword}%`,
      })
      .orderBy('department.name', 'ASC')
      .getRawMany();

    return {
      data: data.slice((newPage - 1) * limit, page * limit),
      count: data.length,
    };
  }

  async getDepartment(params: object) {
    const department = await this.departmentRepository.findOne(params);
    if (!department) throw { code: 'DEPARTMENT_NOT_FOUND' };
    return department;
  }

  async addDepartmentList(departmentDto: DepartmentDto[]) {
    try {
      return await Promise.all(
        departmentDto.map(async (department: DepartmentDto) => {
          const data = await this.departmentRepository.findOne({
            code: department.code,
          });
          if (data) return data;
          return await this.departmentRepository.save({
            code: department.code,
            name: department.name,
          });
        }),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async addDepartment(departmentDto: DepartmentDto) {
    const department = await this.departmentRepository.findOne({
      code: departmentDto.code,
    });
    if (department)
      throw new HttpException(
        'Không thể trùng Mã đơn vị',
        HttpStatus.BAD_REQUEST,
      );
    return await this.departmentRepository.save({
      code: departmentDto.code,
      name: departmentDto.name,
    });
  }

  async update(id: number, departmentDto: any): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);
    if (!department)
      throw new HttpException('Khoa không tồn tại', HttpStatus.BAD_REQUEST);
    if (department.code !== departmentDto.code) {
      const isExit = await this.departmentRepository.findOne({
        code: departmentDto.code,
      });
      if (isExit)
        throw new HttpException(
          'Không thể trùng Mã đơn vị',
          HttpStatus.BAD_REQUEST,
        );
    }
    return await this.departmentRepository.save({
      ...department,
      ...departmentDto,
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    const department: Department = await this.departmentRepository.findOne(id);
    if (!department) throw { code: 'DEPARTMENT_NOT_FOUND' };
    return await this.departmentRepository.softDelete(id);
  }
}
