import { expect, test } from "bun:test";
import { startAvatarRelay } from "../src/avatar-relay.ts";
import type { AvatarDeliveryKey } from "@opencok/contracts/files";

function scheduler() {
  const tasks: (() => void)[] = [];
  return {
    tasks,
    after: (run: () => void, delay: number) => {
      expect(delay).toBe(5000);
      tasks.push(run);
      return () => {
        const index = tasks.indexOf(run);
        if (index >= 0) {tasks.splice(index, 1);}
      };
    },
    tick: async () => {
      const run = tasks.shift();
      expect(run).toBeDefined();
      run!();
      await settle();
    },
  };
}
async function settle() {
  for (let i = 0; i < 12; i++) {await Promise.resolve();}
}

test("avatar relay advances past failures, wraps, and revisits pending entries without overlap", async () => {
  const schedule = scheduler(),
    cursors: (AvatarDeliveryKey | undefined)[] = [],
    delivered: string[] = [];
  const keys = [
    { owner: "1001", sequence: 5 },
    { owner: "1002", sequence: 1 },
  ];
  let reports = 0,
    active = false;
  const worker = startAvatarRelay(
    async (cursor) => {
      expect(active).toBe(false);
      cursors.push(cursor);
      return cursor?.owner === "1001" ? keys[1] : cursor?.owner === "1002" ? undefined : keys[0];
    },
    async (owner) => {
      expect(active).toBe(false);
      active = true;
      await Promise.resolve();
      active = false;
      delivered.push(owner);
      if (owner === "1001") {throw new Error("Synthetic failure");}
    },
    () => {
      reports++;
    },
    schedule.after,
  );
  await settle();
  expect(reports).toBe(1);
  expect(schedule.tasks).toHaveLength(1);
  await schedule.tick();
  await schedule.tick();
  await schedule.tick();
  expect(cursors).toEqual([undefined, keys[0], keys[1], undefined]);
  expect(delivered).toEqual(["1001", "1002", "1001"]);
  expect(reports).toBe(2);
  await worker.close();
  expect(schedule.tasks).toHaveLength(0);
});

test("relay shutdown drains active delivery and never starts work after a pending selection", async () => {
  const schedule = scheduler();
  let release!: () => void,
    closed = false;
  const worker = startAvatarRelay(
    async () => ({ owner: "1001", sequence: 5 }),
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      }),
    () => {},
    schedule.after,
  );
  await settle();
  expect(schedule.tasks).toHaveLength(0);
  const closing = worker.close().then(() => {
    closed = true;
  });
  await settle();
  expect(closed).toBe(false);
  release();
  await closing;
  expect(schedule.tasks).toHaveLength(0);
  let selected!: (entry: AvatarDeliveryKey) => void,
    deliveries = 0;
  const pending = startAvatarRelay(
    () =>
      new Promise((resolve) => {
        selected = resolve;
      }),
    async () => {
      deliveries++;
    },
    () => {},
    schedule.after,
  );
  const stopped = pending.close();
  selected({ owner: "1001", sequence: 5 });
  await stopped;
  expect(deliveries).toBe(0);
  expect(schedule.tasks).toHaveLength(0);
});

test("selector and reporting failures keep the relay recoverable with the same cursor", async () => {
  const schedule = scheduler();
  let calls = 0;
  const worker = startAvatarRelay(
    async (cursor) => {
      expect(cursor).toBeUndefined();
      calls++;
      throw new Error("Synthetic failure");
    },
    async () => {
      throw new Error("Unexpected delivery");
    },
    () => {
      throw new Error("Synthetic logger failure");
    },
    schedule.after,
  );
  await settle();
  await schedule.tick();
  expect(calls).toBe(2);
  await worker.close();
  expect(schedule.tasks).toHaveLength(0);
});
