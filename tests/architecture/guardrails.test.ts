import { expect, test } from "bun:test";
import { ModuleImports } from "./module-imports.ts";
import { ModuleResolver } from "./module-resolver.ts";
import { DependencyGraph } from "./dependency-graph.ts";
import { ArchitectureAudit } from "./architecture-audit.ts";
import type { Workspace } from "./contracts.ts";

function workspace(path: string, dependencies: string[] = []): Workspace
{
    return {
        path,
        name: `@opencok/${path.split("/").at(-1)}`,
        exports: { "./*": "./src/*.ts" },
        dependencies: new Set(dependencies),
    };
}

test("source parsing includes type-only declarations, re-exports, import types and literal lazy loads", () => {
    const result = new ModuleImports().read(
        `
        import type { A } from "./a";
        export type { B } from "./b";
        export * from "./c";
        type D = import("./d").D;
        const lazy = import("./e");
        const common = require("./f");
        import legacy = require("./g");
        const text = 'import "./not-a-module"';
        const computed = import(name);
    `,
        "synthetic.ts",
    );
    expect(result.map((entry) => entry.specifier)).toEqual([
        "./a",
        "./b",
        "./c",
        "./d",
        "./e",
        "./f",
        "./g",
        undefined,
    ]);
});

test("public export resolution respects aliases, wildcard specificity, exact exclusions and missing files", () => {
    const owner = workspace("packages/example");
    owner.exports = {
        "./*": "./src/*.ts",
        "./special/*": "./src/nested/*.ts",
        "./alias": "./src/actual.ts",
        "./blocked": null,
        "./conditional": { types: "./src/types.ts", default: "./src/runtime.ts" },
    };
    const files = new Set([
        "packages/example/src/nested/value.ts",
        "packages/example/src/special/value.ts",
        "packages/example/src/actual.ts",
        "packages/example/src/blocked.ts",
        "packages/example/src/types.ts",
        "packages/example/src/relative/index.ts",
    ]);
    const resolver = new ModuleResolver(files, [owner]);
    expect(resolver.resolve("consumer.ts", "@opencok/example/special/value")).toBe(
        "packages/example/src/nested/value.ts",
    );
    expect(resolver.resolve("consumer.ts", "@opencok/example/alias")).toBe(
        "packages/example/src/actual.ts",
    );
    expect(resolver.resolve("consumer.ts", "@opencok/example/blocked")).toBeUndefined();
    expect(resolver.resolve("consumer.ts", "@opencok/example/missing")).toBeUndefined();
    expect(resolver.resolve("consumer.ts", "@opencok/example/conditional")).toBe(
        "packages/example/src/types.ts",
    );
    expect(resolver.resolve("packages/example/src/actual.ts", "./relative")).toBe(
        "packages/example/src/relative/index.ts",
    );
});

test("a new cyclic edge is detected even when it stays inside an existing cyclic component", () => {
    const before = new Map([["a", ["b"]], ["b", ["c"]], ["c", ["a"]]]);
    const baseline = new Set(new DependencyGraph(before).cyclicEdges());
    before.set("a", ["b", "c"]);
    expect(new DependencyGraph(before).cyclicEdges().filter((edge) => !baseline.has(edge))).toEqual(
        ["a -> c"],
    );
    expect(new DependencyGraph(new Map([["a", ["a"]]])).cyclicEdges()).toEqual(["a -> a"]);
    expect(new DependencyGraph(new Map([["a", ["b"]], ["b", []]])).cyclicEdges()).toEqual([]);
});

test("a pure module cannot reach infrastructure through a type import and a harmless-looking intermediate module", () => {
    const report = new ArchitectureAudit().inspect(
        new Map([
            ["packages/example/src/domain/model.ts", "import type { X } from \"../bridge\";"],
            ["packages/example/src/bridge.ts", "export type { X } from \"@opencok/drizzle/db\";"],
            ["packages/drizzle/src/db.ts", "export interface X {}"],
        ]),
        [workspace("packages/example", ["@opencok/drizzle"]), workspace("packages/drizzle")],
    );
    expect(report.violations).toEqual([
        "purity: packages/example/src/domain/model.ts -> packages/drizzle/src/db.ts",
    ]);
});

