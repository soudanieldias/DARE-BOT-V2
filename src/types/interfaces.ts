import {
  ApplicationCommandData,
  ButtonBuilder,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import {
  ActivityModule,
  InteractionModule,
  OnReadyModule,
  EmbedModule,
  DatabaseModule,
} from '@/modules';
import { Logger } from '@/utils';

// ===== COMANDOS =====
export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export interface CommandData {
  data:
    | ApplicationCommandData
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  categories: string[];
  execute: (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
}

// ===== BOTÕES =====
export interface ButtonData {
  data: {
    customId: string;
    [key: string]: any;
  };
  execute: (...args: any[]) => Promise<void>;
}

// ===== EMBEDS =====
export interface EmbedData {
  title?: string;
  description?: string;
  color?: string;
  thumbnail?: string;
  image?: string;
  footer?: {
    text: string;
    iconURL?: string;
  };
  timestamp?: Date;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

// ===== EVENTOS =====
export interface Event {
  name: string;
  execute: (...args: any[]) => Promise<void>;
}

// ===== CONFIGURAÇÃO =====
export interface Config {
  token: string;
  prefix: string;
  [key: string]: any;
}

// ===== CLIENTE EXTENDIDO =====
export type ClientExtended = Client & {
  activityModule?: ActivityModule;
  buttons?: Collection<string, ButtonData>;
  databaseModule: DatabaseModule;
  embedModule?: EmbedModule;
  interactionModule?: InteractionModule;
  logger?: Logger;
  onReadyModule: OnReadyModule;
  slashCommands?: Collection<string, CommandData>;
};

// ===== UTILITÁRIOS =====
export interface ButtonRow {
  buttons: ButtonBuilder[];
  maxPerRow: number;
}

export interface CommandCategory {
  name: string;
  description: string;
  commands: CommandData[];
}
