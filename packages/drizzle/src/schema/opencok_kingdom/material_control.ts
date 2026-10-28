import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const material_control = opencok_kingdom.table(
    "material_control",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "num": integer("num").notNull().default(sql.raw("0")),
        "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "material_control_PRIMARY", columns: [table["uid"]] })],
);
