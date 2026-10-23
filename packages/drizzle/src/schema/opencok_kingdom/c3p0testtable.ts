import { varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const c3p0testtable = opencok_kingdom.table("c3p0testtable", {
  "a": varchar("a", { length: 1 }),
});
