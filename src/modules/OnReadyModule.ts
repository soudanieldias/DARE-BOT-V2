import { ClientExtended, CommandData } from '@/types';
import { Logger } from '@/utils';
import { Client, Collection } from 'discord.js';

export class OnReadyModule {
  private readonly client: ClientExtended;
  private readonly logger: Logger;

  constructor(client: ClientExtended) {
    this.client = client;
    this.logger = new Logger(client);
  }

  async initialize(): Promise<void> {
    this.client.once('ready', async () => {
      const discriminator = this.client.user?.discriminator;
      const username = this.client.user?.username;
      const guildCount = this.client.guilds.cache.size;
      const userCount = this.client.users.cache.size;

      await console.info(
        'OnReady',
        `
        ------------------------------
        |  Online como: ${
          discriminator ? `${username}#${discriminator}` : username
        }
        |  Operando em: ${guildCount} servidores.
        |  Online para: ${userCount} Usuários.
        ------------------------------
        |  SERVIDORES ONDE EU ESTOU:
        |  ${this.client.guilds.cache
          .map(guild => guild.name)
          .join('\n      |  ')}
        ------------------------------
        `,
      );

      await this.client.databaseModule?.initialize();
      await this.client.interactionModule?.initialize(
        this.client as Client<true>,
        this.client.slashCommands as Collection<string, CommandData>,
      );
    });
  }
}
