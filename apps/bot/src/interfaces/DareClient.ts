import type { Client } from 'discord.js';
import type { SoundpadModule } from '@/modules/SoundpadModule';
import type { SoundModule } from '@/modules/SoundModule';

export interface DareClient extends Client {
  pads: Map<string, { name: string; path: string }>;
  soundpadModule: SoundpadModule;
  soundModule: SoundModule;
}
