import { expect, spyOn, test } from "bun:test";
import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import { encode } from "@opencok/messages/sfs";
import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import { initializeLogging } from "@opencok/core/logging";
import { CityInitializationCommand } from "@opencok/city/enums/initialization-command";
import { createEggActivityDomain } from "@opencok/services/egg-activity";
import { createNormalRechargeDomain } from "@opencok/services/normal-recharge";
import { comebackDomain } from "@opencok/services/comeback";
import { createPrayerDomain } from "@opencok/services/prayer";
import { createRechargeActivityDomain } from "@opencok/services/recharge-activity";
import { createSevenDayCycleDomain } from "@opencok/services/seven-day-cycle";
import { branchCityDomain } from "@opencok/services/branch-city";
import { castleLevelEventDomain } from "@opencok/services/castle-level-event";
import { createLuckyDayDomain } from "@opencok/services/lucky-day";
import { lotteryDomain } from "@opencok/services/lottery";
import { CivilizationScienceDomain } from "@opencok/research/services/civilization";
import { createRealmQuestsDomain } from "../src/composition/quests";
import { createRealmRecallTaskDomain } from "../src/composition/recall-task";
import { createRealmTargetTaskDomain } from "../src/composition/target-task";
import { createRealmCityProgressionStore } from "../src/composition/city-persistence";
import { createRealmCityProgressionHandlers } from "../src/composition/city";
import { createRealmEquipmentDomains } from "../src/composition/equipment";
import { createRealmAllianceHeartDomain } from "../src/composition/alliance-heart";
import { createOrdinaryBoxDomain } from "@opencok/services/ordinary-box";
import { createTotemDomain } from "@opencok/services/totem";
import { createVipBoxDomain } from "@opencok/services/vip-box";
import { dailyInvestmentDomain } from "@opencok/services/daily-investment";
import { playerEffectsDomain } from "@opencok/services/player-effects";
import { cityHarness } from "./support/city";

const domains = [
    createRealmEquipmentDomains().equipment,
    createRealmAllianceHeartDomain(),
    createOrdinaryBoxDomain(),
    createTotemDomain(1200),
    createVipBoxDomain(),
    dailyInvestmentDomain,
    playerEffectsDomain,
    createEggActivityDomain(() => 0),
    createNormalRechargeDomain(),
    comebackDomain,
    createPrayerDomain(() => 0),
    createRealmRecallTaskDomain(),
    createRealmQuestsDomain(),
    new CivilizationScienceDomain(),
    createRealmTargetTaskDomain(),
    createRechargeActivityDomain(),
    createSevenDayCycleDomain(undefined, () => 0),
    branchCityDomain,
    castleLevelEventDomain,
    createLuckyDayDomain(() => 0),
    lotteryDomain,
];

for (const kingdomId of [1, 2])
{
    test(
        `login projections preserve native responses, writes and freshness in kingdom ${kingdomId}`,
        async () => {
            initializeLogging("login-projection-test");
            let count = 0;
            let measuring = false;
            const output = spyOn(console, "info").mockImplementation((value) => {
                const record = JSON.parse(String(value)) as { event?: string; operation?: string; };

                if (
                    measuring && record.event === "database_result"
                    && record.operation?.endsWith(".select")
                )
                {
                    count++;
                }
            });
            const warnings = spyOn(console, "warn").mockImplementation(() => {});
            const errors = spyOn(console, "error").mockImplementation(() => {});
            const h = await cityHarness(domains, false, undefined, 1200, { kingdomId });
            const rollback = new Error("Synthetic comparison rollback");
            const evidence: {
                command: string;
                before: number;
                after: number;
                beforeMs: number;
                afterMs: number;
            }[] = [];

            try
            {
                await h.command("quest.init", {});
                await h.command("lottery.init", {});
                const compare = async (command: string, project: boolean) => {
                    let write: CityProgressionWrite | undefined;
                    let response: unknown;
                    const economy: ActivityEconomy = {
                        hasPendingItemGrants: () => false,
                        gold()
                        {},
                        resource()
                        {},
                        item()
                        {},
                        event()
                        {},
                    };
                    const handlers = createRealmCityProgressionHandlers(
                        (tx: Parameters<typeof createRealmCityProgressionStore>[0], owner, now) => {
                            const store = createRealmCityProgressionStore(
                                tx,
                                owner,
                                now,
                                async (_tx, _owner, _now, change) => change(),
                                1200,
                                h.authority,
                                project,
                            );

                            return {
                                ...store,
                                update: async (value, currentEconomy) => {
                                    write = structuredClone(value);
                                    await store.update(value, currentEconomy);
                                },
                            };
                        },
                        domains,
                        h.rules,
                        h.effects,
                    );
                    count = 0;
                    measuring = true;
                    const started = performance.now();

                    await expect(h.db.db.transaction(async (tx) => {
                        response = await handlers.command(
                            tx,
                            "owner",
                            command,
                            encode({}),
                            BigInt(h.clock.now),
                            economy,
                        );
                        throw rollback;
                    })).rejects.toBe(rollback);
                    measuring = false;

                    return {
                        response,
                        write,
                        queries: count,
                        durationMs: performance.now() - started,
                    };
                };

                for (const command of Object.values(CityInitializationCommand))
                {
                    const before = await compare(command, false);
                    const after = await compare(command, true);

                    expect(after.response, command).toEqual(before.response);
                    expect(after.write, command).toEqual(before.write);
                    expect(after.queries).toBeLessThan(before.queries);
                    evidence.push({
                        command,
                        before: before.queries,
                        after: after.queries,
                        beforeMs: before.durationMs,
                        afterMs: after.durationMs,
                    });
                }

                await h.db.db.insert(user_branch_city_info).values({
                    uid: "owner",
                    openstate: 1,
                    takerewardcount: 0,
                }).onConflictDoUpdate({ target: user_branch_city_info.uid, set: { openstate: 1 } });
                const committed = await compare("branchcity.init", true);
                const unchanged = await compare("branchcity.init", false);

                expect(committed.response).toEqual(unchanged.response);
                expect(evidence).toHaveLength(21);
            }
            finally
            {
                await h.close();
                output.mockRestore();
                warnings.mockRestore();
                errors.mockRestore();
            }

            console.log(JSON.stringify({ kingdomId, queryComparison: evidence }));
        },
        120000,
    );
}
