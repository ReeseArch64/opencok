import { createHash } from "node:crypto";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { DependencyError } from "@opencok/errors/dependency";
import { mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { nicknameTrim } from "@opencok/rules/nickname";
import { sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as globalSchema from "@opencok/drizzle/schema/global";
import type { Database } from "./game.ts";
import { readNicknameOccupation } from "./nickname.ts";

type GlobalDatabase = Database["databases"]["global"]["db"];

export type NicknameGlobalTransaction = Pick<
  NodePgDatabase<typeof globalSchema>,
  "select" | "insert" | "update" | "delete" | "execute"
>;

export async function withAvailableNickname<T>(
  db: GlobalDatabase,
  name: string,
  operation: (tx: NicknameGlobalTransaction) => Promise<T>,
): Promise<T> {
  return withNicknameLock(db, name, async (tx) => {
    if (await readNicknameOccupation(tx, name)) throw new GameError(errors.nicknameOccupied);

    return operation(tx);
  });
}

export async function withNicknameLock<T>(
  db: GlobalDatabase,
  name: string,
  operation: (tx: NicknameGlobalTransaction) => Promise<T>,
): Promise<T> {
  let key: string;

  try {
    if (
      typeof name !== "string" ||
      !name ||
      name.length > 200 ||
      name.includes("\0") ||
      nicknameTrim(name) !== name
    )
      throw new Error("Invalid nickname lock input");

    key = createHash("sha256")
      .update("opencok:nickname-change:uca400:")
      .update(mysqlUtf8UnicodeKey(name))
      .digest()
      .readBigInt64BE()
      .toString();
  } catch {
    throw new DependencyError("nickname change input");
  }

  let release: ((destroy: boolean) => void) | undefined;
  let rollback: (() => Promise<unknown>) | undefined;
  let ended = false;

  try {
    const client = await db.$client.connect();
    release = (destroy) => client.release(destroy);
    const tx = drizzle(client, { schema: globalSchema });
    rollback = () => tx.execute(sql`rollback`);
    await tx.execute(sql`begin isolation level read committed read write`);
    const result = await tx.execute<{ acquired: boolean }>(
      sql`select pg_try_advisory_xact_lock(${key}::bigint) as acquired`,
    );

    if (result.rows.length !== 1 || typeof result.rows[0]?.acquired !== "boolean")
      throw new DependencyError("nickname lock result");

    if (!result.rows[0].acquired) throw new GameError(errors.nicknameOccupied);

    const value = await operation(tx);
    await tx.execute(sql`commit`);
    ended = true;

    return value;
  } catch (error) {
    if (rollback)
      try {
        await rollback();
        ended = true;
      } catch {}

    if (ended && error instanceof GameError) throw error;

    throw new DependencyError("nickname change transaction");
  } finally {
    release?.(!ended);
  }
}
