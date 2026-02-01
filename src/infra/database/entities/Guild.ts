import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { GuildSettings } from './GuildSettings';
import { Member } from './Member';

@Entity('guilds')
export class Guild {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  iconURL!: string | null;

  @Column({ nullable: true })
  bannerURL!: string | null;

  @OneToOne(() => GuildSettings, (settings) => settings.guild, {
    cascade: true,
  })
  settings!: GuildSettings | null;

  @OneToMany(() => Member, (member) => member.guild)
  members!: Member[];
}
