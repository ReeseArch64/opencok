import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const accept_fb_record = opencok_kingdom.table("accept_fb_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "accept_fb_record_PRIMARY", columns: [table["uid"], table["uuid"]] }),
]);
