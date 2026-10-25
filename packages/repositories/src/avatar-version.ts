import type {
  AvatarVersionInspector,
  AvatarVersionIntent,
  AvatarVersionKey,
  AvatarVersionResult,
} from "@opencok/contracts/avatar-version";
import type { AvatarMailDelivery, AvatarProfilePublisher } from "@opencok/contracts/files";
import { avatar_version_update } from "@opencok/drizzle/schema/opencok_kingdom/avatar_version_update";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { avatarVersionMail, avatarVersionProfile } from "@opencok/rules/avatar-version";
import { legacyAvatarVersion } from "@opencok/rules/avatar-version";
import { nextAvatarRevision } from "./avatar-publication.ts";
import { and, asc, eq, gt, or, sql } from "drizzle-orm";
import { insertAvatarSystemMail } from "./avatar-mail.ts";
import type { Database } from "./game.ts";

type RealmDatabase = Database["kingdom"]["db"];

function validKey(owner: string, operationId: string, kingdomId: number) {
  if (
    !/^[0-9]{1,20}$/.test(owner) ||
    !/^[a-f0-9]{32}$/.test(operationId) ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647
  )
    throw new Error("Invalid avatar version key");
}

export async function commitAvatarVersion(
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  operationId: string,
  now: number,
  inspect: AvatarVersionInspector,
  recoverOnly = false,
): Promise<AvatarVersionResult> {
  validKey(owner, operationId, kingdomId);
  if (!Number.isSafeInteger(now) || now < 0) throw new Error("Invalid avatar version time");
  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          banTime: userprofile.banTime,
          banFlag: userprofile.banFlag,
          picVer: userprofile.picVer,
          name: userprofile.name,
          pf: userprofile.pf,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");
      if (
        !profile ||
        profile.uid !== owner ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(now)
      )
        return { profile };
      const [prior] = await tx
        .select()
        .from(avatar_version_update)
        .where(eq(avatar_version_update.operationId, operationId))
        .limit(1);
      if (prior) {
        if (prior.ownerUid !== owner) throw new Error("Avatar version operation owner mismatch");
        avatarVersionProfile(prior, kingdomId);
        return { profile, intent: prior };
      }
      if (recoverOnly) throw new Error("Avatar version operation not committed");
      let record: typeof pic_upload_record.$inferSelect | undefined;
      let recordRead = false,
        castleRead = false,
        active = true;
      let plan;
      try {
        plan = await inspect(profile, {
          async castleLevel() {
            if (!active || castleRead) throw new Error("Invalid avatar version castle read");
            castleRead = true;
            const rows = await tx
              .select({ uid: user_building.uid, level: user_building.level })
              .from(user_building)
              .where(and(eq(user_building.uid, owner), eq(user_building.itemId, 400000)))
              .limit(2);
            if (rows.length > 1 || rows.some((row) => row.uid !== owner))
              throw new Error("Invalid avatar version castle");
            return rows[0]?.level ?? 0;
          },
          async uploadRecord() {
            if (!active || recordRead) throw new Error("Invalid avatar version record read");
            recordRead = true;
            [record] = await tx
              .select()
              .from(pic_upload_record)
              .where(eq(pic_upload_record.uid, owner))
              .limit(1)
              .for("update");
            if (record && record.uid !== owner)
              throw new Error("Invalid avatar version record owner");
            return record;
          },
        });
      } finally {
        active = false;
      }
      const sequence = legacyAvatarVersion(profile.picVer);
      if (
        plan.picVer !== sequence + (plan.moderated ? 0 : 2000000) ||
        (plan.moderated ? !recordRead || !castleRead : recordRead || castleRead) ||
        (plan.moderated ? plan.nextUpdateTime === null : plan.nextUpdateTime !== null)
      )
        throw new Error("Invalid avatar version plan");
      const intent: AvatarVersionIntent = {
        operationId,
        ownerUid: owner,
        picVer: plan.picVer,
        committedAt: BigInt(now),
        nextUpdateTime: plan.nextUpdateTime,
        effects: plan.effects,
        pendingEffects: plan.pendingEffects,
        revision: await nextAvatarRevision(tx, owner),
      };
      avatarVersionProfile(intent, kingdomId);
      if (intent.pendingEffects !== 6 && intent.pendingEffects !== 7)
        throw new Error("Invalid avatar version effects");
      if (intent.pendingEffects & 1) avatarVersionMail(intent);
      const pending = await tx
        .select({ id: avatar_version_update.operationId })
        .from(avatar_version_update)
        .where(
          and(
            eq(avatar_version_update.ownerUid, owner),
            gt(avatar_version_update.pendingEffects, 0),
          ),
        )
        .limit(1000);
      if (pending.length >= 1000) throw new Error("Avatar version backlog full");
      if (plan.moderated) {
        const values = { picVer: plan.picVer, report: 0, updateTime: BigInt(now), stat: 0 };
        if (record)
          await tx.update(pic_upload_record).set(values).where(eq(pic_upload_record.uid, owner));
        else
          await tx
            .insert(pic_upload_record)
            .values({ uid: owner, ...values, banCount: 0, banTime: 0n });
      }
      const changed = await tx
        .update(userprofile)
        .set({ picVer: plan.picVer })
        .where(and(eq(userprofile.uid, owner), eq(userprofile.picVer, profile.picVer!)))
        .returning({ uid: userprofile.uid });
      if (changed.length !== 1 || changed[0]!.uid !== owner)
        throw new Error("Avatar version update failed");
      await tx.insert(avatar_version_update).values(intent);
      return { profile: { ...profile, picVer: plan.picVer }, intent };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}

