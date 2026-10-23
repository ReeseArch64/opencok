import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_helper = cokdb1.table("alliance_helper", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "helpId": varchar("helpId", { length: 255 }),
  "senderId": varchar("senderId", { length: 255 }),
  "recvId": varchar("recvId", { length: 255 }),
  "stats": integer("stats").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_helper_PRIMARY", columns: [table["uid"]] }),
  index("alliance_helper_index_alliance_helper").on(sql.raw("\"helpId\""), sql.raw("\"recvId\"")),
]);
