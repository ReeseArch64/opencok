import { createHash } from "node:crypto";

export class AllianceIdentity
{
    public static stableId(value: string)
    {
        return createHash("sha256").update(value).digest("hex").slice(0, 32);
    }
}
