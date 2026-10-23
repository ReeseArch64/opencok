// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const donate_history = cokdb1.table("donate_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"C"}),
  "donate": integer("donate").default(sql.raw("0")),
  "progress": integer("progress"),
  "donateTime": bigint("donateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "donate_history_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("donate_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("donate_history_aid_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\"")),
  index("donate_history_time_idx").on(sql.raw("\"donateTime\"")),
  index("donate_history_progress_idx").on(sql.raw("\"progress\"")),
  index("donate_history_donate_idx").on(sql.raw("\"donate\"")),
]);
