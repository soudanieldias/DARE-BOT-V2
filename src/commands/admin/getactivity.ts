import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
  MessageFlags,
} from 'discord.js';
import { CommandData } from '@/types/commands';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('getactivity')
    .setDescription('Mostra a atividade atual do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      const activity = client.user?.presence.activities[0];

      if (!activity) {
        await interaction.reply({
          content: 'ℹ️ O bot não possui atividade definida no momento.',
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await interaction.reply({
        content: `📊 **Atividade Atual:**
        **Tipo:** ${activity.type}
        **Nome:** ${activity.name}
        ${activity.url ? `**URL:** ${activity.url}` : ''}`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao obter atividade:', error);
      await interaction.reply({
        content: '❌ Erro ao obter a atividade do bot!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
