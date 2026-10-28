import { afterAll, beforeAll, expect, test } from "bun:test";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createDatabase } from "@opencok/drizzle";
import { initializeLogging } from "@opencok/core/logging";
import { createChatMailboxPublisher } from "@opencok/connection/chat-mailbox";
import { checkMailWorkerPermissions } from "@opencok/mail/repositories/worker-permissions";
import {
    acquireRealmAuthority,
    fenceRealmTransaction,
} from "@opencok/repositories/realm-authority";
import { createMailWorkerApplication } from "../src/composition";
import { createRealmMailIntegrationWorker } from "../../server/src/composition/mail-integration";
import { mailHarness } from "./support/fixture";
import { bounded, eventually } from "./support/process";

initializeLogging("mail-worker-integration");

let h: Awaited<ReturnType<typeof mailHarness>>;
beforeAll(async () => {
    h = await mailHarness();
    await h.provision();
}, 120000);
afterAll(async () => h?.close());

test(
    "a killed gift worker replays a committed global projection without acquiring realm authority",
    async () => {
        const kingdom = h.kingdoms[0]!;
        const old = await acquireRealmAuthority(kingdom.db, 1, () => true);
        const worker = await h.start(1, 5000);
        const lock = await kingdom.pool.connect();
        let recovered: Awaited<ReturnType<typeof h.start>> | undefined;
        try
        {
            await lock.query("SELECT pg_advisory_lock(558, 1501)");
            await kingdom.pool.query(
                "CREATE FUNCTION public.pause_mail_ack() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_advisory_xact_lock(558,1501); RETURN OLD; END $$",
            );
            await kingdom.pool.query(
                "CREATE TRIGGER pause_mail_ack BEFORE DELETE ON opencok_kingdom.mail_gift_opening FOR EACH ROW EXECUTE FUNCTION public.pause_mail_ack()",
            );
            const gift = await h.gift(1, "crash");
            await eventually(async () => {
                const row = (await h.global.pool.query(
                    "SELECT \"isOpened\" AS opened FROM opencok_global.mail_gift_log WHERE uid=$1",
                    [gift.uid],
                )).rows[0];
                return row.opened === 1;
            });
            expect(await h.pending(1, "gift")).toBe(1);
            await worker.crash();
            expect(await h.pending(1, "gift")).toBe(1);
            await lock.query("SELECT pg_advisory_unlock(558, 1501)");
            await kingdom.pool.query(
                "DROP TRIGGER pause_mail_ack ON opencok_kingdom.mail_gift_opening",
            );
            const current = await acquireRealmAuthority(kingdom.db, 1, () => true);
            expect(current.epoch).toBe(old.epoch + 1n);
            await expect(kingdom.db.transaction((tx) => fenceRealmTransaction(tx, old))).rejects
                .toThrow();
            recovered = await h.start(1);
            await eventually(async () => await h.pending(1, "gift") === 0);
            const row = (await h.global.pool.query(
                "SELECT \"sendTime\"::text AS sent,\"receiveTime\"::text AS opened,\"isOpened\",\"isRewarded\",\"isThanks\" FROM opencok_global.mail_gift_log WHERE uid=$1",
                [gift.uid],
            )).rows[0];
            expect(row).toEqual({
                sent: String(gift.sent),
                opened: String(gift.opened),
                isOpened: 1,
                isRewarded: 0,
                isThanks: 0,
            });
            const authority = (await kingdom.pool.query(
                "SELECT \"ownerEpoch\"::text AS epoch FROM opencok_kingdom.realm_authority WHERE \"kingdomId\"=1",
            )).rows[0];
            expect(authority.epoch).toBe(String(current.epoch));
        }
        finally
        {
            await lock.query("SELECT pg_advisory_unlock_all()");
            lock.release();
            await kingdom.pool.query(
                "DROP TRIGGER IF EXISTS pause_mail_ack ON opencok_kingdom.mail_gift_opening",
            );
            await worker.close();
            await recovered?.close();
        }
    },
    30000,
);

