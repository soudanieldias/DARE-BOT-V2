import { CommandData } from '@/types/commands';
import { CacheType, ChatInputCommandInteraction, Client } from 'discord.js';

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const command: CommandData = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!')
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  categories: ['features'],

  async execute(
    client: Client<true>,
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    if (interaction.isRepliable()) {
      await interaction.reply({ content: `Pong!\n${client.ws.ping}ms!` });
    }
  },
};

export default command;
