import { glob } from 'glob';
import path from 'path';
import { MessageFlags } from 'discord.js';
import type {
  Client,
  StringSelectMenuInteraction,
  TextChannel,
} from 'discord.js';
import { log } from '@/shared/logger';
import { ButtonModule } from './ButtonModule';

export const SOUNDPAD_CATEGORIES = [
  { label: 'audios', value: 'spad_audios' },
  { label: 'frases', value: 'spad_frases' },
  { label: 'memes', value: 'spad_memes' },
  { label: 'musicas', value: 'spad_musicas' },
  { label: 'times', value: 'spad_times' },
] as const;

const SOUNDPAD_PATHS: Record<string, { path: string; category: string }> = {
  spad_audios: { path: 'src/audios/audios', category: 'audios' },
  spad_frases: { path: 'src/audios/frases', category: 'frases' },
  spad_memes: { path: 'src/audios/memes', category: 'memes' },
  spad_musicas: { path: 'src/audios/musicas', category: 'musicas' },
  spad_times: { path: 'src/audios/times', category: 'times' },
};

export interface DareClient extends Client {
  pads: Map<string, { name: string; path: string }>;
  soundpadModule: SoundpadModule;
  soundModule: import('./SoundModule').SoundModule;
}

export class SoundpadModule {
  private buttonModule = new ButtonModule();

  async listSoundpads(
    client: DareClient,
    interaction: StringSelectMenuInteraction
  ): Promise<void> {
    const [value] = interaction.values;
    const config = SOUNDPAD_PATHS[value];
    if (!config) return;

    const basePath = path.join(process.cwd(), config.path);
    const buttons = await this.buttonModule.generateButtons(basePath);
    const rows = this.buttonModule.sliceButtonArray(buttons, 5);

    await interaction.reply({
      content: `Enviando lista de áudios.\nCategoria ${config.category}`,
      flags: [MessageFlags.Ephemeral],
    });

    const channel = interaction.channel;
    if (channel && 'send' in channel) {
      for (let i = 0; i < rows.length; i++) {
        await (channel as TextChannel).send({
          content: `Lista de Áudios (${config.category}): ${i + 1}`,
          components: [rows[i]],
        });
      }
    }
  }

  async start(client: DareClient): Promise<void> {
    try {
      log('SoundPad', 'Inicializando Soundpad.');
      const audioFiles = await glob('src/audios/**/*.mp3', { cwd: process.cwd() });

      for (const file of audioFiles) {
        const fullPath = path.join(process.cwd(), file);
        const fileName = path.basename(file, '.mp3');

        if (!client.pads.has(fileName)) {
          client.pads.set(fileName, { name: fileName, path: fullPath });
        } else {
          log('SoundPad', `Arquivo duplicado ignorado: "${fileName}" (${file})`);
        }
      }

      log('SoundPad', `Soundpad inicializado: ${client.pads.size} pads carregados.`);
    } catch (error) {
      log('SoundPad', `Erro: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
