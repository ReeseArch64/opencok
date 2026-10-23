import { defineConfig } from "drizzle-kit";

const role = process.env.DATABASE_ROLE;
if (role !== "global" && role !== "realm") throw new Error("Set DATABASE_ROLE=global|realm");

export default defineConfig({
  dialect: "postgresql",
  schema: `./src/schema/${role}.ts`,
  out: `./migrations/${role}`,
  ...(process.env.DATABASE_URL ? { dbCredentials: { url: process.env.DATABASE_URL } } : {}),
  strict: true,
});
