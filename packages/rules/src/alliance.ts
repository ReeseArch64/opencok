import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, text, long } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { AllianceMembershipPolicy } from "@opencok/alliance/rules/membership";

export function allianceFailure(code = errors.invalid): never
{
    throw new GameError(code, "alliance_gameplay");
}

const policy = new AllianceMembershipPolicy({
    num,
    text,
    long,
    cityInteger,
    allianceFailure,
    errors,
});

export const allianceText = policy.allianceText;

export const allianceMember = policy.allianceMember;

export const allianceRight = policy.allianceRight;

export const allianceTargets = policy.allianceTargets;

export const alliancePermissions = policy.alliancePermissions;

export const changeAlliancePermissions = policy.changeAlliancePermissions;

export const newAllianceMember = policy.newAllianceMember;

export const allianceCreationCost = policy.allianceCreationCost;

export const allianceJoinAllowed = policy.allianceJoinAllowed;
