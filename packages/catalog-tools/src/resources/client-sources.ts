import { constants } from "node:fs";
import { createHash } from "node:crypto";
import { open } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { ClientRecord, ClientSources } from "../contracts/discovery";

export const digest = (value: string | Uint8Array) =>
    createHash("sha256").update(value).digest("hex");

export async function readBounded(path: string, limit: number): Promise<Buffer>
{
    const file = await open(path, constants.O_RDONLY | constants.O_NONBLOCK).catch(() => {
        throw new Error("Unable to read input");
    });

    try
    {
        const stat = await file.stat();

        if (!stat.isFile() || stat.size > limit)
        {
            throw new Error("Invalid input size or type");
        }

        const buffer = Buffer.alloc(stat.size + 1);
        let length = 0;

        while (length < buffer.length)
        {
            const result = await file.read(buffer, length, buffer.length - length, null);

            if (result.bytesRead === 0)
            {
                break;
            }
            length += result.bytesRead;
        }

        const after = await file.stat();

        if (
            length !== stat.size || after.size !== stat.size || after.mtimeMs !== stat.mtimeMs
            || after.ctimeMs !== stat.ctimeMs
        )
        {
            throw new Error("Input changed while reading");
        }

        return buffer.subarray(0, length);
    }
    catch (error)
    {
        if (
            error instanceof Error
            && ["Invalid input size or type", "Input changed while reading"].includes(error.message)
        )
        {
            throw error;
        }
        throw new Error("Unable to read input");
    }
    finally
    {
        await file.close().catch(() => {
            throw new Error("Unable to close input");
        });
    }
}

export function parseClientSources(
    database: Uint8Array,
    localization: Uint8Array,
    selectedGroups: ReadonlySet<string>,
): ClientSources
{
    try
    {
        const decoder = new TextDecoder("utf-8", { fatal: true });
        const xml = decoder.decode(database);

        if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true)
        {
            throw new Error();
        }

        const parsed = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
            parseAttributeValue: false,
            parseTagValue: false,
            trimValues: false,
            removeNSPrefix: true,
            isArray: (name) => name === "Group" || name === "ItemSpec",
        }).parse(xml) as { database?: { Group?: unknown[]; }; };

        if (!parsed.database || !Array.isArray(parsed.database.Group))
        {
            throw new Error();
        }

        const groups = new Map<string, ClientRecord[]>();

        for (const node of parsed.database.Group)
        {
            const group = node as { id?: unknown; ItemSpec?: unknown[]; };

            if (typeof group.id !== "string" || !selectedGroups.has(group.id))
            {
                continue;
            }

            if (groups.has(group.id))
            {
                throw new Error();
            }

            const records: ClientRecord[] = [];

            for (const item of group.ItemSpec ?? [])
            {
                if (!item || typeof item !== "object")
                {
                    throw new Error();
                }

                const fields = Object.fromEntries(
                    Object.entries(item).filter(([key]) => key !== "#text"),
                );

                if (
                    typeof fields.id !== "string" || !/^[A-Za-z0-9_.:+-]{1,120}$/.test(fields.id)
                    || Object.values(fields).some((value) => typeof value !== "string")
                )
                {
                    throw new Error();
                }
                records.push({ id: fields.id, fields: fields as Record<string, string> });
            }
            groups.set(group.id, records);
        }

        const names = new Map<string, { sha256: string; ambiguous: boolean; }[]>();
        let last: { sha256: string; ambiguous: boolean; } | undefined;
        let unparsedLocalizationLines = 0;

        for (const line of decoder.decode(localization).split(/\r?\n/))
        {
            if (!line.trim() || line.startsWith(";") || line.startsWith("#"))
            {
                continue;
            }

            const match = /^([A-Za-z0-9_.:+-]+)=(.*)$/.exec(line);

            if (!match)
            {
                unparsedLocalizationLines++;

                if (last)
                {
                    last.ambiguous = true;
                }
                continue;
            }

            const key = match[1]!;
            last = { sha256: digest(match[2]!), ambiguous: !match[2]!.length };
            names.set(key, [...names.get(key) ?? [], last]);
        }

        return {
            database: { bytes: database.byteLength, sha256: digest(database) },
            localization: { bytes: localization.byteLength, sha256: digest(localization) },
            groups,
            names,
            unparsedLocalizationLines,
        };
    }
    catch
    {
        throw new Error("Invalid client reference input");
    }
}
