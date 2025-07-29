/* eslint-disable no-undef */
import { globSync } from 'glob';
import { REST, Routes } from 'discord.js';
import { ClientExtended, CommandData } from '@/types';
import path from 'path';

export class CommandLoaderModule {
  private client: ClientExtended;

  constructor(client: ClientExtended) {
    this.client = client;
  }

  async loadCommands(): Promise<void> {
    try {
      await this.client.logger!.info('Commands', 'Carregando comandos...');

      // Buscar arquivos de comando (dev e prod)
      const commandFiles = [
        ...globSync('./src/commands/**/*.ts'),
        ...globSync('./dist/commands/**/*.js'),
      ];

      if (commandFiles.length === 0) {
        await this.client.logger!.info(
          'Commands',
          'Nenhum comando encontrado.',
        );
        return;
      }

      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
      const restCommands: any[] = [];

      // Carregar cada comando
      for (const file of commandFiles) {
        try {
          const commandModule = await import(path.resolve(file));
          const command: CommandData = commandModule.default || commandModule;

          // Validar comando
          if (!this.isValidCommand(command)) {
            await this.client.logger!.warn(
              'Commands',
              `Comando inválido: ${file}`,
            );
            continue;
          }

          const { name } = command.data;

          // Verificar duplicata
          if (this.client.slashCommands?.has(name)) {
            await this.client.logger!.warn(
              'Commands',
              `Comando duplicado: ${name}`,
            );
            continue;
          }

          // Adicionar comando
          this.client.slashCommands!.set(name, command);
          restCommands.push(command.data.toJSON());

          await this.client.logger!.info('Commands', `✓ ${name}`);
        } catch (error) {
          await this.client.logger!.error(
            'Commands',
            `Erro em ${file}: ${error}`,
          );
        }
      }

      // Registrar no Discord
      if (restCommands.length > 0) {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
          body: restCommands,
        });
      }

      const count = this.client.slashCommands?.size || 0;
      await this.client.logger!.info(
        'Commands',
        `${count} comandos carregados.`,
      );
    } catch (error) {
      await this.client.logger!.error('Commands', `Erro: ${error}`);
    }
  }

  private isValidCommand(command: any): boolean {
    return (
      command?.data?.name &&
      command?.data?.description &&
      command?.categories &&
      typeof command.execute === 'function'
    );
  }
}
