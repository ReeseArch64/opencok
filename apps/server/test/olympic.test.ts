import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { olympicDefinitions, olympicDisplayedPool, olympicPayout } from "@opencok/rules/olympic";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("Olympic rules preserve tax normalization, integer pool growth and the zero-pool reward cap", async () => {
    const rules = await loadRules(),
        definition = olympicDefinitions(rules).find((row) => row.id === "7501001")!;
    expect(definition).toMatchObject({ type: 5, tax: 10 });
    expect(
        olympicDisplayedPool(
            { startBetTime: 0n, startTime: 3600000n, betNum: 50n },
            { rate: 100, cheat: 1000n },
            1800000n,
        ),
    ).toBe(1050n);
    expect(
        olympicPayout(100, { winningBetNum: 200n, rewardPool: 100n, tax: 10, rewardLimit: 10000 }),
    ).toBe(146);
    expect(olympicPayout(100, { winningBetNum: 100n, rewardPool: 0n, tax: 10, rewardLimit: 0 }))
        .toBe(
            100,
        );
});
test("Olympic public queries preserve LONG correlation and cannot publish or settle a result", async () => {
    const rules = await loadRules(),
        game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
            cityProgression: async () => ({ body: {}, pushes: [] }),
        });
    for (const command of ["Olympic.question.info", "Olympic.bet.info", "Olympic.reward"])
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    for (const command of ["Olympic.result", "Olympic.settle"])
    {
        await expect(game.execute("owner", command, {})).rejects.toThrow();
    }
});
