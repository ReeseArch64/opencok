import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  fragmentExchangeRecipes,
  readFragmentExchangeOffers,
  selectFragmentExchangeOffers,
} from "@opencok/rules/fragment-exchange";
import { campaignEventMatches } from "@opencok/rules/local-campaign";
test("all maintained fragment recipes preserve configured type weights, duplicate composition and descending native tiers", async () => {
  const rules = await loadRules(),
    recipes = fragmentExchangeRecipes(rules.advanced.fragments!.values());
  expect(recipes).toHaveLength(13);
  const histogram = new Map<number, number>();
  for (let draw = 0; draw < 100; draw++) {
    const offer = selectFragmentExchangeOffers(
      recipes,
      (maximum) => (maximum === 100 ? draw : 0),
      6,
    )[0]!;
    histogram.set(offer.same, (histogram.get(offer.same) ?? 0) + 1);
    expect(offer.id).toHaveLength(6);
    expect(new Set(offer.id).size).toBe(7 - offer.same);
    expect(readFragmentExchangeOffers(Buffer.from(JSON.stringify([offer]) + "\0\0"))).toEqual([
      offer,
    ]);
  }
  expect([...histogram]).toEqual([
    [1, 16],
    [2, 30],
    [3, 30],
    [4, 20],
    [5, 2],
    [6, 2],
  ]);
  expect(selectFragmentExchangeOffers(recipes, () => 0).map((offer) => offer.type)).toEqual([
    6, 4, 3,
  ]);
  expect(() => selectFragmentExchangeOffers(recipes, (maximum) => maximum)).toThrow();
});
test("fragment snapshots reject invalid repetition proofs, duplicate tiers and malformed byte input", () => {
  const offer = {
    id: ["209699", "209699", "209700"],
    type: 3,
    same: 2,
    reward: "247012",
    multiple: 2,
  };
  expect(readFragmentExchangeOffers(Buffer.from(JSON.stringify([offer])))).toEqual([offer]);
  for (const value of [
    [],
    [offer, offer],
    [{ ...offer, same: 1 }],
    [{ ...offer, multiple: 0 }],
    [{ ...offer, id: ["209699"] }],
  ])
    expect(() => readFragmentExchangeOffers(Buffer.from(JSON.stringify(value)))).toThrow();
  expect(() => readFragmentExchangeOffers(Buffer.from([255]))).toThrow();
  expect(() => readFragmentExchangeOffers(Buffer.alloc(65536))).toThrow();
});
test("exchange campaign selectors match their two independent native wildcard positions without broadening ordinary item selectors", () => {
  expect(campaignEventMatches(62, "-1;-1", "57006;247012")).toBe(true);
  expect(campaignEventMatches(62, "57006;-1", "57006;247012")).toBe(true);
  expect(campaignEventMatches(62, "-1;247012", "57006;247012")).toBe(true);
  expect(campaignEventMatches(62, "57006;247012", "57006;247013")).toBe(false);
  expect(campaignEventMatches(62, "57006;-1", "57007;247012")).toBe(false);
  expect(campaignEventMatches(62, "-1;-1", "57006")).toBe(false);
  expect(campaignEventMatches(40, "-1", "209699")).toBe(false);
  expect(campaignEventMatches(62, undefined, "57006;247012")).toBe(false);
  expect(campaignEventMatches(62, "-1;-1", ";247012")).toBe(false);
});
