import { createHash } from "node:crypto";
import type { LegacyActivitySnapshot, DueActivitySnapshot } from "../contracts/deadline";

export class ActivityOperationMapper
{
    public restore(snapshot: LegacyActivitySnapshot): string
    {
        return "restore:" + createHash("sha256").update([
            snapshot.uuid,
            snapshot.ownerId,
            snapshot.itemId,
            String(snapshot.startTime),
            String(snapshot.updateTime),
        ].join(":")).digest("hex");
    }

    public finish(snapshot: DueActivitySnapshot): string
    {
        return `finish:${snapshot.id}:${snapshot.version}`;
    }
}
