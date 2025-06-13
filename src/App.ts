import { Client, Collection } from 'discord.js';
import { intentsList, partialsList } from './config/discord';
import { Logger } from './utils';
import { ActivityModule, OnReadyModule } from '@/modules';

require('dotenv').config();

type ClientExtended = Client & {
  activityModule?: ActivityModule;
  onReadyModule?: OnReadyModule;
  slashCommands?: Collection<string, any>;
  logger?: Logger;
  /**
   * TO-DO: Implementar os módulos abaixo
   * → Admin, Database, Sound, Soundpad
   * → Ticket, Embed, Form & Buttons.
   */
};

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
  }

  private initializeModules() {
    new OnReadyModule(this.client);
  }

  public async start() {
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
