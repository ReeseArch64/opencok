// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const tavern = cokdb1.table("tavern", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "free": integer("free").notNull(),
  "firstFree": integer("firstFree").notNull(),
  "firstPay": integer("firstPay").notNull(),
  "freeTimes": integer("freeTimes").notNull(),
  "payTimes": integer("payTimes").notNull(),
  "generals": legacyText("generals", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "generalId1": legacyText("generalId1", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "generalId2": legacyText("generalId2", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "generalId3": legacyText("generalId3", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "generalId4": legacyText("generalId4", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "generalId5": legacyText("generalId5", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "generalId6": legacyText("generalId6", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "recruit1": integer("recruit1").notNull(),
  "recruit2": integer("recruit2").notNull(),
  "recruit3": integer("recruit3").notNull(),
  "recruit4": integer("recruit4").notNull(),
  "recruit5": integer("recruit5").notNull(),
  "recruit6": integer("recruit6").notNull(),
  "addFreeTime": bigint("addFreeTime", { mode: "bigint" }).notNull(),
  "resetResult": integer("resetResult").notNull(),
}, (table) => [
  primaryKey({ name: "tavern_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("tavern_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
