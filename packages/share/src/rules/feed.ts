import type { ShareFeed, ShareFeedActor, ShareFeedOperation } from "../contracts/feed";
import type { ShareFeedRuntime } from "../contracts/runtime";

export class ShareFeedPolicy
{
    public constructor(private readonly runtime: Pick<ShareFeedRuntime, "fail">)
    {}

    public validateSend(input: ShareFeedOperation)
    {
        if (
            (!input.body && input.feedType !== 101)
            || input.notices.length > 50
            || input.notices.some((uid) => !/^[a-zA-Z0-9_-]{1,40}$/.test(uid))
        )
        {
            this.runtime.fail("invalid_message");
        }
    }

    public canRead(owner: string, actor: ShareFeedActor, row: ShareFeed)
    {
        return row.owner === owner
            || (row.realm === actor.serverId
                && !!row.alliance
                && row.alliance === actor.allianceId
                && actor.allianceId === actor.membershipAllianceId);
    }
}
