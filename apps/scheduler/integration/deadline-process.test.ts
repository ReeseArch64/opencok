import { afterAll, beforeAll, expect, test } from "bun:test";
import { createServer } from "node:net";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { and, eq } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { sfs } from "@opencok/messages/sfs";
import { ActivityDispatchResult as Result } from "@opencok/queues/enums/dispatch-result";
import { checkSchedulerPermissions } from "@opencok/queues/repositories/scheduler-permissions";
import { schedulerHarness } from "./support/fixture";
import { bounded, eventually } from "./support/process";

let h: Awaited<ReturnType<typeof schedulerHarness>>;
beforeAll(async () => {
    h = await schedulerHarness();
    await h.startOwner(1);
    await h.startOwner(2);
    await h.provision();
}, 120000);
afterAll(async () => {
    await h?.close();
}, 60000);

async function start(uid: string, realm = 1, now = Date.now())
{
    await h.seedOwner(realm, uid, now);
    await h.command(realm, "build.upgrade", {
        uuid: sfs.string(`${uid}-413000`),
        gold: sfs.int(0),
        operationId: sfs.string(randomUUID()),
    }, uid);
    return h.active(realm, 0, uid);
}
async function level(uid: string, realm = 1)
{
    const [row] = await h.kingdoms[realm - 1]!.db.select().from(user_building).where(
        eq(user_building.uuid, `${uid}-413000`),
    );
    return row!.level;
}
async function receiptCount(uid: string, requestId: string, realm = 1)
{
    return (await h.kingdoms[realm - 1]!.db.select().from(command_receipt).where(
        and(eq(command_receipt.ownerUid, uid), eq(command_receipt.requestId, requestId)),
    )).length;
}

test(
    "signed discovery waits for the owner's exact deadline and shares reconnect receipts",
    async () => {
        const row = await start("exact");
        await h.owner(1).request("clock", { now: Number(row.dueAt) - 1 });
        expect(await h.publisher(1).finish(row)).toBe(Result.NotDue);
        expect(await level("exact")).toBe(1);
        expect(await receiptCount("exact", `finish:${row.id}:${row.version}`)).toBe(0);
        await h.owner(1).request("clock", { now: Number(row.dueAt) });
        await Promise.all([
            h.publisher(1).finish(row),
            h.publisher(1).finish(row),
            h.owner(1).request("recover", { owner: "exact" }),
        ]);
        expect(await level("exact")).toBe(2);
        expect(await receiptCount("exact", `finish:${row.id}:${row.version}`)).toBe(1);
        await expect(h.publisher(1, 1000, 2).capabilities()).rejects.toThrow(
            "Activity owner unavailable",
        );
        expect(await h.publisher(1).capabilities()).toEqual([
            0,
            1,
            2,
            3,
            6,
            8,
            9,
            10,
            11,
            12,
            17,
            19,
        ]);
    },
    30000,
);

test("cancelled generations and accelerated snapshots cannot finish reused queues", async () => {
    const first = await start("cancelled");
    await h.command(
        1,
        "queue.cancel",
        {
            uuid: sfs.string(first.queueId),
            activityId: sfs.string(first.id),
            operationId: sfs.string(randomUUID()),
        },
        "cancelled",
        true,
    );
    await h.command(
        1,
        "build.upgrade",
        { uuid: sfs.string("cancelled-413000"), gold: sfs.int(0) },
        "cancelled",
    );
    const replacement = await h.active(1, 0, "cancelled");
    expect(replacement.id).not.toBe(first.id);
    await h.owner(1).request("clock", { now: Number(first.dueAt) + 10000 });
    expect(await h.publisher(1).finish(first)).toBe(Result.Obsolete);
    expect(await level("cancelled")).toBe(1);
    expect(await h.publisher(1).finish(replacement)).toBe(Result.Applied);
    const accelerated = await start("accelerated");
    await h.command(
        1,
        "queue.ccd",
        {
            qUUID: sfs.string(accelerated.queueId),
            isGold: sfs.int(1),
            operationId: sfs.string(randomUUID()),
        },
        "accelerated",
        true,
    );
    expect(await h.publisher(1).finish(accelerated)).toBe(Result.Obsolete);
    expect(await level("accelerated")).toBe(2);
}, 30000);

