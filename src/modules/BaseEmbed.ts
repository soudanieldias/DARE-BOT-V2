import {
  EmbedBuilder,
  ColorResolvable,
  EmbedAuthorOptions,
  EmbedFooterOptions,
  EmbedField,
} from 'discord.js';

export class BaseEmbed {
  protected embed: EmbedBuilder;

  constructor() {
    this.embed = new EmbedBuilder();
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

  setAuthor(options: EmbedAuthorOptions): this {
    this.embed.setAuthor(options);
    return this;
  }

  setFooter(options: EmbedFooterOptions): this {
    this.embed.setFooter(options);
    return this;
  }

  setThumbnail(url: string): this {
    this.embed.setThumbnail(url);
    return this;
  }

  setImage(url: string): this {
    this.embed.setImage(url);
    return this;
  }

  setTimestamp(date?: Date): this {
    this.embed.setTimestamp(date);
    return this;
  }

  addField(name: string, value: string, inline?: boolean): this {
    this.embed.addFields({ name, value, inline });
    return this;
  }

  addFields(...fields: EmbedField[]): this {
    this.embed.addFields(fields);
    return this;
  }

  setURL(url: string): this {
    this.embed.setURL(url);
    return this;
  }

  // Métodos utilitários para cores comuns
  setSuccess(): this {
    return this.setColor('#00ff00');
  }

  setError(): this {
    return this.setColor('#ff0000');
  }

  setInfo(): this {
    return this.setColor('#0099ff');
  }

  setWarning(): this {
    return this.setColor('#ffaa00');
  }

  setDark(): this {
    return this.setColor('#2f3136');
  }

  // Método para construir o embed
  build(): EmbedBuilder {
    return this.embed;
  }

  // Método para obter o embed atual
  getEmbed(): EmbedBuilder {
    return this.embed;
  }

  // Método para resetar o embed
  reset(): this {
    this.embed = new EmbedBuilder();
    return this;
  }

  // Método para clonar o embed atual
  clone(): BaseEmbed {
    const newEmbed = new BaseEmbed();
    newEmbed.embed = EmbedBuilder.from(this.embed);
    return newEmbed;
  }
}
