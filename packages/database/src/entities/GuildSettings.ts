import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Guild } from './Guild';

@Entity('guild_settings')
export class GuildSettings {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  guildId!: string;

  @OneToOne(() => Guild, (guild) => guild.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild!: Guild;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ownerId!: string | null;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
