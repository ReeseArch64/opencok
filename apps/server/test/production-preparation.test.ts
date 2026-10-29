import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import type { ProductionPreparation } from "@opencok/production/contracts/persistence";
import {
    readProductionProgress,
    readReconnectProgress,
} from "@opencok/repositories/reconnect-progress";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";
import { sfs } from "@opencok/messages/sfs";
import { loadRules } from "@opencok/resources/rules";
import { importBuildingDefinition } from "@opencok/building/mappings/legacy-definition";
import {
    createRealmProductionExecutor,
    createRealmProductionService,
    createRealmProductionPreparation,
    planRealmProductionContext,
} from "../src/composition/production";

function fixture()
{
    const rows: Record<string, Row[]> = {
        userprofile: [{
            uid: "owner",
            serverId: 1,
            name: "Synthetic",
            level: 1,
            exp: 0,
            gold: "100",
            banFlag: 0,
            banTime: "0",
            appVersion: "12.06.0",
            civilizationType: 0,
        }],
        user_resource: [{ uid: "owner", food: "1000", foodbind: "0", lastUpdateTime: "1000" }],
        realm_authority: [{ ownerEpoch: "1" }],
    };
    const queries: { sql: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            const sql = query.text;
            queries.push({ sql, params });
            const table = /(?:from|update|into) "opencok_kingdom"\."([^"]+)"/.exec(sql)?.[1];
            const fields = /^(?:select (.*?) from |.* returning (.*)$)/.exec(sql);
            const columns = (fields?.[1] ?? fields?.[2])?.split(", ");

            return {
                rows: columns
                    ? (rows[table ?? ""] ?? []).map((row) =>
                        columns.map((column) =>
                            row[[...column.matchAll(/"([^"]+)"/g)].at(-1)![1]!] ?? null
                        )
                    )
                    : [],
            };
        },
    };
    const db = drizzle(client as unknown as NodePgClient, { schema });
    const authority = {
        kingdomId: 1,
        epoch: 1n,
        instance: "synthetic",
        assertReady()
        {},
    };

    return { rows, queries, db, authority };
}

const providers = {
    worldPowerEffects: async () => new Map<string, string>(),
    emperorVersion: async () => null,
};

function fullPreparation(h: ReturnType<typeof fixture>, rules: Rules): ProductionPreparation
{
    return {
        async prepare(tx, owner, now)
        {
            const state = await readReconnectProgress(tx, owner, 1, now);
            const planned = await planRealmProductionContext(state, rules, now, providers);
            await persistReconnectProgress(
                tx,
                state,
                {
                    ...planned.write,
                    tasks: { inserts: [], updates: [] },
                    generalResets: [],
                    skillResets: [],
                    skillCooldownResets: [],
                    buildingRefreshes: [],
                    mail: [],
                },
                h.authority,
                now,
            );

            return planned.rates;
        },
    };
}

function executor(
    h: ReturnType<typeof fixture>,
    rules: Rules,
    preparation?: ProductionPreparation,
    now = 1000,
)
{
    return createRealmProductionExecutor(
        h.db,
        h.authority,
        preparation ?? createRealmProductionPreparation(rules, h.authority, providers),
        () => now,
    );
}

const command = (requestId: string) => ({
    owner: "owner",
    requestId,
    command: "init",
    request: Buffer.from("1"),
});

const plan = () => ({
    response: Buffer.from("ok"),
    items: [],
    profile: {},
    resource: {},
    cooldowns: new Map<string, bigint>(),
    postings: [],
    accounts: [],
    buildings: [],
});

const selects = (h: ReturnType<typeof fixture>) =>
    h.queries.filter((query) => query.sql.startsWith("select "));

const writes = (h: ReturnType<typeof fixture>) =>
    h.queries.filter((query) => /^(insert|update)/.test(query.sql));

test("prepare_reconnectOnlyDomains_removesQueriesAtProductionExecutorBoundary", async () => {
    const rules = await loadRules(undefined, 1);
    const full = fixture();
    const narrow = fixture();

    const before = await executor(full, rules, fullPreparation(full, rules))(
        command("phase-1"),
        async () => plan(),
    );
    const after = await executor(narrow, rules)(command("phase-1"), async () => plan());

    expect(before).toEqual(after);
    expect(selects(full)).toHaveLength(54);
    expect(selects(narrow)).toHaveLength(41);
    expect(selects(narrow).map((query) => /from "opencok_kingdom"\."([^"]+)"/.exec(query.sql)?.[1]))
        .not.toContain("user_hospital");
    expect(
        selects(narrow).some((query) =>
            /"(?:stat_reg|user_task|queue|user_world|user_skill|user_wall|user_knight_title|civilization_castle|playerinfo)"/
                .test(query.sql)
        ),
    ).toBe(false);
    expect(writes(narrow)).toEqual(writes(full));
    expect(narrow.queries[0]!.sql).toContain("begin");
    expect(narrow.queries.at(-1)!.sql).toBe("commit");
});

