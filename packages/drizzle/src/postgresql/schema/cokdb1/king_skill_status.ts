// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_skill_status = cokdb1.table("king_skill_status", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "kingMsg": legacyText("kingMsg", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}).notNull(),
  "curChooseSkill": legacyText("curChooseSkill", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "skillMaterial": bigint("skillMaterial", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "king_skill_status_PRIMARY", columns: [table["id"]] }),
]);
