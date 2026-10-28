import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const material_cost_ranking = opencok_kingdom.table(
    "material_cost_ranking",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "contributeSum": integer("contributeSum").notNull().default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "material_cost_ranking_PRIMARY", columns: [table["uid"]] })],
);
