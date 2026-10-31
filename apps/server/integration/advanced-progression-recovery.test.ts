import { planRealmProductionContext } from "../src/composition/production.ts";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { lottery_record } from "@opencok/drizzle/schema/opencok_kingdom/lottery_record";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { acquireRealmAuthority, type RealmAuthority } from "@opencok/repositories/realm-authority";
import { createActivityExecutor } from "@opencok/repositories/timed-activity";
import { createCityProductionBoundary } from "@opencok/production/repositories/city-boundary";
import { createRealmCityProgressionStore } from "../src/composition/city-persistence.ts";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { persistProductionProgress } from "@opencok/repositories/reconnect-write";
import { createRealmCityProgressionHandlers } from "../src/composition/city.ts";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { dragonProgressionDomain } from "@opencok/services/dragon-progression";
import { CivilizationScienceDomain } from "@opencok/research/services/civilization";
import { lotteryDomain } from "@opencok/services/lottery";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { emptyDragonTravel } from "@opencok/rules/dragon-progression";
import { text, num } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rule } from "@opencok/rules/game";
import { cityHarness } from "./support/city";

const civilizationScienceDomain = new CivilizationScienceDomain();

const domains = [dragonProgressionDomain, civilizationScienceDomain, lotteryDomain];
const reward = "dragon_food,0,7|dragon_gold,0,11|goods,200300,2";

async function fixture()
{
    const h = await cityHarness(domains);
    try
    {
        h.clock.now = 172800000;
        for (const id of ["dragon_new", "dragon_levelup", "dragon_travel", "science_race_switch"])
        {
            h.rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });
        }
        await h.db.db.insert(user_pet_dragon).values({
            uuid: "owned-dragon",
            uid: "owner",
            itemId: 109000,
            dragonState: 3,
            lv: 1,
            useFlag: 1,
            travelData: JSON.stringify({
                ...emptyDragonTravel,
                travelState: 2,
                rewardId: "pinned-before-restart",
                rewardGoods: reward,
            }),
        });
        h.rules.power.civilizationSciences = new Map<string, Rule>([
            [
                "700000",
                {
                    id: "700000",
                    time_research: "60",
                    research_need: "0;100",
                    para1: "1",
                    para2: "0",
                    power: "0",
                },
            ],
            [
                "700001",
                {
                    id: "700001",
                    time_research: "60",
                    research_need: "0;200",
                    para1: "1",
                    para2: "10",
                    power: "10",
                },
            ],
            ["700002", { id: "700002", para1: "1", para2: "20", power: "20" }],
        ]);
        await h.db.db.insert(queue).values({
            uuid: "owner-civilization",
            ownerId: "owner",
            qid: 1,
            type: 19,
            itemId: "",
            startTime: idleDeadline,
            endTime: idleDeadline,
            updateTime: idleDeadline,
            totalTime: 0n,
        });
        await h.db.db
            .update(user_resource)
            .set({ chip: 50000, diamond: 50000 })
            .where(eq(user_resource.uid, "owner"));
        return h;
    }
    catch (error)
    {
        await h.close();
        throw error;
    }
}

