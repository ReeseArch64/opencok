import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mod_record = opencok_kingdom.table("mod_record", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"mod_record_id_seq","startWith":1}),
  "fromUser": varchar("fromUser", { length: 255 }),
  "toUser": varchar("toUser", { length: 255 }),
  "mailType": integer("mailType"),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "mod_record_PRIMARY", columns: [table["id"]] }),
  index("mod_record_from_idx").on(sql.raw("\"fromUser\"")),
  index("mod_record_to_idx").on(sql.raw("\"toUser\"")),
  index("mod_record_time_Idx").on(sql.raw("\"createTime\"")),
]);
