import { expect, test } from "bun:test";
import { ModuleImports } from "../src/services/module-imports";
import { ModuleResolver } from "../src/services/module-resolver";
import type { Workspace } from "../src/contracts/source-ownership";

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

test("inspect_conditionalRootExports_reportsEveryExistingAndMissingBranch", () => {
    const owner = workspace("packages/example");
    owner.exports = { ".": { types: "./src/types.ts", import: "./src/runtime.ts" } };
    const resolver = new ModuleResolver(new Set(["packages/example/src/types.ts"]), [owner]);

    expect(resolver.inspect("consumer.ts", "@opencok/example")).toEqual({
        targets: ["packages/example/src/types.ts"],
        missing: ["packages/example/src/runtime.ts"],
    });
    expect(resolver.inspect("consumer.ts", "node:fs")).toEqual({ targets: [], missing: [] });
});

test("read_invalidSource_failsInsteadOfDroppingModuleEvidence", () => {
    expect(() => new ModuleImports().read("const =", "invalid.ts")).toThrow();
});
