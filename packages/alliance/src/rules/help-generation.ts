import type { AllianceRecord as Row } from "../contracts/records";
import type { HelpGeneration } from "../contracts/help";
import type { AllianceHelpFailure } from "../contracts/help-runtime";

export class AllianceHelpPolicy
{
    public constructor(private readonly runtime: AllianceHelpFailure)
    {}

    public readonly generation = (row: Row): HelpGeneration => {
        const allianceFailure: () => never = this.runtime.allianceFailure;
        let value: HelpGeneration;

        try
        {
            value = JSON.parse(Buffer.isBuffer(row.helpers) ? row.helpers.toString("utf8") : "");
        }
        catch
        {
            allianceFailure();
        }

        if (
            value.version !== 1
            || typeof value.activityId !== "string"
            || !Array.isArray(value.helpers)
            || value.helpers.length > 2048
            || new Set(value.helpers).size !== value.helpers.length
            || value.helpers.some((id) => typeof id !== "string" || !id || id.length > 40)
        )
        {
            allianceFailure();
        }

        return value;
    };
}
