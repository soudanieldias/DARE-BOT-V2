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
    .setName('resetpresence')
    .setDescription('Reseta a presença do bot para os valores padrão')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  categories: ['admin'],
  execute: async (
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => {
    try {
      // Reseta para os valores padrão definidos no .env
      const defaultMessage = process.env.PRESENCE_MESSAGE || 'seus comandos';
      const defaultUrl = process.env.BOT_PRESENCE_URL;

      if (defaultUrl) {
        client.user?.setPresence({
          status: 'online',
          activities: [
            {
              name: defaultMessage,
              type: ActivityType.Playing,
              url: defaultUrl,
            },
          ],
        });
      } else {
        client.user?.setPresence({
          status: 'online',
          activities: [
            {
              name: defaultMessage,
              type: ActivityType.Playing,
            },
          ],
        });
      }

      await interaction.reply({
        content: `✅ Presença resetada para os valores padrão:
        **Status:** Online
        **Atividade:** Playing ${defaultMessage}`,
        flags: [MessageFlags.Ephemeral],
      });
    } catch (error) {
      console.error('Erro ao resetar presença:', error);
      await interaction.reply({
        content: '❌ Erro ao resetar a presença do bot!',
        ephemeral: true,
      });
    }
  },
};

export default command;
