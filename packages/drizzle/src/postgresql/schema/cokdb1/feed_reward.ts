// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const feed_reward = cokdb1.table("feed_reward", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "feed_count": integer("feed_count"),
  "feed_time": bigint("feed_time", { mode: "bigint" }),
  "accept_count": integer("accept_count"),
  "accept_time": bigint("accept_time", { mode: "bigint" }),
  "feed_uuid": legacyText("feed_uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "feed_reward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("feed_reward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
