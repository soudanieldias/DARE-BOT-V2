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
    .setName('clearactivity')
    .setDescription('Remove a atividade atual do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      client.user?.setPresence({ activities: [] });

      await interaction.reply({
        content: '✅ Atividade removida com sucesso!',
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao remover atividade:', error);
      await interaction.reply({
        content: '❌ Erro ao remover a atividade do bot!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
