import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_invite_move = cokdb1.table("alliance_invite_move", {
  "inviter": varchar("inviter", { length: 255 }).notNull(),
  "invitee": varchar("invitee", { length: 255 }).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_invite_move_PRIMARY", columns: [table["inviter"], table["invitee"]] }),
]);
