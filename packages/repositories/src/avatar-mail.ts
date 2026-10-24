import { createHash } from "node:crypto";
import type { AvatarMailDelivery, AvatarMailPlanner } from "@opencok/contracts/files";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { and, eq } from "drizzle-orm";
import type { Database } from "./game.ts";

export function deliverAvatarMail(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  sequence: number,
  plan: AvatarMailPlanner,
): Promise<AvatarMailDelivery> {
  if (
    typeof owner !== "string" ||
    !/^[0-9]{1,20}$/.test(owner) ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999999
  )
    throw new Error("Invalid avatar mail query");
  return db.transaction(
    async (tx) => {
      const profile = (
        await tx
          .select({ uid: userprofile.uid, serverId: userprofile.serverId })
          .from(userprofile)
          .where(eq(userprofile.uid, owner))
          .limit(1)
          .for("update")
      )[0];
      if (!profile || profile.uid !== owner || profile.serverId !== kingdomId) return { profile };
      const key = and(
        eq(avatar_completion.ownerUid, owner),
        eq(avatar_completion.sequence, sequence),
      );
      const entry = (
        await tx.select().from(avatar_completion).where(key).limit(1).for("update")
      )[0];
      if (!entry) return { profile };
      if (
        entry.ownerUid !== owner ||
        entry.sequence !== sequence ||
        !/^[a-f0-9]{64}$/.test(entry.hash) ||
        !Number.isInteger(entry.pendingEffects) ||
        entry.pendingEffects < 0 ||
        entry.pendingEffects > 7
      )
        throw new Error("Invalid avatar mail state");
      if (!(entry.pendingEffects & 1)) return { profile };
      const stem = createHash("sha256")
        .update(`avatar-mail\n${owner}\n${sequence}\n${entry.hash}`)
        .digest("hex")
        .slice(0, 32);
      const result = plan(Object.freeze({ ...entry }), stem);
      const message = {
        ...result,
        contents: Buffer.from(result.contents),
        extra: result.extra === null ? null : Buffer.from(result.extra),
      };
      if (
        message.owner !== owner ||
        !message.uid.startsWith(stem) ||
        message.uid.length < 32 ||
        message.uid.length > 34 ||
        !message.uid.isWellFormed() ||
        message.uid.includes("\0") ||
        message.createTime !== entry.committedAt ||
        typeof message.createTime !== "bigint" ||
        message.createTime < 0n ||
        ![2, 15].includes(message.type) ||
        ![0, 1].includes(message.rewardStatus) ||
        !Number.isInteger(message.reply) ||
        message.reply < -2147483648 ||
        message.reply > 2147483647 ||
        typeof message.title !== "string" ||
        message.title.length > 255 ||
        !message.title.isWellFormed() ||
        message.title.includes("\0") ||
        typeof message.fromName !== "string" ||
        message.fromName.length > 100 ||
        !message.fromName.isWellFormed() ||
        message.fromName.includes("\0") ||
        message.contents.length > 40000 ||
        (message.extra !== null &&
          (message.contents.toString("utf8") !== "extra" || message.extra.length > 262143)) ||
        (message.rewardId !== null &&
          (typeof message.rewardId !== "string" ||
            !message.rewardId.isWellFormed() ||
            Buffer.byteLength(message.rewardId) > 262143))
      )
        throw new Error("Invalid avatar mail plan");
      if (message.extra !== null)
        await tx
          .insert(mail_contents)
          .values({ uid: message.uid, toUser: owner, contents: message.extra });
      await tx.insert(mail).values({
        uid: message.uid,
        toUser: owner,
        fromUser: null,
        fromName: message.fromName,
        title: message.title,
        contents: message.contents,
        rewardId: message.rewardId,
        itemIdFlag: 1,
        status: 0,
        type: message.type,
        rewardStatus: message.rewardStatus,
        saveFlag: 0,
        createTime: message.createTime,
        reply: message.reply,
        translationId: null,
      });
      if (message.type === 2)
        await tx.insert(mail_group).values({
          uid: owner,
          groupType: 2,
          groupIndex: message.uid,
          updateTime: message.createTime,
        });
      const updated = await tx
        .update(avatar_completion)
        .set({ pendingEffects: entry.pendingEffects & ~1 })
        .where(and(key, eq(avatar_completion.pendingEffects, entry.pendingEffects)))
        .returning({ ownerUid: avatar_completion.ownerUid });
      if (updated.length !== 1 || updated[0]!.ownerUid !== owner)
        throw new Error("Avatar mail acknowledgment failed");
      return { profile, mail: message };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
