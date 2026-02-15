import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Guild, User } from '@/database/entities';

/**
 * Represents the association of a user to a server (Guild).
 * Does not store user or server data, only the relationship.
 */
@Entity('members')
export class Member {
  /** Discord user ID (PK, FK) */
  @PrimaryColumn({ type: 'varchar', length: 255 })
  userId!: string;

  /** Discord server ID (PK, FK) */
  @PrimaryColumn({ type: 'varchar', length: 255 })
  guildId!: string;

  /** Associated user */
  @ManyToOne(() => User, (user) => user.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  /** Associated server */
  @ManyToOne(() => Guild, (guild) => guild.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild!: Guild;

  /** Member registration date */
  @CreateDateColumn()
  registeredAt!: Date;
}
