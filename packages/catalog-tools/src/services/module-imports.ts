import { parseSync } from "@swc/core";
import type { ModuleImport } from "../contracts/source-ownership";

export class ModuleImports
{
    public read(source: string, filename: string): ModuleImport[]
    {
        const imports: ModuleImport[] = [];
        const literal = (value: unknown): string | undefined => {
            if (!value || typeof value !== "object")
            {
                return undefined;
            }

            const node = value as Record<string, unknown>;

            return node.type === "StringLiteral" && typeof node.value === "string"
                ? node.value
                : undefined;
        };
        const visit = (value: unknown): void => {
            if (Array.isArray(value))
            {
                value.forEach(visit);

                return;
            }

            if (!value || typeof value !== "object")
            {
                return;
            }

            const node = value as Record<string, unknown>;
            const syntax = String(node.type);

            if (
                ["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(
                    syntax,
                ) && node.source
            )
            {
                imports.push({ specifier: literal(node.source), syntax });
            }
            else if (syntax === "TsImportType")
            {
                imports.push({ specifier: literal(node.argument), syntax });
            }
            else if (syntax === "TsExternalModuleReference")
            {
                imports.push({ specifier: literal(node.expression), syntax });
            }
            else if (syntax === "CallExpression")
            {
                const callee = node.callee as Record<string, unknown> | undefined;

                if (
                    callee?.type === "Import"
                    || (callee?.type === "Identifier" && callee.value === "require")
                )
                {
                    const args = node.arguments as { expression?: unknown; }[];
                    imports.push({
                        specifier: literal(args[0]?.expression),
                        syntax: String(callee.type),
                    });
                }
            }

            Object.values(node).forEach(visit);
        };
        visit(parseSync(source, {
            syntax: "typescript",
            tsx: filename.endsWith(".tsx") || filename.endsWith(".jsx"),
            decorators: true,
        }));

        return imports;
    }
}
