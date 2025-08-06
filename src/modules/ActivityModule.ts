import {
  Client,
  ActivityType,
  PresenceStatusData,
  ChatInputCommandInteraction,
  CacheType,
  MessageFlags,
} from 'discord.js';
import { Logger } from '@/utils';

export class ActivityModule {
  private client: Client;
  private logger: Logger;

  constructor(client: Client) {
    this.client = client;
    this.logger = new Logger(client);

    // Inicializar atividade padrão quando o bot ficar online
    client.once('ready', () => {
      this.setDefaultActivity();
    });
  }

  /**
   * Define a atividade padrão do bot
   */
  private setDefaultActivity(): void {
    try {
      this.client.user?.setActivity(
        process.env.PRESENCE_MESSAGE || 'DARE-BOT',
        {
          type: ActivityType.Playing,
          url: process.env.BOT_PRESENCE_URL,
        },
      );

      this.logger.info(
        'ActivityModule',
        '✅ Atividade padrão definida com sucesso!',
      );
    } catch (error) {
      this.logger.error(
        'ActivityModule',
        `❌ Erro ao definir atividade padrão: ${error}`,
      );
    }
  }

  /**
   * Obtém a atividade e presença atual do bot
   */
  public getCurrentActivity(): { activity: any; status: string | undefined } {
    const activity = this.client.user?.presence.activities[0];
    const status = this.client.user?.presence.status;

    return { activity, status };
  }

  /**
   * Define apenas a atividade do bot (mantém status atual)
   */
  public setActivity(
    activityType: string,
    name: string,
    url?: string,
  ): Promise<boolean> {
    return new Promise(resolve => {
      try {
        const type = ActivityType[activityType as keyof typeof ActivityType];

        if (activityType === 'STREAMING' && !url) {
          this.logger.error(
            'ActivityModule',
            '❌ URL é obrigatória para atividades do tipo STREAMING!',
          );
          resolve(false);
          return;
        }

        if (activityType === 'STREAMING' && url) {
          this.client.user?.setActivity(name, {
            type,
            url,
          });
        } else {
          this.client.user?.setActivity(name, {
            type,
          });
        }

        this.logger.info(
          'ActivityModule',
          `✅ Atividade alterada para: ${activityType} ${name}`,
        );
        resolve(true);
      } catch (error) {
        this.logger.error(
          'ActivityModule',
          `❌ Erro ao definir atividade: ${error}`,
        );
        resolve(false);
      }
    });
  }

  /**
   * Define a presença completa do bot (atividade + status)
   */
  public setPresence(
    activityType: string,
    name: string,
    status: PresenceStatusData,
    url?: string,
  ): Promise<boolean> {
    return new Promise(resolve => {
      try {
        const type = ActivityType[activityType as keyof typeof ActivityType];

        if (activityType === 'STREAMING' && !url) {
          this.logger.error(
            'ActivityModule',
            '❌ URL é obrigatória para atividades do tipo STREAMING!',
          );
          resolve(false);
          return;
        }

        const presenceOptions: any = {
          status,
          activities: [
            {
              name,
              type,
            },
          ],
        };

        if (activityType === 'STREAMING' && url) {
          presenceOptions.activities[0].url = url;
        }

        this.client.user?.setPresence(presenceOptions);

        this.logger.info(
          'ActivityModule',
          `✅ Presença alterada para: ${status} | ${activityType} ${name}`,
        );
        resolve(true);
      } catch (error) {
        this.logger.error(
          'ActivityModule',
          `❌ Erro ao definir presença: ${error}`,
        );
        resolve(false);
      }
    });
  }

  /**
   * Remove a atividade atual do bot
   */
  public clearActivity(): Promise<boolean> {
    return new Promise(resolve => {
      try {
        this.client.user?.setPresence({ activities: [] });
        this.logger.info(
          'ActivityModule',
          '✅ Atividade removida com sucesso!',
        );
        resolve(true);
      } catch (error) {
        this.logger.error(
          'ActivityModule',
          `❌ Erro ao remover atividade: ${error}`,
        );
        resolve(false);
      }
    });
  }

