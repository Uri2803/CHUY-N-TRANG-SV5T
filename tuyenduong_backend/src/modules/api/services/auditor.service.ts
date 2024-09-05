import { Department } from './../../../models/Achievement/department.entity';
import { Achievement } from '../../../models/Achievement/achievement.entity';
import { AchievementService } from './achievement.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { User } from 'src/models/Achievement/user.entity';
import { Result } from 'src/models/Achievement/result.entity';
import { ResultOfCriteria } from 'src/models/Achievement/resultOfCriteria.entity';

@Injectable()
export class AuditorService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(Result)
    private resultRepository: Repository<Result>,
    @InjectRepository(ResultOfCriteria)
    private resultOfCriteriaRepository: Repository<ResultOfCriteria>,
    private achievementService: AchievementService,
  ) {}

  async getResultUser(
    achievementId: number,
    page: number,
    limit: number,
    keyword?: string,
  ) {
    try {
      const newPage = page <= 0 ? 1 : page;
      const result = await getRepository(User)
        .createQueryBuilder('user')
        .select([
          'user.id AS id',
          'user.email AS email',
          'user.name AS name',
          'user.surName AS surName',
          'user.mssv AS mssv',
        ])
        .addSelect('department.name', 'department')
        .addSelect('result.result', 'result')
        .innerJoin(
          Result,
          'result',
          `result.examer.id = user.id 
            AND 
            result.achievement.id = ${achievementId} 
            AND 
            result.final = ${true}`,
        )
        .innerJoin(
          Department,
          'department',
          'department.id = user.department.id',
        )
        .where(
          ` user.surName || ' ' || user.name ILIKE :fullName OR user.mssv ILIKE :mssv OR user.email ILIKE :email OR department.name ILIKE :department`,
          {
            fullName: `%${keyword}%`,
            mssv: `%${keyword}%`,
            email: `%${keyword}%`,
            department: `%${keyword}%`,
          },
        )
        .orderBy('user.createdAt')
        .getRawMany();

      return {
        count: result.length,
        data: result.slice((newPage - 1) * limit, page * limit),
      };
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async createEachCriterias(
    criterias: any,
    resultFinal: number,
    achievementId: number,
    examerId: number,
    userId: number,
  ) {
    const newCriterias = criterias;
    const resultAchievement = await this.saveResultForAchievement(
      achievementId,
      resultFinal,
      userId,
      examerId,
    );
    try {
      await Promise.all(
        newCriterias.map(async (item: any) => {
          const updateData = await this.resultOfCriteriaRepository.findOne({
            relations: ['user', 'resultAchievement', 'submission'],
            where: {
              user: { id: userId },
              resultAchievement: { id: resultAchievement.id },
              submission: { id: item.id },
            },
          });
          if (updateData) {
            let result = item.result === 'none'? null : item.result;
            let description = item.description;
            return await this.resultOfCriteriaRepository
              .createQueryBuilder()
              .update({
                result: result,
                description: description
              })
              .where({
                user: { id: userId },
                submission: { id: item.id },
              })
              .returning('*')
              .execute();
          } else {
            return await this.resultOfCriteriaRepository.save({
              userId: userId,
              description: item.description,
              result: item.result === 'none'? null : item.result,
              resultAchievement,
              submission: item.id,
            });
          }
        }),
      );
      return { message: 'tạo thành công' };
    } catch (error) {
      console.log('error createEachCriterias', error.message);
    }
  }

  async saveResultForAchievement(
    id: number,
    result: number,
    userId: number,
    examerId: number,
  ) {
    try {
      const resultOld = await this.resultRepository.findOne({
        relations: ['achievement', 'examer', 'auditor'],
        where: {
          achievement: { id },
          examer: { id: examerId },
          auditor: { id: userId },
        },
      });

      if (resultOld) {
        resultOld.result = result;
        return await this.resultRepository.save(resultOld);
      } else {
        const userFinal = await this.checkAuditor(userId, id);
        const newResult = this.resultRepository.create({
          result,
          achievement: this.achievementRepository.create({ id }),
          auditor: this.userRepository.create({ id: userId }),
          examer: this.userRepository.create({ id: examerId }),
          final: userFinal === 1 ? true : false,
        });

        return await this.resultRepository.save(newResult);
      }
    } catch (error) {
      console.log('error saveResultForAchievement', error.message);
    }
  }

  async checkAuditor(userId: number, achievementId: number) {
    const achievement = await this.achievementService.getOne(achievementId);
    if (achievement.auditorFinal.id === userId) return 1;
    const auditor = achievement.auditors.find(
      (auditor) => auditor.id === userId,
    );
    if (auditor) return 2;
    return 3;
  }

  async getResultOfCriteria(id: string, userId: number) {
    return await this.resultOfCriteriaRepository.findOne({
      relations: ['submission', 'user'],
      where: { submission: { id }, user: { id: userId } },
    });
  }

  async getAllResultOfCriteria(id: string) {
    return await this.resultOfCriteriaRepository.findOne({
      relations: ['submission', 'user'],
      where: { submission: { id } },
    });
  }

  async deleteAll(id: number) {
    try {
      await getRepository(ResultOfCriteria)
      .createQueryBuilder('ResultOfCriteria')
      .delete()
      .from(ResultOfCriteria)
      .where("userId = :id", { id: id })
      .execute()
      await getRepository(Result)
      .createQueryBuilder('Result')
      .delete()
      .from(Result)
      .where("auditorId = :id", { id: id })
      .execute()
      return "success"
    } catch (err) {
      console.log(err)
    }
  }
}
