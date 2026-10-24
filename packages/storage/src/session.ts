import { SESSION_TTL_SECONDS } from "@opencok/constants/connection";
import { RedisClient } from "bun";
import { DependencyError } from "@opencok/errors/dependency";
import { bounded } from "./timeout.ts";

export interface SessionConfig {
  redisUrl: string;
  timeoutMs: number;
  kingdomId: number;
}
export class Cache {
  constructor(readonly config: SessionConfig) {}
  async command(command: string, ...args: string[]): Promise<unknown> {
    const client = new RedisClient(this.config.redisUrl, {
      connectionTimeout: this.config.timeoutMs,
      idleTimeout: this.config.timeoutMs,
      autoReconnect: false,
      enableOfflineQueue: false,
    });
    try {
      return await bounded(
        (async () => {
          await client.connect();
          return client.send(command, args);
        })(),
        this.config.timeoutMs,
        "redis",
      );
    } catch {
      throw new DependencyError("redis");
    } finally {
      client.close();
    }
  }
  async claim(uid: string, token: string): Promise<boolean> {
    return (
      (await this.command(
        "SET",
        `opencok:kingdom:${this.config.kingdomId}:session:${uid}`,
        token,
        "NX",
        "EX",
        String(SESSION_TTL_SECONDS),
      )) === "OK"
    );
  }
  async deviceChangeCount(deviceId: string): Promise<bigint | null> {
    if (!deviceId || deviceId.length > 255) throw new DependencyError("redis");
    const value = await this.command("GET", `opencok:global:device-account-change:${deviceId}`);
    if (value === null) return null;
    if (
      typeof value !== "string" ||
      !/^\d{1,19}$/.test(value) ||
      BigInt(value) > 9223372036854775807n
    )
      throw new DependencyError("redis");
    return BigInt(value);
  }
  async refresh(uid: string, token: string): Promise<boolean> {
    return (
      Number(
        await this.command(
          "EVAL",
          "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('EXPIRE',KEYS[1],ARGV[2]) else return 0 end",
          "1",
          `opencok:kingdom:${this.config.kingdomId}:session:${uid}`,
          token,
          String(SESSION_TTL_SECONDS),
        ),
      ) === 1
    );
  }
  async release(uid: string, token: string) {
    await this.command(
      "EVAL",
      "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
      "1",
      `opencok:kingdom:${this.config.kingdomId}:session:${uid}`,
      token,
    );
  }
}
