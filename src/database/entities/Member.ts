import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Guild, User } from '@/database/entities';

@Entity('members')
export class Member {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  userId!: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
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
