import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Member } from '@/database/entities';

export class MemberRepository {
  private repo: Repository<Member>;

  constructor() {
    this.repo = AppDataSource.getRepository(Member);
  }

  async findByGuildAndUser(guildId: string, userId: string): Promise<Member | null> {
    return this.repo.findOne({
      where: { guildId, userId },
      relations: ['user', 'guild'],
    });
  }

  async register(guildId: string, userId: string): Promise<Member> {
    const existing = await this.findByGuildAndUser(guildId, userId);
    if (existing) return existing;
    const member = this.repo.create({ guildId, userId });
    return this.repo.save(member);
  }
}
