import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { RewardRandom } from "@opencok/economy/contracts/reward-preview";

const invalid = () => {
    throw new GameError(errors.invalid, "city_progression");
};

export function chooseWeight(weights: readonly number[], random: RewardRandom)
{
    const values = weights.map((value) => {
        if (!Number.isFinite(value) || value < 0)
        {
            invalid();
        }

        return Math.floor(value * 100000);
    });
    const total = values.reduce((sum, value) => sum + value, 0);

    if (!Number.isSafeInteger(total) || total <= 0)
    {
        invalid();
    }

    let choice = random(total);

    if (!Number.isInteger(choice) || choice < 0 || choice >= total)
    {
        invalid();
    }

    for (let index = 0; index < values.length; index++)
    {
        if (choice < values[index]!)
        {
            return index;
        }

        choice -= values[index]!;
    }

    return invalid();
}
