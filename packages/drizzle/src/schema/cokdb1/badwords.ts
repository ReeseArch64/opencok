import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const badwords = cokdb1.table("badwords", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"badwords_id_seq","startWith":1}),
  "words": varchar("words", { length: 255 }),
}, (table) => [
  primaryKey({ name: "badwords_PRIMARY", columns: [table["id"]] }),
]);
