import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  ChatInputCommandInteraction,
  CacheType,
  ColorResolvable,
  TextChannel,
} from 'discord.js';
import { ClientExtended } from '@/types';

export class EmbedModule {
  private embed: EmbedBuilder;
  private logger: any;

  constructor(client: ClientExtended) {
    this.embed = new EmbedBuilder();
    this.logger = client.logger;
    this.initializeEmbed();
  }

  private initializeEmbed(): void {
    this.embed
      .setTitle('Título do Embed')
      .setDescription('Descrição do Embed')
      .setColor('#00ff00');
  }

  setTitle(title: string): this {
    this.embed.setTitle(title);
    return this;
  }

  setDescription(description: string): this {
    this.embed.setDescription(description);
    return this;
  }

  setColor(color: ColorResolvable): this {
    this.embed.setColor(color);
    return this;
  }

  setThumbnail(thumbnail: string): this {
    this.embed.setThumbnail(thumbnail);
    return this;
  }

  setImage(image: string): this {
    this.embed.setImage(image);
    return this;
  }

  setFooter(text: string, iconURL?: string): this {
    this.embed.setFooter({ text, iconURL });
    return this;
  }

  setTimestamp(date?: Date): this {
    this.embed.setTimestamp(date);
    return this;
  }

  addField(name: string, value: string, inline: boolean = false): this {
    this.embed.addFields({ name, value, inline });
    return this;
  }

  addFields(
    ...fields: Array<{ name: string; value: string; inline?: boolean }>
  ): this {
    this.embed.addFields(fields);
    return this;
  }

  async cancel(
    _client: ClientExtended,
    interaction: Interaction,
  ): Promise<void> {
    try {
      if (interaction.isRepliable()) {
        await interaction.deleteReply();
      }
    } catch (error) {
      await this.logger?.error(
        'EmbedModule',
        `Erro ao cancelar embed: ${error}`,
      );
    }
  }

  async generate(
    client: ClientExtended,
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    try {
      const newEmbed = new EmbedBuilder()
        .setTitle(this.embed.data.title || 'Título do Embed')
        .setDescription(this.embed.data.description || 'Descrição do Embed')
        .setColor(this.embed.data.color || '#00ff00')
        .setThumbnail(this.embed.data.thumbnail?.url || '');

      if (this.embed.data.image?.url) {
        newEmbed.setImage(this.embed.data.image.url);
      }

      if (this.embed.data.footer) {
        newEmbed.setFooter(this.embed.data.footer);
      }

      if (this.embed.data.timestamp) {
        newEmbed.setTimestamp(new Date(this.embed.data.timestamp));
      }

      if (this.embed.data.fields?.length) {
        newEmbed.addFields(this.embed.data.fields);
      }

      const sendButton = new ButtonBuilder()
        .setCustomId('embed-send')
        .setStyle(ButtonStyle.Success)
        .setLabel('Enviar')
        .setEmoji('✅');

      const cancelButton = new ButtonBuilder()
        .setCustomId('embed-cancel')
        .setStyle(ButtonStyle.Danger)
        .setLabel('Cancelar')
        .setEmoji('❌');

      const editButton = new ButtonBuilder()
        .setCustomId('embed-edit')
        .setStyle(ButtonStyle.Primary)
        .setLabel('Editar')
        .setEmoji('✏️');

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        sendButton,
        editButton,
        cancelButton,
      ]);

      this.embed = newEmbed;

      await interaction.reply({
        embeds: [newEmbed],
        components: [row],
        ephemeral: true,
      });

      await this.logger?.info('EmbedModule', 'Embed gerado com sucesso');
    } catch (error) {
      await this.logger?.error('EmbedModule', `Erro ao gerar embed: ${error}`);
      throw error;
    }
  }

  async send(client: ClientExtended, interaction: Interaction): Promise<void> {
    try {
      if (!interaction.channel) {
        throw new Error('Canal inválido');
      }

      if (!this.embed.data.title) {
        throw new Error('Título do embed não definido');
      }

      await (interaction.channel as TextChannel).send({ embeds: [this.embed] });
      await this.logger?.info('EmbedModule', 'Embed enviado com sucesso');
    } catch (error) {
      await this.logger?.error('EmbedModule', `Erro ao enviar embed: ${error}`);
      throw error;
    }
  }

  async edit(
    _client: ClientExtended,
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    try {
      if (!this.embed.data.title) {
        throw new Error('Título do embed não definido');
      }

      await interaction.editReply({ embeds: [this.embed] });
      await this.logger?.info('EmbedModule', 'Embed editado com sucesso');
    } catch (error) {
      await this.logger?.error('EmbedModule', `Erro ao editar embed: ${error}`);
      throw error;
    }
  }

  // Métodos utilitários
  createSuccessEmbed(title: string, description: string): this {
    return this.setTitle(title).setDescription(description).setColor('#00ff00');
  }

  createErrorEmbed(title: string, description: string): this {
    return this.setTitle(title).setDescription(description).setColor('#ff0000');
  }

  createInfoEmbed(title: string, description: string): this {
    return this.setTitle(title).setDescription(description).setColor('#0099ff');
  }

  createWarningEmbed(title: string, description: string): this {
    return this.setTitle(title).setDescription(description).setColor('#ffaa00');
  }

  // Método para criar embed de ajuda
  createHelpEmbed(
    title: string,
    description: string,
    fields: Array<{ name: string; value: string; inline?: boolean }>,
  ): this {
    return this.setTitle(title)
      .setDescription(description)
      .setColor('#0099ff')
      .addFields(...fields)
      .setTimestamp();
  }

  // Método para criar embed de lista
  createListEmbed(
    title: string,
    items: string[],
    itemPrefix: string = '•',
  ): this {
    const listText = items.map((item) => `${itemPrefix} ${item}`).join('\n');
    return this.setTitle(title).setDescription(listText).setColor('#0099ff');
  }

  // Getter para acessar o embed atual
  getEmbed(): EmbedBuilder {
    return this.embed;
  }

  // Setter para definir um embed completo
  setEmbed(embed: EmbedBuilder): this {
    this.embed = embed;
    return this;
  }
}
