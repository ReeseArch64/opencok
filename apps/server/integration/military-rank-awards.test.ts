import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { user_military_rank } from "@opencok/drizzle/schema/opencok_kingdom/user_military_rank";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_activity } from "@opencok/drizzle/schema/opencok_kingdom/user_activity";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { createMutationExecutor, type MutationTransaction } from "@opencok/repositories/mutation";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import {
    militaryRankAwardReader,
    writeMilitaryRankAward,
} from "@opencok/repositories/military-rank-awards";
import { CityProgressionContext } from "@opencok/services/city-progression";
import { applyMilitaryRankAward } from "@opencok/services/military-rank-awards";
import type { MilitaryRankAward } from "@opencok/contracts/military-rank-awards";
import type { ActivityEconomy } from "@opencok/contracts/timed-activity";
import { encode, decode, sfs, fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness(),
        now = () => h.clock.now;
    h.rules.features.set("wr_switch", {
        id: "wr_switch",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    await h.db.db.insert(server_info).values({ uid: "server", lastClearMilitaryMailSendTime: 1n });
    const awards = new Map<string, readonly MilitaryRankAward[]>(),
        execute = createMutationExecutor(h.db.db, h.authority, now);
    let beforeWrite:
        | ((tx: MutationTransaction, context: CityProgressionContext) => Promise<void>)
        | undefined;
    const entitlement = async (
        id: string,
        reward: readonly MilitaryRankAward[],
        owner = "owner",
    ) => {
        awards.set(id, reward);
        await h.db.db
            .insert(user_activity)
            .values({ uid: owner, actId: id, type: 26, status: 0, time: 1n });
    };
    const claim = async (id: string, requestId = randomUUID(), owner = "owner") =>
        decode(
            await execute(
                {
                    owner,
                    requestId,
                    command: "military.award.accept",
                    request: encode({ id: sfs.string(id) }),
                },
                async (tx) => {
                    const [saved] = await tx
                        .select()
                        .from(user_activity)
                        .where(and(eq(user_activity.uid, owner), eq(user_activity.actId, id)))
                        .for("update");
                    if (!saved)
                    {
                        throw new Error("Missing owned trusted entitlement");
                    }
                    if (saved.status === 1)
                    {
                        return { response: encode({}) };
                    }
                    const state = await createCityProgressionStore(
                        tx,
                        owner,
                        BigInt(now()),
                        async (_tx, _owner, _now, change) => change(),
                    ).getState("military.award.accept");
                    state.militaryAward = militaryRankAwardReader(tx, owner);
                    const context = new CityProgressionContext(
                            state,
                            h.rules,
                            BigInt(now()),
                            {} as ActivityEconomy,
                            () => 0,
                        ),
                        results = [];
                    for (const reward of awards.get(id)!)
                    {
                        results.push(
                            await applyMilitaryRankAward(context, { ...reward, entitlementId: id }),
                        );
                    }
                    await beforeWrite?.(tx, context);
                    if (context.write.militaryAward)
                    {
                        await writeMilitaryRankAward(
                            tx,
                            owner,
                            context.write.militaryAward,
                            BigInt(now()),
                        );
                    }
                    await tx
                        .update(user_activity)
                        .set({ status: 1 })
                        .where(and(eq(user_activity.uid, owner), eq(user_activity.actId, id)));
                    return {
                        response: encode({
                            grants: sfs.array(
                                results
                                    .filter((result) => result !== undefined)
                                    .map((result) =>
                                        sfs.object({
                                            requested: sfs.int(result.requested),
                                            credited: sfs.double(result.credited),
                                            balance: sfs.double(result.balance),
                                        })
                                    ),
                            ),
                        }),
                    };
                },
            ),
        );
    return {
        ...h,
        entitlement,
        claim,
        rank: async () =>
            (
                await h.db.db.select().from(user_military_rank).where(
                    eq(user_military_rank.uid, "owner"),
                )
            )[0],
        modify: (value: typeof beforeWrite) => {
            beforeWrite = value;
        },
    };
}
test(
    "trusted owned claims initialize score defaults and preserve honor until a factual configured rank allows retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.entitlement("gift", [{ kind: "military", amount: 500 }]);
            const request = randomUUID(),
                first = await h.claim("gift", request);
            await h.claim("gift", request);
            await h.claim("gift");
            expect(await h.rank()).toMatchObject({ militaryScore: 500, honor: 0, militaryRank: 0 });
            await h.entitlement("honor", [{ kind: "milhonor", amount: 30000 }]);
            const balanceBefore = await h.rank(),
                ledgerBefore = await h.db.db.select().from(economy_posting),
                resourcesBefore = await h.db.pool.query(
                    "select * from opencok_kingdom.user_resource where uid = $1",
                    ["owner"],
                );
            await expect(h.claim("honor")).rejects.toThrow();
            expect(await h.rank()).toEqual(balanceBefore);
            expect(await h.db.db.select().from(economy_posting)).toEqual(ledgerBefore);
            expect(
                (await h.db.db.select().from(user_activity).where(
                    eq(user_activity.actId, "honor"),
                ))[0]!
                    .status,
            ).toBe(0);
            expect(
                (
                    await h.db.pool.query(
                        "select * from opencok_kingdom.user_resource where uid = $1",
                        [
                            "owner",
                        ],
                    )
                ).rows,
            ).toEqual(resourcesBefore.rows);
            await h.db.db.update(user_military_rank).set({ militaryRank: 20018001 });
            const honor = await h.claim("honor");
            expect(await h.rank()).toMatchObject({
                militaryScore: 500,
                honor: 25000,
                maxHonorWeekly: 25000,
                rankingExp: 0,
                militaryRank: 20018001,
                status: 1,
                lastTimeReset: 0n,
            });
            expect(
                fields((honor.grants!.value as import("@opencok/messages/sfs").Value[])[0])
                    .credited,
            ).toEqual(sfs.double(25000));
            const postings = await h.db.db.select().from(economy_posting);
            expect(
                fields((first.grants!.value as import("@opencok/messages/sfs").Value[])[0])
                    .credited,
            ).toEqual(sfs.double(500));
            expect(postings).toHaveLength(6);
            expect(
                postings.every((row) =>
                    ["activity-military:gift", "activity-military:honor"].includes(row.requestId)
                ),
            ).toBe(true);
            expect(
                postings.find(
                    (row) =>
                        row.asset === "military.honor.cents"
                        && row.requestId === "activity-military:honor",
                )!.delta,
            ).toBe(2500000n);
            await expect(h.claim("gift", randomUUID(), "other")).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "concurrent different entitlements exhaust only the authoritative remaining weekly honor allowance",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(user_military_rank).values({
                uid: "owner",
                militaryScore: 12.34,
                honor: 100,
                maxHonorWeekly: 24900,
                rankingExp: 432,
                militaryRank: 20018001,
                status: 0,
                lastTimeReset: 123n,
                lastTimeSet0Tostatus: 456n,
                skill: "retained-skill",
                award: "retained-award",
            });
            await h.db.db.insert(user_state).values({
                uid: "owner",
                stateId: 510056,
                endTime: 999999999n,
            });
            const states = await h.db.db.select().from(user_state);
            for (let i = 0; i < 5; i++)
            {
                await h.entitlement(`cap${i}`, [{ kind: "milhonor", amount: 200 }]);
            }
            const replies = await Promise.all(
                Array.from({ length: 5 }, (_, i) => h.claim(`cap${i}`)),
            );
            expect(
                replies.reduce(
                    (sum, reply) =>
                        sum
                        + Number(
                            fields(
                                (reply.grants!.value as import("@opencok/messages/sfs").Value[])[0],
                            ).credited!
                                .value,
                        ),
                    0,
                ),
            ).toBe(100);
            expect(await h.rank()).toMatchObject({
                honor: 200,
                maxHonorWeekly: 25000,
                militaryScore: 12.34,
                rankingExp: 432,
                militaryRank: 20018001,
                status: 0,
                lastTimeReset: 123n,
                lastTimeSet0Tostatus: 456n,
                skill: "retained-skill",
                award: "retained-award",
            });
            expect(await h.db.db.select().from(user_state)).toEqual(states);
            expect(await h.db.db.select().from(economy_posting)).toHaveLength(15);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "missing zero future and expired period markers retain the entitlement before a factual clock allows retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.entitlement("clock", [{ kind: "military", amount: 1 }]);
            const request = randomUUID();
            for (const marker of [undefined, 0n, BigInt(h.clock.now + 1)])
            {
                await h.db.db.delete(server_info);
                if (marker !== undefined)
                {
                    await h.db.db
                        .insert(server_info)
                        .values({ uid: "server", lastClearMilitaryMailSendTime: marker });
                }
                await expect(h.claim("clock", request)).rejects.toThrow();
                expect(await h.rank()).toBeUndefined();
                expect((await h.db.db.select().from(user_activity))[0]!.status).toBe(0);
            }
            await h.db.db.update(server_info).set({ lastClearMilitaryMailSendTime: 1n });
            h.clock.now = 181 * 86400000 + 1;
            await expect(h.claim("clock", request)).rejects.toThrow();
            expect((await h.db.db.select().from(user_activity))[0]!.status).toBe(0);
            await h.db.db
                .update(server_info)
                .set({ lastClearMilitaryMailSendTime: BigInt(h.clock.now - 86400000) });
            await h.claim("clock", request);
            expect((await h.rank())!.militaryScore).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "ledger or final receipt failures roll back rank counters and the owned claim before safe retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db
                .insert(user_military_rank)
                .values({ uid: "owner", militaryRank: 20018001, rankingExp: 0 });
            const before = await h.rank();
            await h.entitlement("rollback", [
                { kind: "military", amount: 25 },
                { kind: "milhonor", amount: 10 },
            ]);
            await h.db.pool.query(
                `create function reject_military() returns trigger language plpgsql as $$ begin raise exception 'synthetic military failure'; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_military before insert on opencok_kingdom.economy_posting for each row execute function reject_military()`,
            );
            const request = randomUUID();
            await expect(h.claim("rollback", request)).rejects.toThrow();
            expect(await h.rank()).toEqual(before);
            expect((await h.db.db.select().from(user_activity))[0]!.status).toBe(0);
            await h.db.pool.query(
                `drop trigger reject_military on opencok_kingdom.economy_posting`,
            );
            await h.db.pool.query(
                `create trigger reject_military before insert on opencok_kingdom.command_receipt for each row execute function reject_military()`,
            );
            await expect(h.claim("rollback", request)).rejects.toThrow();
            expect(await h.rank()).toEqual(before);
            expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
            expect((await h.db.db.select().from(user_activity))[0]!.status).toBe(0);
            await h.db.pool.query(
                `drop trigger reject_military on opencok_kingdom.command_receipt`,
            );
            await h.claim("rollback", request);
            expect(await h.rank()).toMatchObject({
                militaryScore: 25,
                honor: 10,
                maxHonorWeekly: 10,
            });
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "stale counter and clock snapshots, nonfinite awards and numeric overflow never consume the saved entitlement",
    async () => {
        const h = await fixture();
        try
        {
            await h.entitlement("invalid", [{ kind: "military", amount: 1 }]);
            h.modify(async (tx) => {
                await tx.update(server_info).set({ lastClearMilitaryMailSendTime: 2n });
            });
            await expect(h.claim("invalid")).rejects.toThrow();
            expect(await h.rank()).toBeUndefined();
            h.modify(undefined);
            await h.db.db
                .insert(user_military_rank)
                .values({ uid: "owner", rankingExp: 0, militaryRank: 0, militaryScore: 999999936 });
            await h.entitlement("overflow", [{ kind: "military", amount: 128 }]);
            await expect(h.claim("overflow")).rejects.toThrow();
            expect((await h.rank())!.militaryScore).toBe(999999936);
            await h.entitlement("nan", [{ kind: "military", amount: NaN }]);
            await expect(h.claim("nan")).rejects.toThrow();
            h.modify(async (tx) => {
                await tx.update(user_military_rank).set({ honor: 100 });
            });
            await expect(h.claim("invalid")).rejects.toThrow();
            expect((await h.rank())!.honor).toBe(0);
            expect((await h.db.db.select().from(user_activity)).every((row) => row.status === 0))
                .toBe(
                    true,
                );
            expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "closed military rewards preserve Source skip semantics and stale realm authorities cannot fund counters",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.features.set("wr_switch", { online: "close", test: "close" });
            await h.db.db.delete(server_info);
            await h.entitlement("closed", [{ kind: "military", amount: 5 }]);
            expect((await h.claim("closed")).grants).toEqual(sfs.array([]));
            expect(await h.rank()).toBeUndefined();
            await acquireRealmAuthority(h.db.db, 1, () => true);
            await h.entitlement("stale", [{ kind: "military", amount: 1 }]);
            await expect(h.claim("stale")).rejects.toThrow();
            expect(
                (await h.db.db.select().from(user_activity).where(
                    eq(user_activity.actId, "stale"),
                ))[0]!
                    .status,
            ).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "float32 credit and capped zero awards retain decimal journal balances and canonical entitlement fencing",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(user_military_rank).values({
                uid: "owner",
                militaryScore: 16777216,
                honor: 12.34,
                maxHonorWeekly: 24999.99,
                rankingExp: 0,
                militaryRank: 20018001,
            });
            await h.entitlement("float", [
                { kind: "military", amount: 1 },
                { kind: "milhonor", amount: 1 },
            ]);
            const reply = await h.claim("float"),
                grants = (reply.grants!.value as import("@opencok/messages/sfs").Value[]).map(
                    fields,
                );
            expect(grants[0]!.credited).toEqual(sfs.double(0));
            expect(grants[1]!.credited).toEqual(sfs.double(0.01));
            expect(grants[1]!.balance).toEqual(sfs.double(12.35));
            const postings = await h.db.db.select().from(economy_posting);
            expect(postings.find((row) => row.asset === "military.honor.cents")).toMatchObject({
                before: 1234n,
                after: 1235n,
                delta: 1n,
            });
            expect(postings.find((row) => row.asset === "military.maxHonorWeekly.cents")!.delta)
                .toBe(1n);
            await h.entitlement("capped", [{ kind: "milhonor", amount: 50 }]);
            await h.claim("capped");
            expect(await h.rank()).toMatchObject({
                militaryScore: 16777216,
                honor: 12.35,
                maxHonorWeekly: 25000,
            });
            expect(
                (
                    await h.db.db
                        .select()
                        .from(economy_posting)
                        .where(eq(economy_posting.requestId, "activity-military:capped"))
                ).every((row) => row.delta === 0n),
            ).toBe(true);
            await h.db.db.update(user_activity).set({ status: 0 }).where(
                eq(user_activity.actId, "float"),
            );
            await expect(h.claim("float")).rejects.toThrow();
            expect(
                (await h.db.db.select().from(user_activity).where(
                    eq(user_activity.actId, "float"),
                ))[0]!
                    .status,
            ).toBe(0);
            expect(await h.db.db.select().from(economy_posting)).toHaveLength(6);
            expect((await h.rank())!.honor).toBe(12.35);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
