import { logger } from '@/shared/logger';
import type { DareClient } from '@/modules/SoundpadModule';

export class SoundpadsModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.once('clientReady', async () => {
      logger.info('Soundpads', 'Inicializando Soundpads...');
      await this.client.soundpadModule.start(this.client);
      logger.info('Soundpads', 'Soundpads Inicializados com Sucesso!');
    });
  }
}
