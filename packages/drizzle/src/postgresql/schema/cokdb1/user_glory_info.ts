// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_glory_info = cokdb1.table("user_glory_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "strengthenCount": integer("strengthenCount").notNull(),
  "strengthenTime": bigint("strengthenTime", { mode: "bigint" }).notNull(),
  "expeditionVictoryTimes": integer("expeditionVictoryTimes").notNull().default(sql.raw("-1")),
  "weaknessTime": bigint("weaknessTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_glory_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_glory_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