test(
    "signed Chat delivery deduplicates lost acknowledgments and timeout retries while another realm progresses",
    async () => {
        const first = await h.start(1, 1000);
        const second = await h.start(2, 1000);
        try
        {
            await h.global.pool.query(
                "INSERT INTO opencok_chat.chat_mailbox_message (kingdom_id,owner_uid,message_id,peer_uid,chat_type,created_at,body) VALUES (1,'owner','message-one','peer',1,1,'synthetic'),(2,'owner','message-two','peer',1,1,'synthetic')",
            );
            h.chat.control.loseNextAck = true;
            const operation = await h.intent(1);
            await eventually(async () =>
                h.chat.deliveries.some((delivery) =>
                    delivery.operation === operation && delivery.result === "applied"
                )
            );
            await eventually(async () => await h.pending(1, "chat") === 0);
            expect(
                h.chat.deliveries.filter((delivery) => delivery.operation === operation).map((
                    delivery,
                ) => delivery.result),
            ).toEqual(["applied", "unchanged"]);
            expect(
                (await h.global.pool.query(
                    "SELECT count(*)::int AS count FROM opencok_chat.chat_mailbox_receipt WHERE operation_id=$1",
                    [operation],
                )).rows[0].count,
            ).toBe(1);
            h.chat.control.delayMs = 1400;
            const delayed = await h.intent(1);
            const other = await h.intent(2);
            const gift = await h.gift(1, "independent-gift");
            await eventually(async () =>
                h.chat.deliveries.some((delivery) => delivery.operation === other)
            );
            await eventually(async () => await h.pending(1, "gift") === 0);
            expect(
                (await h.global.pool.query(
                    "SELECT \"isOpened\" FROM opencok_global.mail_gift_log WHERE uid=$1",
                    [gift.uid],
                )).rows[0].isOpened,
            ).toBe(1);
            await eventually(async () =>
                h.chat.deliveries.some((delivery) => delivery.operation === delayed)
            );
            expect(await h.pending(1, "chat")).toBe(1);
            h.chat.control.delayMs = 0;
            await eventually(async () => await h.pending(1, "chat") === 0);
            expect(
                h.chat.deliveries.filter((delivery) => delivery.operation === delayed).some((
                    delivery,
                ) => delivery.result === "unchanged"),
            ).toBe(true);
            expect(await h.pending(2, "chat")).toBe(0);
            expect((await h.chat.store.list("owner", 1, "peer", 1, 10))[0]?.read).toBe(true);
            expect((await h.chat.store.list("owner", 2, "peer", 1, 10))[0]?.read).toBe(true);
        }
        finally
        {
            h.chat.control.delayMs = 0;
            await Promise.all([first.close(), second.close()]);
        }
    },
    30000,
);

test(
    "local shutdown stops between intents and external mode recovers the remaining durable backlog",
    async () => {
        const entered = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        h.chat.control.afterApply = async () => {
            entered.resolve();
            await release.promise;
        };
        const first = await h.intent(1);
        const second = await h.intent(1, undefined, Date.now() + 1);
        const config = { kingdomId: 1, timeoutMs: 5000, mailChat: h.config(1).chat };
        const local = createRealmMailIntegrationWorker(config, h.kingdoms[0]!.db, h.global.db)!;
        let process: Awaited<ReturnType<typeof h.start>> | undefined;
        try
        {
            await bounded(entered.promise);
            let closed = false;
            const closing = local.close().then(() => {
                closed = true;
            });
            await Bun.sleep(20);
            expect(closed).toBe(false);
            release.resolve();
            await closing;
            expect(await h.pending(1, "chat")).toBe(1);
            expect(
                h.chat.deliveries.filter((delivery) =>
                    [first, second].includes(delivery.operation)
                ),
            ).toHaveLength(1);
            expect(
                createRealmMailIntegrationWorker(
                    { ...config, mailIntegrationMode: "external" },
                    h.kingdoms[0]!.db,
                    h.global.db,
                ),
            ).toBeUndefined();
            h.chat.control.afterApply = undefined;
            process = await h.start(1);
            await eventually(async () => await h.pending(1, "chat") === 0);
            expect(
                h.chat.deliveries.filter((delivery) =>
                    [first, second].includes(delivery.operation)
                ),
            ).toHaveLength(2);
        }
        finally
        {
            release.resolve();
            h.chat.control.afterApply = undefined;
            await local.close();
            await process?.close();
        }
    },
    30000,
);

test("a realm mailbox key cannot forge another realm's remote effects", async () => {
    const config = h.config(1);
    const publish = createChatMailboxPublisher({ ...config.chat!, timeoutMs: 1000 });
    const operationId = randomUUID();
    await expect(publish({
        owner: "owner",
        kingdomId: 2,
        operationId,
        effectIndex: 0,
        action: "delete",
        others: "peer",
        types: [1, 20],
        requestedAt: Date.now(),
    }, new AbortController().signal)).rejects.toThrow("Chat mailbox unavailable");
    expect(h.chat.deliveries.some((delivery) => delivery.operation === operationId)).toBe(false);
    expect(
        (await h.global.pool.query(
            "SELECT count(*)::int AS count FROM opencok_chat.chat_mailbox_receipt WHERE operation_id=$1",
            [operationId],
        )).rows[0].count,
    ).toBe(0);
    expect(await h.chat.store.list("owner", 2, "peer", 1, 10)).toHaveLength(1);
});

