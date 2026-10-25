import { and, eq, gt } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { avatar_version_update } from "@opencok/drizzle/schema/opencok_kingdom/avatar_version_update";
import { avatarModerationPlan } from "@opencok/rules/avatar-moderation";
import { avatarVersionProfile } from "@opencok/rules/avatar-version";
import { nextAvatarRevision } from "./avatar-publication.ts";
import type { Database } from "./game.ts";

export async function moderateAvatar(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  request: {
    owner: string;
    operationId: string;
    expectedPicVer: number;
    decision: "approve" | "reject";
  },
  now: number,
  banSeconds: string | undefined,
) {
  const { owner, operationId, expectedPicVer, decision } = Object.freeze({ ...request });
  if (
    typeof owner !== "string" ||
    typeof operationId !== "string" ||
    !/^[0-9]{1,20}$/.test(owner) ||
    !/^[a-f0-9]{32}$/.test(operationId) ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isInteger(expectedPicVer) ||
    expectedPicVer < -2147483648 ||
    expectedPicVer > 2147483647 ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    !["approve", "reject"].includes(decision)
  )
    throw new Error("Invalid avatar moderation request");
  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select()
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");
      if (!profile || profile.serverId !== kingdomId)
        throw new Error("Avatar moderation owner unavailable");
      const [prior] = await tx
        .select()
        .from(avatar_version_update)
        .where(eq(avatar_version_update.operationId, operationId))
        .limit(1);
      if (prior) {
        const saved = JSON.parse(prior.effects).moderation;
        if (
          prior.ownerUid !== owner ||
          saved?.decision !== decision ||
          saved?.expectedPicVer !== expectedPicVer
        )
          throw new Error("Avatar moderation operation conflict");
        return { operationId, picVer: prior.picVer, changed: prior.picVer !== expectedPicVer };
      }
      if (profile.picVer !== expectedPicVer) throw new Error("Avatar moderation version changed");
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
      if (pending.length >= 1000) throw new Error("Avatar moderation backlog full");
      const [record] = await tx
        .select()
        .from(pic_upload_record)
        .where(eq(pic_upload_record.uid, owner))
        .limit(1)
        .for("update");
      const plan = avatarModerationPlan(expectedPicVer, record, decision, now, banSeconds);
      if (plan.record) {
        if (record)
          await tx
            .update(pic_upload_record)
            .set(plan.record)
            .where(eq(pic_upload_record.uid, owner));
        else await tx.insert(pic_upload_record).values({ uid: owner, ...plan.record });
      }
      const intent = {
        operationId,
        ownerUid: owner,
        picVer: plan.picVer,
        committedAt: BigInt(now),
        revision: plan.changed ? await nextAvatarRevision(tx, owner) : 0n,
        nextUpdateTime: null,
        pendingEffects: plan.changed ? 14 : 0,
        effects: JSON.stringify({
          version: 1,
          mail: null,
          moderation: { decision, expectedPicVer },
          profile: {
            userName: profile.name,
            platform: profile.pf,
            updatedAt: String(Math.floor(now / 1000)),
          },
        }),
      };
      if (plan.changed) {
        avatarVersionProfile(intent, kingdomId);
        const changed = await tx
          .update(userprofile)
          .set({ picVer: plan.picVer })
          .where(and(eq(userprofile.uid, owner), eq(userprofile.picVer, expectedPicVer)))
          .returning({ uid: userprofile.uid });
        if (changed.length !== 1) throw new Error("Avatar moderation profile changed");
      }
      await tx.insert(avatar_version_update).values(intent);
      return { operationId, picVer: plan.picVer, changed: plan.changed };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
