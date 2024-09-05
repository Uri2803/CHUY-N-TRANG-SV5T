import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { Criteria } from './criteria.entity';

import { User } from './user.entity';
import { v4 } from 'uuid';

@Entity()
export class Submission {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.id, {
    onDelete: 'CASCADE',
  })
  achievement: Achievement;

  @ManyToOne(() => Criteria, (crit) => crit.id, {
    onDelete: 'CASCADE',
  })
  criteria: Criteria;

  @Column()
  file: string;

  @Column({ type: 'real', default: 0 })
  point: number;

  @Column({ default: null })
  binary: boolean;

  @Column()
  description: string;

  @Column({ default: '' })
  studentComment: string;

  @Column({ default: '' })
  studentSelect: string;

  @Column({ default: false })
  public isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  endAt: Date;

  @UpdateDateColumn()
  startAt: Date;
  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
