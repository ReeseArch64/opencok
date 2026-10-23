import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const lucky_day = opencok_kingdom.table("lucky_day", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "unluckyCount": integer("unluckyCount").default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }),
  "effectId": varchar("effectId", { length: 40 }),
  "luckyCount": integer("luckyCount"),
  "lucky_id": integer("lucky_id"),
}, (table) => [
  primaryKey({ name: "lucky_day_PRIMARY", columns: [table["uid"]] }),
]);
