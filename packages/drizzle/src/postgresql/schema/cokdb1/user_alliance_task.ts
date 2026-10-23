// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_alliance_task = cokdb1.table("user_alliance_task", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "num": bigint("num", { mode: "bigint" }).default(sql.raw("0")),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_alliance_task_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("user_alliance_task_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_alliance_task_id_idx").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
