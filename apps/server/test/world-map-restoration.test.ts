import { expect, test } from "bun:test";
import { roundTripLegacyObject } from "@opencok/messages/legacy-json";
import { restoredSharedCollectionTime } from "@opencok/rules/world-resource-detail";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
const nested = (fields: Fields) => fields.territory!.value as Fields;

test("nested remote JSON preserves large longs and floating exponent thresholds", () => {
  const fields = roundTripLegacyObject({
    territory: sfs.object({
      time: sfs.long(9007199254740993n),
      speed: sfs.double(1e7),
      small: sfs.double(0.0001),
      integer: sfs.double(1),
      active: sfs.bool(true),
    }),
    kill: sfs.array([sfs.object({ count: sfs.int(3) })]),
  });
  expect(nested(fields).time).toEqual(sfs.long(9007199254740993n));
  expect(nested(fields).speed).toEqual(sfs.double(1e7));
  expect(nested(fields).small).toEqual(sfs.double(0.0001));
  expect(nested(fields).integer).toEqual(sfs.int(1));
  expect(() => roundTripLegacyObject({ bad: { type: Type.Byte, value: 128 } })).toThrow();
});

test("shared collection restores the smaller of group exhaustion and owner capacity durations", () => {
  const owner = {
    armyLoad: 20,
    collectSpd: 2,
    marchArrivalTime: 1000n,
    collectedBeforeSpd: 0n,
    changeCollectSpdTime: 1000n,
    occupyResourceEndTime: 20000n,
  };
  expect(restoredSharedCollectionTime(100, owner, 1000n, [owner], 5000n, true)).toBe(10000n);
  expect(
    restoredSharedCollectionTime(
      100,
      { ...owner, armyLoad: 1000 },
      1000n,
      [owner, owner],
      5000n,
      true,
    ),
  ).toBe(25000n);
  expect(restoredSharedCollectionTime(100, owner, 1000n, [owner], 5000n, false)).toBe(0n);
});
