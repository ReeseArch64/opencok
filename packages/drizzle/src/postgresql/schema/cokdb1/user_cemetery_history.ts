// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_cemetery_history = cokdb1.table("user_cemetery_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "deadSum": bigint("deadSum", { mode: "bigint" }).notNull(),
  "reviveSum": bigint("reviveSum", { mode: "bigint" }).notNull(),
  "useItemSum": integer("useItemSum").notNull(),
  "mainBuildingLevel": integer("mainBuildingLevel").notNull(),
  "rechargeSum": integer("rechargeSum").notNull(),
}, (table) => [
  primaryKey({ name: "user_cemetery_history_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_cemetery_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
