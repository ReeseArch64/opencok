// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const material_cost_ranking = cokdb1.table("material_cost_ranking", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "contributeSum": integer("contributeSum").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "material_cost_ranking_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("material_cost_ranking_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
