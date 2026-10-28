import type { ShareFeedEnvelopeInput, ShareFeedEnvelope } from "../contracts/envelope";
import type { ShareFeedOperation } from "../contracts/feed";

export class ShareFeedMapper
{
    public normalizeEnvelope(value: ShareFeedEnvelopeInput): ShareFeedEnvelope
    {
        return {
            feedId: value.fid ?? value.id ?? "",
            feedType: value.type ?? 0,
            feedData: value.data ?? "",
            feedAuth: value.auth ?? "self",
            notices: value.notices?.split(",").filter(Boolean) ?? [],
            localId: value.localid ?? "",
        };
    }

    public feedBody(
        id: string,
        now: bigint,
        input: ShareFeedOperation,
        parent: string | null,
        alliance: string,
    )
    {
        return {
            id,
            time: Number(now),
            type: input.feedType,
            msg: input.body,
            data: input.feedData,
            sender: input.owner,
            fid: parent ?? "",
            status: 1,
            authority: alliance ? { alliance } : { owner: input.owner },
        };
    }

    public sent(id: string, localId: string)
    {
        return { id, ...(localId ? { localid: localId } : {}) };
    }
}
