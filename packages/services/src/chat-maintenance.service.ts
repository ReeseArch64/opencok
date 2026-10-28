import type { ChatMaintenanceOptions } from "@opencok/contracts/chat-maintenance-options";

export class ChatMaintenanceService
{
    private ready = false;
    private stopped = false;
    private running: Promise<boolean> | undefined;

    public constructor(private readonly options: ChatMaintenanceOptions)
    {}

    public readonly isReady = (): boolean => !this.stopped && this.ready;

    public readonly run = (): Promise<boolean> => {
        if (this.stopped)
        {
            return Promise.resolve(false);
        }

        return (this.running ??= this.maintain().finally(() => {
            this.running = undefined;
        }));
    };

    public async close(): Promise<void>
    {
        this.stopped = true;
        this.ready = false;
        await this.running;
        this.ready = false;
    }

    private async maintain(): Promise<boolean>
    {
        const { repository, distribution, log } = this.options;

        try
        {
            await repository.health();

            for (let batch = 0; batch < 5; batch++)
            {
                const removed = await repository.deleteExpired();

                if (removed.messages < 500 && removed.sessions < 500)
                {
                    break;
                }

                if (batch === 4)
                {
                    log({ operation: "chat.retention", category: "retention_backlog" });
                }
            }

            if (repository.archivePending)
            {
                const deadline = performance.now() + 8000;

                try
                {
                    let pending = 0;

                    for (let batch = 0; batch < 10 && performance.now() < deadline; batch++)
                    {
                        pending = await repository.archivePending();

                        if (pending < 100)
                        {
                            break;
                        }
                    }

                    if (pending >= 100)
                    {
                        log({ operation: "chat.archive", category: "retention_backlog" });
                    }
                }
                catch
                {
                    log({ operation: "chat.archive", category: "unavailable" });
                }
            }

            await distribution?.poll();
            this.ready = distribution?.isReady() ?? true;

            return this.ready;
        }
        catch
        {
            this.ready = false;
            log({ operation: "chat.maintenance", category: "storage_unavailable" });

            return false;
        }
    }
}
