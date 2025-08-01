import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
  Role,
  TextChannel,
} from 'discord.js';
import { CommandData } from '@/types';
import { BaseEmbed } from '@/modules';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faça eu falar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option
        .setName('mensagem')
        .setDescription('Escreva algo para ser enviado.')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('tipo')
        .setDescription('Escolha o tipo de mensagem')
        .setRequired(true)
        .addChoices(
          { name: 'Embed', value: 'embed' },
          { name: 'Mensagem', value: 'mensagem' },
        ),
    )
    .addStringOption(option =>
      option
        .setName('imagem')
        .setDescription('URL de uma imagem para adicionar ao embed (opcional)'),
    )
    .addRoleOption(option =>
      option
        .setName('cargo')
        .setDescription('Selecione um cargo para mencionar (opcional)')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('cor')
        .setDescription('Cor do embed (hexadecimal)')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('título')
        .setDescription('Título do embed (opcional)')
        .setRequired(false),
    ),
  categories: ['features'],

  async execute(
    _client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    try {
      if (
        !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
      ) {
        await interaction.reply({
          content: '❌ Você não possui permissão para utilizar este comando.',
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: '📤 Enviando mensagem...',
        ephemeral: true,
      });

      const message = interaction.options.getString('mensagem', true);
      const type = interaction.options.getString('tipo', true);
      const imageUrl = interaction.options.getString('imagem', false);
      const role = interaction.options.getRole('cargo') as Role | null;
      const color = interaction.options.getString('cor', false);
      const title = interaction.options.getString('título', false);

      const mentionText = role ? `<@&${role.id}>` : '';

      if (type === 'embed') {
        const embed = new BaseEmbed()
          .setColor((color as any) || 'Random')
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ size: 256 }),
          })
          .setDescription(message)
          .setTimestamp();

        if (title) {
          embed.setTitle(title);
        }

        if (imageUrl) {
          embed.setImage(imageUrl);
        }

        await (interaction.channel as TextChannel)?.send({
          content: mentionText,
          embeds: [embed.build()],
        });
      } else {
        await (interaction.channel as TextChannel)?.send({
          content: `${mentionText} ${message}`,
        });
      }

      await interaction.editReply({
        content: '✅ Mensagem enviada com sucesso!',
      });
    } catch (error) {
      console.error('Erro no comando say:', error);
      await interaction.editReply({
        content: '❌ Erro ao enviar a mensagem!',
      });
    }
  },
};

export default command;
