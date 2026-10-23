import { varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const c3p0testtable = cokdb1.table("c3p0testtable", {
  "a": varchar("a", { length: 1 }),
});
