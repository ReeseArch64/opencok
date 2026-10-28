import type { GeneralInfoResponse } from "@opencok/hero/contracts/responses/profile-generals";
import type { InventoryItemResponse } from "./bootstrap";
import type { PublicEquipmentResponse } from "./profile";

export interface ActivityRewardAmounts
{
    wood?: bigint;
    wood_bind?: bigint;
    stone?: bigint;
    stone_bind?: bigint;
    iron?: bigint;
    iron_bind?: bigint;
    food?: bigint;
    food_bind?: bigint;
    money?: bigint;
    gold?: bigint;
    crystal?: bigint;
    chip?: bigint;
    diamond?: bigint;
    sand_stone?: bigint;
    diamond_stone?: bigint;
    marble?: bigint;
    granite?: bigint;
    limestone?: bigint;
    military?: number;
    milhonor?: number;
    power?: number;
    honor?: number;
    alliancepoint?: bigint;
    exp?: number;
    expDelta?: number;
}

export interface ActivityRewardResponse extends ActivityRewardAmounts
{
    goods?: readonly InventoryItemResponse[];
    equip?: readonly PublicEquipmentResponse[];
    general?: readonly GeneralInfoResponse[];
}
