import { expect, test } from "bun:test";
import { InventoryFileRole, SourceEvidenceKind } from "../src/contracts/source-ownership";
import { FileClassification } from "../src/services/file-classification";
import { InventoryRelations } from "../src/services/inventory-relations";
import { SourceFacts } from "../src/services/source-facts";

test("file roles distinguish data, schemas, test fixtures and documentation without assigning semantic identities", () => {
    const classifier = new FileClassification();
    expect(classifier.role("packages/building/src/resources/buildings/00123.ts")).toBe(
        InventoryFileRole.Catalog,
    );
    expect(classifier.role("packages/building/src/resources/buildings/lookup.ts")).toBe(
        InventoryFileRole.Source,
    );
    expect(classifier.role("packages/resources/src/catalogs/types/a.ts")).toBe(
        InventoryFileRole.Schema,
    );
    expect(classifier.role("packages/resources/tests/fixtures/data.json")).toBe(
        InventoryFileRole.Test,
    );
    expect(classifier.role("packages/README.md")).toBe(InventoryFileRole.Documentation);
    expect(classifier.role("packages/config/tsconfig.base.json")).toBe(
        InventoryFileRole.Configuration,
    );
});

test("transitive app and test consumers remain evidence candidates and exclude unrelated workspaces", () => {
    const relations = new InventoryRelations([
        {
            path: "packages/domain/src/value.ts",
            owner: "packages/domain",
            imports: [],
            dependencies: [],
        },
        {
            path: "packages/domain/src/adapter.ts",
            owner: "packages/domain",
            imports: [],
            dependencies: ["packages/domain/src/value.ts"],
        },
        {
            path: "apps/server/src/index.ts",
            owner: "apps/server",
            imports: [],
            dependencies: ["packages/domain/src/adapter.ts"],
        },
        {
            path: "apps/server/test/value.test.ts",
            owner: "apps/server",
            imports: [],
            dependencies: ["packages/domain/src/adapter.ts"],
        },
        { path: "apps/chat/src/index.ts", owner: "apps/chat", imports: [], dependencies: [] },
    ]);
    expect(relations.consumers("packages/domain/src/value.ts")).toEqual({
        directDependents: ["packages/domain/src/adapter.ts"],
        applicationSourceConsumers: ["apps/server"],
        verificationCandidates: ["apps/server/test/value.test.ts"],
    });
    expect(relations.consumers("packages/README.md").applicationSourceConsumers).toEqual([]);
});

test("command evidence preserves aliases and spread gaps instead of promoting unrelated strings to handlers", () => {
    const facts = new SourceFacts().read(
        `
        const commands = ["quest.claim", ...sharedCommands] as const;
        class Domain { commands = importedCommands; }
        const enabledCommands = new Set(["world.tick"]);
        switch (command) { case "quest.claim": break; default: break; }
        if (command === "world.tick") {}
        if (["quest.read"].includes(command)) {}
        const unrelated = "mail.reward";
    `,
        "synthetic.ts",
    );
    expect(facts.flatMap((fact) => fact.values)).toEqual([
        "quest.claim",
        "world.tick",
        "quest.claim",
        "world.tick",
        "quest.read",
    ]);
    expect(facts.flatMap((fact) => fact.unresolved)).toEqual([
        "...sharedCommands",
        "importedCommands",
    ]);
    expect(facts.some((fact) => fact.values.includes("mail.reward"))).toBe(false);
    expect(facts.filter((fact) => fact.kind === SourceEvidenceKind.Dispatch)).toHaveLength(3);
});

test("catalog evidence retains exact native membership and marks nonliteral members unresolved", () => {
    const facts = new SourceFacts().read(
        `
        enum GameplayCatalog { Leading = "00123", Variant = "ArenaMap", Unknown = computed }
        enum ChatCommand { Send = "chat.send" }
    `,
        "catalog.ts",
    );
    expect(facts).toEqual([
        {
            kind: SourceEvidenceKind.Catalog,
            name: "GameplayCatalog",
            values: ["00123", "ArenaMap"],
            unresolved: ["computed"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "ChatCommand",
            values: ["chat.send"],
            unresolved: [],
        },
    ]);
});

test("consumers_cyclicImports_terminatesAndDeduplicatesCandidates", () => {
    const relations = new InventoryRelations([
        {
            path: "packages/a/src/a.ts",
            owner: "packages/a",
            imports: [],
            dependencies: ["apps/server/src/a.ts"],
        },
        {
            path: "apps/server/src/a.ts",
            owner: "apps/server",
            imports: [],
            dependencies: ["packages/a/src/a.ts", "packages/a/src/a.ts"],
        },
    ]);

    expect(relations.consumers("packages/a/src/a.ts")).toEqual({
        directDependents: ["apps/server/src/a.ts"],
        applicationSourceConsumers: ["apps/server"],
        verificationCandidates: [],
    });
});

test("read_emptySetAndUnrelatedLiterals_preservesUnknownExpressionsWithoutInventingCommands", () => {
    const facts = new SourceFacts().read(
        `
        const commands = new Set;
        const moreCommands = new Set();
        const unrelated = "quest.claim";
    `,
        "synthetic.ts",
    );

    expect(facts).toEqual([
        {
            kind: SourceEvidenceKind.Commands,
            name: "commands",
            values: [],
            unresolved: ["missing"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "moreCommands",
            values: [],
            unresolved: ["missing"],
        },
    ]);
});

test("role_repositoryConfigurationAndLicense_distinguishesConfigurationFromAssets", () => {
    const classifier = new FileClassification();

    expect(classifier.role("package.json")).toBe(InventoryFileRole.Configuration);
    expect(classifier.role("bun.lock")).toBe(InventoryFileRole.Configuration);
    expect(classifier.role("docker-compose.yml")).toBe(InventoryFileRole.Configuration);
    expect(classifier.role("LICENSE")).toBe(InventoryFileRole.Documentation);
    expect(classifier.role("assets/logo.png")).toBe(InventoryFileRole.Asset);
});

test("read_constructorCommandAssignments_preservesLiteralsAndUnresolvedReferences", () => {
    const facts = new SourceFacts().read(
        `
        class Domain {
            commands: readonly string[];
            constructor() { this.commands = ["herodraw", ...sharedCommands]; }
        }
        target.commands = importedCommands;
        enabledCommands = Object.values(CityInitializationCommand);
        const commands = Object.values(AnotherCommand);
        const unrelated = "not.a.command";
    `,
        "synthetic.ts",
    );

    expect(facts).toEqual([
        {
            kind: SourceEvidenceKind.Commands,
            name: "commands",
            values: [],
            unresolved: ["missing"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "this.commands",
            values: ["herodraw"],
            unresolved: ["...sharedCommands"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "target.commands",
            values: [],
            unresolved: ["importedCommands"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "enabledCommands",
            values: [],
            unresolved: ["Object.values(CityInitializationCommand)"],
        },
        {
            kind: SourceEvidenceKind.Commands,
            name: "commands",
            values: [],
            unresolved: ["Object.values(AnotherCommand)"],
        },
    ]);
});

test("read_nonAsciiBeforeComputedReference_preservesExactUtf8Expression", () => {
    const facts = new SourceFacts().read(
        `
        const label = "ação";
        const commands = lookup("missão");
    `,
        "synthetic.ts",
    );

    expect(facts[0]?.unresolved).toEqual(["lookup(\"missão\")"]);
});
