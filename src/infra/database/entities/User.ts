import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Member } from './Member';

@Entity('users')
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  username!: string;

  @Column({ default: 0 })
  points!: number;

  @OneToMany(() => Member, (member) => member.user)
  members!: Member[];
}
