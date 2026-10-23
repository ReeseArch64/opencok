import { expect, test } from "bun:test";
import { mkdtemp, mkdir, copyFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function fixture(rootFile?: string) {
  const root = await mkdtemp(join(tmpdir(), "opencok-root-env-"));
  const source = join(root, "packages/env/src"); await mkdir(source, { recursive: true });
  await writeFile(join(root, "package.json"), JSON.stringify({ workspaces: { packages: ["packages/*"] } }));
  await writeFile(join(root, "bunfig.toml"), "env = false\n");
  await symlink("../../bunfig.toml", join(root, "packages/env/bunfig.toml"));
  await writeFile(join(root, "packages/env/package.json"), JSON.stringify({ name: "synthetic-env", type: "module" }));
  for (const name of ["schema.ts", "load.ts", "index.ts"]) await copyFile(new URL(`../src/${name}`, import.meta.url), join(source, name));
  if (rootFile !== undefined) await writeFile(join(root, ".env"), rootFile);
  const script = join(root, "read.ts");
  await writeFile(script, `import { env } from './packages/env/src/index.ts'; console.log(JSON.stringify({mode:env.NODE_ENV,role:env.DATABASE_ROLE,hasDatabase:!!env.DATABASE_URL}));`);
  return { root, script };
}
async function run(script: string, cwd: string, overrides: Record<string, string> = {}, disableAutomatic = true) {
  const child = Bun.spawn([process.execPath, ...(disableAutomatic ? ["--no-env-file"] : []), script], {
    cwd, env: { PATH: process.env.PATH, ...overrides }, stdout: "pipe", stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  return { stdout, stderr, code };
}

test("one root file is used from root, a package and an unrelated working directory", async () => {
  const item = await fixture('NODE_ENV=production\nDATABASE_ROLE="kingdom"\nDATABASE_URL=postgresql://synthetic:placeholder@localhost/db\n');
  try {
    await writeFile(join(item.root, "packages/env/.env"), "DATABASE_ROLE=invalid_nested_value\n");
    await writeFile(join(item.root, ".env.local"), "DATABASE_ROLE=invalid_variant\n");
    for (const cwd of [item.root, join(item.root, "packages/env"), tmpdir()]) {
      const result = await run(item.script, cwd);
      expect(result.code).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({ mode: "production", role: "kingdom", hasDatabase: true });
    }
    // Normal root execution uses bunfig.toml to disable Bun's additional dotenv files.
    for (const cwd of [item.root, join(item.root, "packages/env")]) {
      const result = await run(item.script, cwd, {}, false);
      expect(result.code).toBe(0); expect(JSON.parse(result.stdout).role).toBe("kingdom");
    }
  } finally { await rm(item.root, { recursive: true, force: true }); }
});

test("explicit process values override the root file and missing files work in CI", async () => {
  const item = await fixture("NODE_ENV=development\nDATABASE_ROLE=global\n");
  try {
    const result = await run(item.script, tmpdir(), { NODE_ENV: "test", DATABASE_ROLE: "kingdom" });
    expect(result.code).toBe(0); expect(JSON.parse(result.stdout)).toEqual({ mode: "test", role: "kingdom", hasDatabase: false });
    await rm(join(item.root, ".env"));
    const withoutFile = await run(item.script, tmpdir(), { DATABASE_ROLE: "global" });
    expect(withoutFile.code).toBe(0); expect(JSON.parse(withoutFile.stdout).role).toBe("global");
  } finally { await rm(item.root, { recursive: true, force: true }); }
});

test("subprocess diagnostics never contain a rejected secret value", async () => {
  const secret = "synthetic-private-value";
  const item = await fixture(`DATABASE_URL=https://user:${secret}@localhost/db\n`);
  try {
    const result = await run(item.script, tmpdir());
    expect(result.code).not.toBe(0); expect(result.stderr).toContain("DATABASE_URL");
    expect(result.stderr).not.toContain(secret); expect(result.stdout).not.toContain(secret);
  } finally { await rm(item.root, { recursive: true, force: true }); }
});