function resumed(
    h: Awaited<ReturnType<typeof fixture>>,
    db: ReturnType<typeof createDatabase<"kingdom">>,
    authority: RealmAuthority,
)
{
    const preparation = {
        async prepare(
            tx: Parameters<typeof createRealmCityProgressionStore>[0],
            owner: string,
            at: bigint,
        )
        {
            const state = await readReconnectProgress(tx, owner, authority.kingdomId, at);
            const plan = await planRealmProductionContext(state, h.rules, at, {
                worldPowerEffects: async () => new Map<string, string>(),
                emperorVersion: async () => null,
            });
            await persistProductionProgress(tx, state, plan.write, authority, at);
            return plan.rates;
        },
    };
    const boundary = createCityProductionBoundary(preparation, (row) => {
        const rule = h.rules.building(
            text(row, "itemId"),
            num(row, "level"),
            num(row, "star"),
            num(row, "progress"),
        );
        return rule.effects?.productionPerHour === undefined
            ? undefined
            : ["wood", "stone", "iron", "food"][rule.effects.productionResourceId ?? -1];
    });
    const handlers = createRealmCityProgressionHandlers(
        (tx: Parameters<typeof createRealmCityProgressionStore>[0], owner, at) =>
            createRealmCityProgressionStore(tx, owner, at, boundary, 1200, authority),
        domains,
        h.rules,
        h.effects,
    );
    return new TimedActivityService(
        createActivityExecutor(db.db, authority, handlers.domains, () => h.clock.now, {
            before: async (tx, owner, at) => {
                await preparation.prepare(tx, owner, at);
                return at;
            },
            command: handlers.command,
            next: handlers.next,
            accelerate: handlers.accelerate,
        }),
        h.rules,
        h.effects,
    );
}

async function snapshot(db: ReturnType<typeof createDatabase<"kingdom">>)
{
    return Object.fromEntries(
        await Promise.all(
            [
                "userprofile",
                "user_resource",
                "user_item",
                "user_pet_dragon",
                "user_pet_dragon_skill",
                "user_civilization_science",
                "queue",
                "timed_activity",
                "lottery_record",
                "user_lottery",
                "command_receipt",
                "economy_posting",
                "mutation_outbox",
                "playerinfo",
                "building_production",
            ].map(async (table) => [
                table,
                (
                    await db.pool.query(
                        `select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text), '[]'::jsonb) as rows from opencok_kingdom.${table} t`,
                    )
                ).rows[0].rows,
            ]),
        ),
    );
}

