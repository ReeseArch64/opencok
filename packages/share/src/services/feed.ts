import type {
    ShareFeedOperation,
    ShareFeedTransaction,
    ShareFeedResponse,
} from "../contracts/feed";
import type { ShareFeedRuntime, ShareFeedPlanner } from "../contracts/runtime";
import type { ShareFeedPolicy } from "../rules/feed";
import type { ShareFeedMapper } from "../mappings/feed";
import { ShareFeedCommand } from "../enums/feed";

export class ShareFeedService implements ShareFeedPlanner
{
    public constructor(
        private readonly runtime: ShareFeedRuntime,
        private readonly policy: ShareFeedPolicy,
        private readonly mapper: ShareFeedMapper,
    )
    {}

    public handles(command: string)
    {
        return [
            ShareFeedCommand.Send,
            ShareFeedCommand.Delete,
            ShareFeedCommand.DeleteNotices,
            ShareFeedCommand.Get,
        ].some((value) => value === command);
    }

    public async execute(
        input: ShareFeedOperation,
        tx: ShareFeedTransaction,
    ): Promise<ShareFeedResponse>
    {
        const { actor, now } = tx;
        const { randomUUID } = this.runtime;
        const fail: (code: string) => never = this.runtime.fail;
        const event = (
            cmd: string,
            data: Record<string, unknown>,
            recipient: string | null = null,
            room = "",
        ) => tx.event(input.owner, cmd, data, recipient, room);

        if (input.command === ShareFeedCommand.Send)
        {
            this.policy.validateSend(input);

            const alliance = input.feedAuth === "alliance"
                    && actor.allianceId
                    && actor.membershipAllianceId === actor.allianceId
                ? actor.allianceId
                : "";

            if (input.feedAuth === "alliance" && !alliance)
            {
                fail("invalid_room");
            }

            let parent: string | null = null;

            if ([101, 102].includes(input.feedType))
            {
                const original = await tx.feed(input.feedId);

                if (
                    !original || original.parent
                    || !this.policy.canRead(input.owner, actor, original)
                )
                {
                    fail("feed_permission_denied");
                }

                parent = original.id;
            }

            const id = `${input.owner}${now}${randomUUID().slice(0, 8)}`;
            const body = this.mapper.feedBody(id, now, input, parent, alliance);
            await tx.putFeed({
                id,
                owner: input.owner,
                realm: actor.serverId,
                alliance,
                parent,
                type: input.feedType,
                body,
                createdAt: now,
                expiresAt: now + 30n * 86_400_000n,
                deletedAt: null,
            });

            for (const uid of new Set(input.notices))
            {
                const state = tx.players.get(uid);

                if (
                    !state
                    || !alliance
                    || state.allianceId !== alliance
                    || state.membershipAllianceId !== alliance
                    || (await tx.blocked(input.owner, uid))
                )
                {
                    continue;
                }

                await tx.feedNotice(uid, id);
                await event(ShareFeedCommand.Notice, { id }, uid);
            }

            return this.mapper.sent(id, input.localId);
        }

        if (input.command === ShareFeedCommand.Delete)
        {
            const feed = await tx.feed(input.feedId);

            if (!feed || (feed.owner !== input.owner && !(actor.gmFlag && actor.moderationAllowed)))
            {
                fail("feed_permission_denied");
            }

            await tx.removeFeed(feed.id);

            return {};
        }

        if (input.command === ShareFeedCommand.DeleteNotices)
        {
            await tx.removeFeedNotices(input.owner, input.ids);

            return {};
        }

        if (input.command === ShareFeedCommand.Get)
        {
            const feed = [];

            for (
                const row of await tx.feeds(
                    input.owner,
                    actor.serverId,
                    actor.allianceId === actor.membershipAllianceId ? (actor.allianceId ?? "") : "",
                )
            )
            {
                if (
                    this.policy.canRead(input.owner, actor, row)
                    && !(await tx.blocked(input.owner, row.owner))
                )
                {
                    feed.push(row.body);
                }
            }

            return { feed };
        }

        return fail("unsupported_command");
    }
}
