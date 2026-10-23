import { createDatabase } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { userbindmapping } from "@opencok/drizzle/schema/opencok_global/userbindmapping";
import { and, asc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { RedisClient } from "bun";
import type { Config } from "./config.ts";

export class DependencyError extends Error {
  constructor(readonly dependency: "database" | "redis") {
    super(`${dependency} unavailable`);
  }
}
export interface Account {
  gameUid: string;
  server: string;
  uuid: string;
  gameUserLevel: string;
  active: string | null;
  lastTime: string;
}
export interface AccountReader {
  valid(type: string, value: string, bound: boolean): Promise<Account[]>;
}

/** Discovery only reads identity mappings; it never reactivates or provisions accounts. */
export class AccountStore implements AccountReader {
  private readonly database;
  constructor(config: Config) {
    this.database = createDatabase("global", {
      connectionString: config.databaseUrl,
      max: 5,
      connectionTimeoutMillis: config.timeoutMs,
      statement_timeout: config.timeoutMs,
      query_timeout: config.timeoutMs,
    });
    this.database.pool.on("error", () => {});
  }
  private async guarded<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch {
      throw new DependencyError("database");
    }
  }
  async start() {
    await this.guarded(async () => {
      await this.database.db.select().from(account_new).limit(0);
      await this.database.db.select().from(usermapping).limit(0);
      await this.database.db.select().from(userbindmapping).limit(0);
    });
  }
  async health() {
    await this.guarded(() => this.database.db.execute(sql`SELECT 1`));
  }
  async valid(type: string, value: string, bound: boolean): Promise<Account[]> {
    return this.guarded(async () => {
      const mapping = bound ? userbindmapping : usermapping;
      const ids = this.database.db
        .select({ gameUid: mapping.gameUid })
        .from(mapping)
        .where(and(eq(mapping.mappingType, type), eq(mapping.mappingValue, value)));
      const rows = await this.database.db
        .select({
          gameUid: account_new.gameUid,
          server: account_new.server,
          uuid: account_new.uuid,
          gameUserLevel: account_new.gameUserLevel,
          active: account_new.active,
          lastTime: account_new.lastTime,
        })
        .from(account_new)
        .where(
          and(
            inArray(account_new.gameUid, ids),
            or(eq(account_new.active, 0), isNull(account_new.active)),
          ),
        )
        .orderBy(asc(account_new.gameUid));
      // Preserve legacy lastTime tie handling with a deterministic UID order and exact bigint sort.
      const byTime = new Map(rows.map((row) => [row.lastTime.toString(), row]));
      return [...byTime.values()]
        .sort((a, b) => (a.lastTime > b.lastTime ? -1 : a.lastTime < b.lastTime ? 1 : 0))
        .map((row) => ({
          ...row,
          gameUserLevel: String(row.gameUserLevel),
          active: row.active === null ? null : String(row.active),
          lastTime: row.lastTime.toString(),
        }));
    });
  }
  close() {
    return this.database.close();
  }
}

export class DiscoveryRedis {
  constructor(private readonly config: Config) {}
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
          if ((await client.send("PING", [])) !== "PONG") throw new DependencyError("redis");
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
