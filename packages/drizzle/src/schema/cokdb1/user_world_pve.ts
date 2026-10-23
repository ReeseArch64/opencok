import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const user_world_pve = cokdb1.table("user_world_pve", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "pointId": integer("pointId").notNull(),
  "attNum": integer("attNum").notNull(),
  "buyNum": integer("buyNum"),
  "monsterInfo": bytea("monsterInfo"),
}, (table) => [
  primaryKey({ name: "user_world_pve_PRIMARY", columns: [table["uid"], table["pointId"]] }),
  check("user_world_pve_monsterInfo_length", sql.raw("octet_length(\"monsterInfo\") <= 65535")),
]);
