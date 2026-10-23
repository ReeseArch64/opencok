// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ob_user = cokdb1.table("ob_user", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "worldId": integer("worldId"),
  "param1": legacyText("param1", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "ob_user_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("ob_user_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
