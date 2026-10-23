import { sql } from "drizzle-orm";
import { bigint, index, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_branch_city_reward = opencok_kingdom.table(
  "user_branch_city_reward",
  {
    "id": integer("id").notNull().default(sql.raw("0")),
    "uid": varchar("uid", { length: 32 }).notNull().default(sql.raw("''")),
    "configid": integer("configid").notNull(),
    "dieawaytime": bigint("dieawaytime", { mode: "bigint" }),
    "rewardrefreashtime": bigint("rewardrefreashtime", { mode: "bigint" }),
  },
  (_table) => [index("user_branch_city_reward_uid_id_index").on(sql.raw('"uid"'), sql.raw('"id"'))],
);
