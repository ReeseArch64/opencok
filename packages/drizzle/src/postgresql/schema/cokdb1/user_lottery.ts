// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_lottery = cokdb1.table("user_lottery", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "lotteryId": legacyText("lotteryId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "times": integer("times"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_lottery_PRIMARY", columns: [table["uid"], table["lotteryId"]] }),
  uniqueIndex("user_lottery_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"lotteryId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
