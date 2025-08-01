import { ClientExtended } from '@/types';
import { Logger } from '@/utils';

export class OnReadyModule {
  private client: ClientExtended;
  private logger: Logger;

  constructor(client: ClientExtended) {
    this.client = client;
    this.logger = new Logger(client);
    this.setupReadyEvent();
  }

  private setupReadyEvent(): void {
    this.client.once('ready', async () => {
      const discriminator = this.client.user?.discriminator;
      const username = this.client.user?.username;
      const guildCount = this.client.guilds.cache.size;
      const userCount = this.client.users.cache.size;

      await this.logger.info(
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
    });
  }
}
