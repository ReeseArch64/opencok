// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const score_act = cokdb1.table("score_act", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "actId": legacyText("actId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level"),
  "score": integer("score").notNull().default(sql.raw("0")),
  "finishFlag": integer("finishFlag").default(sql.raw("0")),
  "rewardFlag": legacyText("rewardFlag", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "score_act_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("score_act_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("score_act_actId_idx").on(sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
