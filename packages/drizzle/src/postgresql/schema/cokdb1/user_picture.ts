// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_picture = cokdb1.table("user_picture", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uploadTime": bigint("uploadTime", { mode: "bigint" }).default(sql.raw("0")),
  "auditPerson": legacyText("auditPerson", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "note": legacyText("note", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "state": integer("state").default(sql.raw("0")),
  "picVer": integer("picVer").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_picture_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_picture_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
