// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const compensation_record = cokdb1.table("compensation_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "count": integer("count").default(sql.raw("0")),
  "lastCompensateTime": bigint("lastCompensateTime", { mode: "bigint" }),
  "isFirstOnFire": integer("isFirstOnFire").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "compensation_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("compensation_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("compensation_record_time_index").on(sql.raw("\"lastCompensateTime\"")),
]);
