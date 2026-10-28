import type {
    MailIntegrationSource,
    MailIntegrationStatus,
    MailIntegrationWorkerOptions,
} from "../contracts/integration-worker";
import { MailIntegrationKind } from "../enums/integration-kind";

interface DeliveryQueue
{
    kind: MailIntegrationKind;
    source: MailIntegrationSource;
    maximum: number;
    state: MailIntegrationStatus;
    active?: Promise<void>;
    cancel?: () => void;
}

export class MailIntegrationWorker
{
    private stopped = false;
    private started = false;
    private readonly queues: readonly DeliveryQueue[];
    private readonly interval: number;
    private readonly after: NonNullable<MailIntegrationWorkerOptions["after"]>;
    private readonly now: () => number;

    public constructor(private readonly options: MailIntegrationWorkerOptions)
    {
        this.interval = options.intervalMs ?? 5000;

        if (!Number.isInteger(this.interval) || this.interval < 1000 || this.interval > 60000)
        {
            throw new Error("Invalid mail worker interval");
        }

        this.now = options.now ?? Date.now;
        this.after = options.after ?? ((run, delay) => {
            const timer = setTimeout(run, delay);

            return () => clearTimeout(timer);
        });
        const queue = (
            kind: MailIntegrationKind,
            source: MailIntegrationSource,
            maximum: number,
        ): DeliveryQueue => ({
            kind,
            source,
            maximum,
            state: { ready: false, pending: 0, limited: false, oldestAgeMs: null, delivered: 0 },
        });
        this.queues = [
            queue(MailIntegrationKind.Gift, options.gift, 1),
            ...(options.chat ? [queue(MailIntegrationKind.Chat, options.chat, 50)] : []),
        ];
    }

    public start(): Promise<void>
    {
        if (this.stopped || this.started)
        {
            return Promise.resolve();
        }

        this.started = true;

        return this.run();
    }

    public run(): Promise<void>
    {
        if (this.stopped)
        {
            return Promise.resolve();
        }

        return Promise.all(this.queues.map((queue) => this.runQueue(queue))).then(() => undefined);
    }

    public isReady(): boolean
    {
        return !this.stopped && this.queues.every((queue) => queue.state.ready);
    }

    public status(): Readonly<Partial<Record<MailIntegrationKind, MailIntegrationStatus>>>
    {
        return Object.fromEntries(
            this.queues.map((
                queue,
            ) => [queue.kind, { ...queue.state, ready: !this.stopped && queue.state.ready }]),
        );
    }

    public async close(): Promise<void>
    {
        this.stopped = true;

        for (const queue of this.queues)
        {
            queue.cancel?.();
            queue.cancel = undefined;
            queue.state.ready = false;
        }

        await Promise.all(this.queues.map((queue) => queue.active));
    }

    private runQueue(queue: DeliveryQueue): Promise<void>
    {
        if (queue.active)
        {
            return queue.active;
        }

        queue.cancel?.();
        queue.cancel = undefined;
        queue.active = this.deliver(queue).finally(() => {
            queue.active = undefined;

            if (this.started && !this.stopped)
            {
                queue.cancel = this.after(() => {
                    queue.cancel = undefined;
                    void this.runQueue(queue);
                }, this.interval);
            }
        });

        return queue.active;
    }

    private async deliver(queue: DeliveryQueue): Promise<void>
    {
        try
        {
            if (this.options.validate)
            {
                await this.options.validate();
            }

            let delivered = 0;

            for (let batch = 0; batch < queue.maximum && !this.stopped; batch++)
            {
                const count = await queue.source.deliver();
                delivered += count;

                if (!count)
                {
                    break;
                }
            }

            if (this.stopped)
            {
                return;
            }

            const backlog = await queue.source.backlog();
            const age = backlog.oldestAt === null ? null : BigInt(this.now()) - backlog.oldestAt;
            queue.state = {
                ready: !this.stopped,
                pending: backlog.pending,
                limited: backlog.limited,
                oldestAgeMs: age === null
                    ? null
                    : Number(
                        age < 0n
                            ? 0n
                            : age > BigInt(Number.MAX_SAFE_INTEGER)
                            ? BigInt(Number.MAX_SAFE_INTEGER)
                            : age,
                    ),
                delivered,
            };
        }
        catch
        {
            queue.state.ready = false;

            try
            {
                this.options.report(queue.kind);
            }
            catch
            {
            }
        }
    }
}
