import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const inviter = cokdb1.table("inviter", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "inviteeUid": varchar("inviteeUid", { length: 40 }).notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "inviter_PRIMARY", columns: [table["uuid"]] }),
  index("inviter_inviter_index_001").on(sql.raw("\"uid\""), sql.raw("\"type\""), sql.raw("\"time\"")),
  index("inviter_uid_type_inviteeUid").on(sql.raw("\"uid\""), sql.raw("\"inviteeUid\""), sql.raw("\"type\"")),
]);
