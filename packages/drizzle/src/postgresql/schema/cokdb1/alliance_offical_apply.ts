// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_offical_apply = cokdb1.table("alliance_offical_apply", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "applyType": integer("applyType").notNull().default(sql.raw("0")),
  "applyTime": bigint("applyTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "operateType": integer("operateType").notNull().default(sql.raw("0")),
  "operateTime": bigint("operateTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_offical_apply_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_offical_apply_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_offical_apply_index_user").on(sql.raw("rtrim(\"userId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_offical_apply_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
