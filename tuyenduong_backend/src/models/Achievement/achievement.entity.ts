import { Lock, TypeOb } from '../../common/enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Criteria } from './criteria.entity';

import { Result } from './result.entity';
import { User } from './user.entity';
import { Auditor } from './auditor.entity';
// import { Submission } from './submission.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 0 })
  softCriteria: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @UpdateDateColumn()
  startAt: Date;

  @UpdateDateColumn()
  endSubmitAt: Date;

  @Column({
    type: 'enum',
    enum: Lock,
    default: Lock.UNAVAILABLE,
  })
  lock: Lock;

  @Column({
    type: 'enum',
    enum: TypeOb,
    default: TypeOb.ACHIEVEMENT,
  })
  type: TypeOb;

  @OneToMany(() => Criteria, (criteria) => criteria.achievement, {
    cascade: true,
  })
  criterias: Criteria[];

  @Column('text', { nullable: false, array: true, default: [''] })
  manageUnit: string[];

  @OneToMany(() => Result, (result) => result.achievement, {
    cascade: true,
  })
  results: Result[];

  @OneToMany(() => User, (user) => user.auditors, {
    cascade: true,
  })
  auditors: User[];

  @OneToMany(() => Auditor, (auditor) => auditor.achievement, {
    cascade: true,
  })
  auditor: Auditor[];

  @ManyToOne(() => User, (user) => user.id)
  auditorFinal: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
