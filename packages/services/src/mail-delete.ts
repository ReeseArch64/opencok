import type {
    MailBatchInvitationUpdate,
    MailDeleteEntry,
    MailDeletePlan,
} from "@opencok/contracts/mail";
import { mailDeleteGroups } from "@opencok/rules/mail";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import { decodeLegacyJsonObject, LegacyJsonError } from "@opencok/messages/legacy-json";
import { fields, ProtocolError, sfs, str, Type, type Value } from "@opencok/messages/sfs";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { storedMailText } from "./mail-contents.ts";

function invitationJson(value: Value): string
{
    switch (value.type)
    {
        case Type.Null:
            return "null";
        case Type.Bool:
        case Type.Int:
        case Type.Long:
            return String(value.value);
        case Type.Double:
            if (typeof value.value !== "number" || !Number.isFinite(value.value))
            {
                throw new ProtocolError();
            }

            return Object.is(value.value, -0) ? "-0.0" : String(value.value);
        case Type.String:
            return JSON.stringify(value.value);
        case Type.Array:
            return `[${(value.value as Value[]).map(invitationJson).join(",")}]`;
        case Type.Object:
            return `{${
                Object.entries(fields(value))
                    .map(([key, entry]) => `${JSON.stringify(key)}:${invitationJson(entry)}`)
                    .join(",")
            }}`;
        default:
            throw new ProtocolError();
    }
}

export function planMailBatchInvitations(
    owner: string,
    entries: readonly MailDeleteEntry[],
): MailBatchInvitationUpdate[]
{
    const updates: MailBatchInvitationUpdate[] = [];

    for (const entry of entries)
    {
        if (entry.type !== 26)
        {
            continue;
        }

        const inline = storedMailText(entry.contents);

        if (inline.toLowerCase() === "extra" && entry.extra === null)
        {
            throw new Error("Missing persisted invitation contents");
        }

        let body;

        try
        {
            body = decodeLegacyJsonObject(
                inline.toLowerCase() === "extra" ? storedMailText(entry.extra) : inline,
            );
        }
        catch (error)
        {
            if (error instanceof LegacyJsonError)
            {
                continue;
            }

            throw error;
        }

        if (body.inviterUid?.type !== Type.String || body.inviteeUid?.type !== Type.String)
        {
            continue;
        }

        const inviter = str(body, "inviterUid");

        if (
            str(body, "inviteeUid") !== owner
            || inviter.length > 255
            || inviter.includes("\0")
            || !inviter.isWellFormed()
        )
        {
            continue;
        }

        body.deal = sfs.int(1);
        const bytes = javaMailBytes(invitationJson(sfs.object(body)));

        if (!bytes || bytes.byteLength > 65535)
        {
            throw new ProtocolError();
        }

        updates.push({ uid: entry.uid, inviter, contents: Buffer.from(bytes) });
    }

    return updates;
}

export function planMailDeletion(
    owner: string,
    entries: readonly MailDeleteEntry[],
): MailDeletePlan
{
    const inviters = new Set<string>();

    for (const entry of entries)
    {
        if (entry.type !== 26 || !entry.contents)
        {
            continue;
        }

        try
        {
            const inline = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
                entry.contents,
            );
            let start = 0;
            let end = inline.length;

            while (start < end && inline.charCodeAt(start) <= 32)
            {
                start++;
            }

            while (end > start && inline.charCodeAt(end - 1) <= 32)
            {
                end--;
            }

            const data = inline.slice(start, end).toLowerCase() === "extra"
                ? entry.extra
                : entry.contents;

            if (!data)
            {
                continue;
            }

            const contents = decodeStoredJson(data);

            if (!contents || typeof contents !== "object" || Array.isArray(contents))
            {
                continue;
            }

            const { inviterUid, inviteeUid } = contents as Record<string, unknown>;

            if (
                inviteeUid !== owner
                || typeof inviterUid !== "string"
                || !inviterUid.trim()
                || inviterUid.length > 255
                || inviterUid.includes("\0")
                || !inviterUid.isWellFormed()
            )
            {
                continue;
            }

            inviters.add(inviterUid);
        }
        catch
        {
        }
    }

    return { groups: mailDeleteGroups(entries), inviters: [...inviters] };
}
