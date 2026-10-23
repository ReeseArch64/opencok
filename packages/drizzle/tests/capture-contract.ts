import { writeFile } from "node:fs/promises";
import { bootstrap } from "../scripts/bootstrap";
import { nativeContract } from "./support/contract";
import { DisposableMariaDB } from "./support/mariadb";

// Deliberate fixture refresh only; never runs as part of tests/snapshot updates.
const server = new DisposableMariaDB();
try {
  const connection = await server.start();
  try {
    await bootstrap(connection);
    const contract = await nativeContract(connection);
    const tables = Object.entries(contract.tables).map(([id, table]) => `    ${JSON.stringify(id)}: ${JSON.stringify(table)}`).join(",\n");
    await writeFile(new URL("./fixtures/mariadb-contract.json", import.meta.url),
      `{\n  "version": ${JSON.stringify(contract.version)},\n  "migrations": ${JSON.stringify(contract.migrations)},\n  "tables": {\n${tables}\n  }\n}\n`);
    console.log(`Captured ${Object.keys(contract.tables).length} native table contracts (public DDL only)`);
  } finally { await connection.end(); }
} finally { await server.stop(); }
