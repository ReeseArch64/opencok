import { nicknameChangePayment } from "@opencok/player/repositories/nickname-change";
import { planRealmInventoryGrants } from "@opencok/services/inventory-runtime";
import { randomUUID } from "node:crypto";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { continuedCostDomain } from "@opencok/services/continued-cost";
import { ContinuedCostRankingService } from "@opencok/services/continued-cost-ranking";
import {
    createCostRankingFacts,
    createCostRankingRegistry,
} from "@opencok/repositories/continued-cost-ranking";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { costRankingPlan } from "@opencok/rules/continued-cost-ranking";
import { ShopService } from "@opencok/shop/services/shops";
import { createShopRepository } from "@opencok/shop/repositories/shops";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { sfs, encode } from "@opencok/messages/sfs";
import type { CityDomain } from "@opencok/city/contracts/domain";
import type { Rules } from "@opencok/rules/game";
import { cityHarness } from "./city";
const spender: CityDomain = {
    commands: ["synthetic.spend"],
    types: [],
    async prepare(context, _command, params)
    {
        context.economy.gold(-BigInt(params.gold!.value as bigint));
        return { response: encode({}), event: null };
    },
    async apply()
    {
        throw new Error("No synthetic timer");
    },
};
function configure(rules: Rules)
{
    for (const key of ["continued_cost", "new_rank_cost"])
    {
        rules.features.set(key, { id: key, online: "all", test: "all", version: "1.0.0" });
    }
    rules.items.set("continued_cost", { ...rules.items.get("continued_cost")!, k1: "1", k2: "1" });
    rules.power.activityPanels!.set("57159", {
        ...rules.power.activityPanels!.get("57159")!,
        start: "2030-01-01-00-00",
        end: "2030-01-10-00-00",
    });
    rules.shops.set("cost-shop", {
        id: "cost-shop",
        onsale: "1",
        item_id: "200300",
        sale_type: "10",
        value1_type: "1",
        value1: "10",
        buy_times_daily: "100",
        total_times: "100",
    });
}
export async function costRankingFixture(extra: readonly CityDomain[] = [])
{
    const h = await cityHarness([continuedCostDomain, spender, ...extra]),
        closers = [h.close];
    try
    {
        h.clock.now = Date.UTC(2030, 0, 2);
        configure(h.rules);
        await h.db.pool.query("create database \"cost_ranking_global\"");
        await h.db.pool.query("create database \"cost_ranking_second\"");
        const global = createDatabase("global", {
                ...h.connection,
                database: "cost_ranking_global",
            }),
            second = createDatabase("kingdom", {
                ...h.connection,
                database: "cost_ranking_second",
            });
        closers.push(global.close, second.close);
        await migrate(global.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/global", import.meta.url)
                    .pathname,
        });
        await migrate(second.db, {
            migrationsFolder:
                new URL("../../../../packages/drizzle/migrations/kingdom", import.meta.url)
                    .pathname,
        });
        const authority2 = await acquireRealmAuthority(second.db, 2, () => true),
            rules2 = await loadRules(undefined, 2);
        configure(rules2);
        await second.db.insert(userprofile).values({
            uid: "remote",
            name: "Remote",
            country: "BR",
            serverId: 2,
            level: 1,
            exp: 0,
            gold: 100000n,
        });
        await second.db.insert(user_resource).values({
            uid: "remote",
            wood: 0n,
            stone: 0n,
            food: 0n,
            iron: 0n,
            silver: 0,
            chip: 0,
            diamond: 0,
            dragon_food: 0,
            dragon_gold: 0,
            lastUpdateTime: BigInt(h.clock.now),
        });
        await second.db
            .insert(user_building)
            .values({ uuid: "remote-castle", uid: "remote", itemId: 400000, pos: 0, level: 1 });
        const now = () => h.clock.now,
            source = createCostRankingFacts(h.db.db, h.authority, nicknameChangePayment),
            source2 = createCostRankingFacts(second.db, authority2, nicknameChangePayment),
            registry = createCostRankingRegistry(global.db, h.authority),
            registry2 = createCostRankingRegistry(global.db, authority2),
            service = new ContinuedCostRankingService(source, registry, h.rules, [1, 2], now),
            service2 = new ContinuedCostRankingService(source2, registry2, rules2, [1, 2], now),
            shop2 = new ShopService(
                createShopRepository(second.db, authority2, now),
                rules2,
                planRealmInventoryGrants,
            );
        const spend = (amount: bigint, operationId = randomUUID()) =>
                h.command("synthetic.spend", {
                    gold: sfs.long(amount),
                    operationId: sfs.string(operationId),
                }),
            spend2 = () =>
                shop2.command("remote", "shoppingMall.buy", {
                    id: sfs.string("cost-shop"),
                    num: sfs.int(1),
                    operationId: sfs.string(randomUUID()),
                });
        return {
            ...h,
            global,
            second,
            authority2,
            rules2,
            source,
            source2,
            registry,
            registry2,
            service,
            service2,
            spend,
            spend2,
            plan: costRankingPlan(h.rules, [1, 2])!,
            close: async () => {
                for (const close of closers.toReversed())
                {
                    await close();
                }
            },
        };
    }
    catch (error)
    {
        for (const close of closers.toReversed())
        {
            await close();
        }
        throw error;
    }
}
