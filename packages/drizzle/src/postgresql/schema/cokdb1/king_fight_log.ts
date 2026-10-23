// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_fight_log = cokdb1.table("king_fight_log", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "king_fight_log_id_seq", startWith: 46500 }),
  "index": integer("index").notNull(),
  "logTime": bigint("logTime", { mode: "bigint" }).default(sql.raw("0")),
  "logType": legacyText("logType", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "uid": legacyText("uid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "log": legacyText("log", {"sqlType":"character varying(2048)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "king_fight_log_PRIMARY", columns: [table["id"]] }),
  index("king_fight_log_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
