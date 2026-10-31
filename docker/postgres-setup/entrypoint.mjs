import { createRequire } from "node:module";

const { Client } = createRequire(new URL("../../packages/drizzle/package.json", import.meta.url))(
  "pg",
);

const deadline = Date.now() + 60_000;

while (true) {
  const client = new Client({
    host: "postgres",
    port: 5432,
    database: "postgres",
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD,
    connectionTimeoutMillis: 1000,
  });

  try {
    await client.connect();
    break;
  } catch (error) {
    if (["28P01", "28000"].includes(error?.code)) {
      console.error("PostgreSQL authentication failed; verify setup credentials");
      process.exit(1);
    }

    if (Date.now() >= deadline) {
      console.error("PostgreSQL did not become available within 60 seconds");
      process.exit(1);
    }

    await Bun.sleep(1000);
  } finally {
    await client.end().catch(() => {});
  }
}

const child = Bun.spawn(Bun.argv.slice(2), {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));

process.exit(await child.exited);
