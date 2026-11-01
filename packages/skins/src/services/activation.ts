import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { encode, str } from "@opencok/messages/sfs";
import type { CosmeticCatalog, CosmeticContext } from "../contracts/context";
import type { CosmeticActivationRuntime } from "../contracts/runtime";
import { CosmeticMapper } from "../mappings/cosmetics";
import { CosmeticEventMapper } from "../mappings/interaction";
import { CosmeticCommand } from "../enums/command";
import { CosmeticKind, cosmeticKinds } from "../enums/kind";

export class AvatarActivationDomain<
    TCatalog extends CosmeticCatalog,
    TContext extends CosmeticContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [CosmeticCommand.Activate];
    public readonly types: readonly number[] = [];

    public constructor(
        private readonly runtime: CosmeticActivationRuntime<TCatalog, TContext>,
        private readonly mapper: CosmeticMapper,
        private readonly events: CosmeticEventMapper<TCatalog, TContext>,
    )
    {
        super();
    }

    public readonly prepare: ActivityDomain<TContext>["prepare"] = async (
        context,
        _command,
        params,
    ) => {
        const {
            long,
            num,
            text,
            cityInteger,
            serverFeature,
            temporaryEffect,
            randomInt,
            recordCampaignEvent,
        } = this.runtime;
        const campaignFailure: () => never = this.runtime.campaignFailure;
        const { avatarActivationResponse } = this.mapper;
        const { cosmeticInteractionEvent } = this.events;
        const id = str(params, "avatarId"),
            rule = context.rules.power.statuses?.get(id),
            target = context.state.cosmeticTarget;
        cityInteger(id, 1);

        if (
            !rule?.subgroup
            || !cosmeticKinds.includes(Number(rule.type2))
            || target?.uid !== context.owner
            || target.realm !== context.rules.kingdomId
            || !serverFeature(context.rules, "avatar", {
                kingdomId: context.rules.kingdomId,
                version: "12.06.0",
                now: Number(context.now),
            })
        )
        {
            campaignFailure();
        }

        const owned = target.avatars.find((row) => row.avatarId === id)
            ?? target.avatars.find((row) => {
                const candidate = context.rules.power.statuses?.get(text(row, "avatarId"));

                return candidate?.type2 === rule.type2 && candidate?.subgroup === rule.subgroup;
            });

        if (
            !owned
            || (long(owned, "expirationTime") !== -1n
                && long(owned, "expirationTime") <= context.now)
        )
        {
            campaignFailure();
        }

        recordCampaignEvent(context, 59, id);
        const before = context.write.states ?? context.state.effects.states,
            plan = temporaryEffect(
                before,
                context.rules,
                context.owner,
                id,
                context.now,
                1,
                randomInt,
            ),
            state = plan.states[0];

        if (!state)
        {
            return { response: encode({}), event: null };
        }

        if (rule.type2 === String(CosmeticKind.Frame))
        {
            context.write.appearance = {
                ...context.write.appearance,
                picfraId: cityInteger(rule.frameID, 1),
            };
        }

        if (!["3", "4"].includes(rule.overlap ?? "") && long(owned, "expirationTime") !== -1n)
        {
            state.endTime = long(owned, "expirationTime");
        }
        else if (rule.type === "3")
        {
            state.endTime = 9223372036854775807n;
        }

        context.write.states = [
            ...before.filter(
                (row) =>
                    !plan.deleted.includes(num(row, "stateId"))
                    && !plan.states.some((next) => next.stateId === row.stateId),
            ),
            ...plan.states,
        ];
        context.write.deletedStates = [...(context.write.deletedStates ?? []), ...plan.deleted];
        context.write.cosmeticTarget = {
            uid: context.owner,
            states: plan.states,
            deleted: plan.deleted,
            avatars: [{ ...owned, effectiveSign: 0 }],
        };
        context.write.cosmeticChanges = plan.states.map((row) => ({
            uid: context.owner,
            id: num(row, "stateId"),
            previous: plan.deleted[0],
        }));
        const body = avatarActivationResponse(state, context.rules, plan.deleted[0]);

        return { response: encode(body), event: cosmeticInteractionEvent(context, body) };
    };

    public readonly apply: ActivityDomain<TContext>["apply"] = async () => {
        this.runtime.campaignFailure();
    };
}
