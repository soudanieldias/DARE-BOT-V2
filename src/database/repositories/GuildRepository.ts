import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Guild } from '../entities';

export class GuildRepository {
  private repo: Repository<Guild>;

  constructor() {
    this.repo = AppDataSource.getRepository(Guild);
  }

  async findById(id: string): Promise<Guild | null> {
    return this.repo.findOne({ where: { id }, relations: ['settings'] });
  }

  async upsert(guild: Partial<Guild>): Promise<Guild> {
    const existing = await this.repo.findOne({ where: { id: guild.id! } });
    if (existing) {
      Object.assign(existing, guild);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create(guild));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
