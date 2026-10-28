import type { AllianceHeartCatalog } from "../contracts/heart";
import type { AllianceHeartPolicyRuntime } from "../contracts/heart-runtime";

export class AllianceHeartPolicy
{
    public constructor(private readonly runtime: AllianceHeartPolicyRuntime)
    {}

    public rule(rules: AllianceHeartCatalog, itemId: string)
    {
        const { cityInteger } = this.runtime;
        const allianceHeartFailure: () => never = this.runtime.allianceHeartFailure;

        const item = rules.goods.get(itemId);

        if (item?.type !== "20" || !item.para1 || item.para1.length > 2)
        {
            allianceHeartFailure();
        }

        return { effect: item.para1, duration: cityInteger(item.para2, 1) };
    }
}
