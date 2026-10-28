import { copyFile, cp, mkdir, readdir, symlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import assets from "./web-assets.json";

const destination = process.argv[2];

if (!destination)
{
    throw new Error("Usage: web-workspace.ts <empty synthetic workspace>");
}

const directory = resolve(destination);
const root = resolve(import.meta.dirname, "../..");

await mkdir(directory, { recursive: true });

if ((await readdir(directory)).length !== 0)
{
    throw new Error("Synthetic web workspace must be empty; existing inputs cannot be overwritten");
}

await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ private: true, type: "module", workspaces: [] }),
);
await writeFile(join(directory, "bunfig.toml"), "env = false\n");
await symlink(join(root, "node_modules"), join(directory, "node_modules"), "dir");
const app = join(directory, "apps/web");
await mkdir(join(app, "assets"), { recursive: true });
await cp(join(root, "apps/web/src"), join(app, "src"), { recursive: true });

for (const name of ["package.json", "tsconfig.json"])
{
    await copyFile(join(root, "apps/web", name), join(app, name));
}

for (const [name, encoded] of Object.entries(assets))
{
    await writeFile(join(app, "assets", name), Buffer.from(encoded, "base64"));
}

console.log(app);
