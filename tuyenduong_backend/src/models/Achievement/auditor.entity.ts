import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { Department } from './department.entity';
import { User } from './user.entity';
  
@Entity()
export class Auditor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.auditor)
  @JoinColumn({ name: 'userID' })
  user: User;

  @Column({ nullable: true })
  userID: number;

  @ManyToOne(() => Department, (department) => department.auditor)
  @JoinColumn({ name: 'departmentID' })
  department: Department;

  @Column({ nullable: true })
  departmentID: number;

  @ManyToOne(() => Achievement, (achievement) => achievement.auditor)
  @JoinColumn({ name: 'achievementID' })
  achievement: Achievement;

  @Column({ nullable: true })
  achievementID: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
