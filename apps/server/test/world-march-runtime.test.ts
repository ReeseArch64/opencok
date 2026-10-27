import { test, expect } from "bun:test";
import {
  encodeWorldMarchArmy,
  decodeWorldMarchArmy,
  decodeWorldResourceArmy,
  type SavedMarchArmy,
} from "@opencok/messages/world-resource-army";
import { accelerateMarchSegments } from "@opencok/rules/world-march-runtime";
import { sfs, encode } from "@opencok/messages/sfs";
import { publishWorldMutation } from "@opencok/services/world-publication";

test("maintained march snapshots preserve owned soldiers and reject corrupted ownership", () => {
  const army: SavedMarchArmy = {
    owner: "owner",
    cachedLoad: 80,
    soldiers: [
      { owner: "owner", armsId: "107000", total: 10, dead: 0, loadEffect: 0, basicArm: null },
    ],
    dragons: [],
    general: null,
  };
  const data = encodeWorldMarchArmy(army);
  expect(decodeWorldMarchArmy(data)).toEqual(army);
  expect(decodeWorldResourceArmy(data)?.soldiers?.[0]?.total).toBe(10);
  expect(() => encodeWorldMarchArmy({ ...army, owner: "foreign" })).toThrow();
  expect(() => decodeWorldMarchArmy(Buffer.concat([data, Buffer.from("bad")]))).toThrow();
});

test("segmented speedups preserve time already travelled and shorten all remaining segments", () => {
  const route = [
    { sp: 1, dp: 2, mt: 10000 },
    { sp: 2, dp: 3, mt: 20000 },
    { sp: 3, dp: 4, mt: 10000 },
  ];
  const plan = accelerateMarchSegments(route, 1000n, 6000n, 50);
  expect(plan.segments.map((row) => row.mt)).toEqual([7500, 10000, 5000]);
  expect(plan.remaining).toBe(17500n);
  expect(route[0]!.mt).toBe(10000);
  expect(() => accelerateMarchSegments(route, 1000n, 41000n, 50)).toThrow();
});

test("world publication targets interested players and retains native march deletion payloads", async () => {
  const payload = encode({
    owner: sfs.string("owner"),
    origin: sfs.int(1),
    target: sfs.int(10),
    marches: sfs.array([
      sfs.object({ uuid: sfs.string("march"), sp: sfs.int(1), dp: sfs.int(10) }),
    ]),
    points: sfs.array([]),
    deleted: sfs.array([sfs.string("old")]),
  });
  const delivered: { owner: string; command: string }[] = [];
  await publishWorldMutation(
    payload,
    "world.tick",
    1,
    async (points) => {
      expect(points).toContain(10);
      return ["owner", "nearby"];
    },
    async (owner, command) => {
      delivered.push({ owner, command });
    },
  );
  expect(delivered).toEqual([
    { owner: "owner", command: "push.world.march" },
    { owner: "owner", command: "push.world.march.del" },
    { owner: "nearby", command: "push.world.march" },
    { owner: "nearby", command: "push.world.march.del" },
  ]);
});

test("new owned march snapshots pin troop star levels while older snapshots retain compatibility", () => {
  const army: SavedMarchArmy = {
    owner: "owner",
    cachedLoad: 80,
    soldiers: [
      {
        owner: "owner",
        armsId: "107000",
        total: 10,
        dead: 0,
        loadEffect: 0,
        basicArm: null,
        level: 3,
      },
    ],
    dragons: [],
    general: null,
  };
  const encoded = encodeWorldMarchArmy(army);
  expect(decodeWorldMarchArmy(encoded)!.soldiers![0]!.level).toBe(3);
  expect(decodeWorldResourceArmy(encoded)!.soldiers![0]).not.toHaveProperty("level");
  expect(() =>
    encodeWorldMarchArmy({ ...army, soldiers: [{ ...army.soldiers![0]!, level: -1 }] }),
  ).toThrow();
  expect(() =>
    encodeWorldMarchArmy({ ...army, soldiers: [{ ...army.soldiers![0]!, level: 1.5 }] }),
  ).toThrow();
});
