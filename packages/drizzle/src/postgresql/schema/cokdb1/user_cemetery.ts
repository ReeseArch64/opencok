// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_cemetery = cokdb1.table("user_cemetery", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "deadSum": bigint("deadSum", { mode: "bigint" }).default(sql.raw("0")),
  "deadAbilityValue": bigint("deadAbilityValue", { mode: "bigint" }).default(sql.raw("0")),
  "contributionValue": integer("contributionValue").notNull().default(sql.raw("0")),
  "needContributionValue": integer("needContributionValue").notNull().default(sql.raw("0")),
  "contributionStage": integer("contributionStage").notNull().default(sql.raw("0")),
  "useItemSum": integer("useItemSum").notNull().default(sql.raw("0")),
  "pubDeadInfo": legacyText("pubDeadInfo", {"sqlType":"character varying(1500)","collation":"legacy_meta.ci"}).notNull(),
  "priDeadInfo": legacyText("priDeadInfo", {"sqlType":"character varying(1500)","collation":"legacy_meta.ci"}).notNull(),
  "reviveAbilityValue": bigint("reviveAbilityValue", { mode: "bigint" }).default(sql.raw("0")),
  "tempReviveInfo": legacyText("tempReviveInfo", {"sqlType":"character varying(1500)","collation":"legacy_meta.ci"}),
  "isPriInfoEmpty": integer("isPriInfoEmpty").default(sql.raw("0")),
  "reviveSumThisTime": integer("reviveSumThisTime").default(sql.raw("0")),
  "freedata": legacyText("freedata", {"sqlType":"character varying(1500)","collation":"legacy_meta.ci"}),
  "revived": legacyText("revived", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_cemetery_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_cemetery_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
