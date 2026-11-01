import type { CosmeticRecord, CosmeticRule } from "./records";
import type { CosmeticTargetState, CosmeticTargetWrite, CosmeticStatusChange } from "./cosmetics";

export interface CosmeticCatalog
{
    readonly kingdomId: number;
    readonly power: { readonly statuses?: ReadonlyMap<string, CosmeticRule>; };
}

export interface CosmeticContext<TCatalog extends CosmeticCatalog>
{
    readonly owner: string;
    readonly now: bigint;
    readonly rules: TCatalog;
    readonly state: {
        readonly cosmeticTarget?: CosmeticTargetState;
        readonly effects: { readonly states: readonly CosmeticRecord[]; };
    };
    readonly write: {
        appearance?: { picfraId?: number; };
        states?: readonly CosmeticRecord[];
        deletedStates?: readonly number[];
        cosmeticTarget?: CosmeticTargetWrite;
        cosmeticChanges?: readonly CosmeticStatusChange[];
    };
}
