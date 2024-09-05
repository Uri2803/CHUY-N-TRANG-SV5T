import { Result } from '../../../models/Achievement/result.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ResultOfCriteria } from 'src/models/Achievement/resultOfCriteria.entity';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result) private resultRepository: Repository<Result>,
    @InjectRepository(ResultOfCriteria)
    private resultOfCriteriaRepository: Repository<ResultOfCriteria>,
  ) {}

  async getResultSubmission(id: string) {
    try {
      return await this.resultOfCriteriaRepository.find({
        relations: ['user'],
        where: { submission: { id } },
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async getResult(achievementId: number, examerId: number) {
    return await this.resultRepository.find({
      relations: ['auditor'],
      where: {
        achievement: { id: achievementId },
        examer: { id: examerId },
        final: Not(true),
      },
    });
  }

  async getExamer(
    achievementId: number,
    id: string,
    userId: number,
  ): Promise<any> {
    try {
      return await this.resultRepository.findOne({
        relations: ['examer'],
        where: {
          achievement: { id: achievementId },
          examer: { id },
          auditor: { id: userId },
        },
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async getResultFinal(examerId: number) {
    const result = await this.resultRepository.find({
      relations: ['examer', 'achievement'],
      where: { examer: { id: examerId } },
    });
    return result.reduce((pre, res) => {
      if (res.final) {
        return [...pre, { id: res.achievement.id, result: res.result }];
      }
      return pre;
    }, []);
  }
}