test("worker credentials cannot mutate gameplay, rewards, authority or another realm", async () => {
    const config = h.config(1);
    const kingdom = createDatabase("kingdom", { connectionString: config.kingdomUrl });
    const global = createDatabase("global", { connectionString: config.globalUrl });
    const otherUrl = new URL(config.kingdomUrl);
    otherUrl.pathname = `/${h.names.kingdoms[1]}`;
    const other = createDatabase("kingdom", { connectionString: otherUrl.href });
    try
    {
        for (
            const table of [
                "user_resource",
                "user_item",
                "worldpoint",
                "mail",
                "command_receipt",
                "mutation_outbox",
                "realm_authority",
                "mail_reward_log",
            ]
        )
        {
            await expect(kingdom.pool.query(`DELETE FROM opencok_kingdom.${table} WHERE false`))
                .rejects.toMatchObject({ code: "42501" });
        }
        for (const column of ["isRewarded", "isThanks", "rewards", "contents", "toUid"])
        {
            await expect(
                global.pool.query(
                    `UPDATE opencok_global.mail_gift_log SET "${column}"="${column}" WHERE false`,
                ),
            ).rejects.toMatchObject({ code: "42501" });
        }
        await expect(global.pool.query("SELECT contents,rewards FROM opencok_global.mail_gift_log"))
            .rejects.toMatchObject({ code: "42501" });
        await expect(other.pool.query("DELETE FROM opencok_kingdom.mail_gift_opening WHERE false"))
            .rejects.toMatchObject({ code: "42501" });
        await expect(other.pool.query("CREATE TABLE opencok_kingdom.worker_escape (id int)"))
            .rejects.toMatchObject({ code: "42501" });
        const a = await h.gift(1, "global-one");
        const b = await h.gift(2, "global-two");
        await global.pool.query(
            "UPDATE opencok_global.mail_gift_log SET \"isOpened\"=1,\"receiveTime\"=2 WHERE uid=ANY($1::text[])",
            [[a.uid, b.uid]],
        );
        expect(
            (await h.global.pool.query(
                "SELECT \"isOpened\" FROM opencok_global.mail_gift_log WHERE uid=ANY($1::text[])",
                [[a.uid, b.uid]],
            )).rows.map((row) => row.isOpened),
        ).toEqual([1, 1]);
        const broad = new URL(config.kingdomUrl);
        broad.username = String(h.postgres.options.user);
        broad.password = String(h.postgres.options.password);
        await expect(createMailWorkerApplication({ ...config, kingdomUrl: broad.href })).rejects
            .toThrow("Mail worker startup failed");
    }
    finally
    {
        await Promise.all([kingdom.close(), global.close(), other.close()]);
    }
}, 30000);

