import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { createActivityDeadlinePublisher } from "@opencok/queues/connection/deadline";
import type {
    DueActivitySnapshot,
    LegacyActivitySnapshot,
} from "@opencok/queues/contracts/deadline";
import { decode, encode, type Fields } from "@opencok/messages/sfs";
import { DisposablePostgres } from "../../../../packages/drizzle/tests/support/postgres";
import { provisionSchedulerRole } from "../../scripts/scheduler-role-provisioning";
import { childProcess } from "./process";
import type { SchedulerConfig } from "../../src/config";

export async function schedulerHarness(
    ownerPath = new URL("./owner-worker.ts", import.meta.url).pathname,
)
{
    const postgres = new DisposablePostgres();
    const admin = await postgres.start();
    const names = ["scheduler_realm_1", "scheduler_realm_2"];
    try
    {
        for (const name of names)
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
    const kingdoms = names.map((database) =>
        createDatabase("kingdom", { ...postgres.options, database, max: 4 })
    );
    const roles = [1, 2].map((id) => ({
        id,
        role: `scheduler_realm_${id}`,
        password: randomBytes(24).toString("hex"),
        secret: randomBytes(32).toString("hex"),
    }));
    const children = new Set<Awaited<ReturnType<typeof childProcess>>>();
    const owners = new Map<number, Awaited<ReturnType<typeof childProcess>>>();
    const close = async () => {
        try
        {
            await Promise.all([...children].map((child) => child.close()));
        }
        finally
        {
            await Promise.all([admin.end(), ...kingdoms.map((db) => db.close())]);
            await postgres.stop();
        }
    };
    const startOwner = async (id: number, seed = true, now?: number, port?: number) => {
        const child = await childProcess(ownerPath, {
            kingdomId: id,
            connection: { ...postgres.options, database: names[id - 1] },
            secret: roles[id - 1]!.secret,
            seed,
            now,
            port,
        });
        children.add(child);
        owners.set(id, child);
        return child;
    };
    const owner = (id: number) => {
        const child = owners.get(id);
        if (!child)
        {
            throw new Error("Synthetic owner not started");
        }
        return child;
    };
    const publisher = (id: number, timeoutMs = 1000, signer = id, port = owner(id).address.port) =>
        createActivityDeadlinePublisher({
            url: `http://127.0.0.1:${port}/_internal/activity-deadlines`,
            kingdomId: id,
            signingSecret: roles[signer - 1]!.secret,
            timeoutMs,
        });
    const command = async (
        id: number,
        name: string,
        fields: Fields,
        uid = "owner",
        timed = false,
    ) => {
        const result = await owner(id).request<string>(timed ? "timed" : "command", {
            command: name,
            body: Buffer.from(encode(fields)).toString("base64"),
            owner: uid,
        });
        return decode(Buffer.from(result, "base64"));
    };
    const active = async (id: number, type = 0, uid = "owner"): Promise<DueActivitySnapshot> => {
        const [row] = await kingdoms[id - 1]!.db.select({
            id: timed_activity.id,
            ownerId: timed_activity.ownerId,
            queueId: timed_activity.queueId,
            type: timed_activity.type,
            dueAt: timed_activity.dueAt,
            version: timed_activity.version,
        }).from(timed_activity).where(
            and(
                eq(timed_activity.ownerId, uid),
                eq(timed_activity.type, type),
                eq(timed_activity.status, 0),
            ),
        );
        if (!row)
        {
            throw new Error("Missing synthetic active activity");
        }
        return row;
    };
    const legacy = async (id: number, uuid = "owner-q0"): Promise<LegacyActivitySnapshot> => {
        const [row] = await kingdoms[id - 1]!.db.select({
            uuid: queue.uuid,
            ownerId: queue.ownerId,
            type: queue.type,
            itemId: queue.itemId,
            startTime: queue.startTime,
            updateTime: queue.updateTime,
        }).from(queue).where(eq(queue.uuid, uuid));
        if (!row || row.itemId === null)
        {
            throw new Error("Missing synthetic legacy activity");
        }
        return { ...row, itemId: row.itemId };
    };
    const databaseUrl = (id: number) => {
        const role = roles[id - 1]!;
        const url = new URL(`postgresql://127.0.0.1:${postgres.options.port}/${names[id - 1]}`);
        url.username = role.role;
        url.password = role.password;
        return url.href;
    };
    const config = (id: number): SchedulerConfig => ({
        kingdomId: id,
        databaseUrl: databaseUrl(id),
        ownerUrl: `http://127.0.0.1:${owner(id).address.port}/_internal/activity-deadlines`,
        signingSecret: roles[id - 1]!.secret,
        healthHost: "127.0.0.1",
        healthPort: 0,
        timeoutMs: 1000,
        intervalMs: 100,
        poolSize: 2,
        batchSize: 64,
        ownerBudget: 4,
    });
    return {
        postgres,
        admin,
        names,
        kingdoms,
        roles,
        children,
        owners,
        close,
        startOwner,
        owner,
        publisher,
        command,
        active,
        legacy,
        async seedOwner(id: number, uid: string, now = Date.now())
        {
            const db = kingdoms[id - 1]!.db;
            const [profile] = await db.select().from(userprofile).where(
                eq(userprofile.uid, "other"),
            );
            const [resource] = await db.select().from(user_resource).where(
                eq(user_resource.uid, "other"),
            );
            const [info] = await db.select().from(playerinfo).where(eq(playerinfo.uid, "other"));
            const buildings = await db.select().from(user_building).where(
                eq(user_building.uid, "other"),
            );
            const queues = await db.select().from(queue).where(eq(queue.ownerId, "other"));
            await db.transaction(async (tx) => {
                await tx.insert(userprofile).values({ ...profile!, uid });
                await tx.insert(user_resource).values({
                    ...resource!,
                    uid,
                    lastUpdateTime: BigInt(now),
                });
                await tx.insert(playerinfo).values({ ...info!, uid });
                await tx.insert(user_building).values(
                    buildings.map((row) => ({
                        ...row,
                        uid,
                        uuid: row.uuid.replace("other-", `${uid}-`),
                        refreshTime: BigInt(now),
                    })),
                );
                await tx.insert(queue).values(
                    queues.map((row) => ({
                        ...row,
                        ownerId: uid,
                        uuid: row.uuid.replace("other-", `${uid}-`),
                    })),
                );
            });
            await owner(id).request("clock", { now });
        },
        async provision()
        {
            for (const role of roles)
            {
                await provisionSchedulerRole({
                    kingdom: kingdoms[role.id - 1]!.pool,
                    kingdomId: role.id,
                    role: role.role,
                    password: role.password,
                });
            }
        },
        databaseUrl,
        config,
        async startScheduler(id: number, automatic = true, overrides: Partial<SchedulerConfig> = {})
        {
            const child = await childProcess(
                new URL("./scheduler-worker.ts", import.meta.url).pathname,
                {
                    scheduler: { ...config(id), ...overrides },
                    automatic,
                },
            );
            children.add(child);
            return child;
        },
    };
}
