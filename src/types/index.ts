import { ActivityModule, OnReadyModule } from '@/modules';
import { Logger } from '@/utils';
import { Client, Collection } from 'discord.js';

export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
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
  onReadyModule?: OnReadyModule;
  slashCommands?: Collection<string, any>;
  logger?: Logger;
};
