// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity_group_buys = cokdb1.table("activity_group_buys", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "curRound": integer("curRound").notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "roundInfo": legacyText("roundInfo", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "activity_group_buys_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("activity_group_buys_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
