// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const trouble_log = cokdb1.table("trouble_log", {
  "uid": bigint("uid", { mode: "bigint" }),
  "username": legacyText("username", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "usetime": bigint("usetime", { mode: "bigint" }),
  "statusid": legacyText("statusid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (_table) => [
  index("trouble_log_trouble_log_uid_index").on(sql.raw("\"uid\"")),
]);
