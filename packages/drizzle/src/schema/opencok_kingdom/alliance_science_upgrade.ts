import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const alliance_science_upgrade = opencok_kingdom.table("alliance_science_upgrade", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "scienceId": integer("scienceId"),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "needTime": bigint("needTime", { mode: "bigint" }),
  "accelerate": bytea("accelerate"),
}, (table) => [
  primaryKey({ name: "alliance_science_upgrade_PRIMARY", columns: [table["allianceId"]] }),
  check("alliance_science_upgrade_accelerate_length", sql.raw("octet_length(\"accelerate\") <= 65535")),
]);
