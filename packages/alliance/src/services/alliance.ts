import type { Fields } from "@opencok/messages/sfs";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
import type { AllianceContextFactory } from "../contracts/context";
import type { AllianceContextState } from "../contracts/context-state";
import type { AllianceContextCatalog } from "../contracts/context-catalog";
import type { AllianceMutationLedger, AllianceRepository } from "../contracts/mutation";
import type { AllianceMutationRuntime } from "../contracts/mutation-runtime";
import type { AllianceGiftFactory } from "../contracts/gifts";
import { AllianceCommandValidation } from "../validations/command";
import { AllianceMutationMapper } from "../mappings/mutation";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AllianceIdentity } from "./identity";
import { allianceCommands } from "../constants/commands";
import { AllianceQueryCommand } from "../enums/query-command";
import { AlliancePublicationTrigger } from "../enums/publication";
import { AllianceMutationCommand } from "../enums/mutation";

export class AllianceService<
    TState extends AllianceContextState,
    TCatalog extends AllianceContextCatalog,
    TLedger extends AllianceMutationLedger,
    TEffects,
>
{
    public constructor(
        readonly repository: AllianceRepository<TState>,
        readonly rules: TCatalog,
        readonly effects: TEffects,
        readonly contextFactory: AllianceContextFactory<TState, TCatalog, TLedger, TEffects>,
        readonly gifts: AllianceGiftFactory<TLedger>,
        private readonly runtime: AllianceMutationRuntime<TState, TCatalog, TLedger, TEffects>,
        private readonly validation: AllianceCommandValidation,
        private readonly mapper: AllianceMutationMapper,
        private readonly policy: AllianceMembershipPolicy,
    )
    {}

    async publishGift(owner: string, eventId: string, type: number)
    {
        const { cityInteger, createInventoryPlanner } = this.runtime;
        const { allianceText } = this.policy;

        allianceText(eventId, 1, 128);
        cityInteger(type, 30000, 30500);
        const giftEvent = AllianceIdentity.stableId(`alliance-gift:${eventId}`),
            requestId = `alliance-gift:${giftEvent}`;
        const response = await this.repository.execute(
            {
                owner,
                command: AllianceMutationCommand.Reward,
                requestId,
                request: this.mapper.giftRequest(eventId, type),
            },
            { giftEvent },
            async (state) => {
                const context = this.contextFactory(
                    owner,
                    state,
                    this.rules,
                    createInventoryPlanner(
                        state.inventory,
                        this.rules,
                        this.effects,
                        Number(state.now),
                    ),
                    this.effects,
                );
                context.member();
                const body = this.gifts(context).publish(giftEvent, type),
                    inventory = context.ledger.result(body);

                if (context.write.publishedGift)
                {
                    inventory.events = [
                        ...(inventory.events ?? []),
                        this.mapper.gift(context.allianceId),
                    ];
                }

                return { inventory, write: context.write };
            },
        );

        return inventoryReplay(response, requestId);
    }

    async command(owner: string, command: string, params: Fields)
    {
        const { createInventoryPlanner } = this.runtime;

        if (
            command !== AlliancePublicationTrigger.Tick
            && command !== AllianceQueryCommand.Init
            && !(allianceCommands as readonly string[]).includes(command)
        )
        {
            this.runtime.unsupportedFailure();
        }

        if (command !== AlliancePublicationTrigger.Tick)
        {
            await this.command(owner, AlliancePublicationTrigger.Tick, {});
        }

        const { requestId, request, selection } = await this.validation.prepare(command, params);

        const response = await this.repository.execute(
            { owner, command, requestId, request: this.mapper.request(request) },
            selection,
            async (state) => {
                const context = this.contextFactory(
                    owner,
                    state,
                    this.rules,
                    createInventoryPlanner(
                        state.inventory,
                        this.rules,
                        this.effects,
                        Number(state.now),
                    ),
                    this.effects,
                );
                const body = await context.command(command, params);
                const inventory = context.ledger.result(body);

                if (Object.keys(context.write).length)
                {
                    inventory.events = [
                        ...(inventory.events ?? []),
                        this.mapper.changed(context, command),
                    ];
                }

                return {
                    inventory,
                    write: context.write,
                    productionOwners: [...context.productionOwners],
                    productionAt: context.productionAt,
                };
            },
        );

        return inventoryReplay(response, requestId);
    }
}
