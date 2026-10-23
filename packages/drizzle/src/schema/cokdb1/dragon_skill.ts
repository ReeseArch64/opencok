import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const dragon_skill = cokdb1.table("dragon_skill", {
  "uid": varchar("uid", { length: 96 }),
  "dragonId": integer("dragonId"),
  "skillId": varchar("skillId", { length: 60 }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
});
