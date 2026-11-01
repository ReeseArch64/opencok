import type { Row } from "@opencok/contracts/rows";
import type { Rule } from "@opencok/rules/game";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";

export interface ProfilePictureContext
{
    readonly owner: string;
    readonly rules: {
        readonly kingdomId: number;
        readonly profile: { readonly lordImages?: ReadonlyMap<string, Rule>; };
    };
    readonly state: { readonly profile: Row; };
    readonly write: { appearance?: { pic?: string; picVer?: number; picfraId?: number; }; };
    readonly economy: ActivityEconomy;
}
