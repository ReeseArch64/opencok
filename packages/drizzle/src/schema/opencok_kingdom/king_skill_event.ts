import { sql } from "drizzle-orm";
import { bigint, index, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const king_skill_event = opencok_kingdom.table("king_skill_event", {
  "uid": varchar("uid", { length: 256 }),
  "skillId": varchar("skillId", { length: 128 }),
  "data": varchar("data", { length: 1024 }),
  "opTime": bigint("opTime", { mode: "bigint" }),
  "params": varchar("params", { length: 1024 }),
  "dialogId": varchar("dialogId", { length: 128 }),
}, (_table) => [
  index("king_skill_event_uid_index").on(sql.raw("left(\"uid\", 255)")),
]);
