import type { Client } from 'discord.js';

export function LoadCommands(_client: Client): void {}

export function OnReady(client: Client, token: string): void {
  client.login(token);
}

export function OnInteraction(_client: Client): void {}

export function OnMessageCreate(_client: Client): void {}

export function SetActivity(_client: Client): void {}

export function DBConnect(): void {}
