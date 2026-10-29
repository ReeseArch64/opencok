import { expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { RepositoryInventory } from "../src/services/repository-inventory";

function fixture(files: Record<string, string>, inspect: (root: string) => void): void
{
    const root = mkdtempSync(join(tmpdir(), "opencok-580-"));

    try
    {
        execFileSync("git", ["init", "--quiet", root]);

        for (const [path, source] of Object.entries(files))
        {
            mkdirSync(dirname(join(root, path)), { recursive: true });
            writeFileSync(join(root, path), source);
        }

        execFileSync("git", ["add", "."], { cwd: root });
        execFileSync("git", [
            "-c",
            "user.name=Synthetic",
            "-c",
            "user.email=synthetic@example.invalid",
            "commit",
            "--quiet",
            "-m",
            "fixture",
        ], { cwd: root });
        inspect(root);
    }
    finally
    {
        rmSync(root, { recursive: true, force: true });
    }
}

test("read_rootAndUntrackedPaths_assignsExplicitOwnersAndSkipsPrivateInputs", () => {
    fixture({
        "README.md": "Synthetic repository",
        "packages/README.md": "Synthetic packages",
        "packages/domain/package.json": JSON.stringify({
            name: "@opencok/domain",
            exports: { "./*": "./src/*.ts" },
        }),
        "packages/domain/src/value.ts": "export const value = 1;\n",
        "data/reference/synthetic.ts": "not valid source",
        ".gitignore": "ignored.ts\n",
        "removed.ts": "export {};",
    }, (root) => {
        writeFileSync(join(root, "packages/domain/src/new.ts"), "");
        writeFileSync(join(root, "ignored.ts"), "not valid source");
        symlinkSync(join(root, "data/reference/synthetic.ts"), join(root, "linked.ts"));
        rmSync(join(root, "removed.ts"));
        const report = new RepositoryInventory(root).read();

        expect(report.files.map((file) => file.path)).toEqual([
            ".gitignore",
            "README.md",
            "packages/README.md",
            "packages/domain/package.json",
            "packages/domain/src/new.ts",
            "packages/domain/src/value.ts",
        ]);
        expect(report.files.find((file) => file.path === "packages/README.md")).toMatchObject({
            currentOwner: "repository",
            role: "documentation",
            sourceLines: null,
            proposedOwner: null,
            migrationStatus: "unreviewed",
        });
        expect(report.files.find((file) => file.path.endsWith("value.ts"))).toMatchObject({
            currentOwner: "packages/domain",
            role: "source",
            sourceLines: 1,
        });
        expect(report.files.find((file) => file.path.endsWith("new.ts"))?.sourceLines).toBe(0);
        expect(report.schemaVersion).toBe(1);
        expect(report.revision).toMatch(/^[a-f0-9]{40}$/);
    });
});

test("read_workspaceExportsAndTypeEdges_reportsCandidatesAndUnresolvedImports", () => {
    fixture({
        "packages/domain/package.json": JSON.stringify({
            name: "@opencok/domain",
            exports: { "./*": "./src/*.ts" },
        }),
        "apps/server/package.json": JSON.stringify({ name: "@opencok/server" }),
        "packages/domain/src/value.ts": "export const commands = [\"read\"] as const;",
        "packages/domain/src/adapter.ts": "export * from \"./value.js\";",
        "apps/server/src/main.ts": "import type { Value } from \"@opencok/domain/adapter\";",
        "apps/server/test/value.test.ts": "import \"../src/main\";",
        "apps/server/src/unresolved.ts": "import \"./missing\"; import(variable);",
    }, (root) => {
        const report = new RepositoryInventory(root).read();
        const value = report.files.find((file) => file.path === "packages/domain/src/value.ts");

        expect(value).toMatchObject({
            directDependents: ["packages/domain/src/adapter.ts"],
            applicationSourceConsumers: ["apps/server"],
            verificationCandidates: ["apps/server/test/value.test.ts"],
            sourceEvidence: [{
                kind: "command-list",
                name: "commands",
                values: ["read"],
                unresolved: [],
            }],
        });
        expect(report.unresolvedImports).toEqual([
            {
                path: "apps/server/src/unresolved.ts",
                specifier: "./missing",
                syntax: "ImportDeclaration",
            },
            { path: "apps/server/src/unresolved.ts", specifier: undefined, syntax: "Import" },
        ]);
        expect(new RepositoryInventory(root).read()).toEqual(report);
    });
});

test("read_maintainedRepository_accountsForAllOriginalDispositionsAndEveryInventoryOwner", () => {
    const root = resolve(import.meta.dir, "../../..");
    const report = JSON.parse(execFileSync(process.execPath, [
        "--no-env-file",
        "packages/catalog-tools/scripts/source-ownership.ts",
    ], { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })) as ReturnType<
        RepositoryInventory["read"]
    >;
    const register = readFileSync(join(root, "packages/MIGRATION.md"), "utf8")
        .split("## ").find((section) => section.startsWith("Existing package disposition review"))!;
    const names = [...register.matchAll(/^\| `([^`]+)`/gm)].map((match) => match[1]);

    expect(names).toEqual([
        "account",
        "alliance",
        "api",
        "api-client",
        "api-contracts",
        "base",
        "billing",
        "building",
        "campaigns",
        "city",
        "combat",
        "command",
        "config",
        "connection",
        "constants",
        "contexts",
        "contracts",
        "controllers",
        "core",
        "custom",
        "decorators",
        "dragon",
        "drizzle",
        "dtos",
        "email",
        "enums",
        "env",
        "errors",
        "events",
        "generators",
        "guard",
        "helpers",
        "hero",
        "i18n",
        "identity",
        "kvk",
        "ledger",
        "mappings",
        "messages",
        "middlewares",
        "mongoose",
        "notifications",
        "npc",
        "payments",
        "player",
        "policy",
        "prompts",
        "queues",
        "ranking",
        "repositories",
        "resources",
        "robot",
        "rules",
        "scripts",
        "services",
        "share",
        "skins",
        "storage",
        "store",
        "tasks",
        "troops",
        "utils",
        "validations",
        "webhooks",
    ]);
    expect(new Set(names).size).toBe(64);
    expect(names).toContain("store");
    expect(names).toContain("custom");
    expect(report.files.find((file) => file.path === "packages/README.md")?.currentOwner).toBe(
        "repository",
    );
    expect(report.files.filter((file) => !file.currentOwner || !file.role)).toEqual([]);
    expect(
        report.files.some((file) => file.path.startsWith("data/") || /(^|\/)\.env/.test(file.path)),
    ).toBe(false);
}, 60_000);

test("read_trackedDirectoryReplacedBySymlink_excludesDescendantsBeforeReadingSources", () => {
    fixture({
        "packages/domain/package.json": JSON.stringify({ name: "@opencok/domain" }),
        "packages/domain/src/value.ts": "export const value = 1;",
        "data/reference/value.ts": "not valid source",
    }, (root) => {
        rmSync(join(root, "packages/domain/src"), { recursive: true });
        symlinkSync(join(root, "data/reference"), join(root, "packages/domain/src"));
        const report = new RepositoryInventory(root).read();

        expect(report.files.map((file) => file.path)).toEqual(["packages/domain/package.json"]);
        expect(report.modules).toEqual([]);
    });
});
