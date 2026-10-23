import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const deposit_record_5 = opencok_kingdom.table("deposit_record_5", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "operate": integer("operate").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "withDrawTime": bigint("withDrawTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "deposit_record_5_PRIMARY", columns: [table["uuid"]] }),
]);
