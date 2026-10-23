import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const compensation_record_shield = cokdb1.table("compensation_record_shield", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "compensation_record_shield_PRIMARY", columns: [table["uid"]] }),
]);
