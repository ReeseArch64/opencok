import type { CosmeticRecord } from "./records";
import type { CosmeticCatalog, CosmeticContext } from "./context";
import type { Fields } from "@opencok/messages/sfs";

export interface CosmeticReaders
{
    text(row: CosmeticRecord, key: string): string;
    num(row: CosmeticRecord, key: string): number;
    long(row: CosmeticRecord, key: string): bigint;
}

export interface CosmeticPolicyRuntime extends Pick<CosmeticReaders, "num" | "long">
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
}

export interface CosmeticOwnershipRuntime<TCatalog extends CosmeticCatalog>
    extends CosmeticReaders, CosmeticPolicyRuntime
{
    serverFeature(rules: TCatalog, key: string, context: {
        kingdomId: number;
        version: string;
        now: number;
    }): boolean;
}

export interface CosmeticRecipientRuntime
{
    playerItemGiftRecipient(value: string): string;
}

export interface CosmeticPublicationRuntime extends CosmeticRecipientRuntime
{
    interested(
        points: readonly number[],
        owner: string,
        target: string,
    ): Promise<readonly string[]>;
    publish(owner: string, command: string, body: Fields): Promise<unknown>;
}

export interface CosmeticActivationRuntime<
    TCatalog extends CosmeticCatalog,
    TContext extends CosmeticContext<TCatalog>,
> extends CosmeticOwnershipRuntime<TCatalog>
{
    randomInt(bound: number): number;
    campaignFailure(): never;
    recordCampaignEvent(context: TContext, type: number, id: string): void;
    temporaryEffect(
        rows: readonly CosmeticRecord[],
        rules: TCatalog,
        owner: string,
        id: string,
        now: bigint,
        count: number,
        random: (bound: number) => number,
    ): {
        states: CosmeticRecord[];
        deleted: number[];
    };
}
