import { posix } from "node:path";
import type { Workspace } from "../contracts/source-ownership";

export class ModuleResolver
{
    public constructor(
        private readonly files: ReadonlySet<string>,
        private readonly workspaces: readonly Workspace[],
    )
    {}

    public owner(file: string): Workspace | undefined
    {
        return this.workspaces.find((workspace) => file.startsWith(`${workspace.path}/`));
    }

    public workspace(specifier: string): Workspace | undefined
    {
        return this.workspaces.find((workspace) =>
            specifier === workspace.name || specifier.startsWith(`${workspace.name}/`)
        );
    }

    public resolve(from: string, specifier: string): string | undefined
    {
        return this.inspect(from, specifier).targets[0];
    }

    public inspect(from: string, specifier: string): { targets: string[]; missing: string[]; }
    {
        const candidates = this.candidates(from, specifier);
        const targets: string[] = [];
        const missing: string[] = [];

        for (const candidate of candidates)
        {
            const target = this.file(candidate);

            if (target)
            {
                targets.push(target);
            }
            else
            {
                missing.push(candidate);
            }
        }

        return { targets: [...new Set(targets)], missing };
    }

    private candidates(from: string, specifier: string): string[]
    {
        if (specifier.startsWith("."))
        {
            return [posix.join(posix.dirname(from), specifier)];
        }

        const workspace = this.workspace(specifier);

        if (!workspace)
        {
            return [];
        }

        const subpath = specifier === workspace.name
            ? "."
            : `.${specifier.slice(workspace.name.length)}`;
        const exports = workspace.exports;

        if (typeof exports === "string" || Array.isArray(exports))
        {
            return subpath === "." ? this.expand(workspace.path, exports, "") : [];
        }

        if (!exports || typeof exports !== "object" || Array.isArray(exports))
        {
            return [];
        }

        const entries = Object.entries(exports);

        if (subpath === "." && entries.every(([key]) => !key.startsWith(".")))
        {
            return this.expand(workspace.path, exports, "");
        }

        const exact = entries.find(([key]) => key === subpath);
        const patterns = entries.filter(([key]) => key.includes("*")).sort(([left], [right]) => {
            return right.indexOf("*") - left.indexOf("*") || right.length - left.length;
        });
        const match = exact ?? patterns.find(([key]) => {
            const [prefix, suffix] = key.split("*");

            return subpath.startsWith(prefix!) && subpath.endsWith(suffix!)
                && subpath.length >= key.length - 1;
        });

        if (!match)
        {
            return [];
        }

        const [key, target] = match;
        const capture = key.includes("*")
            ? subpath.slice(key.indexOf("*"), subpath.length - (key.length - key.indexOf("*") - 1))
            : "";
        return this.expand(workspace.path, target, capture);
    }

    private expand(workspace: string, target: unknown, capture: string): string[]
    {
        return this.targets(target).map((value) => {
            const path = posix.normalize(posix.join(workspace, value.replaceAll("*", capture)));

            return value.startsWith("./") && path.startsWith(`${workspace}/`)
                ? path
                : `invalid-export:${workspace}:${value}`;
        });
    }

    private targets(value: unknown): string[]
    {
        if (typeof value === "string")
        {
            return [value];
        }

        if (Array.isArray(value))
        {
            return value.flatMap((entry) => this.targets(entry));
        }

        if (value && typeof value === "object")
        {
            return Object.values(value).flatMap((target) => this.targets(target));
        }

        return [];
    }

    private file(path: string): string | undefined
    {
        const candidates = [
            path,
            ...(/\.[cm]?jsx?$/.test(path)
                ? [
                    path.replace(/\.js$/, ".ts"),
                    path.replace(/\.jsx$/, ".tsx"),
                    path.replace(/\.mjs$/, ".mts"),
                    path.replace(/\.cjs$/, ".cts"),
                ]
                : []),
            `${path}.ts`,
            `${path}.tsx`,
            `${path}.js`,
            `${path}.mts`,
            `${path}.cts`,
            `${path}.mjs`,
            `${path}.cjs`,
            `${path}.jsx`,
            `${path}/index.ts`,
            `${path}/index.tsx`,
            `${path}/index.js`,
            `${path}/index.mts`,
            `${path}/index.cts`,
            `${path}/index.mjs`,
            `${path}/index.cjs`,
            `${path}/index.jsx`,
        ];

        return candidates.find((candidate) => this.files.has(candidate));
    }
}
