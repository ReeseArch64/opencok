import { server_info } from "@opencok/drizzle/schema/opencok_global/server_info";
import { DependencyError } from "@opencok/errors/dependency";
import { DrizzleQueryError, eq } from "drizzle-orm";
import type { Database } from "./game.ts";

export async function readNormalRankingRealm(
  db: Database["databases"]["global"]["db"],
  kingdomId: number,
): Promise<boolean> {
  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    throw new DependencyError("ranking realm input");
  if (kingdomId > 999999) return false;
  try {
    const rows = await db
      .select({ id: server_info.id, type: server_info.type })
      .from(server_info)
      .where(eq(server_info.id, kingdomId))
      .limit(1);
    const row = rows[0];
    if (!row) return false;
    if (row.id !== kingdomId || !Number.isInteger(row.type))
      throw new DependencyError("ranking realm row");
    return [0, 1, 6, 23].includes(row.type);
  } catch (error) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;
    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      typeof cause.code === "string" &&
      /^[0-9A-Z]{5}$/.test(cause.code)
    )
      return false;
    throw new DependencyError("ranking realm");
  }
}

export async function readCrossRankingRealm(
  db: Database["databases"]["global"]["db"],
  kingdomId: number,
): Promise<boolean> {
  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    throw new DependencyError("ranking realm input");
  if (kingdomId > 999999) return false;
  const row = (
    await db
      .select({ id: server_info.id, type: server_info.type })
      .from(server_info)
      .where(eq(server_info.id, kingdomId))
      .limit(1)
  )[0];
  if (!row) return false;
  if (row.id !== kingdomId || !Number.isInteger(row.type))
    throw new DependencyError("ranking realm row");
  return [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21, 22].includes(row.type);
}
