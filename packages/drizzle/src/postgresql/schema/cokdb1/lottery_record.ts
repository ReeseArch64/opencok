// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const lottery_record = cokdb1.table("lottery_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "superMode": integer("superMode").notNull(),
  "step": integer("step").notNull(),
  "times1": integer("times1").notNull(),
  "times2": integer("times2").notNull(),
  "multiple": integer("multiple").notNull(),
  "result": legacyText("result", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "lotteryId": legacyText("lotteryId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "lotteryInfo1": legacyText("lotteryInfo1", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "lotteryInfo2": legacyText("lotteryInfo2", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
  "times3": integer("times3").default(sql.raw("0")),
  "times4": integer("times4").default(sql.raw("0")),
  "boxTimes": integer("boxTimes").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "lottery_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("lottery_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
