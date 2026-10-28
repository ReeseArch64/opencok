export interface ModuleImport
{
    specifier: string | undefined;
    syntax: string;
}

export interface Workspace
{
    path: string;
    name: string;
    exports?: unknown;
    dependencies: ReadonlySet<string>;
}

export interface ModuleRecord
{
    path: string;
    owner: string;
    imports: ModuleImport[];
    dependencies: string[];
}

export interface ArchitectureReport
{
    modules: ModuleRecord[];
    violations: string[];
}

export enum InventoryFileRole
{
    Source = "source",
    Test = "test",
    Catalog = "catalog",
    Schema = "schema",
    Tooling = "tooling",
    Documentation = "documentation",
    Configuration = "configuration",
    Asset = "asset",
}

export enum SourceEvidenceKind
{
    Commands = "command-list",
    Dispatch = "command-dispatch",
    Catalog = "catalog-membership",
}

export interface SourceEvidence
{
    kind: SourceEvidenceKind;
    name: string;
    values: string[];
    unresolved: string[];
}
