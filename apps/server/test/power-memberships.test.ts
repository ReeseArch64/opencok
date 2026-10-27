import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { vipEffects, allianceScienceEffects } from "@opencok/rules/power-memberships";
import { Rules } from "@opencok/rules/game";

const now = 1792756800000;
function fixture() {
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    1,
    new Map(),
    {},
    {
      vip: new Map(),
      superVip: new Map(),
      allianceSciences: new Map(),
    },
  );
  const vip: Row = { score: 250, vipEndTime: BigInt(now + 1), sLevel: 0, level: -1, vip_switch: 0 };
  rules.power.vip!.set("7000", { id: "7000", point: "0", effect: "487;1" });
  rules.power.vip!.set("7001", { id: "7001", point: "100", effect: "487;10|999;5|487;15" });
  rules.power.vip!.set("7002", { id: "7002", point: "300", effect: "487;100" });
  return { rules, vip };
}

test("VIP effects select by score in catalog order and replace duplicate IDs before adding super VIP", () => {
  const { rules, vip } = fixture();
  expect(vipEffects(vip, rules, now)).toEqual(
    new Map([
      [487, 15],
      [999, 5],
    ]),
  );
  vip.sLevel = 2;
  rules.power.superVip!.set("7011", { id: "7011", effect: "487;0.5|487;1.25|888;3" });
  const before = { ...vip };
  expect(vipEffects(vip, rules, now)).toEqual(
    new Map([
      [487, 16.75],
      [999, 5],
      [888, 3],
    ]),
  );
  expect(vip).toEqual(before);
  rules.power.vip!.set("6999", { id: "6999", point: "50", effect: "487;2" });
  expect(vipEffects(vip, rules, now)).toEqual(
    new Map([
      [487, 3.75],
      [888, 3],
    ]),
  );
});

test("VIP activation has an exclusive deadline and retains millisecond precision beyond Number safety", () => {
  const { rules, vip } = fixture();
  for (const vipEndTime of [0n, BigInt(now - 1), BigInt(now)]) {
    const expired = { ...vip, vipEndTime, score: "invalid", sLevel: "invalid" };
    expect(vipEffects(expired, rules, now).size).toBe(0);
  }
  expect(vipEffects(undefined, rules, now).size).toBe(0);
  expect(vipEffects({ ...vip, vipEndTime: 9007199254740993n }, rules, now).get(487)).toBe(15);
  for (const vipEndTime of [9007199254740992, 9223372036854775808n, "private-invalid", null])
    {expect(() => vipEffects({ ...vip, vipEndTime }, rules, now)).toThrow("102192");}
});

test("VIP score thresholds, absent tiers and float increments do not alter stored progression", () => {
  const { rules, vip } = fixture();
  expect(vipEffects({ ...vip, score: -1 }, rules, now).size).toBe(0);
  expect(vipEffects({ ...vip, score: 100 }, rules, now).get(487)).toBe(15);
  expect(vipEffects({ ...vip, score: 300 }, rules, now).get(487)).toBe(100);
  rules.power.vip!.get("7001")!.effect = "487;16777216";
  rules.power.superVip!.set("7010", { id: "7010", effect: "487;1|487;1" });
  expect(vipEffects({ ...vip, sLevel: 1 }, rules, now).get(487)).toBe(16777216);
});

test("active VIP state requires its catalogs and rejects malformed points and numeric effects", () => {
  const { rules, vip } = fixture();
  expect(() => vipEffects({ ...vip, sLevel: 1 }, rules, now)).toThrow("102192");
  for (const effect of ["487;NaN", "487;1e100", "487", "invalid;1", "487;0x10"]) {
    rules.power.vip!.get("7001")!.effect = effect;
    expect(() => vipEffects(vip, rules, now)).toThrow("102192");
  }
  rules.power.vip!.get("7001")!.effect = "";
  expect(vipEffects(vip, rules, now).size).toBe(0);
  rules.power.vip!.get("7001")!.point = "1.5";
  expect(() => vipEffects(vip, rules, now)).toThrow("102192");
  rules.power.vip!.clear();
  expect(() => vipEffects(vip, rules, now)).toThrow("102192");
});

test("alliance science uses persisted levels including zero and semicolon-delimited effects", () => {
  const { rules } = fixture();
  rules.power.allianceSciences!.set("1002", { id: "1002", para1: "487;999;487", para2: "2.5" });
  rules.power.allianceSciences!.set("2000", { id: "2000", para1: "487", para2: "0.5" });
  const sciences: Row[] = [
    { scienceId: 1000, level: 2, researchstarttime: 1n, effectflag: 0 },
    { scienceId: 2000, level: 0, researchstarttime: 1n, effectflag: 1 },
  ];
  const before = structuredClone(sciences);
  expect(allianceScienceEffects(sciences, rules)).toEqual(
    new Map([
      [487, 5.5],
      [999, 2.5],
    ]),
  );
  expect(sciences).toEqual(before);
  expect(allianceScienceEffects([], rules).size).toBe(0);
});

test("alliance effect addition preserves float order and signed ID arithmetic", () => {
  const { rules } = fixture();
  rules.power.allianceSciences!.set("-2147483648", {
    id: "-2147483648",
    para1: "487",
    para2: "16777216",
  });
  rules.power.allianceSciences!.set("1001", { id: "1001", para1: "487", para2: "1" });
  expect(
    allianceScienceEffects(
      [
        { scienceId: 2147483647, level: 1 },
        { scienceId: 1000, level: 1 },
        { scienceId: 1000, level: 1 },
      ],
      rules,
    ).get(487),
  ).toBe(16777216);
});

test("unavailable or malformed alliance research cannot silently become zero", () => {
  const { rules } = fixture();
  const sciences = [{ scienceId: 1000, level: 1 }];
  expect(() => allianceScienceEffects(sciences, rules)).toThrow("102192");
  for (const para2 of ["", "NaN", "Infinity", "1e100"]) {
    rules.power.allianceSciences!.set("1001", { id: "1001", para1: "487", para2 });
    expect(() => allianceScienceEffects(sciences, rules)).toThrow("102192");
  }
  rules.power.allianceSciences!.set("1001", { id: "1001", para1: "487|999", para2: "1" });
  expect(() => allianceScienceEffects(sciences, rules)).toThrow("102192");
});
