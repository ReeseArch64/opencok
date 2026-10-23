// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_push = cokdb1.table("user_push", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "platform": legacyText("platform", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "userId": legacyText("userId", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "channelId": legacyText("channelId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "active": integer("active").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "user_push_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_push_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_push_userId").on(sql.raw("rtrim(left(\"userId\", 255), ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
