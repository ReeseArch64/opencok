import type { createDatabase } from "@opencok/drizzle";
import { distribution } from "./benchmark-distribution";

type Pool = ReturnType<typeof createDatabase>["pool"];
type Client = Awaited<ReturnType<Pool["connect"]>>;

export class BenchmarkWorldLocks
{
    private readonly originals = new Map<Client, Client["query"]>();
    private readonly acquired = new Map<Client, number>();
    private readonly waits: number[] = [];
    private readonly holds: number[] = [];
    private commits = 0;
    private rollbacks = 0;

    constructor(private readonly pool: Pool)
    {
        pool.on("acquire", this.acquire);
    }

    private readonly acquire = (client: Client) => {
        if (this.originals.has(client))
        {
            return;
        }
        const original = client.query;
        this.originals.set(client, original);
        const observe = (args: unknown[]) => {
            const input = args[0];
            const statement = typeof input === "string"
                ? input
                : input && typeof input === "object" && "text" in input
                ? String(input.text)
                : "";
            const worldLock = /pg_advisory_xact_lock\s*\(\s*728214\s*,\s*0\s*\)/i.test(statement);
            const terminal = /^\s*(commit|rollback)\s*;?\s*$/i.exec(statement)?.[1]?.toLowerCase();
            const started = performance.now();
            let finished = false;
            const finish = (failed: boolean) => {
                if (finished)
                {
                    return;
                }
                finished = true;
                const now = performance.now();
                if (worldLock && !failed)
                {
                    this.waits.push(now - started);
                    if (!this.acquired.has(client))
                    {
                        this.acquired.set(client, now);
                    }
                }
                const acquired = this.acquired.get(client);
                if (terminal && !failed && acquired !== undefined)
                {
                    this.holds.push(now - acquired);
                    this.acquired.delete(client);
                    if (terminal === "commit")
                    {
                        this.commits++;
                    }
                    else
                    {
                        this.rollbacks++;
                    }
                }
            };
            const callback = args.at(-1);
            if (typeof callback === "function")
            {
                args[args.length - 1] = function(this: unknown, ...values: unknown[])
                {
                    finish(Boolean(values[0]));
                    return Reflect.apply(callback, this, values);
                };
            }
            try
            {
                const result = Reflect.apply(original, client, args);
                if (result instanceof Promise)
                {
                    return result.then((value) => {
                        finish(false);
                        return value;
                    }, (error: unknown) => {
                        finish(true);
                        throw error;
                    });
                }
                return result;
            }
            catch (error)
            {
                finish(true);
                throw error;
            }
        };
        client.query = function(...args: unknown[])
        {
            return observe(args);
        } as Client["query"];
    };

    report()
    {
        return {
            acquisitionRoundTripMs: distribution(this.waits),
            observedHoldMs: distribution(this.holds),
            commits: this.commits,
            rollbacks: this.rollbacks,
            unfinished: this.acquired.size,
        };
    }

    close()
    {
        this.pool.off("acquire", this.acquire);
        for (const [client, query] of this.originals)
        {
            client.query = query;
        }
        this.originals.clear();
    }
}
