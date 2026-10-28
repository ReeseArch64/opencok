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
