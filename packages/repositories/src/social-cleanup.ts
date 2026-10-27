import { encode, decode } from "@opencok/messages/sfs";
import { and, eq, inArray, lte } from "drizzle-orm";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { post_box } from "@opencok/drizzle/schema/opencok_kingdom/post_box";
import { post_mail } from "@opencok/drizzle/schema/opencok_kingdom/post_mail";
import { post_relation } from "@opencok/drizzle/schema/opencok_kingdom/post_relation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority.ts";
import type { Database } from "./game.ts";

export async function cleanupSocialRealm(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now(),
) {
  return db.transaction(async (tx) => {
    await fenceRealmTransaction(tx, authority);
    const at = BigInt(now),
      cutoff = at - 30n * 86_400_000n;
    const receipts = await tx
      .select()
      .from(command_receipt)
      .where(lte(command_receipt.expiresAt, at))
      .limit(500);

    for (const row of receipts)
      {await tx
        .update(command_receipt)
        .set({ request: Buffer.alloc(0), response: Buffer.alloc(0), expiresAt: null })
        .where(
          and(
            eq(command_receipt.kingdomId, row.kingdomId),
            eq(command_receipt.ownerUid, row.ownerUid),
            eq(command_receipt.requestId, row.requestId),
          ),
        );}

    const events = await tx
      .select()
      .from(mutation_outbox)
      .where(lte(mutation_outbox.expiresAt, at))
      .limit(500);

    for (const row of events) {
      const pendingNotice = row.eventType === "social.notice" && row.publishedAt === 0n;
      const metadata = pendingNotice ? decode(row.payload) : undefined;
      const payload = metadata
        ? encode({ roomId: metadata.roomId!, createdAt: metadata.createdAt! })
        : Buffer.alloc(0);
      await tx
        .update(mutation_outbox)
        .set({ payload, expiresAt: null, publishedAt: pendingNotice ? 0n : row.publishedAt || at })
        .where(
          and(
            eq(mutation_outbox.kingdomId, row.kingdomId),
            eq(mutation_outbox.ownerUid, row.ownerUid),
            eq(mutation_outbox.requestId, row.requestId),
            eq(mutation_outbox.eventId, row.eventId),
          ),
        );
    }

    const boxes = await tx
      .select({ uid: post_box.uid })
      .from(post_box)
      .where(lte(post_box.time, cutoff))
      .limit(500);

    if (boxes.length)
      {await tx.delete(post_box).where(
        inArray(
          post_box.uid,
          boxes.map((row) => row.uid),
        ),
      );}

    const mails = await tx
      .select({ uid: post_mail.uid })
      .from(post_mail)
      .where(lte(post_mail.createTime, cutoff))
      .limit(500);

    if (mails.length)
      {await tx.delete(post_mail).where(
        inArray(
          post_mail.uid,
          mails.map((row) => row.uid),
        ),
      );}

    const relations = await tx
      .select({ uid: post_relation.uid })
      .from(post_relation)
      .where(lte(post_relation.time, cutoff))
      .limit(500);

    if (relations.length)
      {await tx.delete(post_relation).where(
        inArray(
          post_relation.uid,
          relations.map((row) => row.uid),
        ),
      );}

    return receipts.length + events.length + boxes.length + mails.length + relations.length;
  });
}
