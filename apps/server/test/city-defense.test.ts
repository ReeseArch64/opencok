import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { cityFireSpeed, settleCityFire } from "@opencok/rules/city-defense";
const rules = await loadRules();

test("city fire preserves native float damage, finished fire and the black-land reduction ring", () => {
  const base = {
    x: 1,
    y: 1,
    gridType: 2,
    cityDefValue: 500,
    startOccupyTime: 900000n,
    fireTime: 1300000n,
  };
  expect(
    settleCityFire(
      base,
      1000000n,
      cityFireSpeed(base, [], rules, () => 0),
    ).cityDefValue,
  ).toBe(495);
  const expired = settleCityFire(
    base,
    2000000n,
    cityFireSpeed(base, [], rules, () => 0),
  );
  expect(expired.cityDefValue).toBe(478);
  expect(expired.startOccupyTime).toBe(0n);
  expect(expired.fireTime).toBe(0n);
  expect(
    settleCityFire(
      base,
      1000000n,
      cityFireSpeed(base, [], rules, (id) => (id === 122 ? -100 : 0)),
    ).cityDefValue,
  ).toBe(499);
  const black = { ...base, x: 600, y: 600, gridType: 0 };
  expect(
    settleCityFire(
      black,
      1000000n,
      cityFireSpeed(black, [], rules, () => 0),
    ).cityDefValue,
  ).toBe(0);
  const ring = { ...black, x: 629 };
  expect(
    settleCityFire(
      ring,
      1000000n,
      cityFireSpeed(ring, [], rules, () => 0),
    ).cityDefValue,
  ).toBe(495);
  expect(base.startOccupyTime).toBe(900000n);
});
