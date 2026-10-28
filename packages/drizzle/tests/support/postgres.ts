import { randomBytes } from "node:crypto";
import { Pool, type PoolConfig } from "pg";

export class DisposablePostgres
{
    readonly name = `opencok-postgresql-${randomBytes(8).toString("hex")}`;
    readonly options: PoolConfig = {
        host: "127.0.0.1",
        port: 0,
        user: "postgres",
        password: randomBytes(24).toString("hex"),
        options: "-c timezone=UTC",
    };
    private created = false;
    async docker(args: string[], input?: Uint8Array): Promise<Uint8Array>
    {
        const child = Bun.spawn(["docker", ...args], {
            env: { ...process.env, POSTGRES_PASSWORD: String(this.options.password) },
            stdin: input ? new Blob([input]) : "ignore",
            stdout: "pipe",
            stderr: "pipe",
        });
        const [output, errors, code] = await Promise.all([
            new Response(child.stdout).bytes(),
            new Response(child.stderr).text(),
            child.exited,
        ]);
        if (code)
        {
            throw new Error(
                `Disposable PostgreSQL ${args[0]} failed (exit ${code}): ${
                    errors.replaceAll(String(this.options.password), "[redacted]").trim()
                }`,
            );
        }
        return output;
    }
    async connect(database = "postgres")
    {
        this.options.port = Number(
            Buffer.from(await this.docker(["port", this.name, "5432/tcp"]))
                .toString()
                .trim()
                .split(":")
                .at(-1),
        );
        for (let attempt = 0; attempt < 120; attempt++)
        {
            const pool = new Pool({ ...this.options, database, connectionTimeoutMillis: 1000 });
            try
            {
                await pool.query("SELECT 1");
                return pool;
            }
            catch
            {
                await pool.end();
                await Bun.sleep(500);
            }
        }
        throw new Error("Disposable PostgreSQL readiness timed out");
    }
    async start()
    {
        await this.docker([
            "run",
            "--detach",
            "--rm",
            "--name",
            this.name,
            "--env",
            "POSTGRES_PASSWORD",
            "--publish",
            "127.0.0.1::5432",
            "postgres:17.11-bookworm",
        ]);
        this.created = true;
        return this.connect();
    }
    async restart()
    {
        await this.docker(["restart", this.name]);
        const pool = await this.connect();
        await pool.end();
    }
    async stop()
    {
        if (this.created)
        {
            await this.docker(["rm", "--force", "--volumes", this.name]);
            this.created = false;
        }
    }
}
