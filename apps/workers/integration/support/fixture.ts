import { randomBytes, randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";
import type { MailWorkerConfig } from "../../src/config";
import { provisionMailWorkerRoles } from "../../scripts/mail-role-provisioning";
import { chatReceiver } from "./chat";
import { startMailProcess } from "./process";

export async function mailHarness()
{
    const postgres = new DisposablePostgres();
    const admin = await postgres.start();
    const names = { global: "mail_global", kingdoms: ["mail_kingdom_1", "mail_kingdom_2"] };
    try
    {
        for (const name of [names.global, ...names.kingdoms])
        {
            await admin.query(`CREATE DATABASE ${name}`);
        }
    }
    catch (error)
    {
        await admin.end();
        await postgres.stop();
        throw error;
    }
    const global = createDatabase("global", {
        ...postgres.options,
        database: names.global,
        max: 4,
    });
    const kingdoms = names.kingdoms.map((database) =>
        createDatabase("kingdom", { ...postgres.options, database, max: 4 })
    );
    const roles = [1, 2].map((id) => ({
        id,
        kingdom: `mail_relay_${id}`,
        global: `mail_global_${id}`,
        password: randomBytes(24).toString("hex"),
    }));
    const workers = new Set<Awaited<ReturnType<typeof startMailProcess>>>();
    let receiver: Awaited<ReturnType<typeof chatReceiver>> | undefined;
    const close = async () => {
        try
        {
            await Promise.all([...workers].map((worker) => worker.close()));
        }
        finally
        {
            try
            {
                await receiver?.close();
            }
            finally
            {
                await Promise.all([
                    admin.end(),
                    global.close(),
                    ...kingdoms.map((db) => db.close()),
                ]);
                await postgres.stop();
            }
        }
    };
    try
    {
        await migrate(global.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/global", import.meta.url).pathname,
        });
        for (const kingdom of kingdoms)
        {
            await migrate(kingdom.db, {
                migrationsFolder:
                    new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
                        .pathname,
            });
        }
        const secret = randomBytes(24).toString("hex");
        const realmSecrets = Object.fromEntries(
            roles.map((role) => [String(role.id), randomBytes(24).toString("hex")]),
        );
        receiver = await chatReceiver(global, secret, realmSecrets);
        const chat = receiver;
        const url = (database: string, user: string, password: string) => {
            const target = new URL(`postgresql://127.0.0.1:${postgres.options.port}/${database}`);
            target.username = user;
            target.password = password;
            return target.href;
        };
        const config = (id: number, timeoutMs = 1000): MailWorkerConfig => {
            const role = roles[id - 1]!;
            return {
                kingdomId: id,
                kingdomUrl: url(names.kingdoms[id - 1]!, role.kingdom, role.password),
                globalUrl: url(names.global, role.global, role.password),
                healthHost: "127.0.0.1",
                healthPort: 0,
                timeoutMs,
                intervalMs: 1000,
                kingdomPool: 2,
                globalPool: 1,
                chat: { url: chat.url, signingSecret: realmSecrets[String(id)]! },
            };
        };
        const gift = async (id: number, suffix: string = randomUUID()) => {
            const uid = `gift-${suffix}`.slice(0, 40);
            const sent = 9007199254740993n;
            const opened = 1792756800123n;
            await global.pool.query(
                "INSERT INTO opencok_global.mail_gift_log (uid,\"sendTime\",\"toUid\",\"isOpened\",\"receiveTime\",\"isRewarded\",\"isThanks\") VALUES ($1,$2,'owner',0,0,0,0)",
                [uid, String(sent)],
            );
            await kingdoms[id - 1]!.pool.query(
                "INSERT INTO opencok_kingdom.mail_gift_opening (\"mailUid\",\"sendTime\",\"toUser\",\"openedAt\") VALUES ($1,$2,'owner',$3)",
                [uid, String(sent), String(opened)],
            );
            return { uid, sent, opened };
        };
        const intent = async (
            id: number,
            operation: string = randomUUID(),
            requestedAt = Date.now(),
        ) => {
            await kingdoms[id - 1]!.pool.query(
                "INSERT INTO opencok_kingdom.mail_chat_read_intent (\"commandId\",\"effectIndex\",\"ownerUid\",others,\"chatTypes\",\"requestedAt\",action) VALUES ($1,0,'owner','peer','1,20',$2,'read')",
                [operation, requestedAt],
            );
            return operation;
        };
        const pending = async (id: number, kind: "gift" | "chat") => {
            const table = kind === "gift" ? "mail_gift_opening" : "mail_chat_read_intent";
            const rows = await kingdoms[id - 1]!.pool.query<{ count: number; }>(
                `SELECT count(*)::int AS count FROM opencok_kingdom.${table}`,
            );
            return rows.rows[0]!.count;
        };
        return {
            postgres,
            admin,
            names,
            global,
            kingdoms,
            roles,
            chat,
            config,
            gift,
            intent,
            pending,
            close,
            async provision()
            {
                for (const role of roles)
                {
                    await provisionMailWorkerRoles({
                        kingdom: kingdoms[role.id - 1]!.pool,
                        global: global.pool,
                        kingdomId: role.id,
                        kingdomRole: role.kingdom,
                        globalRole: role.global,
                        password: role.password,
                    });
                }
            },
            async start(id: number, timeoutMs = 1000)
            {
                const worker = await startMailProcess(config(id, timeoutMs));
                workers.add(worker);
                return worker;
            },
        };
    }
    catch (error)
    {
        await close();
        throw error;
    }
}
