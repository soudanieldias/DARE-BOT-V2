import { Client, Collection } from 'discord.js';
import { intentsList, partialsList } from '@/config/discord';
import { Logger } from '@/utils';
import {
  ActivityModule,
  ButtonModule,
  OnReadyModule,
  CommandLoaderModule,
  InteractionModule,
  EmbedModule,
} from '@/modules';
import { ClientExtended, CommandData } from '@/types';
import { configDotenv } from 'dotenv';
configDotenv();

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

  private initializeClient(): void {
    this.client.logger = this.logger;
    this.client.slashCommands = new Collection();
    this.client.activityModule = new ActivityModule(this.client);
    this.client.interactionModule = new InteractionModule(this.client);
    this.client.embedModule = new EmbedModule(this.client);
  }

  private initializeModules(): void {
    new OnReadyModule(this.client);
    new CommandLoaderModule(this.client).loadCommands();
    new ButtonModule(this.client).loadButtons(this.client);
  }

  public async start(): Promise<void> {
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
