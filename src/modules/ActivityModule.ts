import { Client, ActivityType } from 'discord.js';

export class ActivityModule {
  constructor(client: Client) {
    client.once('ready', () => {
      client.user?.setActivity(`${process.env.PRESENCE_MESSAGE}`, {
        type: ActivityType.Playing,
        url: process.env.BOT_PRESENCE_URL,
      });
    });
  }
}
