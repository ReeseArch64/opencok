import type { createDatabase } from "@opencok/drizzle";
import { distribution } from "./benchmark-distribution";

type DatabasePool = ReturnType<typeof createDatabase>["pool"];
type DatabaseClient = Awaited<ReturnType<DatabasePool["connect"]>>;

export class BenchmarkDatabase
{
    private readonly queries: number[] = [];
    private readonly acquisitions: number[] = [];
    private readonly originals = new Map<DatabaseClient, DatabaseClient["query"]>();
    private readonly connect: DatabasePool["connect"];
    private failures = 0;
    private acquisitionFailures = 0;

    constructor(private readonly pool: DatabasePool)
    {
        this.connect = pool.connect;
        const observe = (receiver: DatabasePool, args: unknown[]) =>
            this.observe(
                this.connect,
                receiver,
                args,
                this.acquisitions,
                () => this.acquisitionFailures++,
            );
        pool.connect = function(this: DatabasePool, ...args: unknown[])
        {
            return observe(this, args);
        } as typeof pool.connect;
        pool.on("acquire", this.acquire);
    }

    private readonly acquire = (client: DatabaseClient) => {
        if (this.originals.has(client))
        {
            return;
        }

        const query = client.query;
        const observe = (receiver: DatabaseClient, args: unknown[]) =>
            this.observe(query, receiver, args, this.queries, () => this.failures++);
        this.originals.set(client, query);
        client.query = function(this: DatabaseClient, ...args: unknown[])
        {
            return observe(this, args);
        } as typeof client.query;
    };

    private observe(
        operation: (...args: never[]) => unknown,
        receiver: unknown,
        args: unknown[],
        samples: number[],
        failure: () => void,
    ): unknown
    {
        const started = performance.now();
        let completed = false;
        const finish = (failed: boolean) => {
            if (!completed)
            {
                completed = true;
                samples.push(performance.now() - started);
                if (failed)
                {
                    failure();
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
            const result = Reflect.apply(operation, receiver, args);
            if (result instanceof Promise)
            {
                return result.then(
                    (value) => {
                        finish(false);
                        return value;
                    },
                    (error: unknown) => {
                        finish(true);
                        throw error;
                    },
                );
            }

            return result;
        }
        catch (error)
        {
            finish(true);
            throw error;
        }
    }

    report()
    {
        return {
            statementRoundTripMs: distribution(this.queries),
            poolAcquireMs: distribution(this.acquisitions),
            statementFailures: this.failures,
            acquisitionFailures: this.acquisitionFailures,
        };
    }

    close()
    {
        this.pool.connect = this.connect;
        this.pool.off("acquire", this.acquire);
        for (const [client, query] of this.originals)
        {
            client.query = query;
        }
        this.originals.clear();
    }
}
