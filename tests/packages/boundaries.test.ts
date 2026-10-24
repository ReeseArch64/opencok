import { expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../../packages/", import.meta.url).pathname;

test("workspace source imports use declared package APIs without application dependencies or cycles", async () => {
  const graph = new Map<string, string[]>();
  for (const name of await readdir(root)) {
    const directory = join(root, name);
    const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
    const dependencies = Object.keys(manifest.dependencies ?? {});
    graph.set(
      manifest.name,
      dependencies.filter((dependency) => dependency.startsWith("@opencok/")),
    );
    let files: string[];
    try {
      files = await readdir(join(directory, "src"), { recursive: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
    for (const file of files.filter((file) => file.endsWith(".ts"))) {
      const source = await readFile(join(directory, "src", file), "utf8");
      expect(source, `${name}/${file}`).not.toMatch(/from\s+["'][^"']*apps\//);
      for (const match of source.matchAll(/(?:from\s+|import\s*\()["'](@opencok\/[^"']+)["']/g)) {
        const specifier = match[1]!;
        const dependency = specifier.split("/").slice(0, 2).join("/");
        if (dependency !== manifest.name)
          expect(dependencies, `${name}: ${specifier}`).toContain(dependency);
        const target = JSON.parse(
          await readFile(join(root, dependency.slice("@opencok/".length), "package.json"), "utf8"),
        );
        const subpath = specifier.slice(dependency.length);
        const key = subpath ? `.${subpath}` : ".";
        expect(
          Object.keys(target.exports ?? {}).some(
            (exported) =>
              exported === key ||
              (exported.includes("*") && key.startsWith(exported.split("*")[0]!)),
          ),
          specifier,
        ).toBe(true);
      }
    }
  }
  const visited = new Set<string>();
  function visit(name: string, path: string[]) {
    expect(path, `Dependency cycle: ${[...path, name].join(" -> ")}`).not.toContain(name);
    if (visited.has(name)) return;
    for (const dependency of graph.get(name) ?? []) visit(dependency, [...path, name]);
    visited.add(name);
  }
  for (const name of graph.keys()) visit(name, []);
  for (const dependency of graph.get("@opencok/rules") ?? [])
    expect([
      "@opencok/constants",
      "@opencok/errors",
      "@opencok/contracts",
      "@opencok/enums",
    ]).toContain(dependency);
});

test("Services stay independent of Controllers and DTO classes describe create/update inputs", async () => {
  const services = JSON.parse(await readFile(join(root, "services/package.json"), "utf8"));
  expect(Object.keys(services.dependencies)).not.toContain("@opencok/controllers");
  const dtos = join(root, "dtos/src");
  const files = (await readdir(dtos, { recursive: true })).filter((file) => file.endsWith(".ts"));
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    expect(file).toMatch(/(?:create|update)-[\w-]+\.dto\.ts$/);
    const source = await readFile(join(dtos, file), "utf8");
    const classes = [...source.matchAll(/export class (\w+)/g)].map((match) => match[1]);
    expect(classes.length, file).toBeGreaterThan(0);
    for (const name of classes) expect(name, file).toMatch(/^(Create|Update)\w+Dto$/);
    expect(source, file).not.toMatch(/\b(?:constructor|static|extends)\b/);
  }
});
