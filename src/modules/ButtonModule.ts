import { globSync } from 'glob';
import { Logger } from '@/utils';
import { ClientExtended } from '@/types';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import path from 'path';
import fs from 'fs/promises';

export class ButtonModule {
  private logger: Logger;

  constructor(client: ClientExtended) {
    this.logger = new Logger(client);
  }

  /**
   * Carrega todos os botões dos arquivos TypeScript/JavaScript
   */
  async loadButtons(client: ClientExtended) {
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
          const button = buttonModule.default || buttonModule;

          if (!button || !button.data || !button.data.customId) {
            await this.logger.warn(
              'ButtonModule',
              `Botão inválido no arquivo: ${file}`,
            );
            continue;
          }

          const { customId } = button.data;

          if (client.buttons?.has(customId)) {
            await this.logger.error(
              'ButtonModule',
              `Já existe um botão carregado com o mesmo ID: ${customId} no arquivo: ${file}`,
            );
            continue;
          }

          client.buttons?.set(customId, button);
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

      const buttonCount = client.buttons?.size || 0;
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

  /**
   * Divide um array de botões em linhas com máximo de itens por linha
   */
  async sliceButtonArray(
    originalItemsArray: ButtonBuilder[],
    maxItemsPerRow: number,
  ): Promise<ActionRowBuilder<ButtonBuilder>[]> {
    const allRows: ActionRowBuilder<ButtonBuilder>[] = [];

    const slicedResult = originalItemsArray.reduce((acc, item, index) => {
      const group = Math.floor(index / maxItemsPerRow);
      acc[group] = [...(acc[group] || []), item];
      return acc;
    }, [] as ButtonBuilder[][]);

    slicedResult.forEach((subArray) => {
      const actionRowBuilder =
        new ActionRowBuilder<ButtonBuilder>().addComponents(subArray);
      allRows.push(actionRowBuilder);
    });

    return allRows;
  }

  /**
   * Gera botões a partir de arquivos de áudio em um diretório
   */
  async generateButtons(buttonsPath: string): Promise<ButtonBuilder[]> {
    try {
      const audioFiles = (await fs.readdir(buttonsPath)).filter(
        (file) => path.extname(file).toLowerCase() === '.mp3',
      );

      const fileObjects = audioFiles.map((audio) =>
        new ButtonBuilder()
          .setCustomId(audio.slice(0, -4))
          .setLabel(audio.slice(0, -4))
          .setStyle(ButtonStyle.Primary),
      );

      await this.logger.info(
        'ButtonModule',
        `${fileObjects.length} botões de áudio gerados do diretório: ${buttonsPath}`,
      );

      return fileObjects;
    } catch (error) {
      await this.logger.error(
        'ButtonModule',
        `Erro ao gerar botões do diretório ${buttonsPath}: ${error}`,
      );
      return [];
    }
  }

  /**
   * Método utilitário para criar um botão personalizado
   */
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

  /**
   * Método utilitário para criar uma ActionRow com botões
   */
  createActionRow(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
  }
}
