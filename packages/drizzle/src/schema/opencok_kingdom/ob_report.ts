import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const ob_report = opencok_kingdom.table(
    "ob_report",
    {
        "id": integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "ob_report_id_seq", "startWith": 1 }),
        "worldId": integer("worldId").notNull(),
        "content": bytea("content"),
        "createTime": bigint("createTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "ob_report_PRIMARY", columns: [table["id"], table["worldId"]] }),
        index("ob_report_createTime").on(sql.raw("\"createTime\"")),
        check("ob_report_content_length", sql.raw("octet_length(\"content\") <= 65535")),
    ],
);
