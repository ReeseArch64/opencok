export interface ServerConfig {
  host: string;
  port: number;
  healthPort: number;
  kingdomId: number;
  kingdomDatabase: string;
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
