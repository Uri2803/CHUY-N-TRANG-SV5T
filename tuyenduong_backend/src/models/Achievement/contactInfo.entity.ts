import { User } from './user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';
@Entity()
export class ContactInfo {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: 'Male' })
  public gender: string;

  @Column({ default: '', nullable: true })
  nation: string;

  @Column({ default: '', nullable: true })
  emailPersonal: string;

  @Column({ default: '', nullable: true })
  religion: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  studentAssociation: Date;

  @Column({ default: '0', nullable: true })
  CMND: string;

  @Column({ default: '', nullable: true })
  homeTown: string;

  @Column({ default: '', nullable: true })
  resident: string;

  @Column({ default: '0', nullable: true })
  phone: string;

  @Column({ default: '', nullable: true })
  placeUnion: string;

  @Column({ nullable: true })
  dateAtUnion: Date;

  @Column({ nullable: true })
  dateAtCommunistParty: Date;

  @Column({ nullable: true })
  placeCommunistParty: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  addId() {
    this.id = v4();
  }
}

export default ContactInfo;
