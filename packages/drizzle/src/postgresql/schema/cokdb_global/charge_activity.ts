// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const charge_activity = cokdb_global.table("charge_activity", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
  "buyEndTime": bigint("buyEndTime", { mode: "bigint" }),
  "buyCount": integer("buyCount"),
  "maxBuyCount": integer("maxBuyCount"),
  "rewardStatus": integer("rewardStatus"),
  "round": integer("round"),
}, (table) => [
  primaryKey({ name: "charge_activity_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("charge_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
