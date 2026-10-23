import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const invitee = cokdb1.table("invitee", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "inviterUid": varchar("inviterUid", { length: 40 }).notNull(),
  "status": integer("status"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "invitee_PRIMARY", columns: [table["uid"]] }),
]);