test("out-of-order delivery cannot advance later economic checkpoints first", async () => {
    const construction = await start("ordered");
    await h.command(
        1,
        "science.research",
        { itemId: sfs.string("700100"), gold: sfs.int(0) },
        "ordered",
    );
    const research = await h.active(1, 6, "ordered");
    const rows = [construction, research].sort((a, b) =>
        Number(a.dueAt - b.dueAt) || a.id.localeCompare(b.id)
    );
    await h.owner(1).request("clock", { now: Number(rows[1]!.dueAt) + 3600000 });
    expect(await h.publisher(1).finish(rows[1]!)).toBe(Result.Blocked);
    expect(await h.publisher(1).finish(rows[0]!)).toBe(Result.Applied);
    expect(await h.publisher(1).finish(rows[1]!)).toBe(Result.Applied);
    expect(await receiptCount("ordered", `finish:${rows[0]!.id}:${rows[0]!.version}`)).toBe(1);
    expect(await receiptCount("ordered", `finish:${rows[1]!.id}:${rows[1]!.version}`)).toBe(1);
}, 30000);

test(
    "legacy import checks its fingerprint and does not charge the saved activity twice",
    async () => {
        const original = await start("legacy");
        const db = h.kingdoms[0]!.db;
        await db.delete(timed_activity).where(eq(timed_activity.id, original.id));
        const old = await h.legacy(1, original.queueId);
        await db.update(queue).set({ updateTime: old.updateTime + 1n }).where(
            eq(queue.uuid, old.uuid),
        );
        expect(await h.publisher(1).restore(old)).toBe(Result.Obsolete);
        const fresh = await h.legacy(1, original.queueId);
        expect(await h.publisher(1).restore(fresh)).toBe(Result.Applied);
        expect(await h.publisher(1).restore(fresh)).toBe(Result.Applied);
        const restored = await h.active(1, 0, "legacy");
        await h.owner(1).request("clock", { now: Number(restored.dueAt) });
        expect(await h.publisher(1).finish(restored)).toBe(Result.Applied);
        expect(await level("legacy")).toBe(2);
    },
    30000,
);

test("a lost HTTP acknowledgement and a killed owner preserve one committed result", async () => {
    const row = await start("lost-ack");
    await h.owner(1).request("clock", { now: Number(row.dueAt) });
    await h.owner(1).request("control", { afterCommitDelayMs: 2000 });
    await expect(h.publisher(1, 100).finish(row)).rejects.toThrow("Activity owner unavailable");
    await eventually(async () => await level("lost-ack") === 2);
    await h.owner(1).request("control", {});
    expect(await h.publisher(1).finish(row)).toBe(Result.Applied);
    expect(await receiptCount("lost-ack", `finish:${row.id}:${row.version}`)).toBe(1);
    const killed = await start("killed");
    const old = h.owner(1);
    await old.request("clock", { now: Number(killed.dueAt) });
    await old.request("control", { afterCommitDelayMs: 10000 });
    const response = h.publisher(1, 1000).finish(killed).catch(() => undefined);
    await eventually(async () => (await level("killed")) === 2);
    await old.crash();
    await response;
    const replacement = await h.startOwner(
        1,
        false,
        Number(killed.dueAt),
        Number(old.address.port),
    );
    expect(BigInt(String(replacement.address.epoch))).toBeGreaterThan(
        BigInt(String(old.address.epoch)),
    );
    expect(await h.publisher(1).finish(killed)).toBe(Result.Applied);
    expect(await receiptCount("killed", `finish:${killed.id}:${killed.version}`)).toBe(1);
}, 60000);

test(
    "replaced owners reject capabilities even while their HTTP listener remains alive",
    async () => {
        const old = h.owner(1);
        const oldPublisher = h.publisher(1);
        await h.startOwner(1, false);
        await expect(oldPublisher.capabilities()).rejects.toThrow("Activity owner unavailable");
        expect(await h.publisher(1).capabilities()).toHaveLength(12);
        await old.close();
    },
    30000,
);

test("two isolated scheduler processes recover independently after an owner outage", async () => {
    const left = await start("isolated-left", 1, Date.now() - 3600000);
    const right = await start("isolated-right", 2, Date.now() - 3600000);
    const now = Math.max(Number(left.dueAt), Number(right.dueAt));
    await h.owner(1).request("clock", { now });
    await h.owner(2).request("clock", { now });
    await h.owner(1).request("control", { available: false });
    const schedulers = [await h.startScheduler(1), await h.startScheduler(2)];
    await eventually(async () => await level("isolated-right", 2) === 2);
    expect(await level("isolated-left", 1)).toBe(1);
    await h.owner(1).request("control", {});
    await eventually(async () => await level("isolated-left", 1) === 2);
    await Promise.all(schedulers.map(child => child.close()));
}, 30000);

