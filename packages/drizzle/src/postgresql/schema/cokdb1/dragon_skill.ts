// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_skill = cokdb1.table("dragon_skill", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}),
  "dragonId": integer("dragonId"),
  "skillId": legacyText("skillId", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
});
