import { desc, eq, sql } from "drizzle-orm";
import { expedition_calendar } from "@opencok/drizzle/schema/opencok_global/expedition_calendar";
import { new_expedition } from "@opencok/drizzle/schema/opencok_global/new_expedition";
import type { ExpeditionCalendarStore } from "@opencok/contracts/expedition-calendar";
import { long, num, text } from "@opencok/contracts/rows";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import type { Database } from "./game";

export function createExpeditionCalendarStore(
  db: Database["databases"]["global"]["db"],
): ExpeditionCalendarStore {
  return {
    async reconcile(build) {
      return db.transaction(async (tx) => {
        await tx.execute(sql`set local lock_timeout='1s'`);
        await tx.execute(sql`set local statement_timeout='3s'`);
        await tx.execute(sql`select pg_advisory_xact_lock(728225,1)`);
        const [latest] = await tx
          .select()
          .from(expedition_calendar)
          .orderBy(desc(expedition_calendar.endTime), desc(expedition_calendar.id))
          .limit(1)
          .for("update");
        const legacy = latest
          ? []
          : await tx
              .select()
              .from(new_expedition)
              .where(
                sql`${new_expedition.endTime}>0 and ${new_expedition.endTime}<9223372036854775807`,
              )
              .orderBy(desc(new_expedition.endTime))
              .limit(2)
              .for("share");
        const plan = build({ latest, legacy });

        if (plan.close) {
          if (
            !latest ||
            latest.id !== plan.close ||
            !plan.create ||
            long(plan.create, "startTime") < latest.endTime
          )
            {throw new Error("Invalid expedition calendar replacement");}

          await tx
            .update(expedition_calendar)
            .set({ state: 1 })
            .where(eq(expedition_calendar.id, latest.id));
        }

        if (plan.create) {
          const row = plan.create;
          expeditionCalendarPhases(row);
          await tx.insert(expedition_calendar).values({
            id: text(row, "id"),
            startTime: long(row, "startTime"),
            endTime: long(row, "endTime"),
            schedule: text(row, "schedule"),
            expectedRealms: text(row, "expectedRealms"),
            createdAt: long(row, "createdAt"),
            cycle: num(row, "cycle"),
            state: 0,
            sourceId: row.sourceId === null ? null : text(row, "sourceId"),
          });
        }

        return plan.current;
      });
    },
  };
}
