import { ActivityModule, InteractionModule, OnReadyModule } from '@/modules';
import { Logger } from '@/utils';
import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export interface CommandData {
  data: SlashCommandOptionsOnlyBuilder;
  categories: string[];
  execute: (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
}

export interface Event {
  name: string;
  execute: (...args: any[]) => Promise<void>;
}

export interface Config {
  token: string;
  prefix: string;
  [key: string]: any;
}

export type ClientExtended = Client & {
  activityModule?: ActivityModule;
  interactionModule?: InteractionModule;
  logger?: Logger;
  onReadyModule?: OnReadyModule;
  slashCommands?: Collection<string, any>;
};
