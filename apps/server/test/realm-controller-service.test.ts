import { expect, test } from "bun:test";
import { GameController } from "@opencok/controllers/game.controller";
import { WorldController } from "@opencok/world/controllers/world";
import { createRealmGameService } from "../src/composition/game";
import { createRealmWorldService } from "../src/composition/world";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
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
} satisfies GameStore;

test("realm Controllers compose real Services and preserve missing-state rejections", async () => {
    const game = new GameController(
        createRealmGameService(store, new Rules(new Map(), new Map(), new Map()), { kingdomId: 1 }),
    );
    const world = new WorldController(
        createRealmWorldService(
            {
                getWorldByPointIds: async () => ({
                    world: undefined,
                    points: [],
                    hasMarches: false,
                }),
            },
            1200,
            1,
        ),
    );
    await expect(game.initial("missing")).rejects.toMatchObject({ code: "E100169" });
    await expect(world.get("missing", { x: sfs.int(10), y: sfs.int(10) })).rejects.toBeDefined();
});
