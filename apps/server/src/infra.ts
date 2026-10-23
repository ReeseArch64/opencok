import { RedisClient } from "bun";
import zk from "node-zookeeper-client";
import type { Client } from "node-zookeeper-client";
import type { Config } from "./config.ts";

export { Database } from "./persistence.ts";

export class DependencyError extends Error {
  constructor(readonly component: string) {
    super(`${component} unavailable`);
  }
}
export async function bounded<T>(task: Promise<T>, timeout: number, component: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      task,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new DependencyError(component)), timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export class Cache {
  constructor(readonly config: Config) {}
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
        "120",
      )) === "OK"
    );
  }
  async refresh(uid: string, token: string): Promise<boolean> {
    return (
      Number(
        await this.command(
          "EVAL",
          "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('EXPIRE',KEYS[1],120) else return 0 end",
          "1",
          `opencok:kingdom:${this.config.kingdomId}:session:${uid}`,
          token,
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

export class Coordination {
  private readonly client: Client;
  private registered = false;
  private expired = false;
  constructor(readonly config: Config) {
    this.client = zk.createClient(config.zookeeper, {
      sessionTimeout: 15000,
      spinDelay: 1000,
      retries: 0,
    });
    this.client.on("expired", () => {
      this.expired = true;
      this.registered = false;
    });
    this.client.on("authenticationFailed", () => {
      this.expired = true;
      this.registered = false;
    });

    this.client.on("error", () => {});
  }
  get ready() {
    return this.registered && !this.expired && this.client.getState() === zk.State.SYNC_CONNECTED;
  }
  async start() {
    try {
      await bounded(
        new Promise<void>((resolve) => {
          this.client.once("connected", resolve);
          this.client.connect();
        }),
        this.config.timeoutMs,
        "zookeeper",
      );
      await bounded(
        new Promise<void>((resolve, reject) => {
          this.client.mkdirp("/opencok-experiment", (error) =>
            error ? reject(new DependencyError("zookeeper")) : resolve(),
          );
        }),
        this.config.timeoutMs,
        "zookeeper",
      );
      await bounded(
        new Promise<void>((resolve, reject) => {
          this.client.create(
            this.config.zkPath,
            Buffer.from(JSON.stringify({ runtime: "bun", kingdom: this.config.kingdomId })),
            zk.CreateMode.EPHEMERAL,
            (error) => (error ? reject(new DependencyError("zookeeper ownership")) : resolve()),
          );
        }),
        this.config.timeoutMs,
        "zookeeper",
      );
      this.registered = true;
    } catch {
      this.client.close();
      throw new DependencyError("zookeeper");
    }
  }
  close() {
    this.registered = false;
    this.client.close();
  }
}
