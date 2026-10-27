import { randomUUID } from "node:crypto";
import { and, asc, eq, sql } from "drizzle-orm";
import { mail_chat_read_intent } from "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent";
import type { ChatMailboxPublisher, ChatMailboxUpdate } from "@opencok/contracts/chat-mailbox";
import type { Database } from "./game.ts";

type Db = Database["kingdom"]["db"];

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export interface MailChatEffect {
  action: "read" | "delete";
  others: string;
  types: readonly number[];
}

export async function enqueueMailChat(
  tx: Tx,
  owner: string,
  now: number,
  effects: readonly MailChatEffect[],
) {
  if (!effects.length) {return;}

  if (
    effects.length > 1000 ||
    effects.some(
      (effect) =>
        !["read", "delete"].includes(effect.action) ||
        typeof effect.others !== "string" ||
        effect.others.length > 40 ||
        effect.others.includes("\0") ||
        !effect.others.isWellFormed() ||
        !["1,20", "2", "3", "1,2,20"].includes(effect.types.join(",")),
    )
  )
    {throw new Error("Invalid mail chat effect");}

  const [count] = await tx
    .select({ count: sql<string>`count(*)::text` })
    .from(mail_chat_read_intent)
    .where(eq(mail_chat_read_intent.ownerUid, owner));

  if (!count || !/^\d+$/.test(count.count) || BigInt(count.count) + BigInt(effects.length) > 1000n)
    {throw new Error("Mail chat backlog exceeded");}

  const commandId = randomUUID();
  await tx.insert(mail_chat_read_intent).values(
    effects.map((effect, effectIndex) => ({
      commandId,
      effectIndex,
      ownerUid: owner,
      action: effect.action,
      others: effect.others,
      chatTypes: effect.types.join(","),
      requestedAt: BigInt(now),
    })),
  );
}

export async function relayMailChat(
  db: Db,
  kingdomId: number,
  publish: ChatMailboxPublisher,
  timeoutMs: number,
): Promise<number> {
  if (
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 30000
  )
    {throw new Error("Invalid mailbox relay");}

  return db.transaction(
    async (tx) => {
      const pending = await tx
        .select()
        .from(mail_chat_read_intent)
        .orderBy(
          asc(mail_chat_read_intent.requestedAt),
          asc(mail_chat_read_intent.commandId),
          asc(mail_chat_read_intent.effectIndex),
        )
        .limit(1)
        .for("update", { skipLocked: true });
      const entry = pending[0];

      if (!entry) {return 0;}

      const update: ChatMailboxUpdate = {
        owner: entry.ownerUid,
        kingdomId,
        operationId: entry.commandId,
        effectIndex: entry.effectIndex,
        action: entry.action as "read" | "delete",
        others: entry.others,
        types: entry.chatTypes.split(",").map(Number),
        requestedAt: Number(entry.requestedAt),
      };
      const abort = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;

      try {
        await Promise.race([
          publish(update, abort.signal),
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
              abort.abort();
              reject(new Error("Mailbox relay timeout"));
            }, timeoutMs);
          }),
        ]);
        abort.signal.throwIfAborted();
        await tx
          .delete(mail_chat_read_intent)
          .where(
            and(
              eq(mail_chat_read_intent.commandId, entry.commandId),
              eq(mail_chat_read_intent.effectIndex, entry.effectIndex),
            ),
          );

        return 1;
      } finally {
        clearTimeout(timer);
        abort.abort();
      }
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
