import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_exchange_cycle = opencok_kingdom.table("user_exchange_cycle", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "stage": integer("stage").default(sql.raw("0")),
  "totalstage": integer("totalstage").default(sql.raw("0")),
  "waittime": bigint("waittime", { mode: "bigint" }).default(sql.raw("0")),
  "totalstage1": integer("totalstage1").default(sql.raw("0")),
  "waittime1": bigint("waittime1", { mode: "bigint" }).default(sql.raw("0")),
  "totalstage2": integer("totalstage2").default(sql.raw("0")),
  "waittime2": bigint("waittime2", { mode: "bigint" }).default(sql.raw("0")),
  "exchanges": varchar("exchanges", { length: 200 }),
  "stage1": integer("stage1").default(sql.raw("0")),
  "stage2": integer("stage2").default(sql.raw("0")),
  "cdtime": bigint("cdtime", { mode: "bigint" }).default(sql.raw("-1")),
  "cdtime1": bigint("cdtime1", { mode: "bigint" }).default(sql.raw("-1")),
  "cdtime2": bigint("cdtime2", { mode: "bigint" }).default(sql.raw("-1")),
  "receive_reward": varchar("receive_reward", { length: 255 }),
  "receive_reward1": varchar("receive_reward1", { length: 255 }),
  "receive_reward2": varchar("receive_reward2", { length: 255 }),
}, (table) => [
  primaryKey({ name: "user_exchange_cycle_PRIMARY", columns: [table["uid"]] }),
]);
