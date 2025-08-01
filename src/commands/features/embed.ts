import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  CacheType,
  PermissionFlagsBits,
} from 'discord.js';
import { CommandData } from '@/types';
import { BaseEmbed } from '@/modules';

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Cria um embed personalizado')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option
        .setName('título')
        .setDescription('Título do embed')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('descrição')
        .setDescription('Descrição do embed')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('cor')
        .setDescription('Cor do embed (hexadecimal)')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('imagem')
        .setDescription('URL de uma imagem para adicionar ao embed')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('miniatura')
        .setDescription('URL de uma miniatura para o embed')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('campo1')
        .setDescription('Primeiro campo do embed')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('campo2')
        .setDescription('Segundo campo do embed')
        .setRequired(false),
    )
    .addStringOption(option =>
      option
        .setName('rodapé')
        .setDescription('Texto do rodapé')
        .setRequired(false),
    ),
  categories: ['features'],

  async execute(
    _client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    try {
      // Verificar permissões
      if (
        !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
      ) {
        await interaction.reply({
          content: '❌ Você não possui permissão para utilizar este comando.',
          ephemeral: true,
        });
        return;
      }

      // Obter opções
      const title = interaction.options.getString('título', true);
      const description = interaction.options.getString('descrição', true);
      const color = interaction.options.getString('cor', false) || '#0099ff';
      const image = interaction.options.getString('imagem', false);
      const thumbnail = interaction.options.getString('miniatura', false);
      const field1 = interaction.options.getString('campo1', false);
      const field2 = interaction.options.getString('campo2', false);
      const footer = interaction.options.getString('rodapé', false);

      // Criar embed usando BaseEmbed
      const embed = new BaseEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color as any)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 256 }),
        })
        .setTimestamp();

      // Adicionar campos se fornecidos
      if (field1) {
        embed.addField('Campo 1', field1, true);
      }

      if (field2) {
        embed.addField('Campo 2', field2, true);
      }

      // Adicionar imagem se fornecida
      if (image) {
        embed.setImage(image);
      }

      // Adicionar miniatura se fornecida
      if (thumbnail) {
        embed.setThumbnail(thumbnail);
      }

      // Adicionar rodapé se fornecido
      if (footer) {
        embed.setFooter({
          text: footer,
          iconURL: interaction.guild?.iconURL({ size: 256 }) || undefined,
        });
      }

      // Enviar embed
      await interaction.reply({
        embeds: [embed.build()],
      });
    } catch (error) {
      console.error('Erro ao criar embed:', error);
      await interaction.reply({
        content: '❌ Erro ao criar o embed!',
        ephemeral: true,
      });
    }
  },
};

export default command;
