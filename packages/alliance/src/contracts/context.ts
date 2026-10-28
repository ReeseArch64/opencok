import type { Fields } from "@opencok/messages/sfs";
import type { AllianceContextState, AllianceContextWrite } from "./context-state";
import type { AllianceContextCatalog } from "./context-catalog";
import type { AllianceGiftContext, AllianceGiftLedger } from "./gifts";
import type { AllianceScienceLedger } from "./science";

export interface AllianceContextLedger extends AllianceGiftLedger, AllianceScienceLedger
{}

export interface AllianceExecutionContext<
    TCatalog extends AllianceContextCatalog,
    TLedger extends AllianceContextLedger,
> extends AllianceGiftContext<TLedger>
{
    readonly rules: TCatalog;
    readonly state: AllianceContextState;
    readonly write: AllianceContextWrite;
    readonly productionOwners: Set<string>;
    productionAt?: bigint;
    command(command: string, params: Fields): Promise<Fields>;
}

export type AllianceContextFactory<
    TState extends AllianceContextState,
    TCatalog extends AllianceContextCatalog,
    TLedger extends AllianceContextLedger,
    TEffects,
> = (
    owner: string,
    state: TState,
    rules: TCatalog,
    ledger: TLedger,
    effects: TEffects,
) => AllianceExecutionContext<TCatalog, TLedger>;
