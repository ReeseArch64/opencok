import { randomUUID } from "node:crypto";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { Coordination } from "@opencok/storage/coordination";
import { terrainXml } from "../../../../packages/resources/tests/support/world-terrain";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";

export async function terrainCliHarness()
{
    const pg = new DisposablePostgres(),
        admin = await pg.start(),
        directory = await mkdtemp(join(tmpdir(), "opencok-terrain-cli-")),
        zkName = `opencok-terrain-zk-${randomUUID()}`;
    let zkStarted = false;
    let db: ReturnType<typeof createDatabase<"kingdom">> | undefined;
    try
    {
        await admin.query("CREATE DATABASE \"terrain_cli\"");
        await admin.end();
        db = createDatabase("kingdom", { ...pg.options, database: "terrain_cli", max: 4 });
        await migrate(db.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
                    .pathname,
        });
        await pg.docker([
            "run",
            "--detach",
            "--rm",
            "--name",
            zkName,
            "--publish",
            "127.0.0.1::2181",
            "zookeeper:3.4.14",
        ]);
        zkStarted = true;
        const port = Buffer.from(await pg.docker(["port", zkName, "2181/tcp"]))
                .toString()
                .trim()
                .split(":")
                .at(-1),
            zookeeper = `127.0.0.1:${port}`,
            kingdomId = 900501,
            config = {
                kingdomId,
                zookeeper,
                zkPath: `/opencok-experiment/COK${kingdomId}`,
                timeoutMs: 5000,
            };
        for (let attempt = 0;; attempt++)
        {
            const probe = new Coordination({
                ...config,
                zkPath: "/opencok-experiment/terrain-probe",
            });
            try
            {
                await probe.start();
                probe.close();
                break;
            }
            catch (error)
            {
                probe.close();
                if (attempt >= 20)
                {
                    throw error;
                }
                await Bun.sleep(100);
            }
        }
        for (const name of ["building", "role", "position"])
        {
            await writeFile(
                join(directory, `${name}.xml`),
                `<database><ItemSpec id="${
                    name === "building" ? 400001 : name === "role" ? 100101 : 1
                }" level="1"/></database>`,
            );
        }
        await writeFile(
            join(directory, "item.xml"),
            "<database><ItemSpec id=\"worldmap_city\" k1=\"2\" k3=\"5\" k6=\"2\"/><ItemSpec id=\"worldmap_explore\" k1=\"2\"/><ItemSpec id=\"worldmap_num\" k1=\"50\"/></database>",
        );
        await writeFile(
            join(directory, "resdential.xml"),
            `<database>${
                Array.from({ length: 98 }, (_, i) => `<ItemSpec id="${43000 + i}" area_id="1"/>`)
                    .join("")
            }</database>`,
        );
        const map = join(directory, "terrain.xml");
        await writeFile(map, terrainXml());
        const url = new URL(`postgres://127.0.0.1:${pg.options.port}/terrain_cli`);
        url.username = String(pg.options.user);
        url.password = String(pg.options.password);
        const run = async (
            args: readonly string[] = [],
            options: { map?: string; size?: number; catalogs?: boolean; } = {},
        ) => {
            const child = Bun.spawn(
                [
                    "bun",
                    "--no-env-file",
                    "scripts/import-world-terrain.ts",
                    String(kingdomId),
                    String(options.size ?? 5),
                    options.map ?? map,
                    ...(options.catalogs === false ? [] : ["--catalogs", directory]),
                    ...args,
                ],
                {
                    cwd: new URL("../..", import.meta.url).pathname,
                    env: {
                        PATH: process.env.PATH,
                        DATABASE_ROLE: "kingdom",
                        DATABASE_URL: url.toString(),
                        GAME_ZOOKEEPER: zookeeper,
                    },
                    stdout: "pipe",
                    stderr: "pipe",
                },
            );
            const timer = setTimeout(() => child.kill(), 120000);
            try
            {
                const [code, stdout, stderr] = await Promise.all([
                    child.exited,
                    new Response(child.stdout).text(),
                    new Response(child.stderr).text(),
                ]);
                return { code, stdout, stderr };
            }
            finally
            {
                clearTimeout(timer);
            }
        };
        return {
            db,
            pg,
            directory,
            map,
            url,
            config,
            run,
            async close()
            {
                await db!.close();
                if (zkStarted)
                {
                    await pg.docker(["rm", "--force", "--volumes", zkName]);
                }
                await rm(directory, { recursive: true, force: true });
                await pg.stop();
            },
        };
    }
    catch (error)
    {
        await admin.end().catch(() => undefined);
        await db?.close();
        if (zkStarted)
        {
            await pg.docker(["rm", "--force", "--volumes", zkName]);
        }
        await rm(directory, { recursive: true, force: true });
        await pg.stop();
        throw error;
    }
}
