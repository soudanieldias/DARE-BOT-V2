import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  type VoiceConnection,
  type AudioPlayer,
} from '@discordjs/voice';
import type { GuildMember, VoiceChannel } from 'discord.js';

export interface ConnectionParams {
  channelId: string;
  guildId: string;
  adapterCreator: unknown;
}

interface PadInfo {
  name: string;
  path: string;
}

export class SoundModule {
  private players = new Map<string, AudioPlayer>();
  private connections = new Map<string, VoiceConnection>();

  private cleanup(guildId: string): void {
    const player = this.players.get(guildId);
    if (player) player.stop();
    this.players.delete(guildId);
    this.connections.delete(guildId);
  }

  async playSound(
    interaction: { guildId?: string | null; member: GuildMember | null },
    pad: PadInfo,
    params: ConnectionParams
  ): Promise<void> {
    const { guildId } = params;
    const member = interaction.member;
    if (!member) throw new Error('Membro não encontrado');

    let player = this.players.get(guildId);
    if (!player) {
      player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play },
      });
      this.players.set(guildId, player);
    }

    const existingConn = this.connections.get(guildId);
    const existingChannelId = existingConn?.joinConfig.channelId;
    if (existingConn && existingChannelId && existingChannelId !== member.voice.channel?.id) {
      const botChannel = member.guild.channels.cache.get(existingChannelId) as
        | VoiceChannel
        | undefined;
      if (botChannel && botChannel.members.size > 1) {
        throw new Error('O bot já está conectado a outro canal de voz.');
      }
    }

    const connection = joinVoiceChannel(params as Parameters<typeof joinVoiceChannel>[0]);
    this.connections.set(guildId, connection);

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      this.cleanup(guildId);
    });
    connection.on(VoiceConnectionStatus.Destroyed, () => {
      this.cleanup(guildId);
    });

    const resource = createAudioResource(pad.path, { inlineVolume: true });
    if (resource.volume) resource.volume.setVolume(0.1);

    player.on(AudioPlayerStatus.Idle, () => this.cleanup(guildId));
    player.on('error', () => this.cleanup(guildId));

    connection.subscribe(player);
    player.play(resource);
  }

  stopSound(guildId: string): void {
    this.cleanup(guildId);
  }
}
