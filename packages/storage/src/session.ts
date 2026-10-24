import { publishPlayerUpdate } from "./player-update.ts";
import { loadExpeditionRanking } from "./expedition-ranking.ts";
import { loadScoreActivityRanking } from "./score-activity-ranking.ts";
import { loadExpeditionStage } from "./expedition-stage.ts";
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
  expeditionRanking(limit: number) {
    return loadExpeditionRanking(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      limit,
    );
  }
  scoreActivityRanking(): Promise<readonly string[]> {
    return loadScoreActivityRanking(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
    );
  }
  expeditionStage(kingdomId = this.config.kingdomId): Promise<number | undefined> {
    return loadExpeditionStage((command, ...args) => this.command(command, ...args), kingdomId);
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
  async deviceChangeCount(deviceId: string): Promise<string | null> {
    if (deviceId.length > 255) throw new DependencyError("redis");
    const value = await this.command("GET", `opencok:global:device-account-change:${deviceId}`);
    if (value === null) return null;
    if (typeof value !== "string" || value.length > 65535) throw new DependencyError("redis");
    return value;
  }
  async nicknameForbiddenWords(key: string): Promise<readonly string[]> {
    if (
      !["regular", "strict", "pattern", "weight", "name"].some(
        (kind) => key === `forbidden_words_${kind}`,
      )
    )
      throw new DependencyError("nickname forbidden list");
    let entries: unknown;
    try {
      entries = await this.command("LRANGE", key, "0", "-1");
    } catch {
      return [];
    }
    if (!Array.isArray(entries) || entries.length > 65536)
      throw new DependencyError("nickname forbidden list");
    let bytes = 0;
    for (const entry of entries) {
      if (typeof entry !== "string" || Buffer.byteLength(entry) > 65535)
        throw new DependencyError("nickname forbidden list");
      bytes += Buffer.byteLength(entry);
      if (bytes > 16 * 1024 * 1024) throw new DependencyError("nickname forbidden list");
    }
    return [...entries];
  }
  publishPlayerUpdateTime(uid: string, updatedAt: string): Promise<void> {
    return publishPlayerUpdate(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      uid,
      updatedAt,
    );
  }
  async playerUpdateTimes(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>> {
    if (
      !Number.isSafeInteger(kingdomId) ||
      kingdomId < 1 ||
      uids.length > 50 ||
      uids.some((uid) => !uid || uid.length > 255)
    )
      throw new DependencyError("redis");
    if (!uids.length) return new Map();
    const values = await this.command(
      "MGET",
      ...uids.map((uid) => `opencok:kingdom:${kingdomId}:player-update:${uid}`),
    );
    if (!Array.isArray(values) || values.length !== uids.length) throw new DependencyError("redis");
    const updates = new Map<string, string>();
    for (const [index, value] of values.entries()) {
      if (value === null || (typeof value === "string" && !value.trim())) continue;
      if (
        typeof value !== "string" ||
        !/^\d{1,19}$/.test(value) ||
        BigInt(value) > 9223372036854775807n
      )
        throw new DependencyError("redis");
      updates.set(uids[index]!, value);
    }
    return updates;
  }
  async emperorVersion(kingdomId = this.config.kingdomId): Promise<number | null | undefined> {
    if (!Number.isSafeInteger(kingdomId) || kingdomId < 1) throw new DependencyError("redis");
    const value = await this.command("GET", `opencok:kingdom:${kingdomId}:emperor-version`);
    if (value === null) return undefined;
    if (value === "none") return null;
    if (typeof value !== "string" || !/^(?:0|-?[1-9]\d{0,9})$/.test(value))
      throw new DependencyError("redis");
    const version = Number(value);
    if (version < -2147483648 || version > 2147483647) throw new DependencyError("redis");
    return version;
  }
  async worldEffects(kingdomId = this.config.kingdomId): Promise<ReadonlyMap<string, string>> {
    if (!Number.isSafeInteger(kingdomId) || kingdomId < 1) throw new DependencyError("redis");
    const values = await this.command("HGETALL", `opencok:kingdom:${kingdomId}:world-effects`);
    if (!Array.isArray(values) || values.length > 8192 || values.length % 2 !== 0)
      throw new DependencyError("redis");
    const effects = new Map<string, string>();
    let bytes = 0;
    for (let index = 0; index < values.length; index += 2) {
      const key = values[index];
      const value = values[index + 1];
      if (
        typeof key !== "string" ||
        !/^(?:0|[1-9]\d{0,9})$/.test(key) ||
        Number(key) > 2147483647 ||
        typeof value !== "string" ||
        effects.has(key)
      )
        throw new DependencyError("redis");
      const size = Buffer.byteLength(value);
      bytes += size;
      if (size > 65535 || bytes > 1048576) throw new DependencyError("redis");
      effects.set(key, value);
    }
    return effects;
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
