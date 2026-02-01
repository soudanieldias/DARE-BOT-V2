import 'dotenv/config';
import { getDiscordClient } from '@/infra/discord/client';
import {
  LoadCommands,
  OnReady,
  OnInteraction,
  OnMessageCreate,
  SetActivity,
  DBConnect,
} from '@/infra/discord/events';
import { config } from '@/infra/shared/config';

async function bootstrap(): Promise<void> {
  console.log('[INFO] Starting DareBot...');

  const client = getDiscordClient();

  await DBConnect();
  LoadCommands(client);
  OnInteraction(client);
  OnMessageCreate(client);
  SetActivity(client);

  const token = config.discord.token;
  if (!token) {
    throw new Error('DISCORD_TOKEN is required');
  }

  OnReady(client, token);
}

bootstrap();
