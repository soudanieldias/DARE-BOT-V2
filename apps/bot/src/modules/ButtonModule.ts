import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { readdir } from 'fs/promises';
import path from 'path';

const MAX_LABEL_LENGTH = 80;

export class ButtonModule {
  async generateButtons(buttonsPath: string): Promise<ButtonBuilder[]> {
    const files = await readdir(buttonsPath);
    const mp3Files = files.filter((f) => path.extname(f).toLowerCase() === '.mp3');
    return mp3Files.map((audio) =>
      new ButtonBuilder()
        .setCustomId(audio.slice(0, -4).slice(0, MAX_LABEL_LENGTH))
        .setLabel(audio.slice(0, -4).slice(0, MAX_LABEL_LENGTH))
        .setStyle(ButtonStyle.Primary)
    );
  }

  sliceButtonArray(
    items: ButtonBuilder[],
    maxPerRow: number
  ): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
    const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];
    for (let i = 0; i < items.length; i += maxPerRow) {
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      row.addComponents(items.slice(i, i + maxPerRow));
      rows.push(row);
    }
    return rows;
  }
}
