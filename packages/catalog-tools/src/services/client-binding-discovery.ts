import { createHash } from "node:crypto";
import type {
    Binding,
    ClientRecord,
    ClientEvidence,
    ClientSources,
    DiscoveredBinding,
    DiscoveryManifest,
    DiscoveryReport,
    Family,
    NativeId,
    ServerInventory,
} from "../contracts/discovery";

const nativeKey = (id: NativeId) => JSON.stringify([typeof id, id]);
const token = (value: string | undefined): value is string =>
    typeof value === "string" && /^[A-Za-z0-9_.:+-]{1,120}$/.test(value);

function index<T>(rows: readonly T[], key: (row: T) => string): Map<string, T[]>
{
    const result = new Map<string, T[]>();

    for (const row of rows)
    {
        const id = key(row);
        const values = result.get(id) ?? [];
        values.push(row);
        result.set(id, values);
    }

    return result;
}

export class ClientBindingDiscovery
{
    constructor(readonly sources: ClientSources)
    {}

    inspect(
        manifest: DiscoveryManifest,
        inventory: ServerInventory,
        release: string,
    ): DiscoveryReport
    {
        if (!token(release))
        {
            throw new Error("Invalid client release");
        }

        const report: DiscoveryReport = {
            schemaVersion: 1,
            release,
            ready: false,
            sources: {
                normalizedManifestSha256: createHash("sha256").update(JSON.stringify(manifest))
                    .digest("hex"),
                normalizedInventorySha256: createHash("sha256").update(JSON.stringify(inventory))
                    .digest("hex"),
                database: {
                    ...this.sources.database,
                    category: "client-database",
                    reference: manifest.databaseReference,
                },
                localization: {
                    ...this.sources.localization,
                    category: "client-localization",
                    reference: manifest.localizationReference,
                },
                unparsedLocalizationLines: this.sources.unparsedLocalizationLines,
            },
            issues: [],
            unassignedCatalogs: [],
            families: [],
        };

        if (manifest.release !== release || inventory.release !== release)
        {
            report.issues.push("release-mismatch");
        }

        if (manifest.databaseSha256 !== this.sources.database.sha256)
        {
            report.issues.push("database-fingerprint-mismatch");
        }

        if (manifest.localizationSha256 !== this.sources.localization.sha256)
        {
            report.issues.push("localization-fingerprint-mismatch");
        }

        const catalogs = index(inventory.catalogs, (entry) => entry.catalog);
        const families = index(manifest.families, (entry) => entry.catalog);
        const clients = new Map(
            [...this.sources.groups].map(([group, rows]) =>
                [group, index(rows, (row) => row.id)] as const
            ),
        );

        if ([...catalogs.values(), ...families.values()].some((rows) => rows.length > 1))
        {
            report.issues.push("duplicate-catalog");
        }
        report.unassignedCatalogs = [...catalogs.keys()].filter((key) => !families.has(key)).sort();

        for (const family of manifest.families)
        {
            const ids = catalogs.get(family.catalog)?.flatMap((catalog) => catalog.ids) ?? [];
            const serverIds = index(ids, nativeKey);
            const bindings = index(family.bindings, (binding) => nativeKey(binding.nativeId));
            const semantic = index(family.bindings, (binding) => binding.identity);
            const clientBindings = index(family.bindings, (binding) => binding.clientId);
            const rows = this.sources.groups.get(family.clientGroup) ?? [];
            const result: DiscoveryReport["families"][number] = {
                catalog: family.catalog,
                owner: family.owner,
                clientGroup: family.clientGroup,
                nameField: family.nameField,
                issues: [],
                serverRecords: ids.length,
                clientRecords: rows.length,
                bindings: [],
                unboundClientEvidence: [],
                unboundServerIds: ids.filter((id) => !bindings.has(nativeKey(id))),
                unboundClientIds: rows.filter((row) => !clientBindings.has(row.id)).map((row) =>
                    row.id
                ),
            };

            if (!catalogs.has(family.catalog))
            {
                result.issues.push("missing-server-catalog");
            }

            if (!this.sources.groups.has(family.clientGroup))
            {
                result.issues.push("missing-client-group");
            }

            if ([...serverIds.values()].some((values) => values.length > 1))
            {
                result.issues.push("duplicate-server-id");
            }

            for (const binding of family.bindings)
            {
                const found: DiscoveredBinding = {
                    nativeId: binding.nativeId,
                    clientId: binding.clientId,
                    identity: binding.identity,
                    availability: binding.availability,
                    ...(binding.aliasOf === undefined ? {} : { aliasOf: binding.aliasOf }),
                    ...(binding.variant === undefined ? {} : { variant: binding.variant }),
                    links: [],
                    issues: [],
                };

                if (bindings.get(nativeKey(binding.nativeId))!.length > 1)
                {
                    found.issues.push("duplicate-binding-id");
                }

                const hasServer = serverIds.has(nativeKey(binding.nativeId));

                if (binding.availability === "server" && !hasServer)
                {
                    found.issues.push("missing-server-record");
                }

                if (binding.availability === "client-only" && hasServer)
                {
                    found.issues.push("unexpected-server-record");
                }

                const aliases = semantic.get(binding.identity)!;
                const canonical = aliases.filter((entry) => entry.aliasOf === undefined);

                if (
                    aliases.length > 1
                    && (canonical.length !== 1 || aliases.some((entry) =>
                        entry !== canonical[0]
                        && nativeKey(entry.aliasOf!) !== nativeKey(canonical[0]!.nativeId)
                    ))
                )
                {
                    found.issues.push("duplicate-semantic-identity");
                }

                if (binding.aliasOf !== undefined)
                {
                    const targets = bindings.get(nativeKey(binding.aliasOf)) ?? [];

                    if (
                        targets.length !== 1 || targets[0]!.aliasOf !== undefined
                        || targets[0]!.identity !== binding.identity
                        || targets[0]!.availability !== binding.availability
                        || nativeKey(binding.aliasOf) === nativeKey(binding.nativeId)
                    )
                    {
                        found.issues.push("invalid-alias");
                    }
                }

                if (
                    new Set(clientBindings.get(binding.clientId)!.map((entry) => entry.identity))
                        .size > 1
                )
                {
                    found.issues.push("conflicting-client-binding");
                }

                if (binding.variant)
                {
                    const rows = clients.get(family.clientGroup)?.get(binding.clientId);

                    if (
                        rows?.length !== 1
                        || rows[0]!.fields[binding.variant.field] !== binding.variant.value
                    )
                    {
                        found.issues.push("variant-evidence-mismatch");
                    }
                }
                this.trace(family, found, clients, binding);
                result.bindings.push(found);
            }

            const names = index(
                result.bindings.filter((entry) => entry.nameSha256 !== undefined),
                (entry) => entry.nameSha256!,
            );

            for (const duplicates of names.values())
            {
                if (new Set(duplicates.map((entry) => entry.identity)).size < 2)
                {
                    continue;
                }

                const variants = duplicates.map((entry) => {
                    const binding = bindings.get(nativeKey(entry.nativeId))![0]!;
                    const variant = binding.variant;
                    const row = clients.get(family.clientGroup)?.get(binding.clientId);

                    return variant && row?.length === 1
                            && row[0]!.fields[variant.field] === variant.value
                        ? JSON.stringify([variant.field, variant.value])
                        : undefined;
                });
                const variantsByIdentity = index(
                    duplicates.map((entry, position) => ({
                        identity: entry.identity,
                        variant: variants[position],
                    })),
                    (entry) => entry.variant ?? "",
                );

                if (
                    variants.some((entry) => entry === undefined)
                    || [...variantsByIdentity.values()].some((entries) =>
                        new Set(entries.map((entry) => entry.identity)).size > 1
                    )
                )
                {
                    for (const entry of duplicates)
                    {
                        entry.issues.push("ambiguous-localized-name");
                    }
                }
            }

            for (const clientId of result.unboundClientIds)
            {
                const candidate: ClientEvidence = { clientId, links: [], issues: [] };
                this.trace(family, candidate, clients);
                result.unboundClientEvidence.push(candidate);
            }
            report.families.push(result);
        }
        report.ready = report.issues.length === 0 && report.unassignedCatalogs.length === 0
            && report.families.every((family) =>
                family.issues.length === 0
                && family.unboundServerIds.length === 0 && family.unboundClientIds.length === 0
                && family.bindings.every((binding) => binding.issues.length === 0)
            );

        return report;
    }

