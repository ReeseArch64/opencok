import { setTimeout } from "node:timers/promises";
import zk, { type Client } from "node-zookeeper-client";
import { DependencyError } from "@opencok/errors/dependency";
import { bounded } from "./timeout.ts";

export interface CoordinationConfig {
  zookeeper: string;
  timeoutMs: number;
  zkPath: string;
  kingdomId: number;
}
const sessionTimeoutMs = 15000;

export class Coordination {
  private readonly client: Client;
  private registered = false;
  private expired = false;
  constructor(readonly config: CoordinationConfig) {
    this.client = zk.createClient(config.zookeeper, {
      sessionTimeout: sessionTimeoutMs,
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
      const deadline = Date.now() + sessionTimeoutMs * 2 + this.config.timeoutMs;
      while (true) {
        const created = await bounded(
          new Promise<boolean>((resolve, reject) => {
            this.client.create(
              this.config.zkPath,
              Buffer.from(JSON.stringify({ runtime: "bun", kingdom: this.config.kingdomId })),
              zk.CreateMode.EPHEMERAL,
              (error) => {
                if (!error) resolve(true);
                else if (
                  error instanceof zk.Exception &&
                  error.getCode() === zk.Exception.NODE_EXISTS
                )
                  resolve(false);
                else reject(new DependencyError("zookeeper ownership"));
              },
            );
          }),
          Math.min(this.config.timeoutMs, Math.max(1, deadline - Date.now())),
          "zookeeper ownership",
        );
        if (created) break;
        const remaining = deadline - Date.now();
        if (remaining <= 0) throw new DependencyError("zookeeper ownership");
        await setTimeout(Math.min(250, remaining));
      }
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
