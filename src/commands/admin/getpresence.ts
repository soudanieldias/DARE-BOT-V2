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
    .setName('getpresence')
    .setDescription('Mostra a presença atual do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      const presence = client.user?.presence;
      const activity = presence?.activities[0];

      if (!presence) {
        await interaction.reply({
          content: 'ℹ️ Não foi possível obter a presença do bot.',
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      const statusEmoji = {
        online: '🟢',
        idle: '🟡',
        dnd: '🔴',
        invisible: '⚫',
      };

      const statusText = {
        online: 'Online',
        idle: 'Ausente',
        dnd: 'Não Perturbe',
        invisible: 'Invisível',
      };

      const activityText = activity
        ? `**Atividade:** ${activity.type} ${activity.name}${
            activity.url ? ` (${activity.url})` : ''
          }`
        : '**Atividade:** Nenhuma';

      await interaction.reply({
        content: `📊 **Presença Atual do Bot:**
        ${
          statusEmoji[presence.status as keyof typeof statusEmoji]
        } **Status:** ${statusText[presence.status as keyof typeof statusText]}
        ${activityText}`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao obter presença:', error);
      await interaction.reply({
        content: '❌ Erro ao obter a presença do bot!',
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};

export default command;
