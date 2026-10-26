import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
  createTargetTaskDomain,
  targetTaskPurchaseOperationId,
  publishTargetTaskMutation,
} from "@opencok/services/target-task";
import { trainingDomain } from "@opencok/services/training";
import { user_target_task } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task";
import { user_target_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task_notes";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, encode, type Fields } from "@opencok/messages/sfs";
import type { TargetTaskPaymentGateway } from "@opencok/contracts/target-task";
import { cityHarness } from "./support/city";
async function fixture(gateway?: TargetTaskPaymentGateway) {
  const h = await cityHarness([createTargetTaskDomain(gateway, () => 0), trainingDomain]);
  h.clock.now = Date.UTC(2026, 9, 26, 12);
  h.rules.features.set("target_quest", {
    id: "target_quest",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  h.rules.items.set("target_quest", {
    id: "target_quest",
    k1: "0",
    k2: "1",
    k3: "1",
    k4: "1",
    k5: "78192",
    k6: "0",
    k8: "211582;999",
    k9: "211581",
  });
  h.rules.advanced.targetTasks!.clear();
  h.rules.advanced.targetTasks!.set("990001", {
    id: "990001",
    type: "2",
    extend_type: "1",
    accept: "1;50",
    rate: "1",
    num: "4",
    rewardall: "990010",
  });
  h.rules.reconnect.rewards!.set("990010", { id: "990010", gold: "7" });
  await h.db.db.insert(user_item).values([
    { uuid: "sign", ownerId: "owner", itemId: "211581", count: 3, value: 0 },
    { uuid: "double", ownerId: "owner", itemId: "211582", count: 3, value: 0 },
  ]);
  const saved = async () =>
    (await h.db.db.select().from(user_target_task).where(eq(user_target_task.uid, "owner")))[0]!;
  const notes = async () =>
    (
      await h.db.db
        .select()
        .from(user_target_task_notes)
        .where(eq(user_target_task_notes.uid, "owner"))
    )[0]!;
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  const items = async () => h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"));
  const sign = () =>
    h.command("target.task.item", {
      type: sfs.int(2),
      index: sfs.int(0),
      itemId: sfs.string("211581"),
      num: sfs.int(1),
    });
  return {
    ...h,
    saved,
    notes,
    gold,
    items,
    sign,
    command: (name: string, params: Fields = {}) => h.command(name, params),
  };
}
test("target tasks advance only from completed training, preserve assignments and grant configured rewards once", async () => {
  const h = await fixture();
  try {
    const ui = await h.command("target.task.ui");
    expect(ui.body.receive_mode).toEqual(sfs.bool(false));
    expect(ui.body.day_now).toEqual(sfs.int(0));
    const original = await h.saved();
    await h.command("target.init");
    expect(await h.saved()).toEqual(original);
    const training = {
      id: sfs.string("107000"),
      num: sfs.int(2),
      gold: sfs.bool(false),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 3 }, () => h.command("army.add", training)));
    expect((await h.saved()).num).toBe(0);
    await h.finish(1);
    expect(await h.saved()).toMatchObject({ num: 2, state: 0 });
    const immediate = {
      id: sfs.string("107000"),
      num: sfs.int(2),
      complete: sfs.bool(true),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 3 }, () => h.command("army.cd", immediate)));
    expect(await h.saved()).toMatchObject({ num: 4, state: 1 });
    const baseline = await h.gold(),
      claim = { operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("target.task.receive", claim)));
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.notes()).receive_mode).toBe(1);
    await expect(h.command("target.task.receive")).rejects.toThrow();
    expect(
      await h.db.db.select().from(user_target_task).where(eq(user_target_task.uid, "other")),
    ).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("completion and doubling consume owned items atomically, preserve counters and reject use after claiming", async () => {
  const h = await fixture();
  try {
    await h.command("target.init");
    await h.sign();
    expect(await h.saved()).toMatchObject({ num: 0, state: 1, rewardDouble: 0 });
    const double = {
      type: sfs.int(1),
      index: sfs.int(0),
      itemId: sfs.string("211582"),
      num: sfs.int(2),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 3 }, () => h.command("target.task.item", double)));
    expect((await h.saved()).rewardDouble).toBe(1);
    expect((await h.items()).find((row) => row.itemId === "211582")!.count).toBe(1);
    await expect(
      h.command("target.task.item", { ...double, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_target_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_target_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_target_receipt()`,
    );
    const baseline = await h.gold();
    await expect(h.command("target.task.receive")).rejects.toThrow();
    expect(await h.gold()).toBe(baseline);
    expect((await h.notes()).receive_mode).toBe(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_target_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("target.task.receive");
    expect(await h.gold()).toBe(baseline + 14n);
    await expect(h.sign()).rejects.toThrow();
    expect((await h.items()).find((row) => row.itemId === "211581")!.count).toBe(2);
  } finally {
    await h.close();
  }
}, 120000);
test("expired completed tasks fund mail once and reset only in a new active period", async () => {
  const h = await fixture();
  try {
    await h.command("target.init");
    await h.sign();
    const baseline = await h.gold(),
      old = await h.notes();
    h.clock.now = Number(old.endTime);
    await Promise.all(Array.from({ length: 3 }, () => h.command("target.init")));
    const messages = await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
    expect(messages).toHaveLength(1);
    expect(messages[0]!.rewardId).toBe("gold,0,7");
    expect(messages[0]!.rewardStatus).toBe(0);
    expect((await h.notes()).receive_mode).toBe(3);
    expect(await h.gold()).toBe(baseline);
    await expect(h.command("target.task.receive")).rejects.toThrow();
    h.clock.now = Number(old.beginTime) + 7 * 86400000;
    await h.command("target.init");
    expect(await h.saved()).toMatchObject({ num: 0, state: 0, rewardDouble: 0 });
    expect((await h.notes()).receive_mode).toBe(0);
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("premium claims require a verified canonical payment and publish only the owned reward payload", async () => {
  const h = await fixture({
    accepted: async () => ({ exchangeId: "78192", occurredAt: BigInt(Date.UTC(2026, 9, 26, 12)) }),
  });
  try {
    await h.command("target.init");
    await h.sign();
    const eventId = "synthetic-payment",
      params = {
        eventId: sfs.string(eventId),
        operationId: sfs.string(targetTaskPurchaseOperationId("owner", eventId)),
      },
      baseline = await h.gold();
    await expect(
      h.command("target.paid", { ...params, operationId: sfs.string(randomUUID()) }),
    ).rejects.toThrow();
    const replies = await Promise.all(
      Array.from({ length: 4 }, () => h.command("target.paid", params)),
    );
    expect(replies.every((reply) => reply.body.receive_mode?.value === true)).toBe(true);
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.notes()).receive_mode).toBe(2);
    const delivered: string[] = [];
    await publishTargetTaskMutation(
      encode({ owner: sfs.string("owner"), body: sfs.object(replies[0]!.body) }),
      async (owner, command) => {
        delivered.push(`${owner}:${command}`);
      },
    );
    expect(delivered).toEqual(["owner:push.target.task"]);
    await expect(
      publishTargetTaskMutation(
        encode({ owner: sfs.string("owner"), body: sfs.object({ receive_mode: sfs.bool(false) }) }),
        async () => {},
      ),
    ).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
