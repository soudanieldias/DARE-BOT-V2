import { Client, Collection } from 'discord.js';
import { intentsList, partialsList } from '@/config/discord';
import { Logger } from '@/utils';
import {
  ActivityModule,
  ButtonModule,
  CommandModule,
  DatabaseModule,
  EmbedModule,
  InteractionModule,
  OnReadyModule,
} from '@/modules';
import { ClientExtended } from '@/types';
import { configDotenv } from 'dotenv';

configDotenv();

export class App {
  private readonly token: string;
  private readonly client: ClientExtended;
  private readonly logger: Logger;

  constructor() {
    this.token = process.env.TOKEN || '';
    if (!this.token) {
      throw new Error('TOKEN não configurado no arquivo .env');
    }

    this.client = new Client({
      intents: [...intentsList],
      partials: [...partialsList],
    }) as ClientExtended;

    this.logger = new Logger(this.client);
  }

  private initializeClient(): void {
    this.client.logger = this.logger;
    this.client.slashCommands = new Collection();
    this.client.databaseModule = new DatabaseModule(this.client);
    this.client.activityModule = new ActivityModule(this.client);
    this.client.interactionModule = new InteractionModule(this.client);
    this.client.embedModule = new EmbedModule(this.client);
  }

  private async initializeModules(): Promise<void> {
    new OnReadyModule(this.client).initialize();
    new CommandModule(this.client).initialize();
    new ButtonModule(this.client).initialize();
  }

  public async start(): Promise<void> {
    try {
      await this.initializeClient();
      await this.initializeModules();
      await this.client.login(this.token);
    } catch (error) {
      await this.logger.error('App', `Erro ao iniciar a aplicação: ${error}`);
      throw error;
    }
  }
}

export default App;
