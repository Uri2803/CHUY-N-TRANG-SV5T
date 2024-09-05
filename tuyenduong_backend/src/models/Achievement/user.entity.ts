import { Role } from '../../common/enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Department } from './department.entity';
import { Achievement } from './achievement.entity';
import { Submission } from './submission.entity';
import ContactInfo from './contactInfo.entity';
import { Auditor } from './auditor.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public name: string;

  @Column({ nullable: true })
  public surName: string;

  @Column({ nullable: true })
  public mssv: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PARTICIPANT,
  })
  role: Role;

  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @Column({ default: false })
  public isUpdatedInformation: boolean;

  @Column({ default: false })
  public hasContactInfo: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Department, (department) => department.users)
  department: Department;

  @ManyToOne(() => Achievement, (achievement) => achievement.auditors)
  auditors: Achievement;

  @OneToMany(() => Auditor, (auditor) => auditor.user)
  auditor: Auditor[];

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.id)
  contactInfoId: ContactInfo;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];

  @DeleteDateColumn()
  deletedAt?: Date;
}

export default User;
