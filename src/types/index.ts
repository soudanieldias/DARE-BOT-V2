export interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<void>;
}

export interface Event {
  name: string;
  execute: (...args: any[]) => Promise<void>;
}

export interface Config {
  token: string;
  prefix: string;
  [key: string]: any;
}
