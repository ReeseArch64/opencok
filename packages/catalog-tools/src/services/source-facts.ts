import { parseSync } from "@swc/core";
import { SourceEvidenceKind, type SourceEvidence } from "../contracts/source-ownership";

export class SourceFacts
{
    public read(source: string, filename: string): SourceEvidence[]
    {
        const result: SourceEvidence[] = [];
        const encodedSource = Buffer.from(source);
        const node = (value: unknown): Record<string, unknown> =>
            value && typeof value === "object" ? value as Record<string, unknown> : {};
        const name = (value: unknown): string => {
            const entry = node(value);

            if (entry.type === "Identifier" || entry.type === "StringLiteral")
            {
                return String(entry.value);
            }

            if (entry.type === "SpreadElement")
            {
                return `...${String(entry.value)}`;
            }

            const span = node(entry.span);

            if (typeof span.start === "number" && typeof span.end === "number")
            {
                return encodedSource.subarray(span.start - 1, span.end - 1).toString("utf8");
            }

            return String(entry.type ?? "missing");
        };
        const record = (kind: SourceEvidenceKind, label: string, values: unknown[]): void => {
            const entry: SourceEvidence = { kind, name: label, values: [], unresolved: [] };

            for (const value of values)
            {
                const item = node(value);

                if (item.type === "StringLiteral")
                {
                    entry.values.push(String(item.value));
                }
                else
                {
                    entry.unresolved.push(name(value));
                }
            }

            result.push(entry);
        };
        const list = (value: unknown): unknown[] => {
            const entry = node(value);

            if (
                [
                    "TsConstAssertion",
                    "TsAsExpression",
                    "TsSatisfiesExpression",
                    "ParenthesisExpression",
                ].includes(String(entry.type))
            )
            {
                return list(entry.expression);
            }

            if (entry.type === "NewExpression" && name(entry.callee) === "Set")
            {
                return list(node((entry.arguments as unknown[] | null)?.[0]).expression);
            }

            return entry.type === "ArrayExpression"
                ? (entry.elements as unknown[]).filter(Boolean).map((element) => {
                    const member = node(element);

                    return member.spread
                        ? { type: "SpreadElement", value: name(member.expression) }
                        : member.expression;
                })
                : [value];
        };
        const command = (value: unknown): boolean => /(^|\.)(command|cmd)$/.test(name(value));
        const visit = (value: unknown): void => {
            if (Array.isArray(value))
            {
                value.forEach(visit);

                return;
            }

            const entry = node(value);

            if (entry.type === "VariableDeclarator" && /commands$/i.test(name(entry.id)))
            {
                record(SourceEvidenceKind.Commands, name(entry.id), list(entry.init));
            }
            else if (
                ["ClassProperty", "KeyValueProperty"].includes(String(entry.type))
                && name(entry.key) === "commands"
            )
            {
                record(SourceEvidenceKind.Commands, "commands", list(entry.value));
            }
            else if (
                entry.type === "AssignmentExpression" && entry.operator === "="
                && ((node(entry.left).type === "Identifier" && /commands$/i.test(name(entry.left)))
                    || (node(entry.left).type === "MemberExpression"
                        && name(node(entry.left).property) === "commands"))
            )
            {
                record(SourceEvidenceKind.Commands, name(entry.left), list(entry.right));
            }
            else if (entry.type === "SwitchStatement" && command(entry.discriminant))
            {
                record(
                    SourceEvidenceKind.Dispatch,
                    name(entry.discriminant),
                    (entry.cases as unknown[]).map((item) => node(item).test).filter(Boolean),
                );
            }
            else if (
                entry.type === "BinaryExpression"
                && ["===", "==", "!==", "!="].includes(String(entry.operator))
            )
            {
                if (command(entry.left) || command(entry.right))
                {
                    record(
                        SourceEvidenceKind.Dispatch,
                        command(entry.left) ? name(entry.left) : name(entry.right),
                        [command(entry.left) ? entry.right : entry.left],
                    );
                }
            }
            else if (
                entry.type === "TsEnumDeclaration"
                && (name(entry.id) === "GameplayCatalog" || name(entry.id).endsWith("Command"))
            )
            {
                record(
                    name(entry.id) === "GameplayCatalog"
                        ? SourceEvidenceKind.Catalog
                        : SourceEvidenceKind.Commands,
                    name(entry.id),
                    (entry.members as unknown[]).map((member) => node(member).init),
                );
            }
            else if (entry.type === "CallExpression")
            {
                const callee = node(entry.callee);
                const argument = node((entry.arguments as unknown[] | null)?.[0]).expression;

                if (
                    callee.type === "MemberExpression"
                    && ["includes", "has"].includes(name(callee.property)) && command(argument)
                )
                {
                    record(SourceEvidenceKind.Dispatch, name(argument), list(callee.object));
                }
            }

            Object.values(entry).forEach(visit);
        };
        visit(
            parseSync(source, {
                syntax: "typescript",
                tsx: /\.[jt]sx$/.test(filename),
                decorators: true,
            }),
        );

        return result;
    }
}
