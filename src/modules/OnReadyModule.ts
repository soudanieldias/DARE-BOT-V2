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

      const botName = discriminator
        ? `${username}#${discriminator}`
        : username || 'Unknown';
        const guildList = this.client.guilds.cache
        .map(guild => `  🎮 ${guild.name}`);

        const commandsCount = this.client.slashCommands?.size || 0;
        const buttonsCount = this.client.buttons?.size || 0;

      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await this.logger.info('OnReadyModule', `🚀 DARE-BOT V2 ONLINE 🚀`);
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await this.logger.info('OnReadyModule', `👤 Bot: ${botName}`);
      await this.logger.info('OnReadyModule', `🏠 Servidores: ${guildCount}`);
      await this.logger.info('OnReadyModule', `👥 Usuários: ${userCount}`);
      await this.logger.info('OnReadyModule', `⏰ Status: Online ✅`);
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await this.logger.info('OnReadyModule', `📍 SERVIDORES ATIVOS 📍`);
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      guildList.map((guild) => this.logger.info('OnReadyModule', `${guild}`));
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await this.logger.info(
        'OnReadyModule',
        `🗄️  Database: Conectado`
      );
      await this.logger.info(
        'OnReadyModule',
        `⚡Commands: ${commandsCount || 0} carregados`
      );
      await this.logger.info(
        'OnReadyModule',
        `🔘 Buttons: ${buttonsCount} carregados`
      );
      await this.logger.info('OnReadyModule', `🎯 Interactions: Ativo`);
      await this.logger.info('OnReadyModule', `🎨 Embeds: Pronto`);
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await this.logger.info(
        'OnReadyModule',
        `🎉 DARE-BOT V2 está online e operacional! 🎉`
      );
      await this.logger.info(
        'OnReadyModule',
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );

      await this.client.databaseModule?.initialize();
      await this.client.interactionModule?.initialize(
        this.client as Client<true>,
        this.client.slashCommands as Collection<string, CommandData>,
      );
    });
  }
}
