import { ActivityType, type Client } from 'discord.js';
import { getDataSource } from '@/infra/database/client';

export function LoadCommands(client: Client): void {
  console.log('[Commands] Carregando Módulo de Comandos');
  // TODO: carregar comandos slash
  console.log('[Commands] Módulo de Comandos Carregado com Sucesso');
}

export function OnReady(client: Client, token: string): void {
  client.on('ready', () => {
    console.log(`
      Bot Online!
      Username: ${client.user?.tag}
      ------------------------------
      Pronto para o Trabalho! Online para ${client.users.cache.size} Usuários.
      Operando em ${client.guilds.cache.size} Servidores
      ------------------------------
      Lista de Guilds:
      ${client.guilds.cache.map((guild) => guild.name).join('\n')}
      ------------------------------
    `);
  });
  client.login(token);
}

export function OnInteraction(_client: Client): void {}

export function OnMessageCreate(_client: Client): void {}

export function SetActivity(client: Client): void {
  client.once('ready', () => {
    console.log('[Activity] Inicializando Activity do BOT.');
    client.user?.setActivity('AVE DARE', {
      type: ActivityType.Streaming,
      url: 'https://diasitservices.com.br/',
    });
    client.user?.setPresence({ status: 'online' });
    console.log('[Activity] Activity Carregada com Sucesso.');
  });
}

export async function DBConnect(): Promise<void> {
  try {
    console.log('[DataBase] Inicializando MySQL...');
    await getDataSource();
    console.log('[DataBase] MySQL Inicializado com Sucesso!');
  } catch (error) {
    console.error('[DataBase] Erro ao conectar:', error);
  }
}
