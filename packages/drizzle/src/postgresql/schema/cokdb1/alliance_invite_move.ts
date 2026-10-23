// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_invite_move = cokdb1.table("alliance_invite_move", {
  "inviter": legacyText("inviter", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "invitee": legacyText("invitee", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_invite_move_PRIMARY", columns: [table["inviter"], table["invitee"]] }),
  uniqueIndex("alliance_invite_move_PRIMARY_pad").on(sql.raw("rtrim(\"inviter\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"invitee\", ' ') COLLATE \"C\"")),
]);
