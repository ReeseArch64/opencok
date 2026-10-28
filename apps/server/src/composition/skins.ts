import { randomInt } from "node:crypto";
import { CosmeticOwnership } from "@opencok/skins/services/ownership";
import { CosmeticParticipants } from "@opencok/skins/services/participants";
import { CosmeticPublication } from "@opencok/skins/services/publication";
import { AvatarActivationDomain } from "@opencok/skins/services/activation";
import { CosmeticEventMapper } from "@opencok/skins/mappings/interaction";
import { CosmeticMapper } from "@opencok/skins/mappings/cosmetics";
import { CosmeticPolicy } from "@opencok/skins/rules/projection";
import type { CosmeticPublicationRuntime } from "@opencok/skins/contracts/runtime";
import type { Rules } from "@opencok/rules/game";
import type { CityProgressionContext } from "@opencok/city/services/context";
import { text, num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { CampaignPlanner } from "@opencok/services/local-campaign";

export function createRealmCosmeticPolicy()
{
    return new CosmeticPolicy<Rules>({ num, long, cityInteger });
}

export function createRealmAvatarActivationDomain()
{
    const mapper = new CosmeticMapper();
    const { cosmeticTargetStates } = new CosmeticOwnership<Rules, CityProgressionContext>({
        text,
        num,
        long,
        cityInteger,
        serverFeature,
    });
    const events = new CosmeticEventMapper<Rules, CityProgressionContext>(
        { num, long },
        createRealmCosmeticPolicy(),
        mapper,
        cosmeticTargetStates,
    );

    return new AvatarActivationDomain<Rules, CityProgressionContext>(
        {
            text,
            num,
            long,
            cityInteger,
            serverFeature,
            randomInt,
            temporaryEffect,
            campaignFailure,
            recordCampaignEvent: (context, type, id) => {
                new CampaignPlanner(context).event(type, id);
            },
        },
        mapper,
        events,
    );
}

export const { cosmeticInteractionParticipants } = new CosmeticParticipants({
    playerItemGiftRecipient,
});

export function publishCosmeticInteractionMutation(
    payload: Uint8Array,
    interested: CosmeticPublicationRuntime["interested"],
    publish: CosmeticPublicationRuntime["publish"],
)
{
    return new CosmeticPublication(
        { playerItemGiftRecipient, interested, publish },
        new CosmeticMapper(),
    )
        .publishCosmeticInteractionMutation(payload);
}
