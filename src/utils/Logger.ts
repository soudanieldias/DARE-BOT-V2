import { Client, EmbedBuilder } from 'discord.js';

const colors = require('colors');
require('dotenv').config();

export class Logger {
  private debug: boolean;
  private debugToDev: boolean;
  private developerId: string;
  private client: Client;

  constructor(client: Client) {
    this.debug = process.env.DEBUG === 'true';
    this.debugToDev = process.env.DEBUG_TO_DEV === 'true';
    this.developerId = process.env.DEV_ID || '';
    this.client = client;
  }

  async info(module: string, msg: string): Promise<void> {
    if (this.debug) return console.log(colors.green(`[INFO/${module}]`), msg);
    if (this.debugToDev && this.developerId) {
      await this.sendToDev(module, msg);
    }
  }

  async error(module: string, msg: string): Promise<void> {
    if (this.debug) return console.error(colors.red(`[ERROR/${module}]`), msg);
    if (this.debugToDev && this.developerId) {
      await this.sendToDev(module, msg);
    }
  }

  async warn(module: string, msg: string): Promise<void> {
    if (this.debug) return console.warn(colors.yellow(`[WARN/${module}]`), msg);

    if (this.debugToDev && this.developerId) {
      await this.sendToDev(module, msg);
    }
  }

  private async sendToDev(module: string, msg: string): Promise<void> {
    try {
      const dev = await this.client.users.fetch(this.developerId);
      if (!dev) {
        console.warn(
          colors.yellow('[WARN/Logger] Desenvolvedor não encontrado'),
        );
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Debug - ${module}`)
        .setDescription(msg)
        .setTimestamp()
        .setFooter({
          text: 'Debug Message',
        });

      await dev.send({ embeds: [embed] });
    } catch (error) {
      console.error(
        colors.red('[ERROR/Logger] Erro ao enviar mensagem de debug:'),
        error,
      );
    }
  }
}
