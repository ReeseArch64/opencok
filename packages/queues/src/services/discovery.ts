import type { ActivityDueCursor, ActivityDiscoveryBounds } from "../contracts/discovery";
import type {
    ActivityDiscoveryOptions,
    ActivityDiscoveryStatus,
} from "../contracts/discovery-service";
import { ActivityDispatchResult } from "../enums/dispatch-result";

export class ActivityDiscoveryService
{
    private stopped = false;
    private started = false;
    private active: Promise<void> | undefined;
    private cancel: (() => void) | undefined;
    private readonly interval: number;
    private readonly batchSize: number;
    private readonly ownerBudget: number;
    private readonly now: () => number;
    private readonly after: NonNullable<ActivityDiscoveryOptions["after"]>;
    private passes = 0;
    private knownTypes = "";
    private horizon: (ActivityDiscoveryBounds & { at: bigint; }) | undefined;
    private legacyCursor: string | undefined;
    private dueCursor: ActivityDueCursor | undefined;
    private legacyComplete = false;
    private dueComplete = false;
    private state: ActivityDiscoveryStatus = {
        ready: false,
        types: 0,
        lastSweepAt: null,
        headRetry: false,
        scannedLegacy: 0,
        scannedDue: 0,
        dispatched: 0,
        applied: 0,
        obsolete: 0,
        notDue: 0,
        blocked: 0,
        failed: 0,
        skippedOwnerBudget: 0,
        pendingLegacy: 0,
        pendingDue: 0,
        legacyLimited: false,
        dueLimited: false,
        oldestDueAgeMs: null,
    };

    public constructor(private readonly options: ActivityDiscoveryOptions)
    {
        this.interval = options.intervalMs ?? 1000;
        this.batchSize = options.batchSize ?? 64;
        this.ownerBudget = options.ownerBudget ?? 4;
        if (
            !Number.isInteger(this.interval) || this.interval < 100 || this.interval > 60000
            || !Number.isInteger(this.batchSize) || this.batchSize < 1 || this.batchSize > 256
            || !Number.isInteger(this.ownerBudget) || this.ownerBudget < 1
            || this.ownerBudget > this.batchSize
        )
        {
            throw new Error("Invalid activity discovery budget");
        }
        this.now = options.now ?? Date.now;
        this.after = options.after ?? ((run, delay) => {
            const timer = setTimeout(run, delay);

            return () => clearTimeout(timer);
        });
    }

    public start(): Promise<void>
    {
        if (this.started || this.stopped)
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
        if (this.active)
        {
            return this.active;
        }
        this.cancel?.();
        this.cancel = undefined;
        this.active = this.sweep().finally(() => {
            this.active = undefined;
            if (this.started && !this.stopped)
            {
                this.cancel = this.after(() => {
                    this.cancel = undefined;
                    void this.run();
                }, this.interval);
            }
        });

        return this.active;
    }

    public isReady(): boolean
    {
        return !this.stopped && this.state.ready;
    }

    public status(): Readonly<ActivityDiscoveryStatus>
    {
        return { ...this.state, ready: this.isReady() };
    }

    public async close(): Promise<void>
    {
        this.stopped = true;
        this.state.ready = false;
        this.cancel?.();
        this.cancel = undefined;
        await this.active;
    }

