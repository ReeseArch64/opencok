export interface ProcessSample
{
    cpu: NodeJS.CpuUsage;
    memory: NodeJS.MemoryUsage;
    eventLoopP99Ms: number | null;
    pool?: { total: number; idle: number; waiting: number; };
}

export async function bounded<T>(work: Promise<T>, timeoutMs = 15000): Promise<T>
{
    let timer: ReturnType<typeof setTimeout> | undefined;
    try
    {
        return await Promise.race([
            work,
            new Promise<never>((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error("Synthetic scheduler operation timed out")),
                    timeoutMs,
                );
            }),
        ]);
    }
    finally
    {
        clearTimeout(timer);
    }
}

export async function eventually(check: () => Promise<boolean>, timeoutMs = 15000)
{
    const until = Date.now() + timeoutMs;
    while (Date.now() < until)
    {
        if (await check())
        {
            return;
        }
        await Bun.sleep(20);
    }
    throw new Error("Synthetic scheduler condition timed out");
}

export async function childProcess(path: string, config: unknown)
{
    const ready = Promise.withResolvers<Record<string, unknown>>();
    const pending = new Map<number, ReturnType<typeof Promise.withResolvers<unknown>>>();
    const events: Record<string, unknown>[] = [];
    let sequence = 0;
    const child = Bun.spawn([process.execPath, "--no-env-file", path], {
        env: { OPENCOK_SCHEDULER_TEST_CONFIG: JSON.stringify(config) },
        stdout: "ignore",
        stderr: "ignore",
        ipc(message: unknown)
        {
            if (!message || typeof message !== "object" || !("type" in message))
            {
                return;
            }
            const value = message as Record<string, unknown>;
            if (value.type === "ready")
            {
                ready.resolve(value);
            }
            else if (value.type === "failed")
            {
                ready.reject(new Error("Synthetic scheduler process startup failed"));
            }
            else if (value.type === "reply" && typeof value.id === "number")
            {
                const request = pending.get(value.id);
                pending.delete(value.id);
                if (value.error)
                {
                    request?.reject(new Error("Synthetic owner operation rejected"));
                }
                else
                {
                    request?.resolve(value.value);
                }
            }
            else
            {
                events.push(value);
            }
        },
    });
    const crash = async () => {
        if (child.exitCode === null)
        {
            child.kill("SIGKILL");
        }
        await child.exited;
    };
    const stop = () => {
        if (child.exitCode === null)
        {
            child.kill("SIGTERM");
        }
        return child.exited;
    };
    try
    {
        const address = await bounded(
            Promise.race([
                ready.promise,
                child.exited.then(() => {
                    throw new Error("Synthetic scheduler process exited before ready");
                }),
            ]),
            60000,
        );
        return {
            address,
            events,
            pid: child.pid,
            exited: child.exited,
            crash,
            stop,
            async request<T = unknown>(
                operation: string,
                data: Record<string, unknown> = {},
            ): Promise<T>
            {
                const id = ++sequence;
                const result = Promise.withResolvers<unknown>();
                pending.set(id, result);
                child.send({ id, operation, ...data });
                try
                {
                    return await bounded(result.promise) as T;
                }
                finally
                {
                    pending.delete(id);
                }
            },
            async sample()
            {
                const id = ++sequence;
                const result = Promise.withResolvers<unknown>();
                pending.set(id, result);
                child.send({ id, operation: "sample" });
                try
                {
                    return await bounded(result.promise) as ProcessSample;
                }
                finally
                {
                    pending.delete(id);
                }
            },
            async close()
            {
                try
                {
                    await bounded(stop(), 15000);
                }
                catch (error)
                {
                    await crash();
                    throw error;
                }
            },
        };
    }
    catch (error)
    {
        await crash();
        throw error;
    }
}
