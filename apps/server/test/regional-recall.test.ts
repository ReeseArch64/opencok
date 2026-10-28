import { test, expect } from "bun:test";
import {
    regionalRecallBand,
    regionalRecallEligible,
    regionalRecallRewards,
} from "@opencok/rules/regional-recall";
import { loadRules } from "@opencok/resources/rules";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("regional recall retains catalog ladders and requires registration and offline history owned by the server", async () => {
    const rules = await loadRules(),
        rule = rules.advanced.regionalRecalls!.get("9030001")!;
    expect(regionalRecallBand(rule, 15)).toBe(-1);
    expect(regionalRecallBand(rule, 18)).toBe(0);
    expect(regionalRecallBand(rule, 19)).toBe(1);
    expect(regionalRecallRewards(rule, 4)).toHaveLength(7);
    expect(() => regionalRecallRewards(rule, 99)).toThrow();
    expect(() => regionalRecallEligible({ ...rule, k3: "bad" }, {}, 16, 0n)).toThrow();
    const game = createRealmGameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
        cityProgression: async () => ({ body: { receive_num: sfs.int(0) }, pushes: [] }),
    });
    expect(
        (await game.execute("owner", "region.recall.open.ui", {
            _cok_: sfs.long(9007199254740993n),
        }))
            .body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
    await expect(game.execute("owner", "region.recall.init", {})).rejects.toThrow();
});
