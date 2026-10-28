import { randomUUID } from "node:crypto";
import { isRecord } from "@opencok/contracts/chat";
async function bounded<T>(value: Promise<T>, milliseconds = 5000): Promise<T>
{
    let timer: ReturnType<typeof setTimeout> | undefined;
    try
    {
        return await Promise.race([
            value,
            new Promise<never>((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error("Synthetic Chat process timed out")),
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
export async function startChatProcess(index: number, databaseUrl: string)
{
    let ready: (port: number) => void;
    const startup = new Promise<number>((resolve) => {
        ready = resolve;
    });
    const pending = new Map<string, () => void>();
    const child = Bun.spawn(
        [process.execPath, "--no-env-file", new URL("./worker.ts", import.meta.url).pathname],
        {
            env: {
                ...process.env,
                SOCIAL_TEST_DATABASE_URL: databaseUrl,
                SOCIAL_TEST_INSTANCE: `transport-${index}`,
            },
            stdout: "ignore",
            stderr: "ignore",
            ipc: (message: unknown) => {
                if (!isRecord(message))
                {
                    return;
                }
                if (message.type === "ready" && typeof message.port === "number")
                {
                    ready(message.port);
                }
                if (message.type === "polled" && typeof message.id === "string")
                {
                    pending.get(message.id)?.();
                    pending.delete(message.id);
                }
            },
        },
    );
    async function close()
    {
        if (child.exitCode !== null)
        {
            return;
        }
        child.kill("SIGTERM");
        try
        {
            await bounded(child.exited);
        }
        catch
        {
            child.kill("SIGKILL");
            await child.exited;
        }
    }
    try
    {
        const port = await bounded(
            Promise.race([
                startup,
                child.exited.then(() => {
                    throw new Error("Synthetic Chat process exited during startup");
                }),
            ]),
        );
        return {
            url: `http://127.0.0.1:${port}`,
            close,
            async runDistribution()
            {
                const id = randomUUID();
                const response = new Promise<void>((resolve) => {
                    pending.set(id, resolve);
                });
                try
                {
                    child.send({ type: "poll", id });
                    await bounded(response);
                }
                finally
                {
                    pending.delete(id);
                }
            },
        };
    }
    catch (error)
    {
        await close();
        throw error;
    }
}
