// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const npc_trade = cokdb1.table("npc_trade", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "trade": legacyText("trade", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "num": integer("num").default(sql.raw("0")),
  "superValue": integer("superValue").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "npc_trade_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("npc_trade_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
