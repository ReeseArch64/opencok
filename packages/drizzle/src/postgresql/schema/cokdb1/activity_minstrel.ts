// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const activity_minstrel = cokdb1.table("activity_minstrel", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "listen": integer("listen").notNull(),
  "listentime": bigint("listentime", { mode: "bigint" }),
  "share": integer("share"),
  "sharetime": bigint("sharetime", { mode: "bigint" }),
  "reward": integer("reward"),
  "rewardtime": bigint("rewardtime", { mode: "bigint" }),
  "resettime": bigint("resettime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "activity_minstrel_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("activity_minstrel_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
