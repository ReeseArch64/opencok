import { afterEach, beforeEach, expect, spyOn, test } from "bun:test";
import { initializeLogging, logEvent, withLogContext } from "../src/logging";
import { observeAdapter, observeJob, observeOperation } from "../src/operation";
import { afterCommit, observeTransaction } from "../src/transaction";

let records: Record<string, unknown>[];
let restore: (() => void)[];
beforeEach(() => {
  initializeLogging("operation-test");
  records = [];
  restore = ["log", "info", "warn", "error"].map((method) => {
    const spy = spyOn(console, method as "log").mockImplementation((value) =>
      records.push(JSON.parse(String(value))),
    );
    return () => spy.mockRestore();
  });
});
afterEach(() => restore.forEach((run) => run()));

test("observation preserves synchronous results, private fields, thrown values and asynchronous failures", async () => {
  class Counter {
    #value = 0;
    increment() {
      return ++this.#value;
    }
    async fail() {
      throw new Error("private-password");
    }
  }
  const counter = observeAdapter(new Counter(), "counter");
  expect(counter.increment()).toBe(1);
  expect(counter.increment()).toBe(2);
  await expect(counter.fail()).rejects.toThrow("private-password");
  let thrown = false;
  try {
    observeOperation("undefined_failure", () => {
      throw undefined;
    });
  } catch {
    thrown = true;
  }
  expect(thrown).toBe(true);
  expect(records.filter((record) => record.event === "operation_failed")).toHaveLength(2);
  expect(JSON.stringify(records)).not.toContain("private-password");
});

test("concurrent operations preserve their context and jobs detach from request identities", async () => {
  await Promise.all(
    ["first", "second"].map((requestId) =>
      withLogContext({ requestId }, () =>
        observeOperation("work", async () => {
          await Promise.resolve();
          logEvent("inside");
          await observeJob("worker.tick", async () => logEvent("job"));
        }),
      ),
    ),
  );
  expect(
    records
      .filter((record) => record.event === "inside")
      .map((record) => record.requestId)
      .sort(),
  ).toEqual(["first", "second"]);
  const jobs = records.filter((record) => record.event === "job");
  expect(jobs).toHaveLength(2);
  expect(
    jobs.every((record) => record.requestId === undefined && typeof record.jobId === "string"),
  ).toBe(true);
});

test("effects are logged only after the outer commit and discarded on rollback", async () => {
  await observeTransaction("outer", async () => {
    afterCommit("generated", { count: 1 });
    await observeTransaction("inner", async () => afterCommit("generated", { count: 2 }));
    expect(records.filter((record) => record.event === "generated")).toHaveLength(0);
  });
  expect(
    records.filter((record) => record.event === "generated").map((record) => record.count),
  ).toEqual([1, 2]);
  await expect(
    observeTransaction("rollback", async () => {
      afterCommit("never_generated", { count: 9 });
      throw new Error("private-rollback");
    }),
  ).rejects.toThrow("private-rollback");
  expect(records.some((record) => record.event === "never_generated")).toBe(false);
  expect(
    records.some(
      (record) => record.event === "transaction_failed" && record.commitState === "unconfirmed",
    ),
  ).toBe(true);
});
