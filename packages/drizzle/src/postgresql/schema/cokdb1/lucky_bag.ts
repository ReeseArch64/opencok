// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const lucky_bag = cokdb1.table("lucky_bag", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "openFreetimes": integer("openFreetimes").default(sql.raw("0")),
  "flushTimes": integer("flushTimes").default(sql.raw("0")),
  "nextOpenTime": integer("nextOpenTime").default(sql.raw("0")),
  "multiple": integer("multiple").default(sql.raw("1")),
  "score": integer("score").default(sql.raw("0")),
  "scoreReward": legacyText("scoreReward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "lucky_bag_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("lucky_bag_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
