import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Guild } from './Guild';
import { User } from './User';

@Entity('members')
export class Member {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  guildId!: string;

  @ManyToOne(() => User, (user) => user.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Guild, (guild) => guild.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild!: Guild;

  @CreateDateColumn()
  registeredAt!: Date;
}
