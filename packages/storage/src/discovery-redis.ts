import { RedisClient } from "bun";
import { DependencyError } from "@opencok/errors/dependency";

export interface DiscoveryRedisConfig {
  redisUrl: string;
  timeoutMs: number;
}

export class DiscoveryRedis {
  constructor(private readonly config: DiscoveryRedisConfig) {}

  async health(): Promise<void> {
    const client = new RedisClient(this.config.redisUrl, {
      connectionTimeout: this.config.timeoutMs,
      idleTimeout: this.config.timeoutMs,
      autoReconnect: false,
      enableOfflineQueue: false,
    });
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        (async () => {
          await client.connect();

          if ((await client.send("PING", [])) !== "PONG") {throw new DependencyError("redis");}
        })(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new DependencyError("redis")), this.config.timeoutMs);
        }),
      ]);
    } catch {
      throw new DependencyError("redis");
    } finally {
      clearTimeout(timer);
      client.close();
    }
  }
}
