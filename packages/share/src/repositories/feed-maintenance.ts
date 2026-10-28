import { inArray, lte } from "drizzle-orm";
import { chat_feed } from "@opencok/drizzle/schema/opencok_chat/chat_feed";
import { chat_feed_notice } from "@opencok/drizzle/schema/opencok_chat/chat_feed_notice";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { ShareFeedMaintenance } from "../contracts/persistence";

export class ShareFeedMaintenanceRepository implements ShareFeedMaintenance
{
    public constructor(private readonly db: DatabaseClient<"global">)
    {}

    public async deleteExpired(cutoff: bigint)
    {
        const db = this.db;

        const feeds = await db
            .select({ id: chat_feed.id })
            .from(chat_feed)
            .where(lte(chat_feed.expiresAt, cutoff))
            .limit(500);

        if (feeds.length)
        {
            await db.delete(chat_feed_notice).where(
                inArray(
                    chat_feed_notice.feed,
                    feeds.map((row) => row.id),
                ),
            );
            await db.delete(chat_feed).where(
                inArray(
                    chat_feed.id,
                    feeds.map((row) => row.id),
                ),
            );
        }
    }

    public async health()
    {
        const db = this.db;

        await db.select().from(chat_feed).limit(0);
    }
}
