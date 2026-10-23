// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_building_bak = cokdb1.table("user_building_bak", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": integer("itemId").notNull(),
  "pos": integer("pos").notNull(),
  "level": integer("level").notNull(),
  "opType": integer("opType").default(sql.raw("0")),
  "putId": legacyText("putId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "reward": integer("reward").default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
  "updateTime": bigint("updateTime", { mode: "bigint" }).default(sql.raw("0")),
  "effectTime": bigint("effectTime", { mode: "bigint" }).default(sql.raw("0")),
  "star": integer("star").default(sql.raw("0")),
  "progress": integer("progress").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_building_bak_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_building_bak_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_building_bak_ub_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"itemId\"")),
  index("user_building_bak_item_index").on(sql.raw("\"itemId\"")),
]);
