import { sql } from "drizzle-orm";
import { integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const download = opencok_pay.table(
    "download",
    {
        "Id": integer("Id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "download_Id_seq", "startWith": 12 }),
        "name": varchar("name", { length: 255 }),
        "app_icon": varchar("app_icon", { length: 255 }),
        "platform": varchar("platform", { length: 255 }),
        "link": text("link"),
        "version": varchar("version", { length: 11 }),
        "status": integer("status").notNull().default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "download_PRIMARY", columns: [table["Id"]] })],
);
