import colors from 'colors';
import type { Client } from 'discord.js';

export class Logger {
  private readonly isDebug: boolean;
  private readonly devId: string | undefined;

  constructor() {
    this.isDebug = process.env.DEBUG === 'true';
    this.devId = process.env.DEV_ID;
  }

  info(module: string, msg: unknown): void {
    if (this.isDebug) {
      console.log(colors.green(`[INFO/${module}]`), msg);
    }
  }

  startup(msg: unknown): void {
    console.log(colors.green('[INFO]'), msg);
  }

  error(module: string, msg: unknown): void {
    console.error(colors.red(`[ERROR/${module}]`), msg);
  }

  warn(module: string, msg: unknown): void {
    if (this.isDebug) {
      console.warn(colors.yellow(`[WARN/${module}]`), msg);
    }
  }

  debug(module: string, msg: unknown): void {
    if (this.isDebug) {
      console.log(colors.blue(`[DEBUG/${module}]`), msg);
    }
  }

  async debugToDev(client: Client, module: string, msg: string): Promise<void> {
    if (!this.devId) {
      console.warn(colors.yellow('[WARN/Logger] DEV_ID não configurado no .env'));
      return;
    }

    try {
      const dev = await client.users.fetch(this.devId);
      if (!dev) {
        console.warn(colors.yellow('[WARN/Logger] Desenvolvedor não encontrado'));
        return;
      }

      await dev.send({
        embeds: [
          {
            color: 0x0099ff,
            title: `Debug - ${module}`,
            description: msg,
            timestamp: new Date().toISOString(),
            footer: { text: 'Debug Message' },
          },
        ],
      });
    } catch (error) {
      console.error(colors.red('[ERROR/Logger] Erro ao enviar mensagem de debug:'), error);
    }
  }
}

export const logger = new Logger();
