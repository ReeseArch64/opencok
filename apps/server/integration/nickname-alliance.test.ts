import { afterAll, beforeAll, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_alliance_task } from "@opencok/drizzle/schema/opencok_kingdom/user_alliance_task";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { createRealmNotifications } from "@opencok/connection/notifications";
import type { NicknameAllianceTask } from "@opencok/contracts/nickname-change";
import type { Rules } from "@opencok/rules/game";
import { createNicknameChangeRuntime } from "../src/nickname-change.ts";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

const pg = new DisposablePostgres();
const topology = {
    globalDatabase: "alliance_global",
    kingdoms: [
        { id: 1, database: "alliance_realm_1" },
        { id: 2, database: "alliance_realm_2" },
    ],
};
const now = 1792756800123;
let databases: ReturnType<typeof createDatabases>,
    nextOwner = 3100;
const realm = (id = 1) => databases.getKingdom(id);
function rules(): {
    items: Rules["items"];
    configuration: Rules["configuration"];
    mail: Rules["mail"];
}
{
    return {
        items: new Map([["function_on6", { k12: "all" }]]),
        configuration: { allianceTeleport: new Map([["46608", { function_on: "1", para1: "1" }]]) },
        mail: new Map([
            [
                "10113",
                {
                    type: "1",
                    category: "07",
                    title: "Synthetic task complete",
                    sender: "Synthetic sender",
                    message: "Synthetic alliance task result",
                    reward: "7,200100,1",
                },
            ],
        ]),
    };
}
function runtime(
    id = 1,
    catalogs = rules(),
    resolveMailReward?: (reward: string, owner: string) => string | null,
)
{
    return createNicknameChangeRuntime({
        databases,
        kingdomId: id,
        rules: { goods: new Map([["200021", { type: "17", price: "100" }]]) },
        refundRatio: async () => {
            throw new Error("CN1 state unavailable");
        },
        notifications: createRealmNotifications(),
        timeoutMs: 1000,
        report: () => {},
        alliance: { rules: catalogs, resolveMailReward },
    });
}
function taskRows(chat = 0, timer = 0, num = 0n): NicknameAllianceTask[]
{
    return [
        { id: "00000", state: 0, num: 11n },
        { id: "46600", state: chat, num: 9n },
        { id: "46608", state: 0, num: 13n },
        { id: "46609", state: timer, num },
    ];
}
async function seed(id = 1, rows = taskRows())
{
    const uid = String(++nextOwner);
    await realm(id)
        .db.insert(userprofile)
        .values({
            uid,
            name: `Before ${uid}`,
            country: "BR",
            level: 1,
            exp: 0,
            serverId: id,
            pf: "synthetic",
            gold: 300n,
        });
    await realm(id)
        .db.insert(user_item)
        .values({ uuid: `item-${uid}`, ownerId: uid, itemId: "200021", count: 3 });
    await databases.global.db.insert(account_new).values({
        gameUid: uid,
        server: String(id),
        uuid: "synthetic-device",
        gameUserName: `Before ${uid}`,
        gameUserLevel: 1,
        lastTime: 0n,
    });
    if (rows.length)
    {
        await realm(id)
            .db.insert(user_alliance_task)
            .values(rows.map((row) => ({ uid, itemId: `metadata-${row.id}`, ...row })));
    }
    return uid;
}
async function changed(uid: string, id = 1, catalogs = rules())
{
    const instance = runtime(id, catalogs),
        operationId = randomUUID();
    await instance.change(uid, operationId, `After ${uid}`, now);
    return { instance, operationId };
}
async function tasks(uid: string, id = 1)
{
    const rows = await realm(id)
        .db.select()
        .from(user_alliance_task)
        .where(eq(user_alliance_task.uid, uid));
    return Object.fromEntries(rows.map((row) => [row.id, row]));
}
const letters = (uid: string, id = 1) =>
    realm(id).db.select().from(mail).where(eq(mail.toUser, uid));
