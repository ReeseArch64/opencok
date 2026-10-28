import { sql } from "drizzle-orm";
import { check, integer, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const logs_points = opencok_pay.table(
    "logs_points",
    {
        "usn": integer("usn"),
        "Transaction_ID": varchar("Transaction_ID", { length: 255 }),
        "points": varchar("points", { length: 50 }),
        "old_points": varchar("old_points", { length: 50 }),
        "new_points": varchar("new_points", { length: 50 }),
        "time": text("time").default(sql.raw("'0000-00-00 00:00:00'")),
    },
    (_table) => [
        check(
            "logs_points_time_temporal",
            sql.raw(
                "(\"time\" IS NULL OR (CASE WHEN \"time\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"time\",4) <> '0000' AND substring(\"time\",6,2) <> '00' AND substring(\"time\",9,2) <> '00' THEN to_char(to_date(left(\"time\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"time\",10) ELSE true END ELSE false END))",
            ),
        ),
    ],
);
