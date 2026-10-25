import { reserveTroops } from "@opencok/rules/military";
import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { Type, sfs, fields } from "@opencok/messages/sfs";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { transferTroops, troopCosts, unitPower, healingSelection } from "@opencok/rules/military";
import { trainingDomain, trainingCapacity } from "@opencok/services/training";
import { hospitalDomain } from "@opencok/services/hospital";
import { fortificationDomain } from "@opencok/services/fortifications";
import { militarySnapshot } from "@opencok/mappings/military";
import { cityFixture } from "./fixtures/city-progression";

const rules = await loadRules();
function fixture() {
  const result = cityFixture(rules);
  result.state.buildings = [
    ...result.state.buildings,
    ...[423000, 410000, 411000, 416000, 419000].map((itemId) => ({
      uid: "owner",
      uuid: String(itemId),
      itemId,
      level: 1,
      star: 0,
      progress: 0,
      opType: 0,
    })),
  ];
  result.state.queues = [1, 2, 3].map((type) => ({
    uuid: `q${type}`,
    ownerId: "owner",
    type,
    qid: 1,
    itemId: "",
    updateTime: idleDeadline,
    endTime: idleDeadline,
  }));
  return result;
}
test("troop transfers conserve quantities and reject overspending and integer overflow", () => {
  expect(transferTroops(10, 5, 3)).toEqual([7, 8]);
  expect(() => transferTroops(10, 5, 11)).toThrow();
  expect(() => transferTroops(10, 2147483647, 1)).toThrow();
  expect(() => transferTroops(10, 5, -1)).toThrow();
  expect(unitPower({ power: "1.25" }, 4)).toBe(5n);
  expect(troopCosts({ food: "61" }, 3)).toMatchObject({ food: 183n });
});
test("training capacity, owned prerequisites and ready batches are authoritative", async () => {
  const { context, state } = fixture();
  expect(trainingCapacity(context, 1)).toBe(20);
  await expect(
    trainingDomain.prepare(context, "army.add", {
      id: sfs.string("107000"),
      num: sfs.int(21),
      gold: sfs.bool(false),
    }),
  ).rejects.toThrow();
  await trainingDomain.prepare(context, "army.add", {
    id: sfs.string("107000"),
    num: sfs.int(5),
    gold: sfs.bool(false),
  });
  expect(context.write.armies![0]!.train).toBe(5);
  expect(context.write.armies![0]!.free).toBe(0);
  const pending = context.write.armies![0]!;
  state.armies = [pending];
  state.queues = [
    { uuid: "q1", ownerId: "owner", type: 1, itemId: "107000", updateTime: pending.finishTime! },
  ];
  const completed = await trainingDomain.apply(context, "finish", {
    id: "a",
    ownerId: "owner",
    queueId: "q1",
    type: 1,
    itemId: "107000",
    startedAt: 1000000n,
    dueAt: BigInt(String(pending.finishTime)),
    version: 2,
    status: 1,
    data: { schema: 1, kind: "train", costs: {}, items: {}, units: { "107000": 5 } },
  });
  expect(completed.free).toEqual(sfs.int(5));
  expect(context.write.armies![0]!.train).toBe(0);
  expect(context.write.statistics!.power).toBe(1005n);
});
test("dismissal cannot consume marching or defended troops", async () => {
  const { context, state } = fixture();
  state.armies = [
    {
      uid: "owner",
      armyId: "107000",
      free: 2,
      march: 100,
      defence: 100,
      pve: 100,
      level: 0,
      train: 0,
    },
  ];
  await expect(
    trainingDomain.prepare(context, "army.fire", { id: sfs.string("107000"), num: sfs.int(3) }),
  ).rejects.toThrow();
  await trainingDomain.prepare(context, "army.fire", { id: sfs.string("107000"), num: sfs.int(2) });
  expect(context.write.armies![0]).toMatchObject({ free: 0, march: 100, defence: 100, pve: 100 });
});
test("healing moves selected wounds into a reservation and cancellation returns every reserved troop", async () => {
  const { context, state } = fixture();
  state.hospital = [{ uid: "owner", armyId: "107000", dead: 10, heal: 0, finishTime: 0n }];
  await expect(
    hospitalDomain.prepare(context, "hospital.cure", { "107000": sfs.int(11) }),
  ).rejects.toThrow();
  const prepared = await hospitalDomain.prepare(context, "hospital.cure", { "107000": sfs.int(6) });
  expect(context.write.hospital![0]).toMatchObject({ dead: 4, heal: 6 });
  state.hospital = context.write.hospital!;
  state.queues = [
    {
      uuid: "q3",
      ownerId: "owner",
      type: 3,
      itemId: "1",
      updateTime: state.hospital[0]!.finishTime!,
    },
  ];
  await hospitalDomain.apply(context, "cancel", {
    id: "a",
    ownerId: "owner",
    queueId: "q3",
    type: 3,
    itemId: "1",
    startedAt: 1000000n,
    dueAt: 1006000n,
    version: 2,
    status: 2,
    data: prepared.data,
  });
  expect(context.write.hospital![0]).toMatchObject({ dead: 10, heal: 0, finishTime: 0n });
});
test("instant healing preserves a concurrent queued reservation of the same troop type", async () => {
  const { context, state } = fixture();
  state.armies = [{ uid: "owner", armyId: "107000", free: 1, level: 0, train: 0 }];
  state.hospital = [{ uid: "owner", armyId: "107000", dead: 10, heal: 5, finishTime: 1010000n }];
  state.queues = [{ uuid: "q3", ownerId: "owner", type: 3, itemId: "1", updateTime: 1010000n }];
  const response = await hospitalDomain.prepare(context, "hospital.cd", { "107000": sfs.int(3) });
  expect(response.type).toBeUndefined();
  expect(context.write.hospital![0]).toMatchObject({ dead: 7, heal: 5, finishTime: 1010000n });
  expect(context.write.armies![0]!.free).toBe(4);
  expect(context.write.statistics!.armyCure).toBe(3);
});
test("healing rejects empty batches and foreign metadata before reserving troops", () => {
  expect(() =>
    healingSelection({ operationId: sfs.string("op"), isBuyRes: sfs.int(0) }, Type.Int),
  ).toThrow();
  expect(() => healingSelection({ "107000": sfs.long(1n) }, Type.Int)).toThrow();
  expect(() => healingSelection({ owner: sfs.int(1) }, Type.Int)).toThrow();
});
test("fortifications reserve total capacity across types and reject excessive destruction", async () => {
  const { context, state } = fixture();
  state.forts = [{ uid: "owner", armyId: "107900", level: 1, num: 999, build: 0, finishTime: 0n }];
  await expect(
    fortificationDomain.prepare(context, "fort.build", {
      id: sfs.string("107900"),
      num: sfs.int(2),
      gold: sfs.bool(false),
    }),
  ).rejects.toThrow();
  await expect(
    fortificationDomain.prepare(context, "fort.destory", {
      id: sfs.string("107900"),
      num: sfs.int(1000),
    }),
  ).rejects.toThrow();
  await fortificationDomain.prepare(context, "fort.build", {
    id: sfs.string("107900"),
    num: sfs.int(1),
    gold: sfs.bool(false),
  });
  expect(context.write.forts![0]).toMatchObject({ num: 999, build: 1 });
});
test("military initialization includes zero-count ordinary units and preserves pending hospital deadlines", () => {
  const result = militarySnapshot(
    [],
    [{ armyId: "107000", dead: 3, heal: 2, finishTime: 5n }],
    [],
    rules,
  );
  expect((result.army!.value as unknown[]).length).toBeGreaterThan(10);
  expect((result.fort!.value as unknown[]).length).toBeGreaterThan(0);
  const hospital = (
    result.hospital!.value as { value: import("@opencok/messages/sfs").Fields }[]
  )[0]!;
  expect(fields(sfs.object(hospital.value)).heal).toEqual(sfs.int(2));
  expect(hospital.value.finish).toEqual(sfs.long(5n));
});

test("future available quantities reserve both training and healing before charging", () => {
  const { state } = fixture();
  state.armies = [{ uid: "owner", armyId: "107000", free: 2147483640, train: 4 }];
  state.hospital = [{ uid: "owner", armyId: "107000", dead: 10, heal: 2 }];
  expect(reserveTroops(state, "107000", 1)).toBe(2147483647);
  expect(() => reserveTroops(state, "107000", 2)).toThrow();
});
