// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_exped_history = cokdb1.table("new_exped_history", {
  "stageId": integer("stageId").default(sql.raw("0")),
  "winServerId": integer("winServerId").default(sql.raw("0")),
  "loseServerId": integer("loseServerId").default(sql.raw("0")),
  "users": legacyText("users", {"sqlType":"character varying(1500)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "createTime": bigint("createTime", { mode: "bigint" }).default(sql.raw("0")),
}, (_table) => [
  index("new_exped_history_winServerId_index").on(sql.raw("\"winServerId\"")),
  index("new_exped_history_loseServerId_index").on(sql.raw("\"loseServerId\"")),
]);
