import { expect, test } from "bun:test";
import { join } from "node:path";

const runner = new URL("../src/runtime.ts", import.meta.url).pathname;
const cwd = join(import.meta.dir, "..");

for (const signal of ["SIGINT", "SIGTERM"] as const)
{
    test(`process runtime finalizes resources on ${signal}`, async () => {
        const child = Bun.spawn(
            [
                process.execPath,
                "--no-env-file",
                "-e",
                `
      import { Effect } from "effect";
      import { runService } from ${JSON.stringify(runner)};
      runService("fixture", Effect.scoped(Effect.gen(function* () {
        yield* Effect.acquireRelease(Effect.void, () => Effect.sync(() => console.log("released")));
        console.log("ready");
        yield* Effect.never;
      })));
    `,
            ],
            { cwd, stdout: "pipe", stderr: "pipe" },
        );
        try
        {
            const reader = child.stdout.getReader();
            let output = "";
            while (!output.includes("ready"))
            {
                const { value, done } = await reader.read();
                if (done)
                {
                    throw new Error("Process exited before startup");
                }
                output += new TextDecoder().decode(value);
            }
            child.kill(signal);
            while (true)
            {
                const { value, done } = await reader.read();
                if (done)
                {
                    break;
                }
                output += new TextDecoder().decode(value);
            }
            await child.exited;
            expect(output.match(/released/g)?.length).toBe(1);
            expect(output).toContain("\"event\":\"stopped\"");
            expect(await new Response(child.stderr).text()).toBe("");
        }
        finally
        {
            if (child.exitCode === null)
            {
                child.kill("SIGKILL");
            }
            await child.exited;
        }
    });
}

test("process failures exit nonzero and never print underlying defects", async () => {
    const child = Bun.spawn(
        [
            process.execPath,
            "--no-env-file",
            "-e",
            `
    import { Effect } from "effect";
    import { runService } from ${JSON.stringify(runner)};
    runService("fixture", Effect.die(new Error("private-secret")));
  `,
        ],
        { cwd, stdout: "pipe", stderr: "pipe" },
    );
    const [stdout, stderr, code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);
    expect(code).not.toBe(0);
    expect(stderr).toContain("\"event\":\"service_failed\"");
    expect(stdout + stderr).not.toContain("private-secret");
});
