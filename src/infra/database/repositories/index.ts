import { GuildRepository } from './GuildRepository';
import { UserRepository } from './UserRepository';
import { MemberRepository } from './MemberRepository';

export const guildRepository = new GuildRepository();
export const userRepository = new UserRepository();
export const memberRepository = new MemberRepository();

export { GuildRepository, UserRepository, MemberRepository };
