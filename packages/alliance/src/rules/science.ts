import type { AllianceRecord as Row } from "../contracts/records";
import type {
    AllianceScienceCatalog as Rules,
    AllianceScienceRule as Rule,
} from "../contracts/science-catalog";
import type { AllianceSciencePolicyRuntime } from "../contracts/science-runtime";

export class AllianceSciencePolicy
{
    public constructor(private readonly runtime: AllianceSciencePolicyRuntime)
    {}

    public readonly allianceScienceRule = (rules: Rules, id: number, level = 0): Rule => {
        const { cityInteger } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        cityInteger(id, 1);
        cityInteger(level, 0, 100);
        const base = rules.power.allianceSciences?.get(String(id)),
            rule = rules.power.allianceSciences?.get(String(id + level));

        if (!base || base.science_lv !== "0" || !rule || cityInteger(rule.science_lv) !== level)
        {
            allianceFailure();
        }

        return rule;
    };

    public readonly allianceScienceStage = (rule: Rule, progress: number) => {
        const { cityInteger } = this.runtime;

        const thresholds = (rule.value ?? "").split(";").map((value) => cityInteger(value, 1));
        let current = cityInteger(progress),
            stage = 0;

        for (; stage < thresholds.length - 1 && current >= thresholds[stage]!; stage++)
        {
            current -= thresholds[stage]!;
        }

        return {
            stage,
            current: Math.min(current, thresholds[stage]!),
            required: thresholds[stage]!,
            total: cityInteger(
                thresholds.reduce((sum, value) => sum + value, 0),
                1,
            ),
        };
    };

    public readonly allianceScienceRow = (
        allianceId: string,
        scienceId: number,
        previous?: Row,
    ): Row => {
        return (
            previous ?? {
                allianceId,
                scienceId,
                level: 0,
                wood: 0,
                stone: 0,
                iron: 0,
                food: 0,
                silver: 0,
                gold: 0,
                donateprogress: 0,
                donatefinish: 0,
                researchstarttime: 0n,
                effectflag: 0,
                power: 0,
            }
        );
    };

    public readonly allianceDonationCount = (before: Row, key: string, delta: number) => {
        const { num, cityInteger } = this.runtime;

        return cityInteger(num(before, key) + cityInteger(delta), 0);
    };
}
