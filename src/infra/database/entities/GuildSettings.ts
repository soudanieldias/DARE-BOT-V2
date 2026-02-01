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
  @PrimaryColumn()
  guildId!: string;

  @OneToOne(() => Guild, (guild) => guild.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guildId' })
  guild!: Guild;

  @Column({ nullable: true })
  ownerId!: string | null;

  @Column({ nullable: true })
  staffChannelId!: string | null;

  @Column({ nullable: true })
  ticketChannelId!: string | null;

  @Column({ nullable: true })
  ticketCategoryId!: string | null;

  @Column({ nullable: true })
  ticketLogsChannelId!: string | null;

  @Column({ nullable: true })
  ticketRoleId!: string | null;

  @Column({ nullable: true })
  ticketTitle!: string | null;

  @Column({ nullable: true })
  ticketButtonName!: string | null;

  @Column({ type: 'text', nullable: true })
  ticketDescription!: string | null;

  @Column({ nullable: true })
  announcesChannelId!: string | null;

  @Column({ nullable: true })
  suggestionsChannelId!: string | null;

  @Column({ nullable: true })
  modRoleId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
