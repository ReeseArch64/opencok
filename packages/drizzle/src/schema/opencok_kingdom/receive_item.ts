import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const receive_item = opencok_kingdom.table("receive_item", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"receive_item_id_seq","startWith":1}),
  "uid": varchar("uid", { length: 50 }).notNull(),
  "senduid": varchar("senduid", { length: 50 }).notNull(),
  "itemId": varchar("itemId", { length: 50 }).notNull().default(sql.raw("'0'")),
  "itemNum": integer("itemNum").notNull().default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "receive_item_PRIMARY", columns: [table["id"]] }),
]);
