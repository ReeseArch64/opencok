import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const compensate_shield_record = cokdb1.table("compensate_shield_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "compensate_shield_record_PRIMARY", columns: [table["uid"]] }),
]);
