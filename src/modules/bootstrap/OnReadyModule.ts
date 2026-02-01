import type { DareClient } from '@/modules/SoundpadModule';

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

      console.log(`
      Bot Online!
      Username: ${this.client.user?.tag}
      ------------------------------
      Pronto para o Trabalho! Online para ${this.client.users.cache.size} Usuários.
      Operando em ${this.client.guilds.cache.size} Servidores
      ------------------------------
      Lista de Guilds:
      ${guildList || '      (nenhuma guild)'}
      ------------------------------
    `);
    });
    this.client.login(this.token);
  }
}
