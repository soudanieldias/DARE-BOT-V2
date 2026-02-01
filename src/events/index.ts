import { ActivityType, MessageFlags, REST, Routes, type Client } from 'discord.js';
import { getDataSource } from '@/database/client';
import { allCommands } from '@/commands';
import { config } from '@/shared/config';
import type { DareClient } from '@/modules/SoundpadModule';

export async function LoadCommands(_client: DareClient): Promise<void> {
  console.log('[Commands] Carregando Módulo de Comandos');
  const token = config.discord.token;
  const clientId = config.discord.clientId;

  if (!clientId) {
    console.warn('[Commands] DISCORD_CLIENT_ID não configurado - comandos não registrados');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const body = allCommands.map((cmd) => cmd.data.toJSON());

  try {
    await rest.put(Routes.applicationCommands(clientId), { body });
    console.log(
      `[Commands] Módulo de Comandos Carregado com Sucesso (${allCommands.length} comandos)`
    );
  } catch (error) {
    console.error('[Commands] Erro ao registrar comandos:', error);
  }
}

export function OnReady(client: Client, token: string): void {
  client.on('clientReady', () => {
    const guilds = client.guilds.cache;
    const guildList = [...guilds.values()]
      .map((guild, i) => {
        const branch = i === guilds.size - 1 ? '└──' : '├──';
        return `      ${branch} ${guild.name}`;
      })
      .join('\n');

    console.log(`
      Bot Online!
      Username: ${client.user?.tag}
      ------------------------------
      Pronto para o Trabalho! Online para ${client.users.cache.size} Usuários.
      Operando em ${client.guilds.cache.size} Servidores
      ------------------------------
      Lista de Guilds:
      ${guildList || '      (nenhuma guild)'}
      ------------------------------
    `);
  });
  client.login(token);
}

export function OnInteraction(client: DareClient): void {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'select_category') {
          return client.soundpadModule.listSoundpads(client, interaction);
        }
      }

      if (interaction.isButton()) {
        if (interaction.message?.content?.includes('Lista de Áudios')) {
          const command = (await import('@/commands')).commandMap.get('soundpad');
          if (command) return command.execute(client, interaction);
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = (await import('@/commands')).commandMap.get(interaction.commandName);
        if (command) return command.execute(client, interaction);
      }
    } catch (error) {
      console.error('[Interaction] Erro:', error);
      const reply = { content: 'Erro ao executar o comando.', flags: [MessageFlags.Ephemeral] };
      if ('replied' in interaction && interaction.replied) {
        await (interaction as { followUp: (o: object) => Promise<unknown> })
          .followUp(reply)
          .catch(() => {});
      } else if ('reply' in interaction) {
        await (interaction as { reply: (o: object) => Promise<unknown> })
          .reply(reply)
          .catch(() => {});
      }
    }
  });
}

export function OnMessageCreate(_client: Client): void {}

export function SetActivity(client: Client): void {
  client.once('clientReady', () => {
    console.log('[Activity] Inicializando Activity do BOT.');
    client.user?.setActivity('AVE DARE', {
      type: ActivityType.Streaming,
      url: 'https://diasitservices.com.br/',
    });
    client.user?.setPresence({ status: 'online' });
    console.log('[Activity] Activity Carregada com Sucesso.');
  });
}

export function loadSoundpads(client: DareClient): void {
  client.once('clientReady', async () => {
    console.log('[Soundpads] Inicializando Soundpads...');
    await client.soundpadModule.start(client);
    console.log('[Soundpads] Soundpads Inicializados com Sucesso!');
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