test(
    "permission audit rejects indirect escalation and keeps realm bindings immutable",
    async () => {
        const config = h.config(1);
        const kingdom = createDatabase("kingdom", { connectionString: config.kingdomUrl });
        const global = createDatabase("global", { connectionString: config.globalUrl });
        const realm = h.kingdoms[0]!.pool;
        const check = () => checkMailWorkerPermissions(kingdom.db, global.db, 1);
        try
        {
            await check();
            await expect(kingdom.pool.query(
                "UPDATE mail_worker_access.binding SET kingdom_id=2 WHERE role_name=current_user",
            )).rejects.toMatchObject({ code: "42501" });
            await expect(kingdom.pool.query(
                "CREATE TABLE mail_worker_access.fake_binding (id int)",
            )).rejects.toMatchObject({ code: "42501" });
            await realm.query("CREATE ROLE mail_audit_escalation NOLOGIN");
            try
            {
                await realm.query(`GRANT mail_audit_escalation TO ${h.roles[0]!.kingdom}`);
                await expect(check()).rejects.toThrow("Unsafe database service role");
            }
            finally
            {
                await realm.query(`REVOKE mail_audit_escalation FROM ${h.roles[0]!.kingdom}`);
                await realm.query("DROP ROLE mail_audit_escalation");
            }
            await check();
            try
            {
                await h.global.pool.query(
                    "GRANT SELECT (\"receiveTime\") ON opencok_global.mail_gift_log TO PUBLIC",
                );
                await expect(check()).rejects.toThrow("Unsafe mail worker column permissions");
            }
            finally
            {
                await h.global.pool.query(
                    "REVOKE SELECT (\"receiveTime\") ON opencok_global.mail_gift_log FROM PUBLIC",
                );
            }
            await check();
            try
            {
                await realm.query(
                    "CREATE FUNCTION public.mail_audit_escape() RETURNS integer LANGUAGE sql SECURITY DEFINER AS 'SELECT 1'",
                );
                await expect(check()).rejects.toThrow("Unsafe database service role");
            }
            finally
            {
                await realm.query("DROP FUNCTION IF EXISTS public.mail_audit_escape()");
            }
            await check();
            try
            {
                await realm.query("CREATE SCHEMA pgxtempx");
                await realm.query("CREATE TABLE pgxtempx.mail_audit_escape (id integer)");
                await realm.query(`GRANT USAGE ON SCHEMA pgxtempx TO ${h.roles[0]!.kingdom}`);
                await realm.query(
                    `GRANT SELECT ON pgxtempx.mail_audit_escape TO ${h.roles[0]!.kingdom}`,
                );
                await expect(check()).rejects.toThrow("Unsafe mail worker column permissions");
            }
            finally
            {
                await realm.query("DROP SCHEMA IF EXISTS pgxtempx CASCADE");
            }
            await check();
            try
            {
                await realm.query(
                    `GRANT CREATE ON SCHEMA opencok_kingdom TO ${h.roles[0]!.kingdom}`,
                );
                await expect(check()).rejects.toThrow("Unsafe database service role");
            }
            finally
            {
                await realm.query(
                    `REVOKE CREATE ON SCHEMA opencok_kingdom FROM ${h.roles[0]!.kingdom}`,
                );
            }
            await check();
        }
        finally
        {
            await Promise.all([kingdom.close(), global.close()]);
        }
    },
    30000,
);

test(
    "permission drift removes readiness and mismatched realm credentials fail startup",
    async () => {
        const worker = await h.start(2);
        const realm = h.kingdoms[1]!;
        const role = h.roles[1]!.kingdom;
        const readiness = async () =>
            (await fetch(`http://127.0.0.1:${worker.port}/health/ready`)).status;
        try
        {
            await eventually(async () => await readiness() === 200);
            await expect(createMailWorkerApplication({ ...h.config(2), kingdomId: 1 })).rejects
                .toThrow("Mail worker startup failed");
            await realm.pool.query(`GRANT UPDATE ON opencok_kingdom.user_resource TO ${role}`);
            await eventually(async () => await readiness() === 503);
            expect((await fetch(`http://127.0.0.1:${worker.port}/health/live`)).status).toBe(200);
            await expect(createMailWorkerApplication(h.config(2))).rejects
                .toThrow("Mail worker startup failed");
            const gift = await h.gift(2, "permission-drift");
            await Bun.sleep(1300);
            expect(await h.pending(2, "gift")).toBe(1);
            expect(
                (await h.global.pool.query(
                    "SELECT \"isOpened\" FROM opencok_global.mail_gift_log WHERE uid=$1",
                    [gift.uid],
                )).rows[0].isOpened,
            ).toBe(0);
            await realm.pool.query(`REVOKE UPDATE ON opencok_kingdom.user_resource FROM ${role}`);
            await eventually(async () => await readiness() === 200);
            await eventually(async () => await h.pending(2, "gift") === 0);
        }
        finally
        {
            await realm.pool.query(`REVOKE UPDATE ON opencok_kingdom.user_resource FROM ${role}`);
            await worker.close();
        }
    },
    30000,
);

test(
    "SIGTERM drains an admitted remote effect and restart resumes only the remaining intents",
    async () => {
        const entered = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        const worker = await h.start(1, 5000);
        h.chat.control.afterApply = async () => {
            entered.resolve();
            await release.promise;
        };
        let next: Awaited<ReturnType<typeof h.start>> | undefined;
        try
        {
            await h.intent(1);
            await h.intent(1, undefined, Date.now() + 1);
            await bounded(entered.promise);
            let exited = false;
            const stopping = worker.stop().then((code) => {
                exited = true;
                return code;
            });
            await Bun.sleep(30);
            expect(exited).toBe(false);
            release.resolve();
            expect(await bounded(stopping)).toBe(0);
            expect(await h.pending(1, "chat")).toBe(1);
            h.chat.control.afterApply = undefined;
            next = await h.start(1);
            await eventually(async () => await h.pending(1, "chat") === 0);
        }
        finally
        {
            release.resolve();
            h.chat.control.afterApply = undefined;
            await worker.close();
            await next?.close();
        }
    },
    30000,
);

