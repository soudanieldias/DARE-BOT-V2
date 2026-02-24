import { logger } from '@/shared/logger';
import type { DareClient } from '@/interfaces';

export class OnReadyModule {
  constructor(
    private readonly client: DareClient,
    private readonly token: string
  ) {}

  bootstrap(): void {
    this.client.on('clientReady', () => {
      const guilds = this.client.guilds.cache;
      const guildList = [...guilds.values()]
        .map((guild, i) => {
          const branch = i === guilds.size - 1 ? '└──' : '├──';
          return `      ${branch} ${guild.name}`;
        })
        .join('\n');

      logger.info(
        'OnReady',
        `
      Bot Online!
      Username: ${this.client.user?.tag}
      ------------------------------
      Pronto para o Trabalho! Online para ${this.client.users.cache.size} Usuários.
      Operando em ${this.client.guilds.cache.size} Servidores
      ------------------------------
      Lista de Guilds:
      ${guildList || '      (nenhuma guild)'}
      ------------------------------
    `
      );
    });

    if (!this.token) {
      throw new Error('DISCORD_TOKEN is required');
    }

    this.client.login(this.token);
  }
}
