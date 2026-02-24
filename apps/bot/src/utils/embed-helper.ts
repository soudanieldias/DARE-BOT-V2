import { ChatInputCommandInteraction, EmbedBuilder, ColorResolvable } from 'discord.js';

export async function sendEmbed(
  interaction: ChatInputCommandInteraction,
  message: string,
  color: ColorResolvable = 'Blurple',
  ephemeral: boolean = true
): Promise<void> {
  const embed = new EmbedBuilder().setColor(color).setDescription(message);

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], ephemeral });
    return;
  }

  await interaction.reply({ embeds: [embed], ephemeral });
}
