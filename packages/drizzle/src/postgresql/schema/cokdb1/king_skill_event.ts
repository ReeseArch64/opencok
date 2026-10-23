// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const king_skill_event = cokdb1.table("king_skill_event", {
  "uid": legacyText("uid", {"sqlType":"character varying(256)","collation":"legacy_meta.ci"}),
  "skillId": legacyText("skillId", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "data": legacyText("data", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "opTime": bigint("opTime", { mode: "bigint" }),
  "params": legacyText("params", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "dialogId": legacyText("dialogId", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
}, (_table) => [
  index("king_skill_event_uid_index").on(sql.raw("rtrim(left(\"uid\", 255), ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
