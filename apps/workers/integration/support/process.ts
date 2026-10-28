import type { MailWorkerConfig } from "../../src/config";

export interface WorkerSample
{
    cpu: NodeJS.CpuUsage;
    memory: NodeJS.MemoryUsage;
    eventLoopP99Ms: number | null;
}

export async function bounded<T>(work: Promise<T>, milliseconds = 10000): Promise<T>
{
    let timer: ReturnType<typeof setTimeout> | undefined;
    try
    {
        return await Promise.race([
            work,
            new Promise<never>((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error("Synthetic worker operation timed out")),
                    milliseconds,
                );
            }),
        ]);
    }
    finally
    {
        clearTimeout(timer);
    }
}

export async function eventually(check: () => Promise<boolean>, milliseconds = 10000)
{
    const deadline = Date.now() + milliseconds;
    while (Date.now() < deadline)
    {
        if (await check())
        {
            return;
        }
        await Bun.sleep(20);
    }
    throw new Error("Synthetic worker condition timed out");
}

export async function startMailProcess(config: MailWorkerConfig)
{
    const ready = Promise.withResolvers<number>();
    const samples = new Map<number, (sample: WorkerSample) => void>();
    let sequence = 0;
    const child = Bun.spawn([
        process.execPath,
        "--no-env-file",
        new URL("./process-worker.ts", import.meta.url).pathname,
    ], {
        env: { OPENCOK_MAIL_WORKER_TEST_CONFIG: JSON.stringify(config) },
        stdout: "ignore",
        stderr: "ignore",
        ipc(message: unknown)
        {
            if (!message || typeof message !== "object" || !("type" in message))
            {
                return;
            }
            if (message.type === "ready" && "port" in message && typeof message.port === "number")
            {
                ready.resolve(message.port);
            }
            else if (message.type === "failed")
            {
                ready.reject(new Error("Synthetic mail worker startup failed"));
            }
            else if (message.type === "sample" && "id" in message && typeof message.id === "number")
            {
                samples.get(message.id)?.(message as unknown as WorkerSample);
                samples.delete(message.id);
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
        const port = await bounded(
            Promise.race([
                ready.promise,
                child.exited.then(() => {
                    throw new Error("Synthetic mail worker exited before ready");
                }),
            ]),
            20000,
        );
        return {
            pid: child.pid,
            port,
            exited: child.exited,
            crash,
            stop,
            async sample()
            {
                const id = ++sequence;
                const pending = Promise.withResolvers<WorkerSample>();
                samples.set(id, pending.resolve);
                child.send({ id });
                try
                {
                    return await bounded(pending.promise);
                }
                finally
                {
                    samples.delete(id);
                }
            },
            async close()
            {
                try
                {
                    await bounded(stop(), config.timeoutMs * 3 + 5000);
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
