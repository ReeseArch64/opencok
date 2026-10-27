import { and, eq } from "drizzle-orm";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import type { ChatNoticeCostReader } from "@opencok/contracts/chat-delivery";
import type { Database } from "./game.ts";

export function createChatNoticeCostReader(
  db: Database["kingdom"]["db"],
  realm: number,
): ChatNoticeCostReader {
  return async (owner, requestId) => {
    const key = and(
      eq(command_receipt.kingdomId, realm),
      eq(command_receipt.ownerUid, owner),
      eq(command_receipt.requestId, requestId),
    );
    const [receipt] = await db.select().from(command_receipt).where(key).limit(1);

    if (!receipt || !["chat.notice", "chat.original.notice"].includes(receipt.command))
      {throw new Error("Notice cost receipt unavailable");}

    const postings = await db
      .select({
        asset: economy_posting.asset,
        before: economy_posting.before,
        after: economy_posting.after,
      })
      .from(economy_posting)
      .where(
        and(
          eq(economy_posting.kingdomId, realm),
          eq(economy_posting.ownerUid, owner),
          eq(economy_posting.requestId, requestId),
        ),
      )
      .limit(16);

    return { createdAt: Number(receipt.createdAt), postings };
  };
}
