import { sql } from "drizzle-orm";
import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const army_strengthen = opencok_kingdom.table("army_strengthen", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "skillbase_id": integer("skillbase_id").default(sql.raw("0")),
  "level": integer("level"),
  "exp": integer("exp"),
  "skills": varchar("skills", { length: 255 }),
  "times": integer("times"),
  "crit": integer("crit"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
});
