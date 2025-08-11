import {
  Client,
  Collection,
  Events,
  Interaction,
  MessageFlags,
} from 'discord.js';
import { CommandData, ClientExtended } from '@/types';
import { Logger } from '@/utils';

export class InteractionModule {
  private logger: Logger;

  constructor(client: ClientExtended) {
    this.logger = client.logger!;
  }

  initialize(
    client: Client<true>,
    slashCommands: Collection<string, CommandData>,
  ): void {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      try {
        // Tratamento de Select Menu
        if (interaction.isStringSelectMenu()) {
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Botões
        if (interaction.isButton()) {
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Modal Submit
        if (interaction.isModalSubmit()) {
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Comandos Slash
        if (interaction.isChatInputCommand()) {
          const command = slashCommands.get(interaction.commandName);

          if (!command) {
            return interaction.reply({
              content: 'Erro ao executar o comando: NÃO ENCONTRADO',
              flags: [MessageFlags.Ephemeral],
            });
          }

          return await command.execute(client, interaction);
        }
      } catch (err) {
        const error = err as Error;
        await this.logger.error(
          'InteractionModule',
          `Erro no arquivo: ${error.message}\nStack: ${error.stack}`,
        );
      }
    });
  }
}
