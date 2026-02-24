import type { SlashCommandBuilder } from 'discord.js';

export interface ICommand {
  data: SlashCommandBuilder;
  execute: (interaction: unknown) => Promise<void>;
}