    private trace(
        family: Family,
        found: ClientEvidence,
        clients: ReadonlyMap<string, ReadonlyMap<string, readonly ClientRecord[]>>,
        binding?: Binding,
    ): void
    {
        let group = family.clientGroup;
        let id = found.clientId;
        const seen = new Set<string>();

        for (let step = 0; step <= family.links.length; step++)
        {
            const key = JSON.stringify([group, id]);

            if (seen.has(key))
            {
                found.issues.push("cyclic-client-link");

                return;
            }
            seen.add(key);
            const rows = clients.get(group)?.get(id) ?? [];

            if (rows.length !== 1)
            {
                found.issues.push(rows.length ? "duplicate-client-id" : "missing-client-record");

                return;
            }

            const link = family.links[step];

            if (link)
            {
                const target = rows[0]!.fields[link.field];

                if (!token(target))
                {
                    found.issues.push("invalid-client-link");

                    return;
                }
                found.links.push({
                    group,
                    clientId: id,
                    field: link.field,
                    targetGroup: link.group,
                    targetId: target,
                });
                group = link.group;
                id = target;
                continue;
            }

            const localizationKey = rows[0]!.fields[family.nameField];

            if (!token(localizationKey))
            {
                found.issues.push("invalid-localization-key");

                return;
            }
            found.localizationKey = localizationKey;

            if (binding && localizationKey !== binding.localizationKey)
            {
                found.issues.push("localization-link-mismatch");
            }

            const names = this.sources.names.get(localizationKey) ?? [];

            if (names.length !== 1 || names[0]?.ambiguous)
            {
                found.issues.push(names.length ? "ambiguous-localization" : "missing-localization");

                return;
            }
            found.nameSha256 = names[0]!.sha256;

            if (binding && found.nameSha256 !== binding.nameSha256)
            {
                found.issues.push("localized-name-fingerprint-mismatch");
            }
        }
    }
}
