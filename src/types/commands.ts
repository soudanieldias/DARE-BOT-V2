import {
  ChatInputCommandInteraction,
  Client,
  CacheType,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface CommandData {
  data: SlashCommandOptionsOnlyBuilder;
  categories: string[];
  execute: (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
}
