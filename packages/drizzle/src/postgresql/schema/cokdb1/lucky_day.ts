// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const lucky_day = cokdb1.table("lucky_day", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "unluckyCount": integer("unluckyCount").default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }),
  "effectId": legacyText("effectId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "luckyCount": integer("luckyCount"),
  "lucky_id": integer("lucky_id"),
}, (table) => [
  primaryKey({ name: "lucky_day_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("lucky_day_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
