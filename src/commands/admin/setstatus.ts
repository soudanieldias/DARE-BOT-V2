import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
  PresenceStatusData,
  MessageFlags,
} from 'discord.js';
import { CommandData } from '@/types/commands';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('Define o status do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('status')
        .setDescription('Status do bot')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Ausente', value: 'idle' },
          { name: 'Não Perturbe', value: 'dnd' },
          { name: 'Invisível', value: 'invisible' },
        ),
    ),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      const status = interaction.options.getString(
        'status',
        true,
      ) as PresenceStatusData;

      client.user?.setPresence({
        status: status,
      });

      await interaction.reply({
        content: `✅ Status alterado para: **${status}**`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      await interaction.reply({
        content: '❌ Erro ao alterar o status do bot!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