async function paidOnce(uid: string, id = 1)
{
    expect(
        (await realm(id).db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]?.count,
    ).toBe(2);
    expect(
        (await realm(id).db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0],
    ).toMatchObject({ name: `After ${uid}`, chNameCount: "1", gold: 300n });
}
function loseCommit()
{
    const pool = realm().pool,
        original = pool.connect,
        connect = pool.connect.bind(pool);
    let armed = true;
    Object.defineProperty(pool, "connect", {
        configurable: true,
        value: (...args: unknown[]) => {
            if (args.length)
            {
                return Reflect.apply(original, pool, args);
            }
            return connect().then((client) => {
                let touched = false;
                return {
                    async query(...input: unknown[])
                    {
                        const first = input[0],
                            text = typeof first === "string"
                                ? first
                                : first && typeof first === "object" && "text" in first
                                ? first.text
                                : undefined;
                        if (typeof text === "string" && text.startsWith("begin"))
                        {
                            touched = false;
                        }
                        if (
                            typeof text === "string"
                            && text.startsWith("update \"opencok_kingdom\".\"nickname_change\"")
                        )
                        {
                            touched = true;
                        }
                        const result = await Reflect.apply(client.query, client, input);
                        if (armed && touched && text === "commit")
                        {
                            armed = false;
                            throw new Error("Synthetic lost commit reply");
                        }
                        return result;
                    },
                    release: (destroy?: boolean) => client.release(destroy),
                };
            });
        },
    });
    return {
        fired: () => !armed,
        restore: () => Object.defineProperty(pool, "connect", { value: original }),
    };
}

beforeAll(async () => {
    const admin = await pg.start();
    try
    {
        for (
            const name of [
                topology.globalDatabase,
                ...topology.kingdoms.map((entry) => entry.database),
            ]
        )
        {
            await admin.query(`CREATE DATABASE "${name}"`);
        }
    }
    finally
    {
        await admin.end();
    }
    databases = createDatabases(pg.options, topology);
    await migrateDatabase(databases.global.pool, "global");
    for (const entry of topology.kingdoms)
    {
        await migrateDatabase(realm(entry.id).pool, "kingdom");
    }
}, 120_000);
afterAll(async () => {
    try
    {
        await databases?.close();
    }
    finally
    {
        await pg.stop();
    }
}, 30_000);

test("committed nickname events update only the owned LORDNAME task in both kingdoms", async () => {
    const other = await seed();
    for (const id of [1, 2])
    {
        const uid = await seed(id),
            { instance, operationId } = await changed(uid, id);
        expect(await instance.deliverAlliance(uid, operationId, now)).toBe(true);
        expect(await tasks(uid, id)).toMatchObject({
            "46608": { state: 1, num: 13n, itemId: "metadata-46608" },
            "46600": { state: 0, num: 9n },
            "46609": { state: 0, num: 0n },
            "00000": { state: 0, num: 11n },
        });
        expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 30 });
        expect(await instance.deliverAlliance(uid, operationId, now + 1000)).toBe(false);
        expect(await letters(uid, id)).toEqual([]);
        await paidOnce(uid, id);
    }
    expect((await tasks(other))["46608"]?.state).toBe(0);
});

test("last ordinary prerequisite starts TIME once without prematurely mailing or completing it", async () => {
    for (const initial of [0n, 7n, -1n])
    {
        const uid = await seed(1, taskRows(1, 0, initial)),
            { instance, operationId } = await changed(uid);
        expect(await instance.deliverAlliance(uid, operationId, now)).toBe(true);
        expect((await tasks(uid))["46609"]).toMatchObject({
            state: 0,
            num: initial === 0n ? BigInt(now) : initial,
        });
        expect((await tasks(uid))["00000"]?.state).toBe(0);
        expect(await letters(uid)).toEqual([]);
    }
});

test("concurrent complete-task replay inserts one actual grouped system mail and closes INIT", async () => {
    const uid = await seed(1, taskRows(1, 1, 17n)),
        { instance, operationId } = await changed(uid);
    const attempts = await Promise.all(
        Array.from({ length: 12 }, () => instance.deliverAlliance(uid, operationId, now)),
    );
    expect(attempts.filter(Boolean)).toHaveLength(1);
    expect((await tasks(uid))["00000"]).toMatchObject({ state: 1, num: 11n });
    const messages = await letters(uid);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
        title: "Synthetic task complete",
        fromName: "Synthetic sender",
        type: 2,
        itemIdFlag: 1,
        status: 0,
        saveFlag: 0,
        createTime: BigInt(now),
        rewardStatus: 0,
    });
    expect(messages[0]!.uid).toMatch(/^[a-f0-9]{32}07$/);
    expect(messages[0]!.contents?.toString("utf8").replace(/\0+$/, "")).toBe(
        "Synthetic alliance task result",
    );
    expect(messages[0]!.rewardId?.replace(/\0+$/, "")).toBe("7,200100,1");
    expect(await realm().db.select().from(mail_group).where(eq(mail_group.uid, uid))).toMatchObject(
        [
            { groupType: 2, groupIndex: messages[0]!.uid },
        ],
    );
    expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 30 });
    await paidOnce(uid);
    const secondId = randomUUID();
    await instance.change(uid, secondId, `Another ${uid}`, now + 1);
    expect(await instance.deliverAlliance(uid, secondId, now + 1)).toBe(true);
    expect(await letters(uid)).toHaveLength(1);
});

