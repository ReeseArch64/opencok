import { env, requireEnv } from "@opencok/env/database";
import { Pool } from "pg";
import { writeFile } from "node:fs/promises";
import { setupDatabases } from "./setup";

// Compose provides individual local development credentials. URL setters encode
// special characters; host-side DATABASE_URL values are not reused in the network.
const url = new URL("postgresql://database:5432/postgres");
url.username = env.POSTGRES_USER;
url.password = requireEnv("POSTGRES_PASSWORD");
const config = { connectionString: url.toString(), options: "-c timezone=UTC" };
const admin = new Pool(config);
try {
  const topology = await setupDatabases(admin, config);
  await writeFile("/configuration/servers.json", JSON.stringify({
    Servers: {
      "1": {
        Name: "OpenCok local PostgreSQL",
        Group: "OpenCok",
        Host: "database",
        Port: 5432,
        MaintenanceDB: "postgres",
        Username: env.POSTGRES_USER,
        SSLMode: "prefer",
      },
    },
  }), { mode: 0o644 });
  console.log(`Initialized global database and ${topology.kingdoms.length} kingdoms`);
} catch {
  console.error("Database initialization failed; verify PostgreSQL credentials and migrations");
  process.exitCode = 1;
} finally { await admin.end(); }
