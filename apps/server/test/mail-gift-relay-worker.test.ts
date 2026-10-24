import { expect, test } from "bun:test";
import { startMailGiftRelay } from "../src/mail-gift-relay.ts";

function scheduler() {
  const tasks = new Map<number, () => void>();
  const delays: number[] = [];
  let sequence = 0;
  return {
    tasks,
    delays,
    after: (run: () => void, delay: number) => {
      const id = ++sequence;
      tasks.set(id, run);
      delays.push(delay);
      return () => {
        tasks.delete(id);
      };
    },
    next: () => {
      const entry = tasks.entries().next().value;
      if (!entry) throw new Error("No scheduled relay");
      tasks.delete(entry[0]);
      entry[1]();
    },
  };
}
async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

test("gift relay retries after a fixed delay, reports no dependency details and never overlaps batches", async () => {
  const timer = scheduler();
  let resolve: (value: number) => void = () => {};
  let calls = 0;
  let reports = 0;
  const worker = startMailGiftRelay(
    async () => {
      calls++;
      if (calls === 1) throw new Error("Synthetic private dependency details");
      return new Promise<number>((done) => {
        resolve = done;
      });
    },
    () => {
      reports++;
    },
    timer.after,
  );
  await settle();
  expect(reports).toBe(1);
  expect(calls).toBe(1);
  expect(timer.delays).toEqual([5000]);
  timer.next();
  await settle();
  expect(calls).toBe(2);
  expect(timer.tasks.size).toBe(0);
  resolve(100);
  await settle();
  expect(timer.delays).toEqual([5000, 5000]);
  await worker.close();
  expect(timer.tasks.size).toBe(0);
  await worker.close();
  expect(calls).toBe(2);
});

test("gift relay shutdown drains an in-flight dispatch before releasing its database and schedules no retry", async () => {
  const timer = scheduler();
  let finish: (value: number) => void = () => {};
  let drained = false;
  let calls = 0;
  const worker = startMailGiftRelay(
    () => {
      calls++;
      return new Promise<number>((resolve) => {
        finish = resolve;
      });
    },
    () => {},
    timer.after,
  );
  const closing = worker.close().then(() => {
    drained = true;
  });
  await settle();
  expect(drained).toBe(false);
  expect(timer.tasks.size).toBe(0);
  finish(1);
  await closing;
  expect(drained).toBe(true);
  expect(timer.tasks.size).toBe(0);
  expect(timer.delays).toEqual([]);
  expect(calls).toBe(1);
});

test("synchronous dispatch and reporting failures do not terminate retry scheduling", async () => {
  const timer = scheduler();
  const worker = startMailGiftRelay(
    () => {
      throw new Error("Synthetic dispatch failure");
    },
    () => {
      throw new Error("Synthetic reporting failure");
    },
    timer.after,
  );
  await settle();
  expect(timer.tasks.size).toBe(1);
  timer.next();
  await settle();
  expect(timer.delays).toEqual([5000, 5000]);
  await worker.close();
  expect(timer.tasks.size).toBe(0);
});
