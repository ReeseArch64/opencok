import { and, eq, inArray } from "drizzle-orm";
import { alliance_gift } from "@opencok/drizzle/schema/opencok_kingdom/alliance_gift";
import { user_gift } from "@opencok/drizzle/schema/opencok_kingdom/user_gift";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceGiftWrite } from "../contracts/gifts";
import type { AllianceGiftPersistenceRuntime } from "../contracts/gift-runtime";

export class AllianceGiftRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly owner: string,
        private readonly participants: readonly string[],
        private readonly runtime: AllianceGiftPersistenceRuntime,
    )
    {}

    public static async readEvent(tx: AllianceTransaction, giftEvent?: string)
    {
        return giftEvent
            ? await tx.select().from(alliance_gift).where(eq(alliance_gift.uid, giftEvent))
            : [];
    }

    public static readOwned(tx: AllianceTransaction, owner: string)
    {
        return tx.select().from(user_gift).where(eq(user_gift.uid, owner)).limit(2049);
    }

    public async write(write: AllianceGiftWrite)
    {
        const { tx, owner, participants } = this;
        const { text, check } = this.runtime;

        if (write.publishedGift)
        {
            check(write.publishedGift, "allianceid");
            await tx.insert(alliance_gift).values(
                write.publishedGift as typeof alliance_gift.$inferInsert,
            );
        }

        for (const row of write.sharedGifts ?? [])
        {
            check(row);

            if (!participants.includes(text(row, "uid")))
            {
                throw new Error("Foreign shared gift recipient");
            }

            await tx.insert(user_gift).values(row as typeof user_gift.$inferInsert);
        }

        for (const row of write.gifts ?? [])
        {
            if (row.uid !== owner)
            {
                throw new Error("Foreign alliance gift");
            }

            await tx
                .update(user_gift)
                .set({ valid: Number(row.valid) })
                .where(and(eq(user_gift.uuid, text(row, "uuid")), eq(user_gift.uid, owner)));
        }

        if (write.deletedGifts?.length)
        {
            await tx
                .delete(user_gift)
                .where(
                    and(eq(user_gift.uid, owner), inArray(user_gift.uuid, [...write.deletedGifts])),
                );
        }
    }
}
