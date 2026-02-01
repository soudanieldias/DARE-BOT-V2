import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Member } from './Member';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ default: 0 })
  points!: number;

  @OneToMany(() => Member, (member) => member.user)
  members!: Member[];
}
