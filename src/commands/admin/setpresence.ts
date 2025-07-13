import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
  ActivityType,
  PresenceStatusData,
  MessageFlags,
} from 'discord.js';
import { CommandData } from '@/types/commands';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('setpresence')
    .setDescription('Define a presença completa do bot (atividade + status)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
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
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Nome da atividade')
        .setRequired(true),
    )
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
    )
    .addStringOption((option) =>
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
      const status = interaction.options.getString(
        'status',
        true,
      ) as PresenceStatusData;
      const url = interaction.options.getString('url', false);

      const activityType = ActivityType[activity as keyof typeof ActivityType];

      if (activity === 'STREAMING' && !url) {
        await interaction.reply({
          content: '❌ URL é obrigatória para atividades do tipo STREAMING!',

          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      const presenceOptions: any = {
        status: status,
        activities: [
          {
            name: name,
            type: activityType,
          },
        ],
      };

      if (activity === 'STREAMING' && url) {
        presenceOptions.activities[0].url = url;
      }

      client.user?.setPresence(presenceOptions);

      await interaction.reply({
        content: `✅ Presença alterada para: **${status}** | **${activity} ${name}**`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao alterar presença:', error);
      await interaction.reply({
        content: '❌ Erro ao alterar a presença do bot!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
