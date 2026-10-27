import { test, expect } from "bun:test";
import {
  reserveMarch,
  arriveForGathering,
  returnFromGathering,
  completeMarchReturn,
  accelerateMarch,
  recallOutbound,
} from "@opencok/rules/world-march-lifecycle";

function departure() {
  return reserveMarch(
    {
      id: "march",
      owner: "owner",
      worldId: 0,
      origin: 1,
      target: 20,
      startedAt: 1000n,
      dueAt: 11000n,
      returnDuration: 10000n,
      troops: [{ armyId: "107000", quantity: 10 }],
    },
    [{ armyId: "107000", free: 100, march: 5 }],
  );
}

test("noncombat lifecycle conserves troop reservations and credits cargo only after the return deadline", () => {
  const start = departure();
  expect(start.troops).toEqual([{ armyId: "107000", free: 90, march: 15 }]);
  const gathering = arriveForGathering(start.march, "owner", 1, 11000n, 20000n);
  expect(gathering.march.dueAt).toBe(31000n);
  const returning = returnFromGathering(gathering.march, "owner", 2, 90000n, {
    resource: "wood",
    amount: 1000n,
  });
  expect(returning.march.dueAt).toBe(41000n);
  expect(returning.credit).toBeNull();
  expect(() => completeMarchReturn(returning.march, "owner", 3, 40999n, start.troops)).toThrow();
  const completed = completeMarchReturn(returning.march, "owner", 3, 90000n, start.troops);
  expect(completed.troops).toEqual([{ armyId: "107000", free: 100, march: 5 }]);
  expect(completed.credit).toEqual({ resource: "wood", amount: 1000n });
  expect(completed.march.cargo).toBeNull();
  expect(() =>
    completeMarchReturn(completed.march, "owner", 4, 90001n, completed.troops),
  ).toThrow();
});

test("world transitions reject foreign owners, stale versions, premature arrivals and missing reservations", () => {
  const start = departure();
  expect(() => arriveForGathering(start.march, "other", 1, 11000n, 1000n)).toThrow();
  expect(() => arriveForGathering(start.march, "owner", 2, 11000n, 1000n)).toThrow();
  expect(() => arriveForGathering(start.march, "owner", 1, 10999n, 1000n)).toThrow();
  const back = recallOutbound(start.march, "owner", 1, 5000n, 4000n);
  expect(back.march.dueAt).toBe(9000n);
  expect(() =>
    completeMarchReturn(back.march, "owner", 2, 9000n, [{ armyId: "107000", free: 90, march: 9 }]),
  ).toThrow();
  expect(() => recallOutbound(start.march, "owner", 1, 11000n, 1000n)).toThrow();
});

test("ordinary march acceleration retains Java float rounding and the outbound 1500ms floor", () => {
  const start = departure();
  expect(accelerateMarch(start.march, "owner", 1, 1000n, 25).march.dueAt).toBe(8500n);
  expect(() => accelerateMarch(start.march, "owner", 1, 9000n, 50)).toThrow();
  const back = recallOutbound(start.march, "owner", 1, 5000n, 4000n);
  expect(accelerateMarch(back.march, "owner", 2, 5000n, 100).march.dueAt).toBe(5000n);
  expect(() => accelerateMarch(start.march, "owner", 1, 1000n, 101)).toThrow();
});

test("failed reservation cannot mutate input or overflow troop counters", () => {
  const original = departure();
  const input = { ...original.march, troops: [{ armyId: "107000", quantity: 101 }] };
  const balances = [{ armyId: "107000", free: 100, march: 5 }];
  expect(() => reserveMarch(input, balances)).toThrow();
  expect(balances).toEqual([{ armyId: "107000", free: 100, march: 5 }]);
  expect(() =>
    reserveMarch(
      {
        ...input,
        troops: [
          { armyId: "107000", quantity: 1 },
          { armyId: "107000", quantity: 1 },
        ],
      },
      balances,
    ),
  ).toThrow();
  expect(() =>
    reserveMarch({ ...input, troops: [{ armyId: "107000", quantity: 1 }] }, [
      { armyId: "107000", free: 1, march: 2147483647 },
    ]),
  ).toThrow();
});

test("treasure parties require real reservations and cannot manufacture gathered cargo", () => {
  const seed = { ...departure().march, purpose: "treasure" as const },
    balances = [{ armyId: "107000", free: 100, march: 0 }];
  expect(() => reserveMarch({ ...seed, troops: [] }, balances)).toThrow();
  const reserved = reserveMarch(seed, balances),
    arrived = arriveForGathering(reserved.march, "owner", 1, seed.dueAt, 10000n);
  expect(reserved.troops).toEqual([{ armyId: "107000", free: 90, march: 10 }]);
  expect(arrived.march.phase).toBe("gathering");
  expect(() =>
    returnFromGathering(arrived.march, "owner", 2, arrived.march.dueAt, {
      resource: "gold",
      amount: 1n,
    }),
  ).toThrow();
  expect(() =>
    completeMarchReturn(
      {
        ...arrived.march,
        phase: "returning",
        cargo: { resource: "gold", amount: 1n },
      },
      "owner",
      2,
      arrived.march.dueAt,
      reserved.troops,
    ),
  ).toThrow();
});
