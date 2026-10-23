import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const avatar_storage = opencok_kingdom.table("avatar_storage", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "avatarId": varchar("avatarId", { length: 255 }).notNull(),
  "expirationTime": bigint("expirationTime", { mode: "bigint" }).notNull(),
  "effectiveSign": integer("effectiveSign").notNull().default(sql.raw("0")),
  "username": varchar("username", { length: 255 }),
  "usetime": bigint("usetime", { mode: "bigint" }),
  "type": integer("type").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "avatar_storage_PRIMARY", columns: [table["uid"], table["avatarId"]] }),
]);
