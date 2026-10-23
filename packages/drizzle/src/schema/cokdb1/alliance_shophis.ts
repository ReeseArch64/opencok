import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_shophis = cokdb1.table("alliance_shophis", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "allianceId": varchar("allianceId", { length: 40 }),
  "userId": varchar("userId", { length: 40 }),
  "goodsId": varchar("goodsId", { length: 40 }),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_shophis_PRIMARY", columns: [table["uid"]] }),
  index("alliance_shophis_index_alliance").on(sql.raw("\"allianceId\"")),
  index("alliance_shophis_index_user").on(sql.raw("\"userId\"")),
]);
