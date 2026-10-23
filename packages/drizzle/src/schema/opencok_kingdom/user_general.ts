import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_general = opencok_kingdom.table("user_general", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "generalId": varchar("generalId", { length: 40 }).notNull(),
  "color": integer("color"),
  "status": integer("status").notNull(),
  "level": integer("level").notNull(),
  "exp": integer("exp").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "ability": bytea("ability"),
  "abilityIndex": integer("abilityIndex").default(sql.raw("1")),
  "plusSkillPoint": integer("plusSkillPoint").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_general_PRIMARY", columns: [table["uuid"]] }),
  index("user_general_uid_index_001").on(sql.raw("\"uid\"")),
  check("user_general_ability_length", sql.raw("octet_length(\"ability\") <= 65535")),
]);