  /**
   * Reseta para a presença padrão do bot
   */
  public resetToDefault(): Promise<boolean> {
    return new Promise(resolve => {
      try {
        this.client.user?.setPresence({
          status: 'online',
          activities: [
            {
              name: process.env.PRESENCE_MESSAGE || 'DARE-BOT',
              type: ActivityType.Playing,
              url: process.env.BOT_PRESENCE_URL,
            },
          ],
        });

        this.logger.info('ActivityModule', '✅ Presença resetada para padrão!');
        resolve(true);
      } catch (error) {
        this.logger.error(
          'ActivityModule',
          `❌ Erro ao resetar presença: ${error}`,
        );
        resolve(false);
      }
    });
  }

  /**
   * Formata a atividade atual para exibição
   */
  public formatActivityForDisplay(): string {
    const { activity, status } = this.getCurrentActivity();

    if (!activity) {
      return `ℹ️ **Status Atual:** ${status || 'Desconhecido'}\n📊 **Atividade:** Nenhuma atividade definida`;
    }

    return `📊 **Status Atual:** ${status || 'Desconhecido'}\n🎮 **Atividade:**\n**Tipo:** ${activity.type}\n**Nome:** ${activity.name}${activity.url ? `\n**URL:** ${activity.url}` : ''}`;
  }

  // ===== MÉTODOS AUXILIARES PARA INTERAÇÕES =====

  /**
   * Manipula o subcomando 'get' - Mostra atividade atual
   */
  public async handleGetCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const formattedActivity = this.formatActivityForDisplay();

    await interaction.reply({
      content: formattedActivity,
      flags: [MessageFlags.Ephemeral],
    });
  }

  /**
   * Manipula o subcomando 'set' - Define atividade
   */
  public async handleSetCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const activity = interaction.options.getString('activity', true);
    const name = interaction.options.getString('name', true);
    const url = interaction.options.getString('url', false);

    const success = await this.setActivity(activity, name, url || undefined);

    if (success) {
      await interaction.reply({
        content: `✅ Atividade alterada para: **${activity} ${name}**`,
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: '❌ Erro ao alterar atividade!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  }

  /**
   * Manipula o subcomando 'presence' - Define presença completa
   */
  public async handlePresenceCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const activity = interaction.options.getString('activity', true);
    const name = interaction.options.getString('name', true);
    const status = interaction.options.getString('status', true);
    const url = interaction.options.getString('url', false);

    const success = await this.setPresence(
      activity,
      name,
      status as any,
      url || undefined,
    );

    if (success) {
      await interaction.reply({
        content: `✅ Presença alterada para: **${status}** | **${activity} ${name}**`,
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: '❌ Erro ao alterar presença!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  }

  /**
   * Manipula o subcomando 'clear' - Remove atividade
   */
  public async handleClearCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const success = await this.clearActivity();

    if (success) {
      await interaction.reply({
        content: '✅ Atividade removida com sucesso!',
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: '❌ Erro ao remover atividade!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  }

  /**
   * Manipula o subcomando 'reset' - Reset para padrão
   */
  public async handleResetCommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    const success = await this.resetToDefault();

    if (success) {
      await interaction.reply({
        content: '✅ Presença resetada para padrão!',
        flags: [MessageFlags.Ephemeral],
      });
    } else {
      await interaction.reply({
        content: '❌ Erro ao resetar presença!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  }

  /**
   * Manipula subcomando inválido
   */
  public async handleInvalidSubcommand(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    await interaction.reply({
      content: '❌ Subcomando inválido!',
      flags: [MessageFlags.Ephemeral],
    });
  }

  /**
   * Manipula erro geral do comando
   */
  public async handleCommandError(
    interaction: ChatInputCommandInteraction<CacheType>,
    error: any,
  ): Promise<void> {
    console.error('Erro no comando activity:', error);
    await interaction.reply({
      content: '❌ Erro ao executar o comando!',
      flags: [MessageFlags.Ephemeral],
    });
  }
}