test(
    "SIGTERM is bounded by remote timeout and preserves an unacknowledged committed effect",
    async () => {
        const worker = await h.start(1, 1000);
        const entered = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        h.chat.control.afterApply = async () => {
            entered.resolve();
            await release.promise;
        };
        let recovered: Awaited<ReturnType<typeof h.start>> | undefined;
        try
        {
            const operation = await h.intent(1);
            await bounded(entered.promise);
            expect(await bounded(worker.stop(), 5000)).toBe(0);
            expect(await h.pending(1, "chat")).toBe(1);
            expect(
                (await h.global.pool.query(
                    "SELECT count(*)::int AS count FROM opencok_chat.chat_mailbox_receipt WHERE operation_id=$1",
                    [operation],
                )).rows[0].count,
            ).toBe(1);
            release.resolve();
            h.chat.control.afterApply = undefined;
            recovered = await h.start(1);
            await eventually(async () => await h.pending(1, "chat") === 0);
            expect(
                h.chat.deliveries.filter((delivery) => delivery.operation === operation).map((
                    delivery,
                ) => delivery.result),
            ).toEqual(["applied", "unchanged"]);
        }
        finally
        {
            release.resolve();
            h.chat.control.afterApply = undefined;
            await worker.close();
            await recovered?.close();
        }
    },
    30000,
);

test(
    "the production worker entrypoint validates environment, becomes ready and finalizes on SIGTERM",
    async () => {
        const reservation = createServer();
        await new Promise<void>((resolve) => reservation.listen(0, "127.0.0.1", resolve));
        const address = reservation.address();
        if (!address || typeof address === "string")
        {
            throw new Error("Missing entrypoint port");
        }
        await new Promise<void>((resolve, reject) =>
            reservation.close((error) => error ? reject(error) : resolve())
        );
        const config = h.config(2);
        const env = {
            MAIL_INTEGRATION_MODE: "external",
            KINGDOM_ID: "2",
            KINGDOM_DATABASE_NAME: h.names.kingdoms[1]!,
            GLOBAL_DATABASE_NAME: h.names.global,
            MAIL_WORKER_KINGDOM_URL: config.kingdomUrl,
            MAIL_WORKER_GLOBAL_URL: config.globalUrl,
            MAIL_WORKER_HEALTH_HOST: "127.0.0.1",
            MAIL_WORKER_HEALTH_PORT: String(address.port),
            MAIL_WORKER_TIMEOUT_MS: "1000",
            MAIL_WORKER_POLL_MS: "1000",
            CHAT_URL: new URL(h.chat.url).origin,
            MAIL_WORKER_CHAT_SECRET: config.chat!.signingSecret,
            NODE_ENV: "test",
        };
        const child = Bun.spawn([
            process.execPath,
            "--no-env-file",
            new URL("../src/index.ts", import.meta.url).pathname,
        ], { env, stdout: "pipe", stderr: "ignore" });
        const output = new Response(child.stdout).text();
        try
        {
            await eventually(async () => {
                if (child.exitCode !== null)
                {
                    throw new Error("Production entrypoint exited before readiness");
                }
                try
                {
                    return (await fetch(`http://127.0.0.1:${address.port}/health/ready`)).status
                        === 200;
                }
                catch
                {
                    return false;
                }
            }, 20000);
            expect((await fetch(`http://127.0.0.1:${address.port}/health/live`)).status).toBe(200);
            child.kill("SIGTERM");
            expect(await bounded(child.exited)).toBe(130);
            expect(await output).toContain("\"event\":\"stopped\"");
            const invalid = Bun.spawn([
                process.execPath,
                "--no-env-file",
                new URL("../src/index.ts", import.meta.url).pathname,
            ], {
                env: { ...env, MAIL_INTEGRATION_MODE: "local" },
                stdout: "ignore",
                stderr: "ignore",
            });
            try
            {
                expect(await bounded(invalid.exited)).not.toBe(0);
            }
            finally
            {
                if (invalid.exitCode === null)
                {
                    invalid.kill("SIGKILL");
                    await invalid.exited;
                }
            }
        }
        finally
        {
            if (child.exitCode === null)
            {
                child.kill("SIGKILL");
                await child.exited;
            }
        }
    },
    30000,
);
