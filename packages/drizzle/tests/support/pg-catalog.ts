import { getTableConfig } from "drizzle-orm/pg-core";
import { manifest } from "../../src/postgresql/manifest";
import * as schemas from "../../src/postgresql/schema";

export const pgCatalog = manifest.tables.map((mapping) => {
  const table = Object.values(schemas[mapping.namespace]).find((table) => getTableConfig(table).name === mapping.name)!;
  if (!table) throw new Error(`Missing PostgreSQL table ${mapping.id}`);
  return { mapping, table, config: getTableConfig(table) };
});
