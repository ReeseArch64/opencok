import { decodeProductionRates } from "@opencok/production/mappings/production";
import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sfs, encode, decode } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { playerEffectsDomain } from "@opencok/services/player-effects";
import { createInventoryService } from "@opencok/services/inventory-runtime";
import { createRealmInventoryExecutor } from "@opencok/repositories/inventory-runtime";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";

test(
    "effect item consumption, production boundaries, retries, and talent persistence share one transaction",
    async () => {
        const h = await cityHarness([playerEffectsDomain]);
        try
        {
            const inventory = createInventoryService(
                createRealmInventoryExecutor(h.db.db, h.authority, () => h.clock.now, {
                    before: async (tx, owner, now) => {
                        await h.preparation.prepare(tx, owner, now);
                    },
                    useEffect: async (tx, owner, itemId, count, now, economy) =>
                        decode(
                            Buffer.from(
                                (
                                    await h.handlers.command(
                                        tx,
                                        owner,
                                        "effect.item",
                                        encode({
                                            itemId: sfs.string(itemId),
                                            count: sfs.int(count),
                                        }),
                                        now,
                                        economy,
                                    )
                                ).response,
                            ),
                        ),
                }),
                h.rules,
                h.effects,
                () => h.clock.now,
            );
            const grant = await inventory.grant("owner", randomUUID(), "200370", 2);
            const uuid = grant.uuid!;
            const request = { uuid, num: sfs.int(1), operationId: sfs.string(randomUUID()) };
            await inventory.command("owner", "item.use", request);
            const first =
                (await h.db.db.select().from(user_vip).where(eq(user_vip.uid, "owner")))[0]!;
            expect(first.vipEndTime).toBe(BigInt(h.clock.now) + 86400000n);
            await inventory.command("owner", "item.use", request);
            expect(
                (await h.db.db.select().from(user_vip).where(eq(user_vip.uid, "owner")))[0]
                    ?.vipEndTime,
            ).toBe(first.vipEndTime);
            const good = [...h.rules.goods.values()].find(
                (rule) => rule.type === "4" && rule.para1 === "500944",
            )!;
            const resourceItem = await inventory.grant("owner", randomUUID(), good.id!, 1);
            h.clock.now += 3600000;
            await inventory.command("owner", "item.use", {
                uuid: resourceItem.uuid!,
                num: sfs.int(1),
            });
            const states = await h.db.db.select().from(user_state).where(
                eq(user_state.uid, "owner"),
            );
            expect(states).toHaveLength(1);
            const production = await h.db.db
                .select()
                .from(building_production)
                .where(eq(building_production.ownerId, "owner"));
            expect(production.length).toBeGreaterThan(0);
            const wood = production.find((row) => row.asset === "wood")!,
                rates = decodeProductionRates(wood.rates),
                expiry = first.vipEndTime;
            const ending = rates.findIndex((rate) => rate.at === expiry);
            expect(ending).toBeGreaterThan(0);
            expect(rates[ending - 1]!.perHour).toBeGreaterThan(rates[ending]!.perHour);
            const general = {
                uid: "owner",
                uuid: "owned-general",
                generalId: "900000",
                status: 0,
                level: 10,
                abilityIndex: 1,
            };
            await h.db.db.insert(user_general).values(general);
            await h.db.db.update(userprofile).set({ level: 10 }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.command("skill.save", {
                gUid: sfs.string(general.uuid),
                abilityId: sfs.string("50000"),
                skill: sfs.object({ "600000": sfs.int(5) }),
            });
            const [saved] = await h.db.db
                .select()
                .from(user_general)
                .where(eq(user_general.uuid, general.uuid));
            expect(JSON.parse(saved!.ability!.toString())).toEqual([{ id: "50000", "600000": 5 }]);
            await expect(
                h.command("skill.save", {
                    gUid: sfs.string(general.uuid),
                    abilityId: sfs.string("50000"),
                    skill: sfs.object({ "600100": sfs.int(5) }),
                }),
            ).rejects.toThrow();
            expect(
                (await h.db.db.select().from(user_general).where(
                    eq(user_general.uuid, general.uuid),
                ))[0]
                    ?.ability,
            ).toEqual(saved?.ability);
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);
