import { sql } from "drizzle-orm";
import { integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const video = cokdb_pay.table("video", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({"name":"video_Id_seq","startWith":3}),
  "name": varchar("name", { length: 255 }),
  "video_key": text("video_key").notNull(),
  "status": varchar("status", { length: 255 }).default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "video_PRIMARY", columns: [table["Id"]] }),
]);
