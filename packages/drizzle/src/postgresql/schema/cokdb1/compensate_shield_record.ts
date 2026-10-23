// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const compensate_shield_record = cokdb1.table("compensate_shield_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "compensate_shield_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("compensate_shield_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
]);
