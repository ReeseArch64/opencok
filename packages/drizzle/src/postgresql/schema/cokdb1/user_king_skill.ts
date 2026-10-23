// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_king_skill = cokdb1.table("user_king_skill", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": legacyText("skillId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "level": integer("level"),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "todayUseTimes": integer("todayUseTimes").notNull().default(sql.raw("0")),
  "checkDay": bigint("checkDay", { mode: "bigint" }).default(sql.raw("0")),
  "hasDonatedMaterial": integer("hasDonatedMaterial").notNull().default(sql.raw("0")),
  "isSuccessLast": integer("isSuccessLast").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "user_king_skill_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_king_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
