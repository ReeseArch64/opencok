import { createHash } from "node:crypto";
import type { AvatarMailDelivery, AvatarMailPlanner } from "@opencok/contracts/files";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, eq } from "drizzle-orm";
import type { Database } from "./game.ts";
import { insertSystemMail as insertAvatarSystemMail } from "./system-mail.ts";

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
      await insertAvatarSystemMail(tx, message, owner, stem, entry.committedAt);
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

export { insertSystemMail as insertAvatarSystemMail } from "./system-mail.ts";
