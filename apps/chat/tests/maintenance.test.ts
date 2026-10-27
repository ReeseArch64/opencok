import { expect, test } from "bun:test";
import { ChatMaintenanceService } from "@opencok/services/chat-maintenance.service";

test("maintenance shares in-flight work and closing drains it without restoring readiness", async () => {
  let finishHealth: () => void = () => {};
  let healthChecks = 0;
  const service = new ChatMaintenanceService({
    repository: {
      health: () => {
        healthChecks++;
        return new Promise<void>((resolve) => {
          finishHealth = resolve;
        });
      },
      deleteExpired: async () => ({ messages: 0, sessions: 0 }),
    },
    log: () => {},
  });

  const first = service.run();
  expect(service.run()).toBe(first);
  expect(healthChecks).toBe(1);

  let closed = false;
  const closing = service.close().then(() => {
    closed = true;
  });
  await Promise.resolve();
  expect(closed).toBe(false);
  expect(service.isReady()).toBe(false);

  finishHealth();
  await closing;
  expect(service.isReady()).toBe(false);
  expect(await service.run()).toBe(false);
  expect(healthChecks).toBe(1);
});

test("maintenance bounds retention and archive batches and checks distribution readiness", async () => {
  let removed = 0;
  let archived = 0;
  let polls = 0;
  const reports: string[] = [];
  const service = new ChatMaintenanceService({
    repository: {
      health: async () => {},
      deleteExpired: async () => {
        removed++;
        return { messages: 500, sessions: 500 };
      },
      archivePending: async () => {
        archived++;
        return 100;
      },
    },
    distribution: {
      poll: async () => {
        polls++;
      },
      isReady: () => false,
    },
    log: (event) => {
      reports.push(event.operation + ":" + event.category);
    },
  });

  expect(await service.run()).toBe(false);
  expect(removed).toBe(5);
  expect(archived).toBe(10);
  expect(polls).toBe(1);
  expect(reports).toEqual(["chat.retention:retention_backlog", "chat.archive:retention_backlog"]);
  await service.close();
});

test("maintenance recovers from storage failure and tolerates an unavailable archive", async () => {
  let unavailable = true;
  const reports: string[] = [];
  const service = new ChatMaintenanceService({
    repository: {
      health: async () => {
        if (unavailable) throw new Error("synthetic storage failure");
      },
      deleteExpired: async () => ({ messages: 0, sessions: 0 }),
      archivePending: async () => {
        throw new Error("synthetic archive failure");
      },
    },
    log: (event) => {
      reports.push(event.operation + ":" + event.category);
    },
  });

  expect(await service.run()).toBe(false);
  expect(service.isReady()).toBe(false);
  unavailable = false;
  expect(await service.run()).toBe(true);
  expect(service.isReady()).toBe(true);
  expect(reports).toEqual(["chat.maintenance:storage_unavailable", "chat.archive:unavailable"]);
  await service.close();
});
