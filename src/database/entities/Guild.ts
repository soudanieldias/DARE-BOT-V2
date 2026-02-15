import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GuildSettings, Member } from '@/database/entities';

/**
 * Represents a Discord server (Guild).
 * Does not store settings, only basic data and relationships.
 */
@Entity('guilds')
export class Guild {
  /** Discord server ID */
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  /** Server name */
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  /** Server icon URL */
  @Column({ type: 'varchar', length: 512, nullable: true })
  iconURL!: string | null;

  /** Server banner URL */
  @Column({ type: 'varchar', length: 512, nullable: true })
  bannerURL!: string | null;

  /** Server settings (1:1) */
  @OneToOne(() => GuildSettings, (settings) => settings.guild, {
    cascade: true,
  })
  settings!: GuildSettings | null;

  /** Server members (1:N) */
  @OneToMany(() => Member, (member) => member.guild)
  members!: Member[];

  /** Record creation date */
  @CreateDateColumn()
  createdAt!: Date;

  /** Record last update date */
  @UpdateDateColumn()
  updatedAt!: Date;
}
