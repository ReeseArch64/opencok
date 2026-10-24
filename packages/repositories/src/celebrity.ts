import type { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { celebrity } from "@opencok/drizzle/schema/opencok_kingdom/celebrity";
import { DependencyError } from "@opencok/errors/dependency";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { sql } from "drizzle-orm";

export async function readCelebrityDescription(
  databases: Pick<ReturnType<typeof createDatabases>, "kingdoms" | "getKingdom">,
  uid: string,
  kingdomId: number,
): Promise<Buffer | null> {
  if (
    typeof uid !== "string" ||
    uid.length > 65535 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < -2147483648 ||
    kingdomId > 2147483647
  )
    throw new DependencyError("celebrity description input");
  if (!databases.kingdoms.has(kingdomId)) return null;
  try {
    const key = mysqlUtf8UnicodeKey(uid);
    const pattern = mysqlUtf8UnicodeCandidates([uid]);
    const db = databases.getKingdom(kingdomId).db;
    const profiles = await db
      .select({ uid: userprofile.uid, flag: userprofile.gmFlag })
      .from(userprofile)
      .where(sql`${userprofile.uid} collate "C" ~ ${pattern}`);
    const matchingProfiles = profiles.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);
    if (matchingProfiles.length > 1) throw new Error("Ambiguous celebrity target");
    const profile = matchingProfiles[0];
    if (!profile || (profile.flag ?? 0) !== 11) return null;
    const rows = await db
      .select({ uid: celebrity.uid, description: celebrity.description })
      .from(celebrity)
      .where(sql`${celebrity.uid} collate "C" ~ ${pattern}`);
    const matches = rows.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);
    if (matches.length > 1) throw new Error("Ambiguous celebrity description");
    const row = matches[0];
    if (!row) return null;
    if (row.description === null) return null;
    if (!Buffer.isBuffer(row.description) || row.description.length > 65535)
      throw new Error("Invalid celebrity bytes");
    return Buffer.from(row.description);
  } catch {
    throw new DependencyError("celebrity description");
  }
}
