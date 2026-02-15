import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '@/database/entities';

/**
 * Represents a global user of the system (Discord User).
 * Does not store guild data, only global user data.
 */
@Entity('users')
export class User {
  /** Discord user ID */
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  /** Username */
  @Column({ type: 'varchar', length: 255 })
  username!: string;

  /** User global points */
  @Column({ default: 0 })
  points!: number;

  /** Relation with members (1:N) */
  @OneToMany(() => Member, (member) => member.user)
  members!: Member[];

  /** Creation and update dates */
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
