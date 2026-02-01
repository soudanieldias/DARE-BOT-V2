import { REST, Routes } from 'discord.js';
import { allCommands } from '@/commands';
import { config } from '@/shared/config';
import type { DareClient } from '@/modules/SoundpadModule';

export class LoadCommandsModule {
  constructor(private readonly client: DareClient) {}

  async bootstrap(): Promise<void> {
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
}
