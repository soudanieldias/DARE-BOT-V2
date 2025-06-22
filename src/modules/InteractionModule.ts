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
  ) {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      try {
        // Log para debug
        await this.logger.info(
          'InteractionModule',
          `Tipo de interação: ${interaction.type}`,
        );

        // Tratamento de Select Menu
        if (interaction.isStringSelectMenu()) {
          await this.logger.info(
            'InteractionModule',
            'Interação detectada: Select Menu',
          );
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Botões
        if (interaction.isButton()) {
          await this.logger.info(
            'InteractionModule',
            `Botão clicado: ${interaction.customId}`,
          );
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Modal Submit
        if (interaction.isModalSubmit()) {
          await this.logger.info(
            'InteractionModule',
            `Modal submetido: ${interaction.customId}`,
          );
          return await interaction.reply({
            content: 'Funcionalidade não implementada ainda',
            flags: [MessageFlags.Ephemeral],
          });
        }

        // Tratamento de Comandos Slash
        if (interaction.isChatInputCommand()) {
          await this.logger.info(
            'InteractionModule',
            `Comando executado: ${interaction.commandName}`,
          );
          const command = slashCommands.get(interaction.commandName);

          if (!command) {
            await this.logger.error(
              'InteractionModule',
              `Comando ${interaction.commandName} não encontrado`,
            );
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
