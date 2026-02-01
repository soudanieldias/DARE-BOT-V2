import type { DareClient } from '../modules/SoundpadModule';
import * as dev from './dev';
import * as features from './features';
import * as help from './help';
import * as music from './music';
import * as staff from './staff';

export interface SlashCommand {
  data: { name: string; toJSON: () => unknown };
  execute: (
    client: DareClient,
    interaction: import('discord.js').ChatInputCommandInteraction | import('discord.js').ButtonInteraction
  ) => Promise<void>;
}

const commandArrays = [
  dev.commands,
  features.commands,
  help.commands,
  music.commands,
  staff.commands,
];

export const allCommands = commandArrays.flat() as SlashCommand[];

export const commandMap = new Map<string, SlashCommand>(
  allCommands.map((cmd) => [cmd.data.name, cmd])
);
