import { RepositoryInventory } from "./repository-inventory.ts";

const root = new URL("../../", import.meta.url).pathname;
const report = new RepositoryInventory(root).read();
process.stdout.write(JSON.stringify(report, null, 2) + "\n");
