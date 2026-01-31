import { Client, GatewayIntentBits } from 'discord.js';

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.DirectMessages,
];

let instance: Client | null = null;

export function getDiscordClient(): Client {
  if (!instance) {
    instance = new Client({ intents });
  }
  return instance;
}
