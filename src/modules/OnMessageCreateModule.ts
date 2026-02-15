import type { DareClient } from '@/modules/SoundpadModule';

export class OnMessageCreateModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.on('messageCreate', async (message) => {
      // TO-DO: Events when a new message is sent in a channel
      return;
    });
  }
}
