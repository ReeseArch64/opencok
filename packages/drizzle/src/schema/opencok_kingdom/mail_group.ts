import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mail_group = opencok_kingdom.table("mail_group", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "groupType": integer("groupType").notNull().default(sql.raw("1")),
  "groupIndex": varchar("groupIndex", { length: 40 }).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "mail_group_PRIMARY", columns: [table["uid"], table["groupType"], table["groupIndex"]] }),
]);
