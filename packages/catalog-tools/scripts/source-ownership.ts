import { resolve } from "node:path";
import { RepositoryInventory } from "../src/services/repository-inventory";

const root = resolve(import.meta.dir, "../../..");
const report = new RepositoryInventory(root).read();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
