import type {
    dueWorldMarches,
    unregisteredWorldMarches,
} from "@opencok/repositories/world-march-runtime";
import { sfs, type Fields } from "@opencok/messages/sfs";

type MarchCursor = Parameters<typeof dueWorldMarches>[2];

export class WorldMarchRecoveryJob
{
    private importCursor: string | undefined;
    private dueCursor: MarchCursor;

    public constructor(
        private readonly imports: (after?: string) => ReturnType<typeof unregisteredWorldMarches>,
        private readonly due: (
            now: bigint,
            after?: MarchCursor,
        ) => ReturnType<typeof dueWorldMarches>,
        private readonly recoverActivities: (owner: string) => Promise<void>,
        private readonly command: (
            owner: string,
            command: string,
            params: Fields,
        ) => Promise<unknown>,
        private readonly reportFailure: (event: string) => void,
        private readonly now: () => number = Date.now,
    )
    {}

    public async run(): Promise<void>
    {
        const imported = await this.imports(this.importCursor);
        this.importCursor = imported.length === 64 ? imported.at(-1)!.id : undefined;

        for (const entry of imported)
        {
            if (entry.owner)
            {
                try
                {
                    await this.recoverActivities(entry.owner);
                    await this.command(entry.owner, "world.tick", {
                        operationId: sfs.string(`world-import:${entry.id}`),
                    });
                }
                catch
                {
                    this.reportFailure("world_import_failed");
                }
            }
        }

        const due = await this.due(BigInt(this.now()), this.dueCursor);
        this.dueCursor = due.length === 64 ? due.at(-1) : undefined;

        for (const entry of due)
        {
            try
            {
                await this.recoverActivities(entry.owner);
                await this.command(entry.owner, "world.tick", {
                    operationId: sfs.string(`world:${entry.id}:${entry.version}`),
                });
            }
            catch
            {
                this.reportFailure("world_recovery_failed");
            }
        }
    }
}
