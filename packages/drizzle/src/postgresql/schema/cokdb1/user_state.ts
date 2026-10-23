// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_state = cokdb1.table("user_state", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "stateId": integer("stateId").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
  "type": integer("type").default(sql.raw("0")),
  "type2": integer("type2").default(sql.raw("0")),
  "groupType": integer("groupType").default(sql.raw("0")),
  "ranEffId": integer("ranEffId"),
  "ranEffValue": integer("ranEffValue"),
  "property1": legacyText("property1", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "property2": legacyText("property2", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "count": integer("count").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "user_state_PRIMARY", columns: [table["uid"], table["stateId"]] }),
  uniqueIndex("user_state_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"stateId\"")),
  index("user_state_index_uid_type2").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type2\"")),
  index("user_state_index_uid_stateId").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"stateId\"")),
  index("user_state_index_stateId").on(sql.raw("\"stateId\"")),
]);
