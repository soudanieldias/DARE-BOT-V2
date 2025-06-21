/* eslint-disable no-undef */
import { globSync } from 'glob';
import { REST, Routes, ApplicationCommand } from 'discord.js';
import { ClientExtended } from '@/types';

interface CommandData {
  name: string;
  description: string;
}

interface Command {
  data: CommandData;
  execute: (...args: any[]) => Promise<void>;
}

export class CommandLoaderModule {
  private client: ClientExtended;

  constructor(client: ClientExtended) {
    this.client = client;
  }

  async loadCommands(): Promise<void> {
    try {
      await this.client.logger!.info(
        'Commands',
        'Carregando módulo de Comandos.',
      );
      const commandFiles = globSync('./src/commands/**/*.ts');
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

      const restCommands: CommandData[] = [];

      for (const file of commandFiles) {
        const commandModule: any = require(`../../${file}`);
        const command: Command = commandModule.default || commandModule;

        if (!command?.data || !command.data.name || !command.data.description) {
          await this.client.logger!.warn(
            'Commands',
            `Comando em ${file} não tem a estrutura correta (data, name, description)`,
          );
          continue;
        }

        const { name } = command.data;

        await this.client.logger!.info(
          'Commands',
          `Comando ${name.toUpperCase()} sendo carregado...`,
        );

        const cmd = this.client.application?.commands.cache.find(
          (c: ApplicationCommand) => c.name === command.data.name,
        );

        if (cmd) {
          await this.client.logger!.error(
            'Commands',
            `Já existe um comando carregado com o mesmo nome, nome: ${name}`,
          );
          continue;
        }

        delete require.cache[require.resolve(`../../${file}`)];

        this.client.slashCommands!.set(name, command);
        await this.client.logger!.info(
          'Commands',
          `Comando ${name.toUpperCase()} carregado corretamente.`,
        );
        restCommands.push(command.data);
      }

      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
        body: restCommands,
      });

      await this.client.logger!.info(
        'Commands',
        'Comandos carregados com Sucesso.',
      );
    } catch (error) {
      await this.client.logger!.error('Commands', `Erro no arquivo: ${error}`);

      if (process.env.DEBUG === 'true') {
        try {
          const guildData = await this.client.guilds.fetch(
            process.env.GUILD_ID!,
          );
          const devMember = await guildData.members.fetch(
            process.env.OWNER_ID!,
          );
          if (devMember.user) {
            await devMember.user.send(`\`\`\`${JSON.stringify(error)}\`\`\``);
          }
        } catch (debugError) {
          console.error('Erro ao enviar debug:', debugError);
        }
      }
    }
  }
}