test(
    "replacement owners recover pinned dragon rewards, civilization queues and lottery choices through fresh repositories",
    async () => {
        const h = await fixture();
        let reopened: ReturnType<typeof createDatabase<"kingdom">> | undefined;
        try
        {
            await h.command("dragon.init", {});
            await h.command("race.science.research", { itemId: sfs.string("700000") });
            const activity = await h.active(19);
            await h.command("lottery.start", {
                type: sfs.string("1"),
                super: sfs.string("0"),
                useGold: sfs.string("0"),
                times: sfs.string("0"),
                position: sfs.string("0"),
            });
            const board = (await h.db.db.select().from(lottery_record))[0]!;
            expect(board.type).toBe(2);
            reopened = createDatabase("kingdom", { ...h.connection, max: 4 });
            const next = await acquireRealmAuthority(reopened.db, 1, () => true);
            const service = resumed(h, reopened, next);
            await service.domainCommand("owner", "dragon.init", {});
            await service.domainCommand("owner", "lottery.init", {});
            expect(
                JSON.parse((await reopened.db.select().from(user_pet_dragon))[0]!.travelData!)
                    .rewardGoods,
            ).toBe(reward);
            expect((await reopened.db.select().from(lottery_record))[0]!.lotteryInfo2).toBe(
                board.lotteryInfo2,
            );
            h.clock.now = Number(activity.dueAt);
            const completion = {
                uuid: sfs.string(activity.queueId),
                activityId: sfs.string(activity.id),
                version: sfs.int(activity.version),
                operationId: sfs.string(randomUUID()),
            };
            await service.command("owner", "queue.finish", completion);
            await service.command("owner", "queue.finish", completion);
            expect((await reopened.db.select().from(user_civilization_science))[0]!.level).toBe(1);
            const claim: Fields = {
                petDragonUid: sfs.string("owned-dragon"),
                operationId: sfs.string(randomUUID()),
            };
            await reopened.pool.query(
                `create function reject_advanced_outbox() returns trigger language plpgsql as $$ begin raise exception 'synthetic advanced recovery failure'; end $$`,
            );
            await reopened.pool.query(
                `create trigger reject_advanced_outbox before insert on opencok_kingdom.mutation_outbox for each row execute function reject_advanced_outbox()`,
            );
            const before = await snapshot(reopened);
            await expect(
                service.domainCommand("owner", "petdragon.travel.take.reward", claim),
            ).rejects.toThrow();
            expect(await snapshot(reopened)).toEqual(before);
            await reopened.pool.query(
                `drop trigger reject_advanced_outbox on opencok_kingdom.mutation_outbox`,
            );
            const replies = await Promise.all(
                Array.from(
                    { length: 4 },
                    () => service.domainCommand("owner", "petdragon.travel.take.reward", claim),
                ),
            );
            expect(replies[0]!.body.awardItems).toBeDefined();
            const resource = (
                await reopened.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
            )[0]!;
            expect(resource.dragon_food).toBe(7);
            expect(resource.dragon_gold).toBe(11);
            expect(
                (await reopened.db.select().from(user_item).where(eq(user_item.itemId, "200300")))[
                    0
                ]!.count,
            ).toBe(2);
            expect(
                JSON.parse((await reopened.db.select().from(user_pet_dragon))[0]!.travelData!)
                    .travelState,
            ).toBe(0);
            const committed = await snapshot(reopened);
            await service.domainCommand("owner", "petdragon.travel.take.reward", claim);
            expect(await snapshot(reopened)).toEqual(committed);
            await expect(h.command("petdragon.travel.take.reward", claim)).rejects.toThrow();
            await expect(h.command("lottery.init", {})).rejects.toThrow();
            expect(await snapshot(reopened)).toEqual(committed);
            const spin = {
                type: sfs.string("2"),
                super: sfs.string("0"),
                useGold: sfs.string("0"),
                times: sfs.string(String(board.times2)),
                position: sfs.string("0"),
                operationId: sfs.string(randomUUID()),
            };
            await service.domainCommand("owner", "lottery.start", spin);
            const spun = await snapshot(reopened);
            await service.domainCommand("owner", "lottery.start", spin);
            expect(await snapshot(reopened)).toEqual(spun);
            const stored = (await reopened.db.select().from(lottery_record))[0]!;
            expect(stored.times2).toBe(board.times2 + 1);
            expect(stored.lotteryInfo2).toBe(board.lotteryInfo2);
            expect(
                (await reopened.db.select().from(command_receipt)).filter(
                    (row) => row.requestId === claim.operationId!.value,
                ),
            ).toHaveLength(1);
        }
        finally
        {
            await reopened?.close();
            await h.close();
        }
    },
    120000,
);

test(
    "receipt failure rolls back advanced feeding, research and lottery costs with all saved outcomes",
    async () => {
        const h = await fixture();
        try
        {
            await h.command("dragon.init", {});
            await h.db.pool.query(
                `create function reject_advanced_receipt() returns trigger language plpgsql as $$ begin raise exception 'synthetic advanced receipt failure'; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_advanced_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_advanced_receipt()`,
            );
            for (
                const [command, params] of [
                    [
                        "petdragon.eat.exp",
                        {
                            petDragonUid: sfs.string("owned-dragon"),
                            eatExpType: sfs.int(0),
                            count: sfs.int(1),
                        },
                    ],
                    ["race.science.research", { itemId: sfs.string("700000") }],
                    ["lottery.batch", {}],
                ] as const
            )
            {
                const before = await snapshot(h.db);
                await expect(h.command(command, params)).rejects.toThrow();
                expect(await snapshot(h.db)).toEqual(before);
            }
            await h.db.pool.query(
                `drop trigger reject_advanced_receipt on opencok_kingdom.command_receipt`,
            );
            await h.command("petdragon.eat.exp", {
                petDragonUid: sfs.string("owned-dragon"),
                eatExpType: sfs.int(0),
                count: sfs.int(1),
            });
            expect((await h.db.db.select().from(user_pet_dragon))[0]!.exp).toBeGreaterThan(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
