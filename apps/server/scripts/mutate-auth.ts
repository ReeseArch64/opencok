import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const app = new URL("../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-auth-mutations-"));
const authFile = "src/game/auth.ts";
const mutations = [
  ["signature", "if (!equal(signature, expected))", "if (false)"],
  ["device binding", 'if (!equal(deviceUuid, text(profile, "deviceUuid")))', "if (false)"],
  ["account activation", 'num(a, "active") === 0', "true"],
  ["realm binding", 'num(a, "server") === config.kingdomId', "true"],
  ["account device", 'equal(text(a, "uuid"), deviceUuid)', "true"],
  ["profile ban", 'num(profile, "banFlag") !== 0', "false"],
  ["profile ban deadline", 'long(profile, "banTime") > BigInt(now)', "false"],
] as const;
async function run() {
  const child = Bun.spawn([process.execPath, "--no-env-file", "test", "test/login.test.ts"], {
    cwd: directory,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [, , code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return code;
}
try {
  for (const name of [authFile, "src/game/rows.ts", "src/protocol/sfs.ts", "test/login.test.ts"]) {
    await mkdir(dirname(join(directory, name)), { recursive: true });
    await writeFile(join(directory, name), await readFile(new URL(name, app)));
  }
  if (await run()) throw new Error("Auth mutation baseline failed");
  const original = await readFile(join(directory, authFile), "utf8");
  for (const [name, from, to] of mutations) {
    if (original.split(from).length !== 2) throw new Error(`Auth mutation target changed: ${name}`);
    await writeFile(join(directory, authFile), original.replace(from, to));
    if ((await run()) === 0) throw new Error(`Critical auth mutation survived: ${name}`);
    console.log(`Killed: ${name}`);
  }
  console.log(`${mutations.length} critical auth mutations killed`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
