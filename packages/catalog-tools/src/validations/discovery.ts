import { z } from "zod";
import type { DiscoveryManifest, ServerInventory } from "../contracts/discovery";

const token = z.string().min(1).max(120).regex(/^[A-Za-z0-9_.:+-]+$/);
const id = z.union([
    z.string().min(1).max(120).refine((value) =>
        value.isWellFormed()
        && [...value].every((character) =>
            character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127
        )
    ),
    z.number().refine((value) => Number.isSafeInteger(value) && !Object.is(value, -0)),
]);
const reference = z.string().min(1).max(240).regex(/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/)
    .refine((value) => value.split("/").every((segment) => segment !== "." && segment !== ".."));
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const manifestSchema = z.strictObject({
    schemaVersion: z.literal(1),
    release: token,
    databaseReference: reference,
    localizationReference: reference,
    databaseSha256: hash,
    localizationSha256: hash,
    families: z.array(z.strictObject({
        catalog: token,
        owner: token,
        clientGroup: token,
        nameField: token,
        links: z.array(z.strictObject({ field: token, group: token })).max(8),
        bindings: z.array(z.strictObject({
            nativeId: id,
            clientId: token,
            identity: z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).max(120),
            localizationKey: token,
            nameSha256: hash,
            availability: z.enum(["server", "client-only"]),
            aliasOf: id.optional(),
            variant: z.strictObject({ field: token, value: token }).optional(),
        })).max(100000),
    })).min(1).max(5000),
});
const inventorySchema = z.strictObject({
    release: token,
    catalogs: z.array(z.strictObject({ catalog: token, ids: z.array(id).max(1000000) })).min(1).max(
        5000,
    ),
});

export function readManifest(input: unknown): DiscoveryManifest
{
    const result = manifestSchema.safeParse(input);

    if (!result.success)
    {
        throw new Error("Invalid discovery manifest");
    }

    return result.data;
}

export function readInventory(input: unknown): ServerInventory
{
    const result = inventorySchema.safeParse(input);

    if (!result.success)
    {
        throw new Error("Invalid server inventory");
    }

    return result.data;
}
