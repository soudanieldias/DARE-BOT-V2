import { ClientExtended } from '@/types';
import { Logger } from '@/utils';
import { PrismaClient } from '@prisma/client';

export class DatabaseModule {
  private client: ClientExtended;
  private logger: Logger;
  public prisma: PrismaClient;

  constructor(client: ClientExtended) {
    this.client = client;
    this.logger = new Logger(client);
    this.prisma = new PrismaClient();
  }

  async initialize(): Promise<void> {
    try {
      await this.logger.info('Database', 'Inicializando...');
      await this.populateServers();
      await this.logger.info('Database', 'Inicializada com sucesso.');
    } catch (error) {
      await this.logger.error('Database', `Erro: ${error}`);
    }
  }

  async populateServers(): Promise<void> {
    try {
      const servers = this.client.guilds.cache.map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        iconURL: guild.icon,
      }));

      for (const server of servers) {
        await this.prisma.guilds.upsert({
          where: { id: server.id },
          update: server,
          create: server,
        });
      }

      await this.logger.info(
        'Database',
        'Guildas populadas no banco de dados com sucesso.',
      );
    } catch (error) {
      await this.logger.error('Database', `Erro: ${error}`);
    }
  }

  async findGuildTicketConfig(guildId: string) {
    try {
      const ticketSettings = await this.prisma.settings.findUnique({
        where: {
          id: guildId,
        },
      });

      if (!ticketSettings) {
        return null; // Retorna null ao invés de interaction.reply
      } else {
        return ticketSettings;
      }
    } catch (error) {
      await this.logger.error('Database', `Erro: ${error}`);
      return null;
    }
  }

  async getGuildData(guildId: string) {
    try {
      const ticketChannelData = await this.prisma.settings.findUnique({
        where: {
          id: guildId,
        },
      });

      return ticketChannelData;
    } catch (error) {
      await this.logger.error('Database', `Erro no arquivo: ${error}`);
      return null;
    }
  }

  async handleError(error: any): Promise<void> {
    await this.logger.error('Database', `Erro no arquivo: ${error}`);
  }

  // Métodos para usuários (Users)
  async createUser(
    discordId: string,
    username: string,
    points: number = 0,
  ): Promise<void> {
    try {
      await this.prisma.users.upsert({
        where: { id: discordId },
        update: { username, points },
        create: { id: discordId, username, points },
      });
    } catch (error) {
      this.logger.error(
        'DatabaseModule',
        `Erro ao criar/atualizar usuário: ${error}`,
      );
    }
  }

  async getUser(discordId: string) {
    return await this.prisma.users.findUnique({
      where: { id: discordId },
    });
  }

  async updateUserPoints(discordId: string, points: number): Promise<void> {
    try {
      await this.prisma.users.update({
        where: { id: discordId },
        data: { points },
      });
    } catch (error) {
      this.logger.error(
        'DatabaseModule',
        `Erro ao atualizar pontos do usuário: ${error}`,
      );
    }
  }

  // Métodos para servidores (Guilds)
  async createGuild(
    discordId: string,
    name: string,
    iconURL?: string,
    bannerURL?: string,
  ): Promise<void> {
    try {
      await this.prisma.guilds.upsert({
        where: { id: discordId },
        update: { name, iconURL, bannerURL },
        create: { id: discordId, name, iconURL, bannerURL },
      });
    } catch (error) {
      this.logger.error(
        'DatabaseModule',
        `Erro ao criar/atualizar servidor: ${error}`,
      );
    }
  }

  async getGuild(discordId: string) {
    return await this.prisma.guilds.findUnique({
      where: { id: discordId },
    });
  }

  async getAllGuilds() {
    return await this.prisma.guilds.findMany();
  }

  // Métodos para configurações (Settings)
  async createSettings(
    guildId: string,
    settings: {
      ownerId?: string;
      staffChannelId?: string;
      ticketChannelId?: string;
      announcesChannelId?: string;
      suggestionsChannelId?: string;
      modRoleId?: string;
      ticketCategoryId?: string;
      ticketLogsChannelId?: string;
      ticketRoleId?: string;
      ticketTitle?: string;
      ticketButtonName?: string;
      ticketDescription?: string;
    },
  ): Promise<void> {
    try {
      await this.prisma.settings.upsert({
        where: { id: guildId },
        update: settings,
        create: { id: guildId, ...settings },
      });
    } catch (error) {
      this.logger.error(
        'DatabaseModule',
        `Erro ao criar/atualizar configurações: ${error}`,
      );
    }
  }

  async getSettings(guildId: string) {
    return await this.prisma.settings.findUnique({
      where: { id: guildId },
    });
  }

  async updateSettings(
    guildId: string,
    settings: Partial<{
      ownerId: string;
      staffChannelId: string;
      ticketChannelId: string;
      announcesChannelId: string;
      suggestionsChannelId: string;
      modRoleId: string;
      ticketCategoryId: string;
      ticketLogsChannelId: string;
      ticketRoleId: string;
      ticketTitle: string;
      ticketButtonName: string;
      ticketDescription: string;
    }>,
  ): Promise<void> {
    try {
      await this.prisma.settings.update({
        where: { id: guildId },
        data: settings,
      });
    } catch (error) {
      this.logger.error(
        'DatabaseModule',
        `Erro ao atualizar configurações: ${error}`,
      );
    }
  }
}
