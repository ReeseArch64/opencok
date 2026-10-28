import { campaignNoticeBody, readCampaignNotice } from "@opencok/mappings/campaign-notice";
import type { CampaignAudience } from "@opencok/contracts/campaign-notice";
import type { Fields } from "@opencok/messages/sfs";

export async function publishCampaignNotice(
    payload: Uint8Array,
    owner: string,
    online: readonly string[],
    audience: CampaignAudience,
    publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
    now = Date.now(),
)
{
    const notice = readCampaignNotice(payload, owner),
        body = campaignNoticeBody(notice.message),
        owners = [...new Set(online)];

    if (!Number.isSafeInteger(now) || BigInt(now) < notice.at)
    {
        throw new Error("Premature campaign notice");
    }

    if (BigInt(now) >= notice.at + 300000n)
    {
        return;
    }

    if (!owners.includes(owner))
    {
        throw new Error("Campaign actor has not completed login");
    }

    for (let start = 0; start < owners.length; start += 500)
    {
        const recipients = await audience.select(
            owners.slice(start, start + 500),
            notice.scope === 1 ? notice.allianceId : undefined,
            BigInt(now),
        );

        for (let index = 0; index < recipients.length; index += 32)
        {
            await Promise.all(
                recipients
                    .slice(index, index + 32)
                    .map((recipient) => publish(recipient, "push.common.notice", body)),
            );
        }
    }
}
