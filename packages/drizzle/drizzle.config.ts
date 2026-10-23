import { defineConfig } from "drizzle-kit";
import { env, requireEnv } from "@opencok/env/database";

const role = requireEnv("DATABASE_ROLE");

export default defineConfig({
  dialect: "postgresql",
  schema: `./src/schema/${role}.ts`,
  out: `./migrations/${role}`,
  ...(env.DATABASE_URL ? { dbCredentials: { url: env.DATABASE_URL } } : {}),
  strict: true,
});
