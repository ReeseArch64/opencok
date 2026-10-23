import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const cross_throne_reward_record = opencok_kingdom.table("cross_throne_reward_record", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"cross_throne_reward_record_id_seq","startWith":10}),
  "version": integer("version").notNull(),
  "from_uid": varchar("from_uid", { length: 40 }).notNull(),
  "target_uid": varchar("target_uid", { length: 40 }).notNull().default(sql.raw("'-1'")),
  "from_server_id": integer("from_server_id").notNull(),
  "target_server_id": integer("target_server_id").notNull(),
  "reward_type": smallint("reward_type").notNull(),
  "reward_id": integer("reward_id").notNull(),
  "record_time": bigint("record_time", { mode: "bigint" }),
  "pic": varchar("pic", { length: 50 }),
  "pic_ver": integer("pic_ver").notNull().default(sql.raw("0")),
  "name": varchar("name", { length: 50 }),
  "alliance_abbr": varchar("alliance_abbr", { length: 50 }),
  "throne_type": integer("throne_type").notNull().default(sql.raw("0")),
  "overlord_type": integer("overlord_type").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "cross_throne_reward_record_PRIMARY", columns: [table["id"]] }),
  check("cross_throne_reward_record_reward_type_range", sql.raw("\"reward_type\" BETWEEN -128 AND 127")),
]);
