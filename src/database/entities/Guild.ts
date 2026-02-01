import { Entity, PrimaryColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { GuildSettings } from './GuildSettings';
import { Member } from './Member';

@Entity('guilds')
export class Guild {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  iconURL!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  bannerURL!: string | null;

  @OneToOne(() => GuildSettings, (settings) => settings.guild, {
    cascade: true,
  })
  settings!: GuildSettings | null;

  @OneToMany(() => Member, (member) => member.guild)
  members!: Member[];
}
