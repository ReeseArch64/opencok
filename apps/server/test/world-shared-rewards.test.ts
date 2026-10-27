import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { sharedResourceRewards } from "../../../packages/services/src/world-shared-rewards";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
const rules = await loadRules();
rules.reconnect.rewards!.set("shared-a", { id: "shared-a", wood: "2" });
rules.reconnect.rewards!.set("shared-b", { id: "shared-b", stone: "3" });
rules.items.set("on_event2", {
  ...rules.items.get("on_event2")!,
  k5: "10",
  k6: "shared-a;shared-b",
  k7: "1;1",
});
const context = { rules, now: 1000000n };
test("shared collection rewards retain whole periods and native stochastic partial periods", () => {
  expect(sharedResourceRewards(context, 25000n, () => 0)).toEqual({
    reward: "wood,0,6",
    counts: [{ id: "shared-a", count: 3 }],
  });
  expect(sharedResourceRewards(context, 25000n, (maximum: number) => maximum - 1)).toEqual({
    reward: "stone,0,6",
    counts: [{ id: "shared-b", count: 2 }],
  });
  expect(sharedResourceRewards(context, 0n, () => 0)).toEqual({ reward: "", counts: [] });
});
test("native shared return awards the first Java hash reward identity for the total stored count", () => {
  const choices = [9, 0, 1];
  const result = sharedResourceRewards(context, 20000n, () => choices.shift()!);
  expect(result.counts).toEqual(
    javaHashMapOrder(["shared-a", "shared-b"]).map((id) => ({ id, count: 1 })),
  );
  expect(result.reward).toBe(result.counts[0]!.id === "shared-a" ? "wood,0,4" : "stone,0,6");
  expect(choices).toHaveLength(0);
});
