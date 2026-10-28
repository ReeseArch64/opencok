import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { HeroCalendarService } from "@opencok/hero/services/hero-calendar";
import { createHeroCalendarStore } from "@opencok/hero/repositories/hero-calendar";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { server_activity } from "@opencok/drizzle/schema/opencok_kingdom/server_activity";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness();
    h.clock.now = Date.UTC(2023, 0, 2, 12, 30);
    const service = new HeroCalendarService(
        createHeroCalendarStore(h.db.db, h.authority, () => h.clock.now),
        h.rules,
        () => h.clock.now,
    );
    return { ...h, calendar: service };
}
test(
    "hero calendars admit one durable period per family and recover the actual current stage across concurrent refreshes",
    async () => {
        const h = await fixture();
        try
        {
            await Promise.all(Array.from({ length: 4 }, () => h.calendar.refresh()));
            const mains = await h.db.db.select().from(hero_activity),
                events = await h.db.db.select().from(hero_event);
            expect(mains).toHaveLength(3);
            expect(events).toHaveLength(4);
            const personal = mains.find((row) => row.activityType === 1)!,
                event = events.find((row) => row.activityId === personal.uuid)!;
            expect(personal).toMatchObject({
                startTime: BigInt(Date.UTC(2023, 0, 2)),
                endTime: BigInt(Date.UTC(2023, 0, 3)),
                roundTime: 7200000n,
            });
            expect(event).toMatchObject({
                eventId: "9001006",
                readyTime: BigInt(Date.UTC(2023, 0, 2, 12)),
                startTime: BigInt(Date.UTC(2023, 0, 2, 12, 10)),
                endTime: BigInt(Date.UTC(2023, 0, 2, 14)),
            });
            const restarted = new HeroCalendarService(
                createHeroCalendarStore(h.db.db, h.authority, () => h.clock.now),
                h.rules,
                () => h.clock.now,
            );
            await restarted.refresh();
            expect(await h.db.db.select().from(hero_event)).toEqual(events);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero stages advance by their saved deadlines without fabricating missed stages or deleting old scores",
    async () => {
        const h = await fixture();
        try
        {
            await h.calendar.refresh();
            const first = (await h.db.db.select().from(hero_event)).find((row) => row.type === 1)!;
            await h.db.db.insert(score_act).values({
                uid: "owner",
                actId: first.uuid,
                level: 0,
                score: 123,
                finishFlag: 0,
                rewardFlag: "0",
            });
            h.clock.now = Date.UTC(2023, 0, 2, 18, 30);
            await h.calendar.refresh();
            const events = (await h.db.db.select().from(hero_event)).filter((row) =>
                row.type === 1
            );
            expect(events).toHaveLength(2);
            expect(events.find((row) => row.uuid !== first.uuid)!.eventId).toBe("9001009");
            expect((await h.db.db.select().from(score_act))[0]).toMatchObject({
                actId: first.uuid,
                score: 123,
            });
            h.clock.now = Date.UTC(2023, 0, 3, 0, 1);
            await h.calendar.refresh();
            const mains = await h.db.db.select().from(hero_activity);
            expect(mains).toHaveLength(6);
            expect(mains.filter((row) => row.finish === 1)).toHaveLength(3);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "stronger-lord activity blocks new hero periods while existing periods keep advancing",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(server_activity).values({
                uid: "lord",
                id: 1,
                startTime: BigInt(h.clock.now - 1),
                endTime: BigInt(h.clock.now + 7200000),
            });
            await h.calendar.refresh();
            expect(await h.db.db.select().from(hero_activity)).toHaveLength(0);
            await h.db.db.delete(server_activity);
            await h.calendar.refresh();
            await h.db.db.insert(server_activity).values({
                uid: "lord",
                id: 1,
                startTime: BigInt(h.clock.now - 1),
                endTime: BigInt(h.clock.now + 14400000),
            });
            h.clock.now = Date.UTC(2023, 0, 2, 14, 30);
            await h.calendar.refresh();
            expect((await h.db.db.select().from(hero_event)).filter((row) => row.type === 1))
                .toHaveLength(
                    2,
                );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "disabling a hero family closes its events without erasing earned scores or reopening the same day",
    async () => {
        const h = await fixture();
        try
        {
            await h.calendar.refresh();
            const event = (await h.db.db.select().from(hero_event)).find((row) => row.type === 1)!;
            await h.db.db.insert(score_act).values({
                uid: "owner",
                actId: event.uuid,
                level: 0,
                score: 123,
                finishFlag: 1,
                rewardFlag: "0,1",
            });
            h.rules.items.get("heroactivity_on")!.k1 = "close";
            await h.calendar.refresh();
            expect(
                (await h.db.db.select().from(hero_event).where(eq(hero_event.uuid, event.uuid)))[0]!
                    .rewardStatus,
            ).toBe(1);
            expect((await h.db.db.select().from(score_act))[0]).toMatchObject({
                score: 123,
                finishFlag: 1,
                rewardFlag: "0,1",
            });
            h.rules.items.get("heroactivity_on")!.k1 = "1-9999";
            await h.calendar.refresh();
            expect(
                (await h.db.db.select().from(hero_activity)).filter((row) =>
                    row.activityType === 1
                ),
            ).toHaveLength(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "hero admission failures roll back the parent and every coupled event, and stale realm authorities cannot create a period",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_hero_event() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_hero_event BEFORE INSERT ON opencok_kingdom.hero_event FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_hero_event()`,
            );
            await expect(h.calendar.refresh()).rejects.toThrow();
            expect(await h.db.db.select().from(hero_activity)).toHaveLength(0);
            expect(await h.db.db.select().from(hero_event)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_hero_event ON opencok_kingdom.hero_event`,
            );
            const authority = await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(h.calendar.refresh()).rejects.toThrow();
            const current = new HeroCalendarService(
                createHeroCalendarStore(h.db.db, authority, () => h.clock.now),
                h.rules,
                () => h.clock.now,
            );
            await current.refresh();
            expect(await h.db.db.select().from(hero_activity)).toHaveLength(3);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
