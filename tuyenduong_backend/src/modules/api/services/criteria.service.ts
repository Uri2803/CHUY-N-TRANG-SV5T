import { Achievement } from '../../../models/Achievement/achievement.entity';
import { AchievementService } from './achievement.service';
import { Criteria } from './../../../models/Achievement/criteria.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { ClosureCriteria } from 'src/models/Achievement/closureCriteria.entity';
import { CriteriaDto } from 'src/Dto/criteria.dto';

@Injectable()
export class CriteriaService {
  constructor(
    @InjectRepository(Criteria)
    private criteriaRepository: Repository<Criteria>,
    @InjectRepository(ClosureCriteria)
    private closureCriteriaRepository: Repository<ClosureCriteria>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    private achievementService: AchievementService,
  ) {}

  async getAll() {
    return await this.criteriaRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  async getDepartment(id: number) {
    try {
      const Criteria = await this.criteriaRepository.find({
        where: { achievement: { id } },
        order: { createdAt: 'ASC' },
      });
      return await Promise.all(
        Criteria.map(async (item: Criteria) => {
          return await this.checkChild(item);
        }),
      );
    } catch (err) {
      throw new HttpException('Danh hiệu không tồn tại', HttpStatus.NOT_FOUND);
    }
  }

  async flatCriteria(id: number) {
    const Criterias = await this.getDepartment(id);
    const flatArray = [...Criterias];
    this.flat(Criterias, flatArray);
    return flatArray;
  }

  async flat(CriteriaArr: any[], flatArray: any[]) {
    CriteriaArr.map((criteria) => {
      this.flat(criteria.children, flatArray);
      criteria.children = criteria.children.map((item) => item.id);
      const isExit = flatArray.find((item) => criteria.id === item.id);
      if (!isExit) flatArray.push(criteria);
    });
  }

  async checkChild(criteria: Criteria) {
    const children = await this.getChildren(criteria.id);
    const newCriteria = { ...criteria, children: [] };
    let childFormat: typeof newCriteria;
    while (children.length > 0) {
      childFormat = await this.checkChild(children.shift());
      newCriteria.children.push(childFormat);
    }
    return newCriteria;
  }

  async getChildren(parentId: string): Promise<Criteria[]> {
    const children = await getRepository(Criteria)
      .createQueryBuilder('criteria')
      .leftJoinAndSelect(
        ClosureCriteria,
        'closureCriteria',
        'closureCriteria.descendantsId = criteria.id',
      )
      .where('closureCriteria.ancestorsId = :id', { id: parentId })
      .orderBy('criteria.createdAt', 'ASC')
      .getMany();
    return children;
  }

  async getParent(childrenId: number): Promise<Criteria[]> {
    const children = await getRepository(Criteria)
      .createQueryBuilder('criteria')
      .leftJoinAndSelect(
        ClosureCriteria,
        'closureCriteria',
        'closureCriteria.ancestorsId = criteria.id',
      )
      .where('closureCriteria.descendantsId = :id', { id: childrenId })
      .getMany();

    return children;
  }

  // async update(criteriaDto: CriteriaDto[], id: number) {
  //   try {
  //     const achievement = await this.achievementRepository.findOne(id);
  //     if (!achievement) throw { code: 'CRITERIA_NOT_FOUND' };
  //     await this.achievementService.delete(id);
  //     const newAchievement = await this.achievementService.add(achievement);
  //     return await this.add(criteriaDto, newAchievement.id);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async addOne(criteria: CriteriaDto): Promise<Criteria> {
    return await this.criteriaRepository.save(criteria);
  }

