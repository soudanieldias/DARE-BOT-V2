import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
  ActivityType,
  MessageFlags,
} from 'discord.js';
import { CommandData } from '@/types/commands';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('setactivity')
    .setDescription('Define a atividade do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option
        .setName('activity')
        .setDescription('Tipo de atividade')
        .setRequired(true)
        .addChoices(
          { name: 'Jogando', value: 'PLAYING' },
          { name: 'Transmitindo', value: 'STREAMING' },
          { name: 'Ouvindo', value: 'LISTENING' },
          { name: 'Assistindo', value: 'WATCHING' },
          { name: 'Competindo', value: 'COMPETING' },
        ),
    )
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Nome da atividade')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('url')
        .setDescription('URL para streaming (apenas para STREAMING)')
        .setRequired(false),
    ),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      const activity = interaction.options.getString('activity', true);
      const name = interaction.options.getString('name', true);
      const url = interaction.options.getString('url', false);

      const activityType = ActivityType[activity as keyof typeof ActivityType];

      if (activity === 'STREAMING' && !url) {
        await interaction.reply({
          content: '❌ URL é obrigatória para atividades do tipo STREAMING!',
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      if (activity === 'STREAMING' && url) {
        client.user?.setActivity(name, {
          type: activityType,
          url: url,
        });
      } else {
        client.user?.setActivity(name, {
          type: activityType,
        });
      }

      await interaction.reply({
        content: `✅ Atividade alterada para: **${activity} ${name}**`,

        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao alterar atividade:', error);
      await interaction.reply({
        content: '❌ Erro ao alterar a atividade do bot!',

        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
