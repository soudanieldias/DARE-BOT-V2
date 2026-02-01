import {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  MessageFlags,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
} from 'discord.js';
import { SOUNDPAD_CATEGORIES } from '../../modules';
import type { DareClient } from '../../modules/SoundpadModule';

export const soundpadCommand = {
  data: new SlashCommandBuilder()
    .setName('soundpad')
    .setDescription('Comandos de SoundPad')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addSubcommand((sc) =>
      sc.setName('list').setDescription('Lista todos os áudios disponíveis no SoundPad')
    )
    .addSubcommand((sc) =>
      sc
        .setName('play')
        .setDescription('Toca o áudio selecionado')
        .addStringOption((opt) =>
          opt.setName('filepath').setDescription('Nome do arquivo de áudio').setRequired(true)
        )
    ),

  async execute(
    client: DareClient,
    interaction: ChatInputCommandInteraction | ButtonInteraction
  ): Promise<void> {
    const member = interaction.member as { voice?: { channel?: { id: string } } };
    const channelId = member?.voice?.channel?.id;

    if (!channelId) {
      await interaction.reply({
        content: `Erro: <@!${interaction.member?.user?.id}> Entre em um canal de voz.`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const guild = interaction.guild!;
    const adapterCreator = guild.voiceAdapterCreator;
    if (!adapterCreator) {
      await interaction.reply({
        content: 'Este servidor não suporta canais de voz.',
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }
    const connectionParams = {
      channelId,
      guildId: guild.id,
      adapterCreator,
    };

    const subCommand = interaction.isButton() ? 'interaction' : interaction.options.getSubcommand();

    if (subCommand === 'play') {
      const fileName = interaction.isButton()
        ? interaction.customId
        : interaction.options.getString('filepath')!;
      const pad = client.pads.get(fileName);

      if (!pad) {
        await interaction.reply({
          content: 'Pad não encontrado!',
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await interaction.reply({
        content: `Tocando som ${pad.name}`,
        flags: [MessageFlags.Ephemeral],
      });

      await client.soundModule.playSound(
        { member: interaction.member as import('discord.js').GuildMember },
        pad,
        connectionParams
      );
      return;
    }

    if (subCommand === 'interaction' && interaction.isButton()) {
      const fileName = interaction.customId;
      const pad = client.pads.get(fileName);

      if (!pad) {
        await interaction.reply({
          content: 'Pad não encontrado!',
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await interaction.reply({
        content: `Tocando som ${pad.name}`,
        flags: [MessageFlags.Ephemeral],
      });
      await client.soundModule.playSound(
        { member: interaction.member as import('discord.js').GuildMember },
        pad,
        connectionParams
      );
      return;
    }

    if (subCommand === 'list') {
      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select_category')
          .setPlaceholder('Escolha uma categoria...')
          .addOptions([...SOUNDPAD_CATEGORIES])
      );

      await interaction.reply({
        content: 'Selecione uma Categoria:',
        components: [row],
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
};
