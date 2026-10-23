// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const egg_activity = cokdb1.table("egg_activity", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "curEgg": legacyText("curEgg", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "eggCd": bigint("eggCd", { mode: "bigint" }).default(sql.raw("0")),
  "exp": integer("exp").default(sql.raw("0")),
  "curExpStage": integer("curExpStage").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "egg_activity_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("egg_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
