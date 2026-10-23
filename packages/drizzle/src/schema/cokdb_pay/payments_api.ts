import { sql } from "drizzle-orm";
import { check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const payments_api = cokdb_pay.table("payments_api", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"payments_api_id_seq","startWith":1}),
  "paymentId": varchar("paymentId", { length: 255 }).notNull().default(sql.raw("''")),
  "orderId": varchar("orderId", { length: 255 }),
  "productId": varchar("productId", { length: 255 }),
  "gameUid": varchar("gameUid", { length: 255 }).notNull().default(sql.raw("''")),
  "payerId": varchar("payerId", { length: 255 }).notNull().default(sql.raw("''")),
  "successTimestamp": text("successTimestamp").notNull().default(sql.raw("to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')")),
  "status": varchar("status", { length: 255 }).notNull().default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "payments_api_PRIMARY", columns: [table["id"]] }),
  check("payments_api_successTimestamp_temporal", sql.raw("(\"successTimestamp\" IS NULL OR (CASE WHEN \"successTimestamp\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"successTimestamp\",4) <> '0000' AND substring(\"successTimestamp\",6,2) <> '00' AND substring(\"successTimestamp\",9,2) <> '00' THEN to_char(to_date(left(\"successTimestamp\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"successTimestamp\",10) ELSE true END ELSE false END))")),
]);
