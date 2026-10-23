import { defineConfig } from "drizzle-kit";

const database = process.env.DRIZZLE_DATABASE;
if (!database || !["cokdb1", "cokdb_global", "cokdb_pay", "opencok_chat"].includes(database)) {
  throw new Error("Set DRIZZLE_DATABASE to one of the four legacy database names");
}

// Offline DSL preview only. It omits MariaDB-only DDL attributes; the reviewed
// migrations are the reconstruction baseline. No push/migrate credentials here.
export default defineConfig({
  dialect: "mysql",
  schema: `./src/schema/${database}.ts`,
  out: "./.local/drizzle-preview",
});
