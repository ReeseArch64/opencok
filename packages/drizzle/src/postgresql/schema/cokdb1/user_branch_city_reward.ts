// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_branch_city_reward = cokdb1.table("user_branch_city_reward", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "configid": integer("configid").notNull(),
  "dieawaytime": bigint("dieawaytime", { mode: "bigint" }),
  "rewardrefreashtime": bigint("rewardrefreashtime", { mode: "bigint" }),
}, (_table) => [
  index("user_branch_city_reward_uid_id_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"id\"")),
]);
