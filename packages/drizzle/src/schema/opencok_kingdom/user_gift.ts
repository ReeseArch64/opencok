import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_gift = opencok_kingdom.table(
  "user_gift",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "giftId": varchar("giftId", { length: 40 }).notNull(),
    "uid": varchar("uid", { length: 40 }).notNull(),
    "allianceId": varchar("allianceId", { length: 40 }).notNull(),
    "gifttype": integer("gifttype").notNull(),
    "valid": integer("valid").notNull().default(sql.raw("1")),
    "level": integer("level"),
    "item": varchar("item", { length: 255 }),
    "num": integer("num"),
    "para": integer("para").default(sql.raw("0")),
    "time": bigint("time", { mode: "bigint" }).notNull(),
    "expiretime": integer("expiretime"),
    "exp": integer("exp").default(sql.raw("0")),
    "description": varchar("description", { length: 255 }),
  },
  (table) => [primaryKey({ name: "user_gift_PRIMARY", columns: [table["uuid"]] })],
);
