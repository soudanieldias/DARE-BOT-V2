import { MessageFlags } from 'discord.js';
import { commandMap } from '@/commands';
import { logger } from '@/shared/logger';
import type { DareClient } from '@/interfaces';

export class OnInteractionModule {
  constructor(private readonly client: DareClient) {}

  bootstrap(): void {
    this.client.on('interactionCreate', async (interaction) => {
      try {
        // If the interaction is a select menu for categories, enter this block
        if (interaction.isStringSelectMenu()) {
          if (interaction.customId === 'select_category') {
            return this.client.soundpadModule.listSoundpads(this.client, interaction);
          }
        }

        // If the interaction is a button, enter this block
        if (interaction.isButton()) {
          if (interaction.message?.content?.includes('Lista de Áudios')) {
            const command = commandMap.get('soundpad');
            if (command) return command.execute(this.client, interaction);
          }
        }

        // If the interaction is a chat input command, enter this block
        if (interaction.isChatInputCommand()) {
          const command = commandMap.get(interaction.commandName);
          if (command) return command.execute(this.client, interaction);
        }

        // If the interaction is a modal submit, enter this block
        if (interaction.isModalSubmit()) {
          switch (interaction.customId) {
            default:
              break;
          }
        }

        // If the interaction is a string select menu, enter this block
        if (interaction.isStringSelectMenu()) {
          switch (interaction.customId) {
            default:
              break;
          }
        }
      } catch (error) {
        logger.error('Interaction', error);
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
}
