import type { profileAssets, resourceAssets } from "../constants/assets";
import type { MutationEvent } from "@opencok/contracts/mutation";

export type EconomyAsset =
    | `profile.${(typeof profileAssets)[number]}`
    | `resource.${(typeof resourceAssets)[number]}`;

export interface EconomyPlan
{
    changes: readonly { asset: EconomyAsset; delta: bigint; reason: string; }[];
    response: Uint8Array;
    events?: readonly MutationEvent[];
}
