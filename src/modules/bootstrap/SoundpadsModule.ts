import type { DareClient } from '@/modules/SoundpadModule';

export class SoundpadsModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.once('clientReady', async () => {
      console.log('[Soundpads] Inicializando Soundpads...');
      await this.client.soundpadModule.start(this.client);
      console.log('[Soundpads] Soundpads Inicializados com Sucesso!');
    });
  }
}
