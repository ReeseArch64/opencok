// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pay_lottery_log = cokdb1.table("user_pay_lottery_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "userId": legacyText("userId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "activityId": legacyText("activityId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "spend": legacyNumber("spend", {"sqlType":"numeric(10,2)"}),
  "itemId": legacyText("itemId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "gold": integer("gold"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_pay_lottery_log_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_pay_lottery_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
