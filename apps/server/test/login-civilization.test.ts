import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { getTableColumns } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { Database } from "@opencok/repositories/game";
import { GameService as Game } from "@opencok/services/game";
import type { Row } from "@opencok/contracts/rows";
import type { CityState, GameStore } from "@opencok/contracts/game";
import { user } from "@opencok/mappings/city";
import { Rules } from "@opencok/rules/game";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";
import { emptyPowerState } from "./fixtures/power-state";

function rules()
{
    return new Rules(
        new Map(),
        new Map([["100100", { id: "100100", player_exp: "100" }]]),
        new Map(),
    );
}

const score = 9007199254740993n;
const prestige = 9007199254740995n;

test("login carries the saved civilization and exact score/prestige in init.user without mutation", async () => {
    const state: CityState = {
        profile: { uid: "synthetic", civilizationType: 3, civilizationSorce: score },
        resource: {},
        world: { worldId: 0 },
        lord: undefined,
        buildings: [],
        queues: [],
        armies: [],
        items: [],
        hasMarches: false,
        civilizationPrestige: prestige,
    };
    const before = structuredClone(state);
    const unused = async (): Promise<never> => {
        throw new Error("Unexpected dependency");
    };
    const store: GameStore = {
        mailGroups: unused,
        mailBatch: unused,
        mailCategory: unused,
        mailContents: unused,
        mailConversationSave: unused,
        mailDelete: unused,
        mailRead: unused,
        mailSave: unused,
        mailStatus: unused,
        allianceRanking: unused,
        playerRanking: unused,
        getPowerByPlayerId: async () => emptyPowerState(state.profile!),
        getProfileById: unused,
        getAccountsByPlayerId: unused,
        getPlayerSummariesByIds: unused,
        getWorldByPointIds: unused,
        getCityByPlayerId: async (uid) => {
            expect(uid).toBe("synthetic");
            return state;
        },
    };
    const initial = decode(
        encode(await new Game(store, rules(), { kingdomId: 1 }).initial("synthetic")),
    );
    expect(fields(initial.user)).toMatchObject({
        civilization_type: sfs.int(3),
        civilization_score: sfs.long(score),
        civilization_prestige: sfs.long(prestige),
    });
    expect(initial.newAccount).toEqual(sfs.bool(false));
    expect(initial.civilization_type).toBeUndefined();
    expect(fields(initial.user).civilizationType).toBeUndefined();
    expect(state).toEqual(before);
});

test("unselected and absent civilization values remain zero instead of inventing a selection", () => {
    const profiles: Row[] = [
        {},
        { civilizationType: null, civilizationSorce: null },
        { civilizationType: 0, civilizationSorce: 0n },
    ];
    for (const profile of profiles)
    {
        const result = decode(encode(user(profile, rules(), 2)));
        expect(result.civilization_type).toEqual(sfs.int(0));
        expect(result.civilization_score).toEqual(sfs.long(0));
        expect(result.civilization_prestige).toEqual(sfs.long(0));
    }
    const selected = user({ civilizationType: 4, civilizationSorce: score }, rules(), 2);
    expect(selected.civilization_type).toEqual(sfs.int(4));
    expect(selected.civilization_score).toEqual(sfs.long(score));
    expect(selected.civilization_prestige).toEqual(sfs.long(0));
});

function snapshot(
    options: {
        type?: number;
        missingProfile?: boolean;
        missingPrestige?: boolean;
        failure?: boolean;
    } = {},
)
{
    const queries: { text: string; params: unknown[]; }[] = [];
    const client = {
        query: async (query: { text: string; }, params: unknown[] = []) => {
            queries.push({ text: query.text, params });
            const table = query.text.match(/from "opencok_kingdom"\."([^"]+)"/)?.[1];
            if (table === "userprofile")
            {
                return {
                    rows: options.missingProfile
                        ? []
                        : [
                            Object.keys(getTableColumns(userprofile)).map(
                                (key) =>
                                    (
                                        {
                                            uid: "synthetic",
                                            civilizationType: options.type ?? 3,
                                        } as Record<
                                            string,
                                            unknown
                                        >
                                    )[key] ?? null,
                            ),
                        ],
                };
            }
            if (table === "user_civilization_prestige")
            {
                if (options.failure)
                {
                    throw new Error("Synthetic prestige read failure");
                }
                return { rows: options.missingPrestige ? [] : [[String(prestige)]] };
            }
            return { rows: [] };
        },
    };
    const database = new Database({
        databaseUrl: "postgresql://synthetic:synthetic@127.0.0.1:1/postgres",
        timeoutMs: 25,
        globalDatabase: "opencok_global",
        kingdomId: 2,
        kingdomDatabase: "opencok_kingdom_2",
    });
    Object.defineProperty(database.kingdom, "db", {
        value: drizzle(client as unknown as NodePgClient),
    });
    return { database, queries };
}

test("city snapshot reads prestige for the owner and selected civilization in its read-only transaction", async () => {
    const { database, queries } = snapshot();
    try
    {
        const state = await database.getCityByPlayerId("synthetic", 0);
        expect(state.civilizationPrestige).toBe(prestige);
        const query = queries.find((query) =>
            query.text.includes("from \"opencok_kingdom\".\"user_civilization_prestige\"")
        )!;
        expect(query.params).toEqual(["synthetic", 3, 1]);
        expect(query.text).toContain("\"user_civilization_prestige\".\"uid\" = $1");
        expect(query.text).toContain("\"user_civilization_prestige\".\"civilizationType\" = $2");
        expect(query.text).toContain("\"prestigeValue\"");
        expect(queries[0]!.text).toBe("begin isolation level repeatable read read only");
        expect(queries.at(-1)!.text).toBe("commit");
        expect(queries.every((query) => !/\b(insert|update|delete)\b/i.test(query.text))).toBe(
            true,
        );
    }
    finally
    {
        await database.close();
    }
});

test("missing prestige defaults to zero; unselected/missing profiles skip the prestige read", async () => {
    for (const options of [{ missingPrestige: true }, { type: 0 }, { missingProfile: true }])
    {
        const { database, queries } = snapshot(options);
        try
        {
            expect((await database.getCityByPlayerId("synthetic", 0)).civilizationPrestige).toBe(
                0n,
            );
            if (!options.missingPrestige)
            {
                expect(
                    queries.some((query) =>
                        query.text.includes(
                            "from \"opencok_kingdom\".\"user_civilization_prestige\"",
                        )
                    ),
                ).toBe(false);
            }
        }
        finally
        {
            await database.close();
        }
    }
});

test("a failed prestige read rolls back instead of reporting a false saved value", async () => {
    const { database, queries } = snapshot({ failure: true });
    try
    {
        await expect(database.getCityByPlayerId("synthetic", 0)).rejects.toThrow();
        expect(queries.at(-1)!.text).toBe("rollback");
        expect(queries.some((query) => query.text === "commit")).toBe(false);
    }
    finally
    {
        await database.close();
    }
});

test("abandoned login stops before the next initialization stage", async () => {
    const controller = new AbortController();
    const calls: string[] = [];
    const game = new Game({} as GameStore, rules(), { kingdomId: 1 }, () => 0, {
        cityProgression: async (_owner, command) => {
            calls.push(command);
            controller.abort();

            return { body: {}, pushes: [] };
        },
    });
    await expect(game.initialize("synthetic", {}, controller.signal)).rejects.toThrow();
    expect(calls).toEqual(["egg.activity.init"]);
    await expect(game.initialize("synthetic", {}, controller.signal)).rejects.toThrow();
    expect(calls).toHaveLength(1);
});
