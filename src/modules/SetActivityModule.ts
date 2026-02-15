import { ActivityType } from 'discord.js';
import { logger } from '@/shared/logger';
import type { DareClient } from '@/interfaces';

export class SetActivityModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.once('clientReady', () => {
      logger.info('Activity', 'Inicializando Activity do BOT.');
      this.client.user?.setActivity('BOLADINHO!', {
        type: ActivityType.Streaming,
        url: 'https://diasitservices.com.br/',
      });
      this.client.user?.setPresence({ status: 'online' });
      logger.info('Activity', 'Activity Carregada com Sucesso.');
    });
  }

  updateActivity(activity: string, type: ActivityType): void {
    this.client.user?.setActivity(activity, {
      type,
      url: 'https://diasitservices.com.br/',
    });
    logger.info('Activity', `Activity atualizada para: ${activity} (${ActivityType[type]})`);
  }
}
