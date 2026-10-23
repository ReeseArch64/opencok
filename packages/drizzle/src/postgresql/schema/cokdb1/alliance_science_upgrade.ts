// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_science_upgrade = cokdb1.table("alliance_science_upgrade", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "scienceId": integer("scienceId"),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "needTime": bigint("needTime", { mode: "bigint" }),
  "accelerate": legacyBytes("accelerate"),
}, (table) => [
  primaryKey({ name: "alliance_science_upgrade_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("alliance_science_upgrade_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_science_upgrade_accelerate_length", sql.raw("octet_length(\"accelerate\") <= 65535")),
]);
