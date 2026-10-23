import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { env, rootEnvPath } from "@opencok/env";

// Drizzle Kit also loads dotenv internally. Pin that loader to the same file
// and pass validated settings so it cannot replace explicit process overrides.
const childEnvironment: Record<string, string | undefined> = {
  ...process.env,
  ...Object.fromEntries(Object.entries(env).map(([key, value]) => [key, value ?? ""])),
  DOTENV_CONFIG_PATH: rootEnvPath,
  DOTENV_KEY: "",
};
delete childEnvironment.DOTENV_CONFIG_OVERRIDE;
delete childEnvironment.DOTENV_CONFIG_DOTENV_KEY;
const child = Bun.spawn([
  process.execPath, "--no-env-file", join(dirname(fileURLToPath(import.meta.resolve("drizzle-kit"))), "bin.cjs"),
  ...process.argv.slice(2), "--config", "drizzle.config.ts",
], { cwd: fileURLToPath(new URL("..", import.meta.url)), env: childEnvironment, stdin: "inherit", stdout: "inherit", stderr: "inherit" });
process.exitCode = await child.exited;
