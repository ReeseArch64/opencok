export interface ServerConfig {
  avatarFiles?: { origin: string; keyFile: string };
  chatSession?: { url: string; signingSecret: string };
  mailTranslationEnabled?: boolean;
  host: string;
  port: number;
  healthPort: number;
  kingdomId: number;
  kingdomDatabase: string;
  playerKingdoms?: readonly { id: number; database: string }[];
  globalDatabase: string;
  databaseUrl: string;
  redisUrl: string;
  zookeeper: string;
  zkPath: string;
  loginSecret: string;
  resources: string;
  mapSize: number;
  timeoutMs: number;
}
