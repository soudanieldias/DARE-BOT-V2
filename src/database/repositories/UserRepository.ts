import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities';

export class UserRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async upsert(user: Partial<User>): Promise<User> {
    const existing = await this.repo.findOne({ where: { id: user.id! } });
    if (existing) {
      Object.assign(existing, user);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create(user));
  }

  async addPoints(id: string, amount: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error(`User ${id} not found`);
    user.points += amount;
    return this.repo.save(user);
  }
}
