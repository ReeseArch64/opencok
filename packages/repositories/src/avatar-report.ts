import { createHash } from "node:crypto";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { DependencyError } from "@opencok/errors/dependency";
import { mailBlank } from "@opencok/rules/mail";
import { mysqlUtf8UnicodeCandidates, mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { eq, sql } from "drizzle-orm";
import type { Database } from "./game.ts";

export async function reportAvatar(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  target: string,
  now: number,
): Promise<void> {
  if (
    typeof owner !== "string" ||
    !owner ||
    owner.length > 255 ||
    !owner.isWellFormed() ||
    owner.includes("\0") ||
    typeof target !== "string" ||
    target.length > 255 ||
    mailBlank(target) ||
    target.includes("\0") ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    throw new DependencyError("avatar report input");

  const key = mysqlUtf8UnicodeKey(target);
  const pattern = mysqlUtf8UnicodeCandidates([target]);
  const lock = createHash("sha256")
    .update("opencok:avatar-report:uca400:")
    .update(key)
    .digest()
    .readBigInt64BE()
    .toString();
  await db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          realm: userprofile.serverId,
          banFlag: userprofile.banFlag,
          banTime: userprofile.banTime,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");

      if (
        !profile ||
        profile.uid !== owner ||
        profile.realm !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(now)
      )
        throw new DependencyError("avatar report owner");

      await tx.execute(sql`select pg_advisory_xact_lock(${lock}::bigint)`);
      const candidates = await tx
        .select({ uid: pic_upload_record.uid })
        .from(pic_upload_record)
        .where(sql`${pic_upload_record.uid} collate "C" ~ ${pattern}`);
      const matches = candidates.filter((row) => mysqlUtf8UnicodeKey(row.uid) === key);

      if (matches.length > 1) throw new DependencyError("ambiguous avatar report target");

      const existing = matches[0];
      const increment = sql`case when coalesce(${pic_upload_record.report}, 0) = 2147483647 then -2147483648 else coalesce(${pic_upload_record.report}, 0) + 1 end`;
      const changed = existing
        ? await tx
            .update(pic_upload_record)
            .set({ report: increment })
            .where(eq(pic_upload_record.uid, existing.uid))
            .returning({ uid: pic_upload_record.uid })
        : await tx
            .insert(pic_upload_record)
            .values({
              uid: target,
              report: 1,
              picVer: -1,
              updateTime: 0n,
              banCount: 0,
              banTime: 0n,
              stat: 0,
            })
            .onConflictDoUpdate({ target: pic_upload_record.uid, set: { report: increment } })
            .returning({ uid: pic_upload_record.uid });

      if (changed.length !== 1 || changed[0]!.uid !== (existing?.uid ?? target))
        throw new DependencyError("avatar report result");
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
