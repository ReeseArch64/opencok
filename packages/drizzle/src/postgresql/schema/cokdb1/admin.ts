// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const admin = cokdb1.table("admin", {
  "uid": integer("uid").notNull().generatedByDefaultAsIdentity({ name: "admin_uid_seq", startWith: 1 }),
  "username": legacyText("username", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "passmd5": legacyText("passmd5", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "language": legacyText("language", {"sqlType":"character varying(8)","collation":"legacy_meta.ci"}).notNull(),
  "auth": legacyText("auth", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "groupid": integer("groupid").notNull().default(sql.raw("0")),
  "addtime": bigint("addtime", { mode: "bigint" }).notNull(),
  "lastactive": bigint("lastactive", { mode: "bigint" }).notNull(),
  "roleIds": legacyText("roleIds", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "default_module_id": integer("default_module_id").default(sql.raw("-1")),
}, (table) => [
  primaryKey({ name: "admin_PRIMARY", columns: [table["uid"]] }),
]);
