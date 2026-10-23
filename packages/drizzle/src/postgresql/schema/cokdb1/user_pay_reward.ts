// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pay_reward = cokdb1.table("user_pay_reward", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
  "time": bigint("time", { mode: "bigint" }),
  "extra": legacyText("extra", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_pay_reward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_pay_reward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
