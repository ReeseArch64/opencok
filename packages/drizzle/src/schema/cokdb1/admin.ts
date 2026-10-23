import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const admin = cokdb1.table("admin", {
  "uid": integer("uid").notNull().generatedByDefaultAsIdentity({"name":"admin_uid_seq","startWith":1}),
  "username": varchar("username", { length: 20 }).notNull(),
  "passmd5": varchar("passmd5", { length: 40 }).notNull(),
  "language": varchar("language", { length: 8 }).notNull(),
  "auth": text("auth").notNull(),
  "groupid": integer("groupid").notNull().default(sql.raw("0")),
  "addtime": bigint("addtime", { mode: "bigint" }).notNull(),
  "lastactive": bigint("lastactive", { mode: "bigint" }).notNull(),
  "roleIds": varchar("roleIds", { length: 100 }),
  "default_module_id": integer("default_module_id").default(sql.raw("-1")),
}, (table) => [
  primaryKey({ name: "admin_PRIMARY", columns: [table["uid"]] }),
]);