test("package imports of app source, undeclared dependencies and unresolved exports are explicit violations", () => {
    const report = new ArchitectureAudit().inspect(
        new Map([
            [
                "packages/example/src/service.ts",
                "import \"../../../apps/server/src/app\"; import \"@opencok/other/missing\"; import \"pg\";",
            ],
            ["apps/server/src/app.ts", "export const app = 1;"],
        ]),
        [workspace("packages/example"), workspace("apps/server"), workspace("packages/other")],
    );
    expect(report.violations).toContain(
        "application: packages/example/src/service.ts -> apps/server/src/app.ts",
    );
    expect(report.violations).toContain(
        "undeclared: packages/example/src/service.ts -> @opencok/server",
    );
    expect(report.violations).toContain("undeclared: packages/example/src/service.ts -> pg");
    expect(report.violations).toContain(
        "unresolved: packages/example/src/service.ts -> @opencok/other/missing",
    );
});

test("workspace cycles are detected even when the individual module graph has no cycle", () => {
    const report = new ArchitectureAudit().inspect(
        new Map([
            ["packages/one/src/first.ts", "import \"@opencok/two/leaf\";"],
            ["packages/one/src/leaf.ts", "export const x = 1;"],
            ["packages/two/src/second.ts", "import \"@opencok/one/leaf\";"],
            ["packages/two/src/leaf.ts", "export const x = 1;"],
        ]),
        [workspace("packages/one", ["@opencok/two"]), workspace("packages/two", ["@opencok/one"])],
    );
    expect(report.violations).toEqual([
        "workspace-cycle: packages/one -> packages/two",
        "workspace-cycle: packages/two -> packages/one",
    ]);
});

test("conditional exports inspect runtime and type branches instead of hiding runtime infrastructure behind declarations", () => {
    const example = workspace("packages/example");
    example.exports = { ".": { types: "./src/types.ts", import: "./src/runtime.ts" } };
    const report = new ArchitectureAudit().inspect(
        new Map([
            ["packages/domain/src/domain/value.ts", "import \"@opencok/example\";"],
            ["packages/example/src/types.ts", "export interface X {}"],
            ["packages/example/src/runtime.ts", "import \"node:fs\";"],
        ]),
        [workspace("packages/domain", ["@opencok/example"]), example],
    );
    expect(report.violations).toContain(
        "purity: packages/domain/src/domain/value.ts -> external:node:fs",
    );
    const resolver = new ModuleResolver(new Set(["packages/example/src/types.ts"]), [example]);
    expect(resolver.inspect("consumer.ts", "@opencok/example")).toEqual({
        targets: ["packages/example/src/types.ts"],
        missing: ["packages/example/src/runtime.ts"],
    });
});

test("JavaScript extension imports resolve maintained TypeScript while exports cannot escape their workspace", () => {
    const owner = workspace("packages/example");
    const files = new Set(["packages/example/src/value.ts", "packages/other/src/private.ts"]);
    const resolver = new ModuleResolver(files, [owner]);
    expect(resolver.resolve("packages/example/src/index.ts", "./value.js")).toBe(
        "packages/example/src/value.ts",
    );
    owner.exports = "../other/src/private.ts";
    expect(resolver.inspect("consumer.ts", "@opencok/example").missing).toEqual([
        "invalid-export:packages/example:../other/src/private.ts",
    ]);
});

test("runtime sources cannot transitively import offline discovery while scripts and tests can", () => {
    const report = new ArchitectureAudit().inspect(
        new Map([
            ["apps/server/src/app.ts", "import \"../../../packages/bridge/scripts/load.ts\";"],
            ["packages/bridge/scripts/load.ts", "import \"@opencok/catalog-tools/entry\";"],
            [
                "packages/domain/src/type.ts",
                "import type { Input } from \"@opencok/catalog-tools/entry\";",
            ],
            ["apps/server/scripts/export.ts", "import \"@opencok/catalog-tools/entry\";"],
            ["packages/domain/tests/discovery.test.ts", "import \"@opencok/catalog-tools/entry\";"],
            ["packages/catalog-tools/src/entry.ts", "export type Input = string;"],
        ]),
        [
            workspace("apps/server", ["@opencok/bridge", "@opencok/catalog-tools"]),
            workspace("packages/bridge", ["@opencok/catalog-tools"]),
            workspace("packages/domain", ["@opencok/catalog-tools"]),
            workspace("packages/catalog-tools"),
        ],
    );
    expect(report.violations).toEqual([
        "offline-tool: apps/server/src/app.ts -> packages/catalog-tools/src/entry.ts",
        "offline-tool: packages/domain/src/type.ts -> packages/catalog-tools/src/entry.ts",
    ]);
});
