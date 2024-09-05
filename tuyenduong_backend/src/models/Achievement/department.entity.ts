import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  ManyToOne
} from 'typeorm';
import { Auditor } from './auditor.entity';
import { User } from './user.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: true })
  code: string;

  @Column({ unique: true, nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.department, {
    cascade: true,
  })
  users: User[];

  @OneToMany(() => Auditor, (auditor) => auditor.department, {
    cascade: true,
  })
  auditor: Auditor[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
