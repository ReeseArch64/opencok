import type { AvatarVersionKey } from "@opencok/contracts/avatar-version";
import { CursorWorker } from "@opencok/core/cursor-worker";
import type { Schedule } from "@opencok/core/schedule";

export class AvatarVersionRelay extends CursorWorker<AvatarVersionKey>
{
    public constructor(
        protected readonly next: (
            cursor?: AvatarVersionKey,
        ) => Promise<AvatarVersionKey | undefined>,
        private readonly publish: (owner: string, operationId: string) => Promise<void>,
        reportFailure: () => void,
        after?: Schedule,
    )
    {
        super(reportFailure, after);
        this.start();
    }

    protected deliver(entry: AvatarVersionKey): Promise<void>
    {
        return this.publish(entry.owner, entry.operationId);
    }
}
