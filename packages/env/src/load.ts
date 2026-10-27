import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const moduleDirectory =
  typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));

function findWorkspaceRoot(start: string): string {
  let directory = start;

  while (true) {
    try {
      const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));

      if (Array.isArray(manifest.workspaces) || Array.isArray(manifest.workspaces?.packages))
        return directory;
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT"))
        throw new Error("Cannot read workspace configuration");
    }

    const parent = dirname(directory);

    if (parent === directory)
      throw new Error("Cannot locate workspace root for environment configuration");

    directory = parent;
  }
}

export const workspaceRoot = findWorkspaceRoot(moduleDirectory);

export const rootEnvPath = join(workspaceRoot, ".env");

export function loadEnvironment(source: Readonly<Record<string, string | undefined>>) {
  let values: Record<string, string | undefined> = {};

  try {
    values = parseEnv(readFileSync(rootEnvPath, "utf8"));
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT"))
      throw new Error("Cannot read root .env configuration");
  }

  return { ...values, ...source };
}
