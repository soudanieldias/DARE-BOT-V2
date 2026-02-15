import { Client, GatewayIntentBits } from 'discord.js';
import { SoundModule, SoundpadModule, DareClient } from '@/modules';

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.DirectMessages,
];

let instance: DareClient | null = null;

export function getDiscordClient(): DareClient {
  if (!instance) {
    const client = new Client({ intents }) as DareClient;
    client.pads = new Map();
    client.soundpadModule = new SoundpadModule();
    client.soundModule = new SoundModule();
    instance = client;
  }
  return instance;
}
