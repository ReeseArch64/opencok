import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const routes = opencok_kingdom.table(
    "routes",
    {
        "route_id": integer("route_id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "routes_route_id_seq", "startWith": 1 }),
        "module_id": integer("module_id"),
        "route_name": varchar("route_name", { length: 50 }),
        "route_path": varchar("route_path", { length: 100 }),
        "log_tag": smallint("log_tag").default(sql.raw("0")),
        "prt_id": integer("prt_id"),
        "order_num": varchar("order_num", { length: 12 }),
        "pinyin": varchar("pinyin", { length: 100 }),
        "isProd": smallint("isProd").default(sql.raw("1")),
        "type": varchar("type", { length: 6 }).default(sql.raw("'other'")),
    },
    (table) => [
        primaryKey({ name: "routes_PRIMARY", columns: [table["route_id"]] }),
        check("routes_log_tag_range", sql.raw("\"log_tag\" BETWEEN -128 AND 127")),
        check("routes_isProd_range", sql.raw("\"isProd\" BETWEEN -128 AND 127")),
    ],
);
