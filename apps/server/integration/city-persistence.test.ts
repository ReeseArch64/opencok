import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import type { CityProductionBoundary } from "@opencok/city/contracts/transaction";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import { createRealmCityProgressionStore } from "../src/composition/city-persistence";
import { cityHarness } from "./support/city";

test(
    "city store retains snapshot identity and rolls back earlier mechanic writes when aggregate ownership fails",
    async () => {
        const h = await cityHarness();
        try
        {
            const economy: ActivityEconomy = {
                gold()
                {},
                resource()
                {},
                item()
                {},
            };
            const stages: string[] = [];
            const boundary: CityProductionBoundary = async (
                tx,
                owner,
                now,
                change,
                deleted,
                actualEconomy,
            ) => {
                expect(owner).toBe("owner");
                expect(now).toBe(1000000n);
                expect(deleted).toEqual([]);
                expect(actualEconomy).toBe(economy);
                expect(
                    await tx.select().from(user_branch_city_info).where(
                        eq(user_branch_city_info.uid, owner),
                    ),
                )
                    .toHaveLength(0);
                stages.push("before");
                await change();
                stages.push("after");
            };
            const foreign = await h.building("other-413000");
            expect(foreign).toBeDefined();
            await expect(h.db.db.transaction(async (tx) => {
                const store = createRealmCityProgressionStore(tx, "owner", 1000000n, boundary);
                const state = await store.getState();
                expect(state.profile.uid).toBe("owner");
                expect(state.buildings.every((row) => row.uid === "owner")).toBe(true);
                try
                {
                    await store.update({
                        branchCityOpenState: 1,
                        buildings: [{ ...foreign!, uid: "owner" }],
                    }, economy);
                }
                catch (error)
                {
                    expect(
                        (await tx.select().from(user_branch_city_info).where(
                            eq(user_branch_city_info.uid, "owner"),
                        ))[0]?.openstate,
                    ).toBe(1);
                    throw error;
                }
            })).rejects.toThrow("Foreign building");
            expect(stages).toEqual(["before"]);
            expect(
                await h.db.db.select().from(user_branch_city_info).where(
                    eq(user_branch_city_info.uid, "owner"),
                ),
            )
                .toHaveLength(0);
            expect(await h.building("other-413000")).toEqual(foreign);
            const own = (await h.building("owner-413000"))!;
            stages.length = 0;
            await h.db.db.transaction(async (tx) => {
                const store = createRealmCityProgressionStore(tx, "owner", 1000000n, boundary);
                await store.getState();
                await store.update({
                    branchCityOpenState: 1,
                    buildings: [{ ...own, level: own.level + 1 }],
                }, economy);
                expect(await store.treasurePoints!([])).toEqual([]);
                await expect(store.treasurePoints!([0])).rejects.toThrow(
                    "Invalid treasure target query",
                );
                await expect(store.birthPoint!({ priorities: [], limits: [], side: 1 }))
                    .rejects.toThrow("Missing world birth authority");
            });
            expect(stages).toEqual(["before", "after"]);
            expect((await h.building("owner-413000"))!.level).toBe(own.level + 1);
            expect(
                (await h.db.db.select().from(user_branch_city_info).where(
                    eq(user_branch_city_info.uid, "owner"),
                ))[0]?.openstate,
            )
                .toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
