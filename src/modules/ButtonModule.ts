import { globSync } from 'glob';
import { Logger } from '@/utils';
import { ClientExtended, ButtonData } from '@/types';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs/promises';

export class ButtonModule {
  private readonly client: ClientExtended;
  private readonly logger: Logger;

  constructor(client: ClientExtended) {
    this.client = client;
    this.logger = new Logger(client);
  }

  /**
   * Carrega todos os botões dos arquivos TypeScript/JavaScript
   */
  async initialize(): Promise<void> {
    try {
      await this.logger.info('ButtonModule', 'Carregando módulo de Botões.');

      const buttonFiles = [
        ...globSync('./src/buttons/**/*.ts'),
        ...globSync('./dist/buttons/**/*.js'),
        ...globSync('./build/buttons/**/*.js'),
      ];

      if (buttonFiles.length === 0) {
        await this.logger.info(
          'ButtonModule',
          'Nenhum arquivo de botão encontrado.',
        );
        return;
      }

      for (const file of buttonFiles) {
        try {
          const buttonModule = await import(path.resolve(file));
          const button: ButtonData = buttonModule.default || buttonModule;

          if (!button || !button.data || !button.data.customId) {
            await this.logger.warn(
              'ButtonModule',
              `Botão inválido no arquivo: ${file}`,
            );
            continue;
          }

          const { customId } = button.data;

          if (this.client.buttons?.has(customId)) {
            await this.logger.error(
              'ButtonModule',
              `Já existe um botão carregado com o mesmo ID: ${customId} no arquivo: ${file}`,
            );
            continue;
          }

          this.client.buttons?.set(customId, button);
          await this.logger.info(
            'ButtonModule',
            `Botão carregado: ${customId}`,
          );
        } catch (fileError) {
          await this.logger.error(
            'ButtonModule',
            `Erro ao carregar botão do arquivo ${file}: ${fileError}`,
          );
        }
      }

      const buttonCount = this.client.buttons?.size || 0;
      await this.logger.info(
        'ButtonModule',
        `${buttonCount} botões carregados com sucesso.`,
      );
    } catch (error) {
      await this.logger.error(
        'ButtonModule',
        `Erro no carregamento de botões: ${error}`,
      );
    }
  }

  async sliceButtonArray(
    originalItemsArray: ButtonBuilder[],
    maxItemsPerRow: number,
  ): Promise<ActionRowBuilder<ButtonBuilder>[]> {
    const allRows: ActionRowBuilder<ButtonBuilder>[] = [];

    const slicedResult = originalItemsArray.reduce((acc, item, index) => {
      const group = Math.floor(index / maxItemsPerRow);
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, [] as ButtonBuilder[][]);

    slicedResult.forEach(row => {
      const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        row,
      );
      allRows.push(actionRow);
    });

    return allRows;
  }

  async generateButtons(buttonsPath: string): Promise<ButtonBuilder[]> {
    try {
      const buttonsData = await fs.readFile(buttonsPath, 'utf-8');
      const buttonsConfig = JSON.parse(buttonsData);

      const buttons: ButtonBuilder[] = [];

      for (const buttonConfig of buttonsConfig.buttons) {
        const button = this.createButton(
          buttonConfig.customId,
          buttonConfig.label,
          buttonConfig.style || ButtonStyle.Primary,
          buttonConfig.disabled || false,
        );
        buttons.push(button);
      }

      return buttons;
    } catch (error) {
      this.logger.error('ButtonModule', `Erro ao gerar botões: ${error}`);
      return [];
    }
  }

  createButton(
    customId: string,
    label: string,
    style: ButtonStyle = ButtonStyle.Primary,
    disabled: boolean = false,
  ): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(style)
      .setDisabled(disabled);
  }

  createActionRow(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }
}
