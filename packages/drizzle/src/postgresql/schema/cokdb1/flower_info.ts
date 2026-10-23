// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const flower_info = cokdb1.table("flower_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(38)","collation":"legacy_meta.ci"}).notNull(),
  "lastflowerRanking": integer("lastflowerRanking"),
  "lastOperatorFlower": bigint("lastOperatorFlower", { mode: "bigint" }),
  "flowerUse": legacyText("flowerUse", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "lastCanvassTime": bigint("lastCanvassTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastBeCanvassTime": bigint("lastBeCanvassTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "flower_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("flower_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