test(
    "scheduler credentials expose only scheduling columns and detect privilege drift",
    async () => {
        const role = h.roles[0]!;
        const restricted = createDatabase("kingdom", {
            connectionString: h.databaseUrl(1),
            max: 1,
        });
        try
        {
            await checkSchedulerPermissions(restricted.db, 1);
            await expect(checkSchedulerPermissions(restricted.db, 2)).rejects.toThrow();
            const denied = [
                "SELECT data FROM opencok_kingdom.timed_activity",
                "SELECT * FROM opencok_kingdom.user_resource",
                "UPDATE opencok_kingdom.timed_activity SET status=1",
                "DELETE FROM opencok_kingdom.queue",
                "INSERT INTO opencok_kingdom.queue DEFAULT VALUES",
                "UPDATE scheduler_access.binding SET kingdom_id=2",
                "CREATE TABLE public.scheduler_escape (id integer)",
            ];
            for (const query of denied)
            {
                await expect(restricted.pool.query(query)).rejects.toThrow();
            }
            const foreign = new Pool({
                connectionString: h.databaseUrl(1).replace(h.names[0]!, h.names[1]!),
                max: 1,
            });
            try
            {
                await expect(foreign.query("SELECT uuid FROM opencok_kingdom.queue")).rejects
                    .toThrow();
            }
            finally
            {
                await foreign.end();
            }
            await h.kingdoms[0]!.pool.query(
                `GRANT SELECT (data) ON opencok_kingdom.timed_activity TO ${role.role}`,
            );
            await expect(checkSchedulerPermissions(restricted.db, 1)).rejects.toThrow();
            await h.kingdoms[0]!.pool.query(
                `REVOKE SELECT (data) ON opencok_kingdom.timed_activity FROM ${role.role}`,
            );
            await checkSchedulerPermissions(restricted.db, 1);
        }
        finally
        {
            await restricted.close();
        }
    },
    30000,
);

test(
    "a poison owner larger than one page cannot starve another owner or authorize unsupported types",
    async () => {
        const healthy = await start("fair-healthy", 2, Date.now() - 3600000);
        await h.owner(2).request("clock", { now: Date.now() });
        const pool = h.kingdoms[1]!.pool;
        await pool.query(
            `INSERT INTO opencok_kingdom.queue (uuid,"ownerId",qid,type,"itemId","startTime","endTime","updateTime") SELECT 'poison-q-'||n,'missing-owner',n,0,'missing-building',0,9223372036854775807,1 FROM generate_series(1,70) n`,
        );
        await pool.query(
            `INSERT INTO opencok_kingdom.timed_activity (id,"ownerId","queueId",type,"itemId","startedAt","dueAt",version,status,data) SELECT 'poison-a-'||lpad(n::text,3,'0'),'missing-owner','poison-q-'||n,0,'missing-building',0,1,1,0,'{}'::jsonb FROM generate_series(1,70) n`,
        );
        await pool.query(
            `INSERT INTO opencok_kingdom.timed_activity (id,"ownerId","queueId",type,"itemId","startedAt","dueAt",version,status,data) VALUES ('unsupported-a','missing-owner','unsupported-q',41,'unsupported',0,1,1,0,'{}')`,
        );
        const scheduler = await h.startScheduler(2, false);
        try
        {
            const first = await scheduler.request<
                { scannedDue: number; skippedOwnerBudget: number; failed: number; }
            >("run");
            expect(first.scannedDue).toBe(64);
            expect(first.skippedOwnerBudget).toBe(60);
            expect(first.failed).toBe(4);
            expect(await level("fair-healthy", 2)).toBe(1);
            await scheduler.request("run");
            expect(await level("fair-healthy", 2)).toBe(2);
            expect(await receiptCount("fair-healthy", `finish:${healthy.id}:${healthy.version}`, 2))
                .toBe(1);
            const rows = await pool.query(
                `SELECT status,count(*)::integer AS count FROM opencok_kingdom.timed_activity WHERE id LIKE 'poison-a-%' OR id='unsupported-a' GROUP BY status`,
            );
            expect(rows.rows).toEqual([{ status: 0, count: 71 }]);
        }
        finally
        {
            await scheduler.close();
            await pool.query(
                `DELETE FROM opencok_kingdom.timed_activity WHERE id LIKE 'poison-a-%' OR id='unsupported-a'`,
            );
            await pool.query(`DELETE FROM opencok_kingdom.queue WHERE uuid LIKE 'poison-q-%'`);
        }
    },
    30000,
);

