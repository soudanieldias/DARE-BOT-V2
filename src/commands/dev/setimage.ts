import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Client,
} from 'discord.js';
import { sendEmbed } from '../../utils/embed-helper';

export default {
  data: new SlashCommandBuilder()
    .setName('setimage')
    .setDescription('Mude avatar do bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption((option) =>
      option.setName('avatar').setDescription('O avatar').setRequired(true)
    ),
  category: 'dev',

  execute: async (client: Client, interaction: ChatInputCommandInteraction) => {
    // Verificação de desenvolvedor
    const isDeveloper = interaction.user.id === process.env.DEV_ID;

    if (!isDeveloper) return sendEmbed(interaction, 'Não Autorizado!');

    const avatar = interaction.options.getAttachment('avatar', true);

    if (!avatar.contentType?.startsWith('image/')) {
      return sendEmbed(interaction, 'Erro: envie uma imagem válida.');
    }

    try {
      await client.user?.setAvatar(avatar.url);
      await sendEmbed(interaction, '✅ Avatar atualizado com sucesso!');
    } catch (err: any) {
      console.error(err);
      await sendEmbed(interaction, `❌ Erro ao definir avatar: ${err.message}`);
    }
  },
};