test("disabled realm, absent task and completed lifecycle acknowledge their actual no-op paths", async () => {
    const disabled = rules();
    disabled.items.get("function_on6")!.k12 = "0";
    disabled.configuration = {};
    const uid = await seed(),
        before = await tasks(uid),
        { instance, operationId } = await changed(uid, 1, disabled);
    expect(await instance.deliverAlliance(uid, operationId, now)).toBe(true);
    expect(await tasks(uid)).toEqual(before);
    const missing = await seed(1, []),
        pending = await changed(missing);
    expect(await pending.instance.deliverAlliance(missing, pending.operationId, now)).toBe(true);
    expect(await tasks(missing)).toEqual({});
    const doneRows = taskRows();
    doneRows[0] = { ...doneRows[0]!, state: 1 };
    const done = await seed(1, doneRows),
        broken = rules();
    broken.items.clear();
    broken.configuration = {};
    const completed = await changed(done, 1, broken);
    expect(await completed.instance.deliverAlliance(done, completed.operationId, now)).toBe(true);
    expect((await tasks(done))["46608"]?.state).toBe(0);
});

test("reached catalog, malformed rows and missing lifecycle evidence keep the durable bit pending", async () => {
    for (
        const setup of [
            () => {
                const r = rules();
                r.configuration = {};
                return { r, rows: taskRows() };
            },
            () => {
                const r = rules();
                r.configuration.allianceTeleport!.get("46608")!.para1 = "bad";
                return { r, rows: taskRows() };
            },
            () => ({ r: rules(), rows: taskRows().slice(1) }),
            () => ({ r: rules(), rows: taskRows(1).slice(0, 3) }),
            () => ({ r: rules(), rows: [...taskRows(), { id: "unknown", state: 0, num: 0n }] }),
        ]
    )
    {
        const { r, rows } = setup(),
            uid = await seed(1, rows),
            before = await tasks(uid),
            pending = await changed(uid, 1, r);
        await expect(pending.instance.deliverAlliance(uid, pending.operationId, now)).rejects
            .toThrow();
        expect(await pending.instance.store.find(uid, pending.operationId)).toMatchObject({
            pendingEffects: 31,
        });
        expect(await tasks(uid)).toEqual(before);
        expect(await letters(uid)).toEqual([]);
        await paidOnce(uid);
    }
});

test("a failed task, system-mail insert or acknowledgment rolls back the entire local effect", async () => {
    for (
        const [table, timing] of [
            ["user_alliance_task", "UPDATE"],
            ["mail", "INSERT"],
            ["nickname_change", "UPDATE OF \"pendingEffects\""],
        ] as const
    )
    {
        const uid = await seed(1, taskRows(1, 1)),
            { instance, operationId } = await changed(uid),
            before = await tasks(uid);
        await realm().pool.query(
            "CREATE OR REPLACE FUNCTION public.reject_alliance_effect() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic alliance effect failure'; END $$",
        );
        await realm().pool.query(
            `CREATE TRIGGER reject_alliance_effect BEFORE ${timing} ON opencok_kingdom.${table} FOR EACH ROW EXECUTE FUNCTION public.reject_alliance_effect()`,
        );
        try
        {
            await expect(instance.deliverAlliance(uid, operationId, now)).rejects.toThrow();
            expect(await tasks(uid)).toEqual(before);
            expect(await letters(uid)).toEqual([]);
            expect(await instance.store.find(uid, operationId)).toMatchObject({
                pendingEffects: 31,
            });
        }
        finally
        {
            await realm().pool.query(
                `DROP TRIGGER reject_alliance_effect ON opencok_kingdom.${table}`,
            );
        }
        expect(await instance.deliverAlliance(uid, operationId, now + 1)).toBe(true);
        expect(await letters(uid)).toHaveLength(1);
        expect((await tasks(uid))["00000"]?.state).toBe(1);
        await paidOnce(uid);
    }
});