test(
    "PUBLIC grants, inherited roles and callable privileged functions fail the exact permission audit",
    async () => {
        const restricted = createDatabase("kingdom", {
            connectionString: h.databaseUrl(2),
            max: 1,
        });
        const pool = h.kingdoms[1]!.pool;
        const role = h.roles[1]!.role;
        try
        {
            await pool.query("GRANT SELECT (data) ON opencok_kingdom.timed_activity TO PUBLIC");
            await expect(checkSchedulerPermissions(restricted.db, 2)).rejects.toThrow();
            await pool.query("REVOKE SELECT (data) ON opencok_kingdom.timed_activity FROM PUBLIC");
            await pool.query("CREATE ROLE scheduler_inherited NOLOGIN");
            await pool.query(`GRANT scheduler_inherited TO ${role}`);
            await expect(checkSchedulerPermissions(restricted.db, 2)).rejects.toThrow();
            await pool.query(`REVOKE scheduler_inherited FROM ${role}`);
            await pool.query(
                `CREATE FUNCTION public.scheduler_escape() RETURNS integer LANGUAGE sql SECURITY DEFINER AS 'SELECT 1'`,
            );
            await expect(checkSchedulerPermissions(restricted.db, 2)).rejects.toThrow();
            await pool.query("DROP FUNCTION public.scheduler_escape()");
            await pool.query("CREATE SCHEMA pgxtempx");
            await pool.query("CREATE TABLE pgxtempx.synthetic (id integer)");
            await pool.query(`GRANT USAGE ON SCHEMA pgxtempx TO ${role}`);
            await pool.query(`GRANT SELECT ON pgxtempx.synthetic TO ${role}`);
            await expect(checkSchedulerPermissions(restricted.db, 2)).rejects.toThrow();
            await pool.query("DROP SCHEMA pgxtempx CASCADE");
            await checkSchedulerPermissions(restricted.db, 2);
        }
        finally
        {
            await pool.query("REVOKE SELECT (data) ON opencok_kingdom.timed_activity FROM PUBLIC");
            await pool.query("DROP FUNCTION IF EXISTS public.scheduler_escape()");
            await pool.query("DROP SCHEMA IF EXISTS pgxtempx CASCADE");
            await pool.query(`REVOKE scheduler_inherited FROM ${role}`);
            await pool.query("DROP ROLE scheduler_inherited");
            await restricted.close();
        }
    },
    30000,
);

test(
    "the production scheduler entrypoint loses readiness on privilege drift and drains on SIGTERM",
    async () => {
        const reservation = createServer();
        await new Promise<void>(resolve => reservation.listen(0, "127.0.0.1", resolve));
        const address = reservation.address();
        if (!address || typeof address === "string")
        {
            throw new Error("Missing scheduler port");
        }
        await new Promise<void>((resolve, reject) =>
            reservation.close(error => error ? reject(error) : resolve())
        );
        const config = h.config(2);
        const child = Bun.spawn([
            process.execPath,
            "--no-env-file",
            new URL("../src/index.ts", import.meta.url).pathname,
        ], {
            env: {
                ACTIVITY_SCHEDULER_MODE: "external",
                ACTIVITY_SCHEDULER_SECRET: config.signingSecret,
                KINGDOM_ID: "2",
                KINGDOM_DATABASE_NAME: h.names[1]!,
                SCHEDULER_DATABASE_URL: config.databaseUrl,
                SCHEDULER_OWNER_URL: new URL(config.ownerUrl).origin,
                SCHEDULER_HEALTH_HOST: "127.0.0.1",
                SCHEDULER_HEALTH_PORT: String(address.port),
                SCHEDULER_TIMEOUT_MS: "1000",
                SCHEDULER_POLL_MS: "100",
                NODE_ENV: "test",
            },
            stdout: "pipe",
            stderr: "ignore",
        });
        const output = new Response(child.stdout).text();
        const health = `http://127.0.0.1:${address.port}`;
        const ready = async (status: number) => {
            if (child.exitCode !== null)
            {
                throw new Error("Production scheduler exited before readiness");
            }
            try
            {
                return (await fetch(`${health}/health/ready`)).status === status;
            }
            catch
            {
                return false;
            }
        };
        try
        {
            await eventually(() => ready(200), 20000);
            await h.kingdoms[1]!.pool.query(
                `GRANT SELECT (data) ON opencok_kingdom.timed_activity TO ${h.roles[1]!.role}`,
            );
            await eventually(() => ready(503));
            expect((await fetch(`${health}/health/live`)).status).toBe(200);
            await h.kingdoms[1]!.pool.query(
                `REVOKE SELECT (data) ON opencok_kingdom.timed_activity FROM ${h.roles[1]!.role}`,
            );
            await eventually(() => ready(200));
            child.kill("SIGTERM");
            expect(await bounded(child.exited)).toBe(130);
            expect(await output).toContain("\"event\":\"stopped\"");
        }
        finally
        {
            await h.kingdoms[1]!.pool.query(
                `REVOKE SELECT (data) ON opencok_kingdom.timed_activity FROM ${h.roles[1]!.role}`,
            );
            if (child.exitCode === null)
            {
                child.kill("SIGKILL");
                await child.exited;
            }
        }
    },
    30000,
);

