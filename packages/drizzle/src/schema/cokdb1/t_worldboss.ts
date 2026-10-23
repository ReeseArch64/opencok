import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const t_worldboss = cokdb1.table("t_worldboss", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"t_worldboss_id_seq","startWith":8456}),
  "bossid": integer("bossid"),
  "level": smallint("level"),
  "type": smallint("type").default(sql.raw("0")),
  "maxhp": integer("maxhp"),
  "hp": integer("hp"),
  "starttime": bigint("starttime", { mode: "bigint" }),
  "endtime": bigint("endtime", { mode: "bigint" }),
  "point": integer("point"),
  "lefttimes": smallint("lefttimes"),
  "attackers": integer("attackers"),
  "attacktimes": integer("attacktimes"),
  "attackpower": integer("attackpower"),
  "items": integer("items"),
  "killuser": varchar("killuser", { length: 32 }),
  "reward": smallint("reward"),
  "firerange": integer("firerange"),
  "firespeed": integer("firespeed"),
  "status": smallint("status"),
}, (table) => [
  primaryKey({ name: "t_worldboss_PRIMARY", columns: [table["id"]] }),
  check("t_worldboss_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
  check("t_worldboss_reward_range", sql.raw("\"reward\" BETWEEN -128 AND 127")),
  check("t_worldboss_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
]);
