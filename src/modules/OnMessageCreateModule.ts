import type { DareClient } from '@/modules/SoundpadModule';

export class OnMessageCreateModule {
  constructor(private readonly _client: DareClient) {}

  bootstrap(): void {}
}
