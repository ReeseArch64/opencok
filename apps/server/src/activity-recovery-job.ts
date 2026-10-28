import { ActivityOperationMapper } from "@opencok/queues/mappings/operation-id";
import type {
    DueActivitySnapshot,
    LegacyActivitySnapshot,
} from "@opencok/queues/contracts/deadline";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { dueActivities, unregisteredActivities } from "@opencok/repositories/timed-activity";

type RecoveryCursor = Parameters<typeof dueActivities>[5];

export class ActivityRecoveryJob
{
    private readonly operationIds = new ActivityOperationMapper();
    private importCursor: string | undefined;
    private recoveryCursor: RecoveryCursor;

    public constructor(
        private readonly assertReady: () => void,
        private readonly types: () => readonly number[],
        private readonly imports: (
            types: readonly number[],
            limit: number,
            owner?: string,
            after?: string,
        ) => ReturnType<typeof unregisteredActivities>,
        private readonly due: (
            types: readonly number[],
            now: bigint,
            limit: number,
            owner?: string,
            after?: RecoveryCursor,
        ) => ReturnType<typeof dueActivities>,
        private readonly restore: (
            owner: string,
            operationId: string,
            queueId: string,
            snapshot: LegacyActivitySnapshot,
        ) => Promise<unknown>,
        private readonly command: (
            owner: string,
            command: string,
            params: Fields,
            snapshot: DueActivitySnapshot,
        ) => Promise<unknown>,
        private readonly reportFailure: (event: string) => void,
        private readonly now: () => number = Date.now,
    )
    {}

    public async run(owner?: string, stopQueue?: string): Promise<void>
    {
        this.assertReady();
        const pending = await this.imports(
            this.types(),
            owner ? 256 : 64,
            owner,
            owner ? undefined : this.importCursor,
        );

        if (!owner)
        {
            this.importCursor = pending.length === 64 ? pending.at(-1)!.uuid : undefined;
        }

        for (const saved of pending)
        {
            const snapshot: LegacyActivitySnapshot = {
                uuid: saved.uuid,
                ownerId: saved.ownerId,
                type: saved.type,
                itemId: saved.itemId!,
                startTime: saved.startTime,
                updateTime: saved.updateTime,
            };
            const operationId = this.operationIds.restore(snapshot);

            try
            {
                await this.restore(saved.ownerId, operationId, saved.uuid, snapshot);
            }
            catch
            {
                this.reportFailure("activity_import_failed");
            }
        }

        const due = await this.due(
            this.types(),
            BigInt(this.now()),
            owner ? 256 : 64,
            owner,
            owner ? undefined : this.recoveryCursor,
        );

        if (!owner)
        {
            this.recoveryCursor = due.length === 64 ? due.at(-1) : undefined;
        }

        for (const activity of due)
        {
            if (activity.queueId === stopQueue)
            {
                break;
            }

            try
            {
                await this.command(activity.ownerId, "queue.finish", {
                    uuid: sfs.string(activity.queueId),
                    activityId: sfs.string(activity.id),
                    version: sfs.int(activity.version),
                    operationId: sfs.string(this.operationIds.finish(activity)),
                }, {
                    id: activity.id,
                    ownerId: activity.ownerId,
                    queueId: activity.queueId,
                    type: activity.type,
                    dueAt: activity.dueAt,
                    version: activity.version,
                });
            }
            catch
            {
                this.reportFailure("activity_recovery_failed");
            }
        }
    }
}
