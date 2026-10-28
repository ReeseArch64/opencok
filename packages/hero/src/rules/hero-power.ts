import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { i64, integer, record, sumInt } from "@opencok/rules/player-power-values";
import { selectHeroes } from "./hero-effects";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function calculateGeneralPower(generals: readonly Row[], rules: Rules): number
{
    return sumInt(
        generals,
        (row) =>
            integer(record(rules.power.generals, text(row, "generalId")).power)
            * integer(row.level),
    );
}

export function calculateHeroPower(heroes: readonly Row[], rules: Rules): bigint
{
    return selectHeroes(heroes).reduce((sum, row) => {
        const raw = record(rules.power.heroes, text(row, "heroid")).power ?? "0";

        if (!/^[+-]?\d+$/.test(raw))
        {
            throw new GameError(errors.unsupported, "power_rule");
        }

        const power = BigInt(raw);

        if (power < -9223372036854775808n || power > 9223372036854775807n)
        {
            throw new GameError(errors.unsupported, "power_rule");
        }

        return i64(sum + power);
    }, 0n);
}
