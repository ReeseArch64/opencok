import { expect, test } from "bun:test";
import { GameController } from "../src/game.controller.ts";
import { WorldController } from "../src/world.controller.ts";
import { GameService } from "@opencok/services/game";
import { WorldService } from "@opencok/services/world";
import { Rules } from "@opencok/rules/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { GameStore } from "@opencok/contracts/game";

const unavailable = async (): Promise<never> => {
    throw new Error("unexpected persistence operation");
};

const store = {
    mailGroups: unavailable,
    mailBatch: unavailable,
    mailCategory: unavailable,
    mailContents: unavailable,
    mailConversationSave: unavailable,
    mailDelete: unavailable,
    mailRead: unavailable,
    mailSave: unavailable,
    mailStatus: unavailable,
    allianceRanking: unavailable,
    playerRanking: unavailable,
    publicProfile: unavailable,
    getPowerByPlayerId: unavailable,
    getPlayerSummariesByIds: unavailable,

    async getProfileById()
    {
        return undefined;
    },
    async getAccountsByPlayerId()
    {
        return [];
    },
    async getCityByPlayerId()
    {
        return {
            profile: undefined,
            resource: undefined,
            buildings: [],
            queues: [],
            world: undefined,
            hasMarches: false,
            armies: [],
            items: [],
            lord: undefined,
        };
    },
    async getWorldByPointIds()
    {
        return { world: undefined, points: [], hasMarches: false };
    },
} satisfies GameStore;

test("realm Controllers compose real Services and preserve missing-state rejections", async () => {
    const game = new GameController(
        new GameService(store, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }),
    );
    const world = new WorldController(new WorldService(store, 1200, 1));
    await expect(game.initial("missing")).rejects.toMatchObject({ code: "E100169" });
    await expect(world.get("missing", { x: sfs.int(10), y: sfs.int(10) })).rejects.toBeDefined();
});

test("command Controller preserves response identity, typed correlation, pushes and errors", async () => {
    const params: Fields = { _cok_: sfs.long(9007199254740993n) };
    const result = { body: params, pushes: [{ command: "push", body: params }] };
    const failure = new Error("controlled failure");
    const game = new GameController({
        async initial()
        {
            return params;
        },
        async initialize(uid, correlation)
        {
            expect(uid).toBe("owner");
            expect(correlation).toBe(params);
            return result;
        },
        async execute(uid, command, fields)
        {
            expect(uid).toBe("owner");
            expect(fields).toBe(params);
            if (command === "fail")
            {
                throw failure;
            }
            return result;
        },
    });
    expect(await game.initial("owner")).toBe(params);
    expect(await game.initialize("owner", params)).toBe(result);
    expect(await game.execute("owner", "read", params)).toBe(result);
    await expect(game.execute("owner", "fail", params)).rejects.toBe(failure);
});
