import { ClosureCriteria } from './closureCriteria.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 } from 'uuid';
import { Achievement } from './achievement.entity';
import { CriteriaSign, CriteriaType } from 'src/common/enum';

@Entity()
export class Criteria {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: false, nullable: false })
  name: string;

  @Column({ default: false })
  isCriteria: boolean;

  @Column({ default: 'binary' })
  method: string;

  @Column({ default: '' })
  note: string;

  @Column({ default: '' })
  valueListString: string;

  @Column({ default: '' })
  content: string;

  @Column({
    type: 'enum',
    enum: CriteriaType,
    default: CriteriaType.HARD,
  })
  type: CriteriaType;

  @Column({ default: false })
  evidence: boolean;

  @Column({
    type: 'enum',
    enum: CriteriaSign,
    default: CriteriaSign.MORE,
  })
  lowerSign: CriteriaSign;

  @Column({
    type: 'enum',
    enum: CriteriaSign,
    default: CriteriaSign.MORE,
  })
  upperSign: CriteriaSign;

  @Column({ type: 'real', default: 0 })
  point: number;

  @Column({ type: 'real', default: 0 })
  lowerPoint: number;

  @Column({ type: 'real', default: 0 })
  upperPoint: number;

  @Column({ default: 0 })
  soft: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Achievement, (achievement) => achievement.criterias, {
    onDelete: 'CASCADE',
  })
  achievement: Achievement;

  @OneToMany(
    () => ClosureCriteria,
    (closureCriteria) => closureCriteria.ancestors,
  )
  closureAncestors: ClosureCriteria[];

  @OneToMany(
    () => ClosureCriteria,
    (closureCriteria) => closureCriteria.descendants,
  )
  closureDescendants: ClosureCriteria[];

  // @OneToMany(() => Submission, (submission) => submission.criteria)
  // submissions: Submission[];
  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}