test("missing mail template follows the source skip while unresolved rewards retain all task work", async () => {
    const missing = rules();
    missing.mail.clear();
    const uid = await seed(1, taskRows(1, 1)),
        result = await changed(uid, 1, missing);
    expect(await result.instance.deliverAlliance(uid, result.operationId, now)).toBe(true);
    expect((await tasks(uid))["00000"]?.state).toBe(1);
    expect(await letters(uid)).toEqual([]);
    const catalogs = rules();
    catalogs.mail.get("10113")!.reward = "synthetic-reward-id";
    const other = await seed(1, taskRows(1, 1)),
        pending = await changed(other, 1, catalogs);
    await expect(pending.instance.deliverAlliance(other, pending.operationId, now)).rejects
        .toThrow();
    expect((await tasks(other))["00000"]?.state).toBe(0);
    expect(await pending.instance.store.find(other, pending.operationId)).toMatchObject({
        pendingEffects: 31,
    });
    const resolved = runtime(1, catalogs, (reward, owner) => {
        expect([reward, owner]).toEqual(["synthetic-reward-id", other]);
        return "7,200101,2";
    });
    expect(await resolved.deliverAlliance(other, pending.operationId, now)).toBe(true);
    expect((await letters(other))[0]!.rewardId?.replace(/\0+$/, "")).toBe("7,200101,2");
});

test("overflow system mail and its acknowledgment remain one transaction", async () => {
    const catalogs = rules(),
        text = "中".repeat(15000);
    catalogs.mail.get("10113")!.message = text;
    catalogs.mail.get("10113")!.type = "0";
    const uid = await seed(1, taskRows(1, 1)),
        { instance, operationId } = await changed(uid, 1, catalogs);
    await realm().pool.query(
        "CREATE OR REPLACE FUNCTION public.reject_alliance_effect() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic alliance effect failure'; END $$",
    );
    await realm().pool.query(
        "CREATE TRIGGER reject_alliance_effect BEFORE UPDATE OF \"pendingEffects\" ON opencok_kingdom.nickname_change FOR EACH ROW EXECUTE FUNCTION public.reject_alliance_effect()",
    );
    try
    {
        await expect(instance.deliverAlliance(uid, operationId, now)).rejects.toThrow();
        expect(await letters(uid)).toEqual([]);
        expect(
            await realm().db.select().from(mail_contents).where(eq(mail_contents.toUser, uid)),
        ).toEqual([]);
        expect((await tasks(uid))["00000"]?.state).toBe(0);
    }
    finally
    {
        await realm().pool.query(
            "DROP TRIGGER reject_alliance_effect ON opencok_kingdom.nickname_change",
        );
    }
    expect(await instance.deliverAlliance(uid, operationId, now)).toBe(true);
    const saved = (await letters(uid))[0]!;
    expect(saved.type).toBe(15);
    expect(saved.contents?.toString("utf8")).toBe("extra");
    const extra = await realm().db.select().from(mail_contents).where(
        eq(mail_contents.toUser, uid),
    );
    expect(extra).toHaveLength(1);
    expect(extra[0]!.uid).toBe(saved.uid);
    expect(extra[0]!.contents?.toString("utf8").replace(/\0+$/, "")).toBe(text);
    expect(await realm().db.select().from(mail_group).where(eq(mail_group.uid, uid))).toEqual([]);
});

test("foreign owner, wrong realm and unknown operation cannot mutate owned task state", async () => {
    const uid = await seed(),
        other = await seed(),
        { instance, operationId } = await changed(uid);
    await expect(instance.deliverAlliance(other, operationId, now)).rejects.toThrow();
    await expect(runtime(2).deliverAlliance(uid, operationId, now)).rejects.toThrow();
    expect(await instance.deliverAlliance(uid, randomUUID(), now)).toBe(false);
    expect((await tasks(uid))["46608"]?.state).toBe(0);
    expect((await tasks(other))["46608"]?.state).toBe(0);
    expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 31 });
});

test(
    "lost local COMMIT reply and PostgreSQL restart retain one mail, task completion and payment",
    async () => {
        const uid = await seed(1, taskRows(1, 1)),
            { instance, operationId } = await changed(uid),
            failure = loseCommit();
        try
        {
            await expect(instance.deliverAlliance(uid, operationId, now)).rejects.toThrow();
            expect(failure.fired()).toBe(true);
        }
        finally
        {
            failure.restore();
        }
        const first = (await letters(uid))[0]!.uid;
        expect(await instance.store.find(uid, operationId)).toMatchObject({ pendingEffects: 30 });
        await databases.close();
        await pg.restart();
        databases = createDatabases(pg.options, topology);
        const restored = runtime();
        expect(await restored.deliverAlliance(uid, operationId, now + 10000)).toBe(false);
        expect((await letters(uid)).map((row) => row.uid)).toEqual([first]);
        expect((await tasks(uid))["00000"]?.state).toBe(1);
        await paidOnce(uid);
    },
    60_000,
);
