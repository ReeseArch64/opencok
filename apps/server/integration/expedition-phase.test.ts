import { long } from "@opencok/contracts/rows";
import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { ExpeditionMatchingService } from "@opencok/services/expedition-matching";
import {
  ExpeditionPhaseService,
  ExpeditionActivityService,
  expeditionPhaseDomain,
  publishExpeditionPhaseNotification,
} from "@opencok/services/expedition-phase";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import {
  createExpeditionMatchingRegistry,
  createExpeditionMatchingRealmStore,
} from "@opencok/repositories/expedition-matching";
import {
  createExpeditionPhaseStore,
  createExpeditionActivityReader,
} from "@opencok/repositories/expedition-phase";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { expeditionPhaseOperation } from "@opencok/rules/expedition-phase";
import { expeditionDomain } from "@opencok/services/new-expedition";
import { expedition_clock } from "@opencok/drizzle/schema/opencok_kingdom/expedition_clock";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { sfs, fields, decode, int, str, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([expeditionDomain, expeditionPhaseDomain]),
    closers = [h.close];
  try {
    h.clock.now = Date.UTC(2040, 0, 1);
    await h.db.pool.query('CREATE DATABASE "expedition_view_global"');
    await h.db.pool.query('CREATE DATABASE "expedition_view_second"');
    const global = createDatabase("global", {
        ...h.connection,
        database: "expedition_view_global",
      }),
      second = createDatabase("kingdom", { ...h.connection, database: "expedition_view_second" });
    closers.push(global.close, second.close);
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    await migrate(second.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const rules2 = await loadRules(undefined, 2),
      authority2 = await acquireRealmAuthority(second.db, 2, () => true),
      now = () => h.clock.now,
      calendar = new ExpeditionCalendarService(
        createExpeditionCalendarStore(global.db),
        h.rules,
        [1, 2],
        now,
      ),
      period = (await calendar.refresh())!,
      schedule = expeditionCalendarPhases(period),
      registry = createExpeditionMatchingRegistry(global.db),
      store = createExpeditionPhaseStore(h.db.db, h.authority, now),
      phase = new ExpeditionPhaseService(calendar, store),
      activity = new ExpeditionActivityService(
        createExpeditionActivityReader(h.db.db, h.authority, now),
        h.rules,
        now,
      );
    const first = new ExpeditionMatchingService(
        calendar,
        createExpeditionMatchingRealmStore(h.db.db, h.authority, now),
        registry,
        h.rules,
        now,
      ),
      secondWorker = new ExpeditionMatchingService(
        new ExpeditionCalendarService(
          createExpeditionCalendarStore(global.db),
          rules2,
          [1, 2],
          now,
        ),
        createExpeditionMatchingRealmStore(second.db, authority2, now),
        registry,
        rules2,
        now,
      );
    const definition = h.rules.power.activityPanels!.get("57155")!;
    h.rules.power.activityPanels!.set("57155", {
      ...definition,
      start: "2030-01-01-00-00",
      end: "2100-01-01-00-00",
    });
    await phase.refresh();
    const pair = async () => {
      h.clock.now = Number(schedule[1]!.startTime);
      await first.refresh();
      await secondWorker.refresh();
      await phase.refresh();
      h.clock.now = Number(schedule[1]!.endTime);
      await first.refresh();
      await secondWorker.refresh();
      await phase.refresh();
    };
    const notify = async (revision: bigint) =>
      h.command("expedition.notify", {
        revision: sfs.string(String(revision)),
        operationId: sfs.string(expeditionPhaseOperation(revision)),
      });
    return {
      ...h,
      global,
      second,
      calendar,
      period,
      schedule,
      store,
      phase,
      activity,
      first,
      secondWorker,
      pair,
      notify,
      close: async () => {
        for (const close of closers.toReversed()) {await close();}
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) {await close();}
    throw error;
  }
}
test("native expedition login and activity queries show waiting, matching and confirmed owned stages without a fictitious opponent", async () => {
  const h = await fixture();
  try {
    const initial = await h.activity.activity("owner"),
      panel = fields((initial.activity!.value as Value[])[0]);
    expect(panel.id).toEqual(sfs.string("57155"));
    expect(panel.state).toEqual(sfs.int(0));
    expect(panel.kingdominfolist!.value).toHaveLength(1);
    const info = await h.command("newexpidition.activityinfo", {});
    expect(info.body.state).toEqual(sfs.int(0));
    expect(info.body.endTime).toEqual(sfs.long(h.schedule[0]!.endTime));
    expect(await h.db.db.select().from(expedition_progress)).toHaveLength(0);
    await h.pair();
    const preparing = await h.command("newexpidition.activityinfo", {});
    expect(preparing.body.state).toEqual(sfs.int(2));
    expect(preparing.body.kingdominfolist!.value).toHaveLength(2);
    expect(fields((preparing.body.kingdominfolist!.value as Value[])[1]).serverid).toEqual(
      sfs.int(2),
    );
    h.clock.now = Number(h.schedule.find((row) => row.stage === 7)!.startTime);
    const clock = (await h.phase.refresh())!;
    expect(clock).toMatchObject({ stage: 7, opponent: 2, revision: 4n });
    expect((await h.command("newexpidition.activityinfo", {})).body.state).toEqual(sfs.int(7));
  } finally {
    await h.close();
  }
}, 120000);
test("an admitted unmatched realm retains its matching view after the deadline and cannot claim or score through that projection", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.schedule[1]!.startTime);
    await h.first.refresh();
    const matching = (await h.phase.refresh())!;
    expect(matching.stage).toBe(1);
    h.clock.now = Number(h.schedule[1]!.endTime) + 1;
    await h.first.refresh();
    expect(await h.phase.refresh()).toEqual(matching);
    const info = await h.command("newexpidition.activityinfo", {});
    expect(info.body.state).toEqual(sfs.int(1));
    expect(info.body.endTime).toEqual(sfs.long(h.schedule[1]!.endTime));
    expect(info.body.kingdominfolist!.value).toHaveLength(1);
    await expect(
      h.command("newexpidition.takepersonreward", { id: sfs.string("1") }),
    ).rejects.toThrow();
    expect(await h.db.db.select().from(expedition_progress)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("phase notifications commit once with their receipt and publish only the latest native activity payload", async () => {
  const h = await fixture();
  try {
    await h.notify(1n);
    await h.notify(1n);
    const events = (await h.db.db.select().from(mutation_outbox)).filter(
      (row) => row.eventType === "expedition.phase",
    );
    expect(events).toHaveLength(1);
    const sent: { command: string; body: Fields }[] = [],
      publish = async (_owner: string, command: string, body: Fields) => {
        sent.push({ command, body });
      };
    expect(await publishExpeditionPhaseNotification(events[0]!.payload, "owner", 1n, publish)).toBe(
      true,
    );
    expect(sent[0]!.command).toBe("push.activity.update");
    expect(int(fields((sent[0]!.body.activity!.value as Value[])[0]), "state")).toBe(0);
    h.clock.now = Number(h.schedule[1]!.startTime);
    await h.first.refresh();
    const clock = (await h.phase.refresh())!;
    expect(clock.revision).toBe(2n);
    expect(
      await publishExpeditionPhaseNotification(
        events[0]!.payload,
        "owner",
        long(clock, "revision"),
        publish,
      ),
    ).toBe(false);
    expect(sent).toHaveLength(1);
    await h.notify(long(clock, "revision"));
    const next = (await h.db.db.select().from(mutation_outbox)).filter(
      (row) => row.eventType === "expedition.phase",
    );
    expect(next).toHaveLength(2);
    const latest = next.find((row) => str(decode(row.payload), "revision") === "2")!;
    expect(await publishExpeditionPhaseNotification(latest.payload, "owner", 2n, publish)).toBe(
      true,
    );
    expect(int(fields((sent[1]!.body.activity!.value as Value[])[0]), "state")).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("clock and notification receipt failures roll back cleanly before restart resumes the same revision", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.schedule[1]!.startTime);
    await h.first.refresh();
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_expedition_clock() returns trigger language plpgsql as $$ begin raise exception 'synthetic clock rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_expedition_clock before update on opencok_kingdom.expedition_clock for each row execute function opencok_kingdom.reject_expedition_clock()`,
    );
    await expect(h.phase.refresh()).rejects.toThrow();
    expect((await h.db.db.select().from(expedition_clock))[0]!.revision).toBe(1n);
    await h.db.db.execute(
      sql`drop trigger reject_expedition_clock on opencok_kingdom.expedition_clock`,
    );
    const clock = (await new ExpeditionPhaseService(h.calendar, h.store).refresh())!;
    expect(clock.revision).toBe(2n);
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_expedition_notice() returns trigger language plpgsql as $$ begin raise exception 'synthetic notice rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_expedition_notice before insert on opencok_kingdom.command_receipt for each row execute function opencok_kingdom.reject_expedition_notice()`,
    );
    await expect(h.notify(2n)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "expedition.phase",
      ),
    ).toHaveLength(0);
    await h.db.db.execute(
      sql`drop trigger reject_expedition_notice on opencok_kingdom.command_receipt`,
    );
    await h.notify(2n);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "expedition.phase",
      ),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("authority replacement preserves the clock, optional shared failure leaves owned reads available and revision exhaustion never wraps", async () => {
  const h = await fixture();
  try {
    const current = (await h.phase.refresh())!,
      unavailable = new ExpeditionPhaseService(
        {
          refresh: async () => {
            throw new Error("synthetic shared outage");
          },
        },
        h.store,
      );
    await expect(unavailable.refresh()).rejects.toThrow("synthetic shared outage");
    expect((await h.activity.activity("owner")).activity!.value).toHaveLength(1);
    const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.phase.refresh()).rejects.toThrow();
    const store = createExpeditionPhaseStore(h.db.db, replacement, () => h.clock.now),
      worker = new ExpeditionPhaseService(h.calendar, store);
    expect(await worker.refresh()).toEqual(current);
    await h.db.db
      .update(expedition_clock)
      .set({ revision: 9223372036854775807n })
      .where(eq(expedition_clock.serverId, 1));
    h.clock.now = Number(h.schedule[1]!.startTime);
    const realm = createExpeditionMatchingRealmStore(h.db.db, replacement, () => h.clock.now);
    await realm.admit(h.period);
    await expect(worker.refresh()).rejects.toThrow("Invalid expedition clock revision");
    expect((await h.db.db.select().from(expedition_clock))[0]!.revision).toBe(9223372036854775807n);
  } finally {
    await h.close();
  }
}, 120000);
test("activity snapshots reject foreign, missing or banned owners before exposing realm panels", async () => {
  const h = await fixture();
  try {
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "other"));
    await expect(h.activity.activity("other")).rejects.toThrow();
    await expect(h.activity.activity("missing")).rejects.toThrow();
    await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "owner"));
    await expect(h.activity.activity("owner")).rejects.toThrow();
    expect((await h.db.db.select().from(expedition_clock))[0]!.revision).toBe(1n);
  } finally {
    await h.close();
  }
}, 120000);
