import { ClientExtended } from '@/types';
import { Logger } from '@/utils';
import { globSync } from 'fs';

export class CommandModule {
  private logger: Logger;

  constructor(client: ClientExtended) {
    this.logger = new Logger(client);
  }

  async loadCommands(client: ClientExtended): Promise<void> {
    try {
      this.logger.info('CommandModule', 'Carregando módulo de Comandos.');

      const commandFiles = [
        ...globSync('src/commands/**/*.ts'),
        ...globSync('src/commands/**/*.js'),
      ];

      this.logger.info(
        'CommandModule',
        `Encontrados ${commandFiles.length} arquivos de comando:`,
      );

      commandFiles.forEach((filePath: string) => {
        this.logger.info('CommandModule', `  📁 ${filePath}`);
      });

      let loadedCommands = 0;
      let skippedCommands = 0;
      let duplicateCommands = 0;

      commandFiles.forEach((filePath: string) => {
        try {
          const commandModule = require(filePath);
          const command = commandModule.default || commandModule;

          if (!command || !command.data) {
            this.logger.warn(
              'CommandModule',
              `❌ Comando inválido em ${filePath} - sem data`,
            );
            skippedCommands++;
            return;
          }

          const { name, description } = command.data;

          if (!name || !description) {
            this.logger.warn(
              'CommandModule',
              `❌ Comando incompleto em ${filePath} - nome: "${name}", descrição: "${description}"`,
            );
            skippedCommands++;
            return;
          }

          if (client.slashCommands && client.slashCommands.has(name)) {
            this.logger.warn(
              'CommandModule',
              `⚠️ Comando duplicado: ${name} já existe, ignorando ${filePath}`,
            );
            duplicateCommands++;
            return;
          }

          if (client.slashCommands) {
            client.slashCommands.set(name, command);
            this.logger.info(
              'CommandModule',
              `✅ Carregado comando: ${name.toLowerCase()} - ${description}`,
            );
            loadedCommands++;
          } else {
            this.logger.error(
              'CommandModule',
              `❌ client.slashCommands não está disponível para ${name}`,
            );
            skippedCommands++;
          }
        } catch (error) {
          this.logger.error(
            'CommandModule',
            `❌ Erro ao carregar comando ${filePath}: ${error}`,
          );
          skippedCommands++;
        }
      });

      this.logger.info(
        'CommandModule',
        `📊 Resumo: ${loadedCommands} comandos carregados, ${skippedCommands} ignorados, ` +
          `${duplicateCommands} duplicados`,
      );
    } catch (error) {
      this.logger.error('CommandModule', `Erro ao carregar comandos: ${error}`);
    }
  }
}
