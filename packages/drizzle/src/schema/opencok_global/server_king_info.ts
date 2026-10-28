import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const server_king_info = opencok_global.table(
    "server_king_info",
    {
        "Id": integer("Id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "server_king_info_Id_seq", "startWith": 3 }),
        "name": varchar("name", { length: 255 }),
        "banner": varchar("banner", { length: 255 }),
        "kingName": varchar("kingName", { length: 255 }),
        "kingAllianceName": varchar("kingAllianceName", { length: 255 }),
        "kingAllianceAbbr": varchar("kingAllianceAbbr", { length: 255 }),
        "kingAllianceIcon": varchar("kingAllianceIcon", { length: 255 }),
    },
    (table) => [primaryKey({ name: "server_king_info_PRIMARY", columns: [table["Id"]] })],
);