test(
    "killing an owner before receipt commit rolls back the effect and allows recovery",
    async () => {
        const row = await start("before-commit");
        const old = h.owner(1);
        await old.request("clock", { now: Number(row.dueAt) });
        const pool = h.kingdoms[0]!.pool;
        const lock = await pool.connect();
        let killed = false;
        try
        {
            await lock.query("SELECT pg_advisory_lock(558699)");
            await pool.query(
                `CREATE FUNCTION opencok_kingdom.block_scheduler_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.command='queue.finish' AND NEW."ownerUid"='before-commit' THEN PERFORM pg_advisory_xact_lock(558699); END IF; RETURN NEW; END $$`,
            );
            await pool.query(
                "CREATE TRIGGER block_scheduler_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.block_scheduler_receipt()",
            );
            const response = h.publisher(1, 10000).finish(row).catch(() => undefined);
            await eventually(async () =>
                (await pool.query(
                    `SELECT count(*)::integer AS count FROM pg_stat_activity WHERE datname=$1 AND wait_event='advisory'`,
                    [h.names[0]],
                )).rows[0].count === 1
            );
            expect(await level("before-commit")).toBe(1);
            expect(await receiptCount("before-commit", `finish:${row.id}:${row.version}`)).toBe(0);
            await old.crash();
            killed = true;
            await response;
            await lock.query("SELECT pg_advisory_unlock(558699)");
            await pool.query(
                "DROP TRIGGER block_scheduler_receipt ON opencok_kingdom.command_receipt",
            );
            await pool.query("DROP FUNCTION opencok_kingdom.block_scheduler_receipt()");
            expect((await h.active(1, 0, "before-commit")).version).toBe(row.version);
            const replacement = await h.startOwner(
                1,
                false,
                Number(row.dueAt),
                Number(old.address.port),
            );
            expect(BigInt(String(replacement.address.epoch))).toBeGreaterThan(
                BigInt(String(old.address.epoch)),
            );
            expect(await h.publisher(1).finish(row)).toBe(Result.Applied);
            expect(await level("before-commit")).toBe(2);
            expect(await receiptCount("before-commit", `finish:${row.id}:${row.version}`)).toBe(1);
        }
        finally
        {
            await lock.query("SELECT pg_advisory_unlock(558699)");
            lock.release();
            await pool.query(
                "DROP TRIGGER IF EXISTS block_scheduler_receipt ON opencok_kingdom.command_receipt",
            );
            await pool.query("DROP FUNCTION IF EXISTS opencok_kingdom.block_scheduler_receipt()");
            if (killed && h.owner(1) === old)
            {
                await h.startOwner(1, false);
            }
        }
    },
    30000,
);

test(
    "scheduler crashes before dispatch and after commit recover entirely from PostgreSQL",
    async () => {
        const pending = await start("scheduler-restart", 2, Date.now() - 3600000);
        await h.owner(2).request("clock", { now: Date.now() });
        await h.owner(2).request("control", { available: false });
        const first = await h.startScheduler(2, false);
        const failed = await first.request<{ ready: boolean; }>("run");
        expect(failed.ready).toBe(false);
        await first.crash();
        expect(await level("scheduler-restart", 2)).toBe(1);
        await h.owner(2).request("control", { afterCommitDelayMs: 10000 });
        const afterCommit = await h.startScheduler(2, true, { timeoutMs: 5000 });
        await eventually(async () => await level("scheduler-restart", 2) === 2);
        await afterCommit.crash();
        await h.owner(2).request("control", {});
        const replacement = await h.startScheduler(2);
        try
        {
            await eventually(async () =>
                (await replacement.request<{ ready: boolean; }>("status")).ready
            );
            expect(await level("scheduler-restart", 2)).toBe(2);
            expect(
                await receiptCount(
                    "scheduler-restart",
                    `finish:${pending.id}:${pending.version}`,
                    2,
                ),
            ).toBe(1);
            const state = await h.kingdoms[1]!.db.select().from(timed_activity).where(
                eq(timed_activity.id, pending.id),
            );
            expect(state[0]!.status).toBe(1);
        }
        finally
        {
            await replacement.close();
        }
    },
    30000,
);
