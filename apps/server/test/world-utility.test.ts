import { expect, test } from "bun:test";
import { nearestWorldFootprint } from "@opencok/rules/world-utility";

function footprint(point: number, size: number) {
  return [point, point - 1, point - size, point - size - 1].map((id) => ({
    id,
    worldId: 0,
    pointType: 0,
    gridType: 2,
    grid2Type: 0,
    resInitValue: 0,
  }));
}
test("nearest free anchors use native bottom-right footprints, perimeter order and bounded rings", () => {
  const target = 211,
    size = 20;
  expect(nearestWorldFootprint(footprint(190, size), target, size)).toBe(190);
  expect(nearestWorldFootprint(footprint(211, size), target, size)).toBe(0);
  expect(nearestWorldFootprint(footprint(211 - 8, size), target, size)).toBe(0);
  expect(nearestWorldFootprint(footprint(21, size), 1, size)).toBe(0);
  expect(
    nearestWorldFootprint(
      footprint(190, size).map((row) => ({ ...row, grid2Type: 1 })),
      target,
      size,
    ),
  ).toBe(0);
  expect(nearestWorldFootprint([], 0, size)).toBe(0);
});
