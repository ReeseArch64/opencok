import { createHash } from "node:crypto";
import { mailRewardEntries } from "./mail-rewards";
import type { CostRankMail } from "@opencok/contracts/continued-cost-rewards";

export function costRankAwardId(periodId: string, owner: string)
{
    if (!/^[a-f0-9]{32}$/.test(periodId) || !owner || owner.length > 40)
    {
        throw new Error("Invalid consumption award identity");
    }

    return createHash("sha256")
        .update(JSON.stringify(["consumption-ranking", periodId, owner]))
        .digest("hex")
        .slice(0, 32);
}

export function costRankAwardOperation(id: string)
{
    if (!/^[a-f0-9]{32}$/.test(id))
    {
        throw new Error("Invalid consumption award operation");
    }

    return `cost-rank:${id}`;
}

export function costRankMail(raw: string): CostRankMail
{
    if (Buffer.byteLength(raw) > 65536)
    {
        throw new Error("Consumption ranking mail bound exceeded");
    }

    const value: unknown = JSON.parse(raw);

    if (
        !value
        || typeof value !== "object"
        || !("sender" in value)
        || typeof value.sender !== "string"
        || !("title" in value)
        || typeof value.title !== "string"
        || !("contents" in value)
        || typeof value.contents !== "string"
        || Buffer.from(value.contents, "base64").toString("base64") !== value.contents
        || !("reward" in value)
        || (value.reward !== null && typeof value.reward !== "string")
    )
    {
        throw new Error("Invalid consumption ranking mail");
    }

    if (value.reward !== null)
    {
        mailRewardEntries(value.reward);
    }

    return value as CostRankMail;
}
