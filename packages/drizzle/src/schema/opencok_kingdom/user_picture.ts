import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_picture = opencok_kingdom.table("user_picture", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "uploadTime": bigint("uploadTime", { mode: "bigint" }).default(sql.raw("0")),
  "auditPerson": varchar("auditPerson", { length: 255 }).default(sql.raw("''")),
  "note": varchar("note", { length: 255 }).default(sql.raw("''")),
  "state": integer("state").default(sql.raw("0")),
  "picVer": integer("picVer").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_picture_PRIMARY", columns: [table["uid"]] }),
]);