  // async addClosure(
  //   arr: CriteriaDto[] | [],
  //   parent: Criteria,
  //   achievement: Achievement,
  // ) {
  //   arr.forEach(async (item: Criteria) => {
  //     try {
  //       const children: [] = item['children'] || [];
  //       delete item['children'];
  //       const criteria = this.criteriaRepository.create(item);
  //       await this.criteriaRepository.save(criteria);
  //       if (parent !== null) {
  //         const closureCriteria = new ClosureCriteria();
  //         closureCriteria.ancestors = parent;
  //         closureCriteria.descendants = criteria;
  //         await this.closureCriteriaRepository.save(closureCriteria);
  //       } else {
  //         //console.log('vo day push');
  //         criteria.achievement = achievement;
  //         await this.criteriaRepository.save(criteria);
  //       }

  //       return this.addClosure(children, criteria, achievement);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   });
  // }
  // async add(criteriaDto: CriteriaDto[], achievementID: number) {
  //   const achievement = await this.achievementRepository.findOne(achievementID);
  //   await this.addClosure(criteriaDto, null, achievement);
  //   return await this.getDepartment(achievementID);
  // }

  // async add(criteriaDto: CriteriaDto[]) {
  //   return await Promise.all(
  //     criteriaDto.map(async (criteria: CriteriaDto) => {
  //       const newCriteria = await this.criteriaRepository.save(criteria);
  //       const newChild = await this.addChildren(criteria.children, newCriteria);
  //       return {
  //         ...newCriteria,
  //         children: newChild,
  //       };
  //     }),
  //   );
  // }

  async add(data: CriteriaDto[]) {
    const dataFlat = await this.formatDataFlat(data);
    dataFlat.forEach((item) => {
      item.children = item.children.map((child) =>
        dataFlat.indexOf(dataFlat.find((sub) => child.id === sub.id)),
      );
    });

    const newData: any[] = [];
    while (dataFlat.length > 0) {
      const item: any = dataFlat.shift();
      const result = await this.criteriaRepository.save(item);
      newData.push({
        ...result,
        children: item.children,
      });
    }
    // console.log('dataFlat',dataFlat)
    // const newData: any = await Promise.all(
    //   dataFlat.map(async (item) => {
    //     const result = await this.criteriaRepository.save(item);
    //     return {
    //       ...result,
    //       children: item.children,
    //     };
    //   }),
    // );
    // console.log('newData',newData)

    await Promise.all(
      newData.map(async (item) => {
        return await Promise.all(
          item.children.map(async (sub) => {
            const closureCriteria = new ClosureCriteria();
            closureCriteria.ancestors = item;
            closureCriteria.descendants = newData[sub];
            await this.closureCriteriaRepository.save(closureCriteria);
          }),
        );
      }),
    );

    return newData.slice(0, data.length).map((item) => {
      delete item.children;
      return item;
    });
  }

  async formatDataFlat(data: any[], temp: any[] = []) {
    const children = data.reduce((pre, item) => {
      temp = [...temp, item];
      if (item.children.length > 0) {
        return [...pre, ...item.children];
      }
      return pre;
    }, []);
    if (children.length === 0) return temp;
    return this.formatDataFlat(children, temp);
  }

  async addChildren(arr: CriteriaDto[] | [], parent: Criteria) {
    return await Promise.all(
      arr.map(async (child: CriteriaDto) => {
        const newCriteria = await this.criteriaRepository.save(child);
        const closureCriteria = new ClosureCriteria();
        closureCriteria.ancestors = parent;
        closureCriteria.descendants = newCriteria;
        await this.closureCriteriaRepository.save(closureCriteria);
        const newChild = await this.addChildren(child.children, newCriteria);
        return {
          ...newCriteria,
          children: newChild,
        };
      }),
    );
  }

  async delete(id: string): Promise<DeleteResult> {
    const criteria: Criteria = await this.criteriaRepository.findOne(id);
    if (!criteria) throw { code: 'CRITERIA_NOT_FOUND' };
    return await this.criteriaRepository.delete(id);
  }

  async deleteExist(id: string) {
    const criteria: Criteria = await this.criteriaRepository.findOne(id);
    if (criteria) await this.criteriaRepository.delete(id);
  }
}
