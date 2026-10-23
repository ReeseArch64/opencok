import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const ob_user = cokdb1.table("ob_user", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "worldId": integer("worldId"),
  "param1": varchar("param1", { length: 200 }),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "ob_user_PRIMARY", columns: [table["uid"]] }),
]);
