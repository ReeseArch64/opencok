// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const army_strengthen = cokdb1.table("army_strengthen", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "skillbase_id": integer("skillbase_id").default(sql.raw("0")),
  "level": integer("level"),
  "exp": integer("exp"),
  "skills": legacyText("skills", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "times": integer("times"),
  "crit": integer("crit"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
});
