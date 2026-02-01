import { getDiscordClient } from '@/client';
import {
  DatabaseModule,
  LoadCommandsModule,
  OnInteractionModule,
  OnMessageCreateModule,
  OnReadyModule,
  SetActivityModule,
} from '@/modules';
import { config } from '@/shared/config';
import { logger } from '@/shared/logger';

export class App {
  async bootstrap(): Promise<void> {
    logger.startup('[DARE-BOT] Starting Application...');
    const client = getDiscordClient();

    await new DatabaseModule().bootstrap();
    await new LoadCommandsModule(client).bootstrap();
    new OnInteractionModule(client).bootstrap();
    new OnMessageCreateModule(client).bootstrap();
    new SetActivityModule(client).bootstrap();
    client.soundpadModule.bootstrap(client);

    const token = config.discord.token;
    if (!token) throw new Error('DISCORD_TOKEN is required');
    logger.startup('[DARE-BOT] Logging in to Discord...');
    new OnReadyModule(client, token).bootstrap();
    logger.startup('[DARE-BOT] Application Started Successfully!');
  }
}
