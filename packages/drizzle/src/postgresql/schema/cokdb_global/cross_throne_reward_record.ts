// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const cross_throne_reward_record = cokdb_global.table("cross_throne_reward_record", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "cross_throne_reward_record_id_seq", startWith: 10 }),
  "version": integer("version").notNull(),
  "from_uid": legacyText("from_uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "target_uid": legacyText("target_uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'-1'")),
  "from_server_id": integer("from_server_id").notNull(),
  "target_server_id": integer("target_server_id").notNull(),
  "reward_type": smallint("reward_type").notNull(),
  "reward_id": integer("reward_id").notNull(),
  "record_time": bigint("record_time", { mode: "bigint" }),
  "pic": legacyText("pic", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "pic_ver": integer("pic_ver").notNull().default(sql.raw("0")),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "alliance_abbr": legacyText("alliance_abbr", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "throne_type": integer("throne_type").notNull().default(sql.raw("0")),
  "overlord_type": integer("overlord_type").notNull(),
}, (table) => [
  primaryKey({ name: "cross_throne_reward_record_PRIMARY", columns: [table["id"]] }),
  check("cross_throne_reward_record_reward_type_range", sql.raw("\"reward_type\" BETWEEN -128 AND 127")),
]);
