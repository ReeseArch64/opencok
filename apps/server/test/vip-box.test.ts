import { test, expect } from "bun:test";
import { vipBoxWeighted, vipBoxIndices, vipBoxBand } from "@opencok/rules/vip-box";
import { loadRules } from "@opencok/resources/rules";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("VIP wheel uses exclusive weighted bands and validates distinct saved indices", async () => {
    expect(vipBoxWeighted([1, 1], () => 0)).toBe(0);
    expect(vipBoxWeighted([1, 1], () => 1)).toBe(1);
    expect(vipBoxWeighted([0, 1], () => 0)).toBe(1);
    expect(() => vipBoxWeighted([1], () => 1)).toThrow();
    expect(() => vipBoxIndices("0,0,", 2)).toThrow();
    expect(() => vipBoxIndices("2,", 2)).toThrow();
    expect(vipBoxIndices("0,1,", 2)).toEqual([0, 1]);
    const rules = await loadRules(),
        tables = [...rules.advanced.vipBoxes!.values()];
    expect(vipBoxBand(tables, 0)).toBe(8);
    expect(vipBoxBand(tables, 15)).toBe(11);
    expect(vipBoxBand(tables, 16)).toBe(16);
});
test("native VIP wheel requests preserve long correlations and cannot invoke initialization", async () => {
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: {}, pushes: [] }) },
    );
    expect(
        (
            await game.execute("owner", "vip.box.turntable.ui", {
                vip: sfs.int(8),
                _cok_: sfs.long(9007199254740993n),
            })
        ).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
    await expect(game.execute("owner", "vip.box.init", {})).rejects.toThrow();
});