test("prepare_elapsedInterval_preservesFoodDebitsAndIntervalReceipts", async () => {
    const rules = await loadRules(undefined, 1);
    rules.arms.set("100001", { upkeep: "86400000", new_arms: "0" });
    const full = fixture();
    const narrow = fixture();
    full.rows.user_army = narrow.rows.user_army = [{ uid: "owner", armyId: "100001", free: 1 }];

    await executor(full, rules, fullPreparation(full, rules), 2000)(
        command("phase-1"),
        async () => plan(),
    );
    await executor(narrow, rules, undefined, 2000)(command("phase-1"), async () => plan());

    expect(selects(full)).toHaveLength(55);
    expect(selects(narrow)).toHaveLength(42);
    expect(writes(narrow)).toEqual(writes(full));
    expect(writes(narrow).map((query) => /"opencok_kingdom"\."([^"]+)"/.exec(query.sql)?.[1]))
        .toEqual([
            "command_receipt",
            "economy_posting",
            "economy_posting",
            "resource_settlement",
            "user_resource",
            "command_receipt",
        ]);
    expect(writes(narrow).find((query) => query.sql.startsWith("update"))!.params).toEqual([
        0n,
        2000n,
        0n,
        "owner",
        1000n,
    ]);
});

test("prepare_starvingKnights_preservesWeaknessAndDeathLedger", async () => {
    const rules = await loadRules(undefined, 1);
    rules.arms.set("100001", { upkeep: "86400000", new_arms: "1", arm: "1" });
    rules.features.set("p6_all", { version: "1.0.0", online: "all" });
    rules.features.set("p6_security_resources", { version: "1.0.0", online: "all" });
    rules.features.set("p6_weak", { version: "1.0.0", online: "all" });
    rules.items.set("week_info", { k1: "1", k2: "500" });
    rules.buildings.set(439001, importBuildingDefinition({ level: "1", unlock_type: "1" }, 439001));
    rules.buildings.set(441001, importBuildingDefinition({ level: "1", para1: "4" }, 441001));
    const full = fixture();
    const narrow = fixture();
    full.rows.user_resource = narrow.rows.user_resource = [{
        uid: "owner",
        food: "100",
        foodbind: "0",
        lastUpdateTime: "0",
    }];
    full.rows.user_army = narrow.rows.user_army = [{
        uid: "owner",
        armyId: "100001",
        free: 10,
        defence: 0,
        pve: 0,
        march: 0,
    }];
    full.rows.user_building = narrow.rows.user_building = [
        { uid: "owner", uuid: "templar", itemId: 439000, level: 1, unlockFlag: 1 },
        { uid: "owner", uuid: "hospital", itemId: 441000, level: 1 },
    ];

    await executor(full, rules, fullPreparation(full, rules), 2100)(
        command("phase-1"),
        async () => plan(),
    );
    await executor(narrow, rules, undefined, 2100)(command("phase-1"), async () => plan());

    expect(writes(narrow)).toEqual(writes(full));
    expect(
        writes(narrow).find((query) =>
            query.sql.startsWith("update \"opencok_kingdom\".\"user_army\"")
        )!.params,
    ).toEqual([2, 0, "owner", "100001"]);
    const settlement = writes(narrow).find((query) =>
        query.sql.includes("\"resource_settlement\"")
    )!;
    expect(settlement.params).toContain(2090n);
    expect(settlement.params).toContain(
        "[{\"armyId\":\"100001\",\"freeBefore\":10,\"freeAfter\":2,\"defenceBefore\":0,\"defenceAfter\":0,\"weakened\":4,\"dead\":4}]",
    );
});

test("prepare_expiringEffects_preservesProductionRateTimeline", async () => {
    const rules = await loadRules(undefined, 1);
    rules.power.statuses = new Map([["1", { effect: "50;100" }]]);
    const full = fixture();
    const narrow = fixture();
    full.rows.user_state = narrow.rows.user_state = [{
        uid: "owner",
        stateId: 1,
        startTime: "0",
        endTime: "1500",
    }];
    const building = { uid: "owner", uuid: "wood", itemId: 413000, level: 1, effectTime: 2000n };
    full.rows.user_building = narrow.rows.user_building = [building];
    const before = await full.db.transaction((tx) =>
        fullPreparation(full, rules).prepare(tx, "owner", 1000n)
    );
    const after = await narrow.db.transaction((tx) =>
        createRealmProductionPreparation(rules, narrow.authority, providers).prepare(
            tx,
            "owner",
            1000n,
        )
    );

    const actual = await after(building, 1000n);

    expect(actual).toEqual(await before(building, 1000n));
    expect(actual.map((rate) => rate.at)).toEqual([1000n, 1500n, 2000n]);
    expect(actual[0]!.perHour).toBeGreaterThan(actual[1]!.perHour);
    expect(actual[1]!.perHour).toBeGreaterThan(actual[2]!.perHour);
});

