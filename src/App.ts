import { getDiscordClient } from '@/client';
import {
  DatabaseModule,
  LoadCommandsModule,
  OnInteractionModule,
  OnMessageCreateModule,
  OnReadyModule,
  SetActivityModule,
  SoundpadsModule,
} from '@/modules/bootstrap';
import { config } from '@/shared/config';

export class App {
  async start(): Promise<void> {
    console.log('[INFO] Starting DareBot...');
    const client = getDiscordClient();

    await new DatabaseModule().bootstrap();
    await new LoadCommandsModule(client).bootstrap();
    new OnInteractionModule(client).bootstrap();
    new OnMessageCreateModule(client).bootstrap();
    new SetActivityModule(client).bootstrap();
    new SoundpadsModule(client).bootstrap();

    const token = config.discord.token;
    if (!token) throw new Error('DISCORD_TOKEN is required');
    new OnReadyModule(client, token).bootstrap();
  }
}
