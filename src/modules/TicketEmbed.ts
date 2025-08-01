import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
  Guild,
  User,
} from 'discord.js';
import { BaseEmbed } from './BaseEmbed';

interface GuildData {
  ticketTitle: string;
  ticketDescription: string;
}

export class TicketEmbed extends BaseEmbed {
  constructor() {
    super();
  }

  buildOpenedTicketEmbed(guild: Guild, guildData: GuildData): EmbedBuilder {
    return this.reset()
      .setDark()
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .setDescription(guildData.ticketDescription)
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .build();
  }

  buildReopenedTicketEmbed(
    guild: Guild,
    guildData: GuildData,
    ticketUserId: string,
    reopenedBy: User,
  ): EmbedBuilder {
    return this.reset()
      .setDark()
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .setDescription(
        `Olá, <@!${ticketUserId}>, o seu ticket foi reaberto pelo <@!${reopenedBy.id}>`,
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .build();
  }

  buildClosedTicketEmbed(guild: Guild, guildData: GuildData): EmbedBuilder {
    return this.reset()
      .setDark()
      .setAuthor({
        name: guildData.ticketTitle,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .setDescription('Ticket fechado, escolha uma ação abaixo.')
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ size: 256 }) || undefined,
      })
      .build();
  }

  buildTicketButtons(
    type: 'opened' | 'reopened' | 'closed',
  ): ActionRowBuilder<ButtonBuilder> | null {
    switch (type) {
      case 'opened':
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-close')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Fechar ticket')
            .setEmoji('🔒'),
          new ButtonBuilder()
            .setCustomId('ticket-mention')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Mencionar Usuário')
            .setEmoji('📢'),
        );

      case 'reopened':
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-closemessage')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Apagar Mensagem')
            .setEmoji('🗑️'),
        );

      case 'closed':
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket-reopen')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Reabrir Ticket')
            .setEmoji('🔓'),
          new ButtonBuilder()
            .setCustomId('ticket-transcript')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Transcrever Ticket')
            .setEmoji('📄'),
        );

      default:
        return null;
    }
  }

  // Métodos adicionais para outros tipos de embeds
  buildWelcomeEmbed(guild: Guild, user: User): EmbedBuilder {
    return this.reset()
      .setSuccess()
      .setTitle('🎉 Bem-vindo!')
      .setDescription(`Olá ${user}, seja bem-vindo ao ${guild.name}!`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setTimestamp()
      .build();
  }

  buildGoodbyeEmbed(guild: Guild, user: User): EmbedBuilder {
    return this.reset()
      .setWarning()
      .setTitle('👋 Até logo!')
      .setDescription(`${user} saiu do servidor ${guild.name}.`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setTimestamp()
      .build();
  }

  buildModerationEmbed(
    action: 'warn' | 'kick' | 'ban' | 'mute',
    user: User,
    moderator: User,
    reason: string,
  ): EmbedBuilder {
    const actionEmojis = {
      warn: '⚠️',
      kick: '👢',
      ban: '🔨',
      mute: '🔇',
    };

    const actionColors = {
      warn: '#ffaa00' as ColorResolvable,
      kick: '#ff6600' as ColorResolvable,
      ban: '#ff0000' as ColorResolvable,
      mute: '#ff8800' as ColorResolvable,
    };

    return this.reset()
      .setColor(actionColors[action])
      .setTitle(
        `${actionEmojis[action]} Usuário ${
          action === 'warn'
            ? 'Advertido'
            : action === 'kick'
              ? 'Expulso'
              : action === 'ban'
                ? 'Banido'
                : 'Silenciado'
        }`,
      )
      .addField('Usuário', `${user} (${user.id})`, true)
      .addField('Moderador', `${moderator} (${moderator.id})`, true)
      .addField('Motivo', reason || 'Nenhum motivo fornecido')
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .setTimestamp()
      .build();
  }

  buildHelpEmbed(
    title: string,
    description: string,
    commands: Array<{ name: string; description: string; usage?: string }>,
  ): EmbedBuilder {
    const fields = commands.map(cmd => ({
      name: `/${cmd.name}`,
      value: `${cmd.description}${cmd.usage ? `\nUso: ${cmd.usage}` : ''}`,
      inline: true,
    }));

    return this.reset()
      .setInfo()
      .setTitle(title)
      .setDescription(description)
      .addFields(...fields)
      .setTimestamp()
      .build();
  }
}

// Exportar uma instância singleton
export const ticketEmbed = new TicketEmbed();
