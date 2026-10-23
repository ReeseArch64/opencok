// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_true_info_bind = cokdb1.table("user_true_info_bind", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "phoneNumber": legacyText("phoneNumber", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}),
  "email": legacyText("email", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "phoneReward": integer("phoneReward"),
  "emailReward": integer("emailReward"),
  "trueInfo": integer("trueInfo").notNull(),
}, (_table) => [
  index("user_true_info_bind_uid, trueInfo").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"trueInfo\"")),
]);
