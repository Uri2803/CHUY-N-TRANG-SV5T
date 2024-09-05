import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from './user.entity';
import { ResultOfCriteria } from './resultOfCriteria.entity';
import { v4 } from 'uuid';

@Entity()
export class Result {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ nullable: true, default: null})
  public result: number;

  @Column({ default: false })
  public final: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Achievement, (achievement) => achievement.results)
  achievement: Achievement;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  examer: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  auditor: User;

  @OneToMany(
    () => ResultOfCriteria,
    (resultOfCriteria) => resultOfCriteria.resultAchievement,
    {
      cascade: true,
    },
  )
  resultOfCriteria: ResultOfCriteria[];
  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}

export default Result;
