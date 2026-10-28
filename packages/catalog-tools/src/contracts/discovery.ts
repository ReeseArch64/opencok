export type NativeId = string | number;

export interface Binding
{
    nativeId: NativeId;
    clientId: string;
    identity: string;
    localizationKey: string;
    nameSha256: string;
    availability: "server" | "client-only";
    aliasOf?: NativeId;
    variant?: { field: string; value: string; };
}

export interface Family
{
    catalog: string;
    owner: string;
    clientGroup: string;
    nameField: string;
    links: readonly { field: string; group: string; }[];
    bindings: readonly Binding[];
}

export interface DiscoveryManifest
{
    schemaVersion: 1;
    release: string;
    databaseReference: string;
    localizationReference: string;
    databaseSha256: string;
    localizationSha256: string;
    families: readonly Family[];
}

export interface ServerInventory
{
    release: string;
    catalogs: readonly { catalog: string; ids: readonly NativeId[]; }[];
}

export interface ClientRecord
{
    id: string;
    fields: Readonly<Record<string, string>>;
}

export interface ClientSources
{
    database: { bytes: number; sha256: string; };
    localization: { bytes: number; sha256: string; };
    groups: ReadonlyMap<string, readonly ClientRecord[]>;
    names: ReadonlyMap<string, readonly { sha256: string; ambiguous: boolean; }[]>;
    unparsedLocalizationLines: number;
}

export interface LinkEvidence
{
    group: string;
    clientId: string;
    field: string;
    targetGroup: string;
    targetId: string;
}

export interface ClientEvidence
{
    clientId: string;
    localizationKey?: string;
    nameSha256?: string;
    links: LinkEvidence[];
    issues: string[];
}

export interface DiscoveredBinding extends ClientEvidence
{
    nativeId: NativeId;
    identity: string;
    availability: Binding["availability"];
    aliasOf?: NativeId;
    variant?: Binding["variant"];
}

export interface DiscoveryReport
{
    schemaVersion: 1;
    release: string;
    ready: boolean;
    sources: {
        normalizedManifestSha256: string;
        normalizedInventorySha256: string;
        database: ClientSources["database"] & { category: "client-database"; reference: string; };
        localization: ClientSources["localization"] & {
            category: "client-localization";
            reference: string;
        };
        unparsedLocalizationLines: number;
    };
    issues: string[];
    unassignedCatalogs: string[];
    families: {
        catalog: string;
        owner: string;
        clientGroup: string;
        nameField: string;
        issues: string[];
        serverRecords: number;
        clientRecords: number;
        bindings: DiscoveredBinding[];
        unboundServerIds: NativeId[];
        unboundClientIds: string[];
        unboundClientEvidence: ClientEvidence[];
    }[];
}
