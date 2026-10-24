import { expect, test } from "bun:test";
import { compactPoint, pointSections, viewport } from "@opencok/services/world";
import { Type } from "@opencok/messages/sfs";

test("legacy isometric viewport has 340 tiles at center and clips at kingdom edges", () => {
  const points = viewport(600, 600, 1200);
  expect(points.length).toBe(340);
  expect(points).toContain(1 + 600 + 600 * 1200);
  expect(new Set(points).size).toBe(points.length);
  expect(viewport(0, 0, 1200).every((id) => id >= 1 && id <= 1440000)).toBe(true);
});
test("world rows use compact keys and seconds; unknown specialized points fail", () => {
  expect(
    JSON.parse(
      compactPoint({
        id: 7,
        pointType: 1,
        resLevel: 33,
        ownerName: "Synthetic",
        resInitValue: 90,
        resCostValue: 20,
        shieldTime: 123456n,
      }),
    ),
  ).toEqual({
    i: 7,
    t: 1,
    l: 30,
    sl: 3,
    o: "Synthetic",
    v: 70,
    pt: 123,
    pt_resource: 0,
    ft: 0,
    rt: 0,
    st: 0,
  });
  expect(() => compactPoint({ id: 1, pointType: 99 })).toThrow();
});
test("v12 points are arrays of JSON strings split below signed-short UTF limit", () => {
  const points = Array.from({ length: 200 }, (_, i) => JSON.stringify({ i, o: "城".repeat(100) }));
  const output = pointSections(points);
  expect(output.points?.type).toBe(Type.Array);
  const parts = output.points!.value as { value: string }[];
  expect(parts.flatMap((p) => JSON.parse(p.value))).toEqual(points);
  expect(parts.every((p) => Buffer.byteLength(p.value) < 32767)).toBe(true);
});
