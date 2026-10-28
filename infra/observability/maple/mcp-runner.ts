import { mcpLimits } from "./mcp-contracts";
import type { CommandRunner } from "./mcp-contracts";

export class BoundedCommandRunner implements CommandRunner
{
    public constructor(
        private readonly timeoutMs: number = mcpLimits.timeoutMs,
        private readonly outputBytes: number = mcpLimits.outputBytes,
    )
    {}

    public async run(command: string[]): Promise<string>
    {
        const child = Bun.spawn(command, { stdin: "ignore", stdout: "pipe", stderr: "pipe" });
        const stdout = child.stdout.getReader();
        const stderr = child.stderr.getReader();
        let bytes = 0;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const collect = async (reader: typeof stdout, retain: boolean) => {
            const chunks: Uint8Array[] = [];

            while (true)
            {
                const { done, value } = await reader.read();

                if (done)
                {
                    break;
                }

                bytes += value.byteLength;

                if (bytes > this.outputBytes)
                {
                    throw new Error("Command output limit exceeded");
                }

                if (retain)
                {
                    chunks.push(value);
                }
            }

            return Buffer.concat(chunks).toString("utf8");
        };

        try
        {
            const [output, , exitCode] = await Promise.race([
                Promise.all([collect(stdout, true), collect(stderr, false), child.exited]),
                new Promise<never>((_, reject) => {
                    timer = setTimeout(
                        () => reject(new Error("Command timed out")),
                        this.timeoutMs,
                    );
                }),
            ]);

            if (exitCode !== 0)
            {
                throw new Error("Command failed");
            }

            return output;
        }
        finally
        {
            clearTimeout(timer);
            child.kill("SIGKILL");
            await Promise.allSettled([stdout.cancel(), stderr.cancel()]);
        }
    }
}
