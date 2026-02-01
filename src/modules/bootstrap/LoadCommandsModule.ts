import { REST, Routes } from 'discord.js';
import { allCommands } from '@/commands';
import { config } from '@/shared/config';
import { logger } from '@/shared/logger';
import type { DareClient } from '@/modules/SoundpadModule';

export class LoadCommandsModule {
  constructor(private readonly client: DareClient) {}

  async bootstrap(): Promise<void> {
    logger.info('Commands', 'Carregando Módulo de Comandos');
    const token = config.discord.token;
    const clientId = config.discord.clientId;

    if (!clientId) {
      logger.warn('Commands', 'DISCORD_CLIENT_ID não configurado - comandos não registrados');
      return;
    }

    const rest = new REST({ version: '10' }).setToken(token);
    const body = allCommands.map((cmd) => cmd.data.toJSON());

    try {
      await rest.put(Routes.applicationCommands(clientId), { body });
      logger.info(
        'Commands',
        `Módulo de Comandos Carregado com Sucesso (${allCommands.length} comandos)`
      );
    } catch (error) {
      logger.error('Commands', error);
    }
  }
}
