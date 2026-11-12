import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GenericContainer, Wait, type StartedTestContainer } from "testcontainers";

export async function startDatabases()
{
    const containers: StartedTestContainer[] = [];
    try
    {
        const postgres = await new GenericContainer("postgres:17.11-bookworm")
            .withEnvironment({ POSTGRES_USER: "postgres", POSTGRES_PASSWORD: "postgres" })
            .withExposedPorts(5432)
            .withWaitStrategy(
                Wait.forLogMessage(/database system is ready to accept connections/, 2),
            )
            .start();
        containers.push(postgres);
        const mongo = await new GenericContainer("mongo:8.0.34")
            .withExposedPorts(27017)
            .withWaitStrategy(Wait.forLogMessage(/Waiting for connections/))
            .start();
        containers.push(mongo);
        const redis = await new GenericContainer("redis:8.10.3-trixie")
            .withExposedPorts(6379)
            .withWaitStrategy(Wait.forLogMessage(/Ready to accept connections/))
            .start();
        containers.push(redis);
        async function run(path: string): Promise<string>
        {
            return new Promise<string>((resolve, reject) => {
                execFile(
                    "bun",
                    [
                        "--no-env-file",
                        "--tsconfig-override",
                        "tsconfig.json",
                        path,
                        "--postgres-host",
                        postgres.getHost(),
                        "--postgres-port",
                        String(postgres.getMappedPort(5432)),
                        "--mongodb-uri",
                        `mongodb://${mongo.getHost()}:${mongo.getMappedPort(27017)}`,
                        "--redis-url",
                        `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`,
                    ],
                    {
                        cwd: fileURLToPath(new URL("../../", import.meta.url)),
                        timeout: 120_000,
                        maxBuffer: 4 * 1024 * 1024,
                    },
                    (error, stdout, stderr) => {
                        if (error)
                        {
                            reject(new Error(`Database command failed\n${stdout}\n${stderr}`, {
                                cause: error,
                            }));
                            return;
                        }
                        resolve(stdout);
                    },
                );
            });
        }
        return {
            runCheck(name: string)
            {
                if (!/^[a-z-]+$/.test(name))
                {
                    throw new Error("Invalid database check name");
                }
                return run(fileURLToPath(new URL(`../database/${name}.check.ts`, import.meta.url)));
            },
            runScript(name: "migrate" | "seed")
            {
                return run(fileURLToPath(new URL(`../../scripts/${name}.ts`, import.meta.url)));
            },
            async stop()
            {
                const results = await Promise.allSettled(
                    containers.map(container => container.stop()),
                );
                const failures = results.filter(result => result.status === "rejected");
                if (failures.length > 0)
                {
                    throw new AggregateError(
                        failures.map(result => result.reason),
                        "Container cleanup failed",
                    );
                }
            },
        };
    }
    catch (error)
    {
        await Promise.allSettled(containers.map(container => container.stop()));
        throw error;
    }
}
