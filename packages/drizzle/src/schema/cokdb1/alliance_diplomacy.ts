import { sql } from "drizzle-orm";
import { check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const alliance_diplomacy = cokdb1.table("alliance_diplomacy", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "ally": bytea("ally"),
  "enemy": bytea("enemy"),
  "other": bytea("other"),
}, (table) => [
  primaryKey({ name: "alliance_diplomacy_PRIMARY", columns: [table["uid"]] }),
  check("alliance_diplomacy_ally_length", sql.raw("octet_length(\"ally\") <= 65535")),
  check("alliance_diplomacy_enemy_length", sql.raw("octet_length(\"enemy\") <= 65535")),
  check("alliance_diplomacy_other_length", sql.raw("octet_length(\"other\") <= 65535")),
]);
