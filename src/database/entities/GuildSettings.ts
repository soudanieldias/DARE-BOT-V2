import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from '@/database/entities';

/**
 * Specific settings for each Guild (Discord server).
 * Does not store server data, only customizable settings.
 */
@Entity('guild_settings')
export class GuildSettings {
  /** Discord server ID (PK & FK) */
  @PrimaryColumn({ type: 'varchar', length: 255 })
  guildId!: string;

  /** 1:1 relationship with Guild */
  @OneToOne(() => Guild, (guild) => guild.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild!: Guild;

  /** Server owner ID */
  @Column({ type: 'varchar', length: 255, nullable: true })
  ownerId!: string | null;

  /** Channel and role IDs for bot features */
  @Column({ type: 'varchar', length: 255, nullable: true })
  staffChannelId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketChannelId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketCategoryId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketLogsChannelId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketRoleId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketTitle!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  ticketButtonName!: string | null;
  @Column({ type: 'text', nullable: true })
  ticketDescription!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  announcesChannelId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  suggestionsChannelId!: string | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  modRoleId!: string | null;

  /** Creation and update dates */
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