test("prepare_nextCommand_readsChangedEffectsAgain", async () => {
    const rules = await loadRules(undefined, 1);
    rules.power.statuses = new Map([["1", { effect: "50;100" }]]);
    const h = fixture();
    const building = { uid: "owner", uuid: "wood", itemId: 413000, level: 1 };
    h.rows.user_building = [building];
    const execute = executor(h, rules);
    const rates: bigint[] = [];
    await execute(command("phase-1"), async (state) => {
        rates.push((await state.rates(building, state.now))[0]!.perHour);
        expect(state.now).toBe(1000n);

        return plan();
    });
    h.rows.user_state = [{ uid: "owner", stateId: 1, startTime: "0", endTime: "2000" }];
    await execute(command("phase-2"), async (state) => {
        rates.push((await state.rates(building, state.now))[0]!.perHour);

        return plan();
    });

    expect(rates[1]!).toBeGreaterThan(rates[0]!);
    expect(
        selects(h).filter((query) => query.sql.includes("from \"opencok_kingdom\".\"user_state\"")),
    ).toHaveLength(2);
    expect(
        selects(h).filter((query) =>
            query.sql.includes("from \"opencok_kingdom\".\"user_resource\"")
            && query.sql.includes("for update")
        ),
    ).toHaveLength(4);
});

test("readProductionProgress_narrowSnapshot_omitsUnloadedDomains", async () => {
    const h = fixture();
    const state = await h.db.transaction((tx) => readProductionProgress(tx, "owner", 1, 1000n));

    expect(Object.keys(state).sort()).toEqual([
        "allianceResearch",
        "armies",
        "buildings",
        "effects",
        "generals",
        "glory",
        "newGenerals",
        "profile",
        "resource",
        "weakness",
    ]);
});

test("prepare_staleAuthority_rollsBackBeforeProductionReads", async () => {
    const rules = await loadRules(undefined, 1);
    const h = fixture();
    h.rows.realm_authority = [];

    await expect(executor(h, rules)(command("phase-1"), async () => plan())).rejects.toThrow();

    expect(selects(h)).toHaveLength(1);
    expect(writes(h)).toEqual([]);
    expect(h.queries.at(-1)!.sql).toBe("rollback");
});

test("prepare_existingCommandReceipt_replaysWithoutResettlingProduction", async () => {
    const rules = await loadRules(undefined, 1);
    const h = fixture();
    h.rows.command_receipt = [{
        command: "init",
        request: Buffer.from("1"),
        response: Buffer.from("cached"),
        expiresAt: null,
    }];

    const response = await executor(h, rules)(command("phase-1"), async () => {
        throw new Error("Unexpected replay planning");
    });

    expect(response).toEqual(Buffer.from("cached"));
    expect(selects(h)).toHaveLength(3);
    expect(writes(h)).toEqual([]);
});

test("productionSettle_elapsedHour_preservesAccountsWithFewerExecutorQueries", async () => {
    const rules = await loadRules(undefined, 1);
    rules.arms.set("100001", { upkeep: "86400000", new_arms: "0" });
    const full = fixture();
    const narrow = fixture();
    full.rows.userprofile![0]!.allianceId = "synthetic-alliance";
    narrow.rows.userprofile![0]!.allianceId = "synthetic-alliance";
    full.rows.user_army = narrow.rows.user_army = [{ uid: "owner", armyId: "100001", free: 1 }];
    full.rows.user_building = narrow.rows.user_building = [
        { uid: "owner", uuid: "wood", itemId: 413000, level: 1, refreshTime: "1000" },
        { uid: "owner", uuid: "iron", itemId: 414000, level: 1, refreshTime: "1000" },
        { uid: "owner", uuid: "food", itemId: 415000, level: 1, refreshTime: "1000" },
        { uid: "owner", uuid: "stone", itemId: 412000, level: 1, refreshTime: "1000" },
    ];
    const effects = { world: async () => new Map<number, number>(), emperor: async () => null };
    const before = createRealmProductionService(
        executor(full, rules, fullPreparation(full, rules), 3601000),
        rules,
        effects,
    );
    const after = createRealmProductionService(
        executor(narrow, rules, undefined, 3601000),
        rules,
        effects,
    );
    const params = { operationId: sfs.string("login-production") };

    const original = await before.command("owner", "production.settle", params);
    const actual = await after.command("owner", "production.settle", params);

    expect(actual).toEqual(original);
    expect(selects(full)).toHaveLength(58);
    expect(selects(narrow)).toHaveLength(45);
    expect(full.queries).toHaveLength(72);
    expect(narrow.queries).toHaveLength(59);
    expect(writes(narrow)).toHaveLength(12);
    expect(writes(narrow)).toEqual(writes(full));
    const accounts = writes(narrow).filter((query) =>
        query.sql.startsWith("insert into \"opencok_kingdom\".\"building_production\"")
    );
    expect(accounts).toHaveLength(4);
    expect(accounts.map((query) => query.params[3])).toEqual([
        3601000n,
        3601000n,
        3601000n,
        3601000n,
    ]);
    expect(accounts.map((query) => (query.params[4] as bigint) > 0n)).toEqual([
        true,
        true,
        true,
        true,
    ]);
    expect(
        writes(narrow).filter((query) =>
            query.sql.startsWith("insert into \"opencok_kingdom\".\"resource_settlement\"")
        ),
    ).toHaveLength(1);
});