    private async sweep(): Promise<void>
    {
        try
        {
            await this.options.validate();
            if (this.stopped)
            {
                return;
            }
            const types = [...await this.options.dispatcher.capabilities()].sort((a, b) => a - b);
            const now = this.now();
            if (
                !Number.isSafeInteger(now) || now < 0 || types.length > 42
                || new Set(types).size !== types.length
                || types.some((type) => !Number.isInteger(type) || type < 0 || type > 41)
            )
            {
                throw new Error("Invalid activity discovery capabilities or clock");
            }
            if (this.stopped)
            {
                return;
            }
            const identity = types.join(",");
            if (identity !== this.knownTypes)
            {
                this.horizon = undefined;
                this.knownTypes = identity;
            }
            const headRetry = ++this.passes % 8 === 0;
            if (!this.horizon)
            {
                this.horizon = {
                    ...await this.options.reader.bounds(types, BigInt(now)),
                    at: BigInt(now),
                };
                this.legacyCursor = undefined;
                this.dueCursor = undefined;
                this.legacyComplete = this.horizon.legacy === null;
                this.dueComplete = this.horizon.due === null;
            }
            if (this.stopped)
            {
                return;
            }
            const horizon = this.horizon;
            const legacy = headRetry || !this.legacyComplete
                ? await this.options.reader.legacy(
                    types,
                    this.batchSize,
                    headRetry ? undefined : this.legacyCursor,
                    headRetry ? undefined : horizon.legacy ?? undefined,
                )
                : [];
            if (this.stopped)
            {
                return;
            }
            const due = headRetry || !this.dueComplete
                ? await this.options.reader.due(
                    types,
                    headRetry ? BigInt(now) : horizon.at,
                    this.batchSize,
                    headRetry ? undefined : this.dueCursor,
                    headRetry ? undefined : horizon.due ?? undefined,
                )
                : [];
            if (!headRetry)
            {
                if (legacy.length)
                {
                    this.legacyCursor = legacy.at(-1)!.uuid;
                }
                if (due.length)
                {
                    this.dueCursor = due.at(-1)!;
                }
                this.legacyComplete ||= legacy.length < this.batchSize
                    || this.legacyCursor === horizon.legacy;
                this.dueComplete ||= due.length < this.batchSize
                    || (this.dueCursor?.id === horizon.due?.id
                        && this.dueCursor?.dueAt === horizon.due?.dueAt);
            }
            const state: ActivityDiscoveryStatus = {
                ...this.state,
                ready: false,
                types: types.length,
                lastSweepAt: now,
                headRetry,
                scannedLegacy: legacy.length,
                scannedDue: due.length,
                dispatched: 0,
                applied: 0,
                obsolete: 0,
                notDue: 0,
                blocked: 0,
                failed: 0,
                skippedOwnerBudget: 0,
            };
            const owners = new Map<string, number>();
            const dispatch = async (
                owner: string,
                apply: () => Promise<ActivityDispatchResult>,
            ) => {
                const count = owners.get(owner) ?? 0;
                if (count >= this.ownerBudget)
                {
                    state.skippedOwnerBudget++;

                    return;
                }
                owners.set(owner, count + 1);
                state.dispatched++;
                try
                {
                    const result = await apply();
                    switch (result)
                    {
                        case ActivityDispatchResult.Applied:
                            state.applied++;
                            break;
                        case ActivityDispatchResult.Obsolete:
                            state.obsolete++;
                            break;
                        case ActivityDispatchResult.NotDue:
                            state.notDue++;
                            break;
                        case ActivityDispatchResult.Blocked:
                            state.blocked++;
                            break;
                        default:
                            throw new Error("Invalid activity dispatch result");
                    }
                }
                catch
                {
                    state.failed++;
                }
            };
            for (const candidate of legacy)
            {
                if (this.stopped)
                {
                    break;
                }
                await dispatch(candidate.ownerId, () => this.options.dispatcher.restore(candidate));
            }
            for (const candidate of due)
            {
                if (this.stopped)
                {
                    break;
                }
                await dispatch(candidate.ownerId, () => this.options.dispatcher.finish(candidate));
            }
            if (this.stopped)
            {
                return;
            }
            const backlog = await this.options.reader.backlog(types, BigInt(now));
            const age = backlog.oldestDueAt === null ? null : BigInt(now) - backlog.oldestDueAt;
            this.state = {
                ...state,
                ready: state.failed === 0,
                pendingLegacy: backlog.legacy,
                pendingDue: backlog.due,
                legacyLimited: backlog.legacyLimited,
                dueLimited: backlog.dueLimited,
                oldestDueAgeMs: age === null ? null : Number(
                    age < 0n
                        ? 0n
                        : age > BigInt(Number.MAX_SAFE_INTEGER)
                        ? BigInt(Number.MAX_SAFE_INTEGER)
                        : age,
                ),
            };
            if (this.legacyComplete && this.dueComplete)
            {
                this.horizon = undefined;
            }
            if (state.failed)
            {
                this.report();
            }
        }
        catch
        {
            this.state.ready = false;
            this.report();
        }
    }

    private report(): void
    {
        try
        {
            this.options.report();
        }
        catch
        {
        }
    }
}
