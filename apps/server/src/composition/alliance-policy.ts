import { AllianceMembershipPolicy } from "@opencok/alliance/rules/membership";
import { AllianceSciencePolicy } from "@opencok/alliance/rules/science";
import { errors } from "@opencok/constants/game";
import { num, text, long } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { cityInteger } from "@opencok/rules/city-progression";

export function allianceFailure(code = errors.invalid): never
{
    throw new GameError(code, "alliance_gameplay");
}

export function createRealmAllianceMembershipPolicy()
{
    return new AllianceMembershipPolicy({
        num,
        text,
        long,
        cityInteger,
        allianceFailure,
        errors,
    });
}

export function createRealmAllianceSciencePolicy()
{
    return new AllianceSciencePolicy({ num, cityInteger, allianceFailure });
}