export async function deliverAvatarVersionMail(
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  operationId: string,
): Promise<AvatarMailDelivery> {
  validKey(owner, operationId, kingdomId);
  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({ uid: userprofile.uid, serverId: userprofile.serverId })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");
      if (!profile || profile.uid !== owner || profile.serverId !== kingdomId) return { profile };
      const key = and(
        eq(avatar_version_update.operationId, operationId),
        eq(avatar_version_update.ownerUid, owner),
      );
      const [entry] = await tx
        .select()
        .from(avatar_version_update)
        .where(key)
        .limit(1)
        .for("update");
      if (!entry || !(entry.pendingEffects & 1)) return { profile };
      const message = avatarVersionMail(entry);
      await insertAvatarSystemMail(tx, message, owner, operationId, entry.committedAt);
      const changed = await tx
        .update(avatar_version_update)
        .set({ pendingEffects: entry.pendingEffects & ~1 })
        .where(and(key, eq(avatar_version_update.pendingEffects, entry.pendingEffects)))
        .returning({ id: avatar_version_update.operationId });
      if (changed.length !== 1 || changed[0]!.id !== operationId)
        throw new Error("Avatar version mail acknowledgment failed");
      return { profile, mail: message };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}

export async function publishAvatarVersionEffect(
  bit: 2 | 4 | 8,
  db: RealmDatabase,
  kingdomId: number,
  owner: string,
  operationId: string,
  publish: AvatarProfilePublisher,
  timeoutMs: number,
): Promise<void> {
  validKey(owner, operationId, kingdomId);
  if (
    (bit !== 2 && bit !== 4 && bit !== 8) ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 30000
  )
    throw new Error("Invalid avatar version publication");
  await db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          picVer: userprofile.picVer,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");
      if (!profile || profile.uid !== owner || profile.serverId !== kingdomId) return;
      const key = and(
        eq(avatar_version_update.operationId, operationId),
        eq(avatar_version_update.ownerUid, owner),
      );
      const [entry] = await tx
        .select()
        .from(avatar_version_update)
        .where(key)
        .limit(1)
        .for("update");
      if (!entry || !(entry.pendingEffects & bit)) return;
      const update = avatarVersionProfile(entry, kingdomId);
      if (profile.picVer === entry.picVer) {
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
          await Promise.race([
            Promise.resolve().then(() => publish(update, controller.signal)),
            new Promise<never>((_, reject) => {
              timer = setTimeout(() => {
                controller.abort();
                reject(new Error("Avatar version publication timeout"));
              }, timeoutMs);
            }),
          ]);
        } finally {
          clearTimeout(timer);
          controller.abort();
        }
      }
      const changed = await tx
        .update(avatar_version_update)
        .set({ pendingEffects: entry.pendingEffects & ~bit })
        .where(and(key, eq(avatar_version_update.pendingEffects, entry.pendingEffects)))
        .returning({ id: avatar_version_update.operationId });
      if (changed.length !== 1 || changed[0]!.id !== operationId)
        throw new Error("Avatar version publication acknowledgment failed");
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}

export async function nextAvatarVersionDelivery(
  db: RealmDatabase,
  kingdomId: number,
  cursor?: AvatarVersionKey,
): Promise<AvatarVersionKey | undefined> {
  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 2147483647)
    throw new Error("Invalid avatar version realm");
  if (cursor) validKey(cursor.owner, cursor.operationId, kingdomId);
  const [row] = await db
    .select({
      owner: avatar_version_update.ownerUid,
      operationId: avatar_version_update.operationId,
    })
    .from(avatar_version_update)
    .innerJoin(userprofile, eq(userprofile.uid, avatar_version_update.ownerUid))
    .where(
      and(
        eq(userprofile.serverId, kingdomId),
        gt(avatar_version_update.pendingEffects, 0),
        cursor
          ? or(
              gt(avatar_version_update.ownerUid, cursor.owner),
              and(
                eq(avatar_version_update.ownerUid, cursor.owner),
                gt(avatar_version_update.operationId, cursor.operationId),
              ),
            )
          : undefined,
      ),
    )
    .orderBy(asc(avatar_version_update.ownerUid), asc(avatar_version_update.operationId))
    .limit(1);
  if (row) validKey(row.owner, row.operationId, kingdomId);
  return row;
}

export async function checkAvatarVersionStore(db: RealmDatabase): Promise<void> {
  await db.select().from(avatar_version_update).limit(0);
  await db.execute(
    sql`select "ownerUid", revision from opencok_kingdom.avatar_publication limit 0`,
  );
}
