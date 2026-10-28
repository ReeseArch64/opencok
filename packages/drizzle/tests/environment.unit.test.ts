import { expect, test } from "bun:test";
import { fileURLToPath } from "node:url";

for (
    const [script, key] of [
        ["migrate", "DATABASE_URL"],
        ["setup", "DATABASE_URL"],
    ] as const
)
{
    test(`${script} reports its missing connection setting before database access`, async () => {
        const child = Bun.spawn([process.execPath, "--no-env-file", `scripts/${script}.ts`], {
            cwd: fileURLToPath(new URL("..", import.meta.url)),
            env: {
                PATH: process.env.PATH,
                NODE_ENV: "test",
                DATABASE_ROLE: "global",
                DATABASE_URL: "",
                POSTGRES_ADMIN_URL: "",
            },
            stdout: "pipe",
            stderr: "pipe",
        });
        const [code, stdout, stderr] = await Promise.all([
            child.exited,
            new Response(child.stdout).text(),
            new Response(child.stderr).text(),
        ]);
        expect(code).toBe(1);
        expect(stdout).toBe("");
        expect(stderr).toContain(`Missing environment configuration: ${key}`);
    });
}
