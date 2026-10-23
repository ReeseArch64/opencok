import { integer } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const anniversary_allianceinfo = opencok_kingdom.table("anniversary_allianceinfo", {
  "num": integer("num").notNull(),
  "allnum": integer("allnum").notNull(),
});
