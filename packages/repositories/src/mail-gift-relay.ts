import { mail_gift_log } from "@opencok/drizzle/schema/opencok_global/mail_gift_log";
import { mail_gift_opening } from "@opencok/drizzle/schema/opencok_kingdom/mail_gift_opening";
import { and, asc, eq, or } from "drizzle-orm";
import type { Database } from "./game.ts";

export function relayMailGiftOpenings(
  kingdom: Database["kingdom"]["db"],
  global: Database["databases"]["global"]["db"],
  limit = 100,
): Promise<number> {
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000)
    {throw new Error("Invalid gift relay limit");}

  return kingdom.transaction(
    async (tx) => {
      const pending = await tx
        .select()
        .from(mail_gift_opening)
        .orderBy(
          asc(mail_gift_opening.openedAt),
          asc(mail_gift_opening.mailUid),
          asc(mail_gift_opening.sendTime),
        )
        .limit(limit)
        .for("update", { skipLocked: true });

      if (!pending.length) {return 0;}

      await global.transaction(
        async (log) => {
          for (const entry of pending)
            {await log
              .update(mail_gift_log)
              .set({
                isOpened: 1,
                receiveTime: entry.openedAt,
              })
              .where(
                and(
                  eq(mail_gift_log.uid, entry.mailUid),
                  eq(mail_gift_log.sendTime, entry.sendTime),
                  eq(mail_gift_log.toUid, entry.toUser),
                ),
              );}
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
      await tx
        .delete(mail_gift_opening)
        .where(
          or(
            ...pending.map((entry) =>
              and(
                eq(mail_gift_opening.mailUid, entry.mailUid),
                eq(mail_gift_opening.sendTime, entry.sendTime),
                eq(mail_gift_opening.toUser, entry.toUser),
                eq(mail_gift_opening.openedAt, entry.openedAt),
              ),
            ),
          ),
        );

      return pending.length;
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
