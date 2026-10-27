import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createArenaDomain, publishArenaMutation } from "@opencok/services/arena";
import type { ArenaBattleGateway, ArenaApplication } from "@opencok/contracts/arena";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_arena } from "@opencok/drizzle/schema/opencok_kingdom/user_arena";
import { arena_registration } from "@opencok/drizzle/schema/opencok_kingdom/arena_registration";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { user_arena_army } from "@opencok/drizzle/schema/opencok_kingdom/user_arena_army";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function fixture() {
  let validated = false,
    authorizeResult = false;
  const applications: ArenaApplication[] = [];
  const gateway: ArenaBattleGateway = {
    validated: () => validated,
    enqueue: async (input) => {
      applications.push(input);
    },
    enter: async () => {
      throw new Error("Battle actor unavailable");
    },
    acceptResult: async (result) => authorizeResult && result.resultId === "authorized-envelope",
    leave: async () => {
      throw new Error("Battle actor unavailable");
    },
  };
  const h = await cityHarness([createArenaDomain(gateway)]);
  h.clock.now = 1792929600000;
  await h.db.db
    .insert(user_world)
    .values({ uid: "owner", pointId: 1, worldId: 0, color: 1, lastCityDefTime: 0n });
  await h.db.db
    .update(user_building)
    .set({ level: 10 })
    .where(eq(user_building.uuid, "owner-400000"));
  const command = (name: string, params: Fields = {}) =>
    h.command(name, { operationId: sfs.string(randomUUID()), ...params });
  return {
    ...h,
    gateway,
    applications,
    command,
    validate: () => {
      validated = true;
    },
    authorizeResult: () => {
      authorizeResult = true;
    },
  };
}

test("arena virtual army setup persists owned preferences without reserving real world troops", async () => {
  const h = await fixture();
  try {
    const initialId = sfs.string(randomUUID());
    const initial = await h.command("arena.info", { operationId: initialId });
    expect(initial.body).toEqual({
      state: sfs.int(0),
      rankScore: sfs.int(1),
      time: sfs.long(0n),
      operationId: initialId,
    });
    const id = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () =>
        h.command("arena.army", { armies: sfs.string("107000;100"), operationId: id }),
      ),
    );
    expect((await h.db.db.select().from(user_arena_army))[0]!.free).toBe(100);
    expect((await h.db.db.select().from(user_army)).length).toBe(0);
    const result = await h.command("show.arena.army");
    expect(result.body.armyArray!.value).toEqual([
      sfs.object({ armyId: sfs.string("107000"), count: sfs.int(100) }),
    ]);
    for (const raw of ["107000;200001", "107000;1|107000;1", "999999;10", "107000;-1"])
      await expect(h.command("arena.army", { armies: sfs.string(raw) })).rejects.toThrow();
    expect((await h.db.db.select().from(user_arena_army))[0]!.free).toBe(100);
    await expect(h.command("arena.apply")).rejects.toThrow();
    expect((await h.db.db.select().from(arena_registration))[0]!.state).toBe(0);
    await expect(h.command("arena.enter")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("arena enrollment persists a single durable application and assignments reject stale identity", async () => {
  const h = await fixture();
  try {
    h.validate();
    const id = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () => h.command("arena.apply", { operationId: id })),
    );
    const [saved] = await h.db.db.select().from(arena_registration);
    expect(saved!.state).toBe(1);
    expect(saved!.time).toBe(BigInt(h.clock.now));
    const outbox = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "arena.apply"));
    expect(outbox.length).toBe(1);
    await publishArenaMutation(outbox[0]!.payload, "arena.apply", h.gateway, async () => {});
    expect(h.applications).toEqual([
      {
        owner: "owner",
        applicationId: saved!.applicationId,
        rankScore: 1,
        registeredAt: BigInt(h.clock.now),
      },
    ]);
    await expect(h.command("arena.apply")).rejects.toThrow();
    const params = {
      applicationId: sfs.string(saved!.applicationId),
      worldId: sfs.int(1),
      fightServerId: sfs.int(1),
      version: sfs.int(2),
    };
    await expect(
      h.command("arena.matched", { ...params, applicationId: sfs.string("foreign-application") }),
    ).rejects.toThrow();
    const matched = await h.command("arena.matched", params);
    expect(matched.body.state!.value).toBe(2);
    await h.command("arena.matched", params);
    expect(
      (
        await h.db.db
          .select()
          .from(mutation_outbox)
          .where(eq(mutation_outbox.eventType, "arena.matched"))
      ).length,
    ).toBe(1);
    await h.command("arena.army", { armies: sfs.string("107000;100") });
    await expect(h.command("arena.enter")).rejects.toThrow("Battle actor unavailable");
    expect((await h.db.db.select().from(arena_registration))[0]!.state).toBe(2);
  } finally {
    await h.close();
  }
}, 120000);

test("arena result consumers require adapter authorization and apply an authorized loss once", async () => {
  const h = await fixture();
  try {
    h.validate();
    await h.command("arena.apply");
    const [application] = await h.db.db.select().from(arena_registration);
    await h.command("arena.matched", {
      applicationId: sfs.string(application!.applicationId),
      worldId: sfs.int(1),
      fightServerId: sfs.int(1),
      version: sfs.int(1),
    });
    const result = {
      applicationId: sfs.string(application!.applicationId),
      worldId: sfs.int(1),
      version: sfs.int(1),
      won: sfs.bool(false),
      playerScore: sfs.int(100),
      teamTotal: sfs.int(100),
      resultId: sfs.string("authorized-envelope"),
    };
    await expect(h.command("arena.finished", result)).rejects.toThrow();
    h.authorizeResult();
    await expect(h.command("arena.finished", { ...result, version: sfs.int(2) })).rejects.toThrow();
    const operationId = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () => h.command("arena.finished", { ...result, operationId })),
    );
    const [finished] = await h.db.db.select().from(arena_registration);
    expect(finished!.state).toBe(0);
    expect(finished!.totalLoseCount).toBe(1);
    expect(finished!.totalWinCount).toBe(0);
    expect(finished!.rankScore).toBe(6);
    await expect(h.command("arena.finished", result)).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("legacy arena values import once without changing the legacy source record", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(user_arena).values({
      uid: "owner",
      rankScore: 5,
      state: 2,
      fightServerId: 1,
      worldId: 1,
      version: 2,
      time: 123456,
      totalWinCount: 3,
      totalLoseCount: 4,
      serialWinCount: 1,
    });
    const response = await h.command("arena.info");
    expect(response.body.time).toEqual(sfs.long(123456n));
    expect(response.body.rankScore).toEqual(sfs.int(5));
    await h.db.db.update(user_arena).set({ rankScore: 99 }).where(eq(user_arena.uid, "owner"));
    await h.command("arena.info");
    expect((await h.db.db.select().from(arena_registration))[0]!.rankScore).toBe(5);
    expect((await h.db.db.select().from(user_arena))[0]!.rankScore).toBe(99);
  } finally {
    await h.close();
  }
}, 120000);
