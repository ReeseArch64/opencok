// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pay_lottery = cokdb1.table("user_pay_lottery", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "totalGold": integer("totalGold"),
  "lastGold": integer("lastGold"),
  "lastLuckyNum": integer("lastLuckyNum"),
  "lastBonus": integer("lastBonus"),
  "count": integer("count"),
  "lastTime": bigint("lastTime", { mode: "bigint" }),
  "shareTime": bigint("shareTime", { mode: "bigint" }),
  "luckyNum": integer("luckyNum"),
}, (table) => [
  primaryKey({ name: "user_pay_lottery_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_pay_lottery_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
