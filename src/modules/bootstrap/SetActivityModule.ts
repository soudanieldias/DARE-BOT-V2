import { ActivityType } from 'discord.js';
import { logger } from '@/shared/logger';
import type { DareClient } from '@/modules/SoundpadModule';

export class SetActivityModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.once('clientReady', () => {
      logger.info('Activity', 'Inicializando Activity do BOT.');
      this.client.user?.setActivity('AVE DARE', {
        type: ActivityType.Streaming,
        url: 'https://diasitservices.com.br/',
      });
      this.client.user?.setPresence({ status: 'online' });
      logger.info('Activity', 'Activity Carregada com Sucesso.');
    });
  }
}
