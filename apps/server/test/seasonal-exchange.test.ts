import { test, expect } from "bun:test";
import { selectSeasonalRewards, seasonalExchangeRewards } from "@opencok/rules/seasonal-exchange";
import { loadRules } from "@opencok/resources/rules";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("maintained seasonal choices pin five bounded reward and cost pairs", async () => {
    const rules = await loadRules(),
        raw = selectSeasonalRewards(rules.items.get("chrisms")!, () => 0),
        offers = seasonalExchangeRewards(raw);
    expect(offers).toHaveLength(5);
    expect(offers.every((offer) => rules.reconnect.rewards!.has(offer.id) && offer.count > 0)).toBe(
        true,
    );
    expect(() => seasonalExchangeRewards("1;1")).toThrow();
    expect(() => seasonalExchangeRewards(Array(5).fill("1;-1").join("|"))).toThrow();
});
test("native seasonal commands preserve the client correlation", async () => {
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: {}, pushes: [] }) },
    );
    expect(
        (
            await game.execute("owner", "activity.exchange.info", {
                type: sfs.int(5),
                _cok_: sfs.long(9007199254740993n),
            })
        ).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
});
