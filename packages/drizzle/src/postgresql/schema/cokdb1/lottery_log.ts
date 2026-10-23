// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const lottery_log = cokdb1.table("lottery_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "type": smallint("type"),
  "superMode": smallint("superMode"),
  "lotteryId": legacyText("lotteryId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "lotteryInfo": legacyText("lotteryInfo", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "result": legacyText("result", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "position": integer("position"),
  "cost": integer("cost"),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "lottery_log_PRIMARY", columns: [table["uid"], table["createTime"]] }),
  uniqueIndex("lottery_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("lottery_log_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
  check("lottery_log_superMode_range", sql.raw("\"superMode\" BETWEEN -128 AND 127")),
]);
