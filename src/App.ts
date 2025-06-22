import { Client, Collection } from 'discord.js';
import { intentsList, partialsList } from '@/config/discord';
import { Logger } from '@/utils';
import {
  ActivityModule,
  OnReadyModule,
  CommandLoaderModule,
  InteractionModule,
} from '@/modules';
import { ClientExtended, CommandData } from '@/types';

require('dotenv').config();

export class App {
  private token: string = process.env.TOKEN || '';

  private client: ClientExtended = new Client({
    intents: [...intentsList],
    partials: [...partialsList],
  });

  private logger: Logger = new Logger(this.client);

  constructor() {
    if (!this.token) {
      throw new Error('TOKEN não configurado no arquivo .env');
    }
  }

  private initializeClient() {
    this.client.logger = this.logger;
    this.client.slashCommands = new Collection();
    this.client.activityModule = new ActivityModule(this.client);
    this.client.interactionModule = new InteractionModule(this.client);
  }

  private initializeModules() {
    new OnReadyModule(this.client);
    new CommandLoaderModule(this.client).loadCommands();
  }

  public async start() {
    try {
      await this.initializeClient();
      await this.initializeModules();
      await this.client.login(this.token);
      await this.client.interactionModule!.initialize(
        this.client as Client<true>,
        this.client.slashCommands as Collection<string, CommandData>,
      );
    } catch (error) {
      await this.logger.error('App', `Erro ao iniciar a aplicação: ${error}`);
      throw error;
    }
  }
}

export default App;
