import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import {
    militaryRankAdd,
    militaryRankGrant,
    militaryRankDefault,
    militaryRankHonorCap,
    militaryRankCents,
} from "@opencok/rules/military-rank-awards";
import { applyMilitaryRankAward } from "@opencok/services/military-rank-awards";
import { CityProgressionContext } from "@opencok/services/city-progression";
import type { CityProgressionState } from "@opencok/contracts/city-progression";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
function fixture(clockMarker: bigint | undefined = 1n, now = 100n)
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.features.set("wr_switch", {
        id: "wr_switch",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    rules.items.set("wr_info", { id: "wr_info", k2: "180", k13: "1:25000|2:26000" });
    rules.profile.militaryRanks = new Map([
        ["20018001", { id: "20018001", level: "1", experience: "0", status: "" }],
        ["20018002", { id: "20018002", level: "2", experience: "15", status: "510056" }],
    ]);
    const row = {
            ...militaryRankDefault("owner"),
            militaryRank: 20018001,
            militaryScore: 12.34,
            honor: 100,
            maxHonorWeekly: 24995,
        },
        context = new CityProgressionContext(
            {
                profile: { uid: "owner" },
                militaryAward: {
                    async load()
                    {
                        return { row, clockMarker };
                    },
                },
            } as unknown as CityProgressionState,
            rules,
            now,
            {} as ActivityEconomy,
            () => 0,
        );
    return { context, rules, row };
}
test("military awards retain float32 addition, clamp and the database's numeric bounds", () => {
    expect(militaryRankAdd(12.34, 1)).toBe(13.34);
    expect(militaryRankAdd(16777216, 1)).toBe(16777216);
    expect(militaryRankAdd(2, -5)).toBe(0);
    expect(militaryRankCents(13.34)).toBe(1334n);
    for (const value of [NaN, Infinity, -1, 1000000000])
    {
        expect(() => militaryRankAdd(value, 1)).toThrow();
    }
    expect(() => militaryRankAdd(999999936, 128)).toThrow();
    expect(() => militaryRankAdd(1, NaN)).toThrow();
});
test("weekly honor caps use actual float32 credit and retain all rank, reset, skill and award metadata", () => {
    const row = {
        ...militaryRankDefault("owner"),
        honor: 100,
        maxHonorWeekly: 24995,
        militaryRank: 20018002,
        rankingExp: 123,
        skill: "saved-skills",
        status: 0,
        lastTimeReset: 20n,
        lastTimeSet0Tostatus: 30n,
    };
    expect(militaryRankGrant(row, { kind: "milhonor", amount: 20 }, 25000)).toEqual({
        ...row,
        honor: 105,
        maxHonorWeekly: 25000,
    });
    expect(
        militaryRankGrant(
            { ...row, honor: 12.34, maxHonorWeekly: 24999.99 },
            { kind: "milhonor", amount: 1 },
            25000,
        ),
    ).toMatchObject({ honor: 12.35, maxHonorWeekly: 25000 });
    expect(
        militaryRankGrant(
            { ...row, maxHonorWeekly: 26000 },
            { kind: "milhonor", amount: 20 },
            25000,
        ),
    ).toMatchObject({ honor: 100, maxHonorWeekly: 25000 });
    expect(() => militaryRankGrant(row, { kind: "military", amount: NaN }, 0)).toThrow();
});
test("configured rank levels select honor ceilings without changing rank thresholds or granting effects", () => {
    const { rules } = fixture();
    expect(() => militaryRankHonorCap(rules, militaryRankDefault("owner"))).toThrow();
    expect(militaryRankHonorCap(rules, { militaryRank: 20018001 })).toBe(25000);
    expect(militaryRankHonorCap(rules, { militaryRank: 20018002 })).toBe(26000);
    expect(() => militaryRankHonorCap(rules, { militaryRank: 999 })).toThrow();
    rules.items.set("wr_info", { k13: "1:25000|1:30000" });
    expect(() => militaryRankHonorCap(rules, { militaryRank: 20018001 })).toThrow();
});
test("trusted award planning binds one entitlement and exposes requested versus actually credited honor", async () => {
    const { context, row } = fixture();
    expect(
        await applyMilitaryRankAward(context, {
            kind: "military",
            amount: 3,
            entitlementId: "gift",
        }),
    ).toEqual({ requested: 3, credited: 3, balance: 15.34 });
    expect(
        await applyMilitaryRankAward(context, {
            kind: "milhonor",
            amount: 20,
            entitlementId: "gift",
        }),
    ).toEqual({ requested: 20, credited: 5, balance: 105 });
    expect(context.write.militaryAward?.before).toEqual(row);
    expect(context.write.militaryAward?.after).toMatchObject({
        militaryScore: 15.34,
        honor: 105,
        maxHonorWeekly: 25000,
    });
    expect(context.write.states).toBeUndefined();
    await expect(
        applyMilitaryRankAward(context, { kind: "military", amount: 1, entitlementId: "other" }),
    ).rejects.toThrow();
});
test("missing zero future and expired authoritative clocks preserve awards while the closed switch skips military readers", async () => {
    for (const marker of [undefined, 0n, 101n])
    {
        const { context } = fixture(marker);
        if (marker === undefined)
        {
            context.state.militaryAward = {
                async load()
                {
                    return { row: undefined, clockMarker: undefined };
                },
            };
        }
        await expect(
            applyMilitaryRankAward(context, { kind: "military", amount: 1, entitlementId: "gift" }),
        ).rejects.toThrow();
        expect(context.write.militaryAward).toBeUndefined();
    }
    const expired = fixture(1n, 181n * 86400000n + 1n);
    await expect(
        applyMilitaryRankAward(expired.context, {
            kind: "military",
            amount: 1,
            entitlementId: "gift",
        }),
    ).rejects.toThrow();
    expect(expired.context.write.militaryAward).toBeUndefined();
    const { context, rules } = fixture();
    rules.features.set("wr_switch", { online: "close", test: "close" });
    context.state.militaryAward = {
        async load()
        {
            throw new Error("Closed military reader called");
        },
    };
    expect(
        await applyMilitaryRankAward(context, {
            kind: "milhonor",
            amount: 1,
            entitlementId: "gift",
        }),
    ).toBeUndefined();
});
