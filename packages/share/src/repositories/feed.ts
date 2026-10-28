import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { chat_feed } from "@opencok/drizzle/schema/opencok_chat/chat_feed";
import { chat_feed_notice } from "@opencok/drizzle/schema/opencok_chat/chat_feed_notice";
import type { ShareFeed, ShareFeedStore } from "../contracts/feed";
import type { ShareTransaction } from "../contracts/persistence";

export class ShareFeedRepository implements ShareFeedStore
{
    public constructor(private readonly tx: ShareTransaction, private readonly now: bigint)
    {}

    public async feed(id: string): Promise<ShareFeed | null>
    {
        const { tx, now } = this;

        const [row] = await tx
            .select()
            .from(chat_feed)
            .where(
                and(
                    eq(chat_feed.id, id),
                    isNull(chat_feed.deletedAt),
                    gt(chat_feed.expiresAt, now),
                ),
            );

        return row ?? null;
    }

    public feeds(owner: string, realm: number, alliance: string): Promise<ShareFeed[]>
    {
        const { tx, now } = this;

        return tx
            .select()
            .from(chat_feed)
            .where(
                and(
                    gt(chat_feed.expiresAt, now),
                    isNull(chat_feed.deletedAt),
                    or(
                        eq(chat_feed.owner, owner),
                        alliance
                            ? and(
                                eq(chat_feed.realm, realm),
                                eq(chat_feed.alliance, alliance),
                            )
                            : undefined,
                    ),
                ),
            )
            .orderBy(desc(chat_feed.createdAt), desc(chat_feed.id))
            .limit(100);
    }

    public async putFeed(row: ShareFeed)
    {
        const { tx } = this;

        await tx.insert(chat_feed).values(row);
    }

    public async removeFeed(id: string)
    {
        const { tx, now } = this;

        await tx
            .update(chat_feed)
            .set({ deletedAt: now, body: {} })
            .where(or(eq(chat_feed.id, id), eq(chat_feed.parent, id)));
    }

    public async feedNotice(owner: string, id: string)
    {
        const { tx, now } = this;

        await tx
            .insert(chat_feed_notice)
            .values({ owner, feed: id, createdAt: now })
            .onConflictDoNothing();
    }

    public async removeFeedNotices(owner: string, ids: string[])
    {
        const { tx } = this;

        if (ids.length)
        {
            await tx
                .delete(chat_feed_notice)
                .where(
                    and(
                        eq(chat_feed_notice.owner, owner),
                        inArray(chat_feed_notice.feed, ids),
                    ),
                );
        }
    }
}
