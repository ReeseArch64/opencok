import { randomUUID } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { Type, sfs, encode, decode, fields, type Fields } from "@opencok/messages/sfs";
import type { InventoryCommandResponse } from "../contracts/responses/inventory.ts";
import type { InventoryCommandState, InventoryExecutor } from "../contracts/inventory-planning.ts";
import type { InventoryPlanningCatalogs } from "../contracts/inventory-catalogs.ts";
import type { InventoryRuntime } from "../contracts/inventory-runtime.ts";
import { inventoryCount } from "../rules/inventory.ts";
import { inventoryReplay } from "../mappings/inventory.ts";
import { inventoryItem } from "../mappings/inventory-item.ts";
import { InventoryPlanner } from "./inventory-planner.ts";

export class InventoryService<
    State extends InventoryCommandState = InventoryCommandState,
    Catalogs extends InventoryPlanningCatalogs = InventoryPlanningCatalogs,
>
{
    constructor(
        readonly execute: InventoryExecutor<State>,
        readonly rules: Catalogs,
        readonly runtime: InventoryRuntime<State, Catalogs>,
        readonly now = Date.now,
    )
    {}

    async command(owner: string, command: string, params: Fields): Promise<InventoryCommandResponse>
    {
        if (
            ![
                "item.buy",
                "item.use",
                "item.buyUse",
                "item.compose",
                "item.compose2",
                "item.compose.suitequipment.store",
            ].includes(command)
        )
        {
            throw new GameError(errors.unsupported);
        }

        for (const key of ["num", "count", "pernum", "batch", "id"])
        {
            const value = params[key];

            if (
                value
                && (value.type !== Type.Int
                    || typeof value.value !== "number"
                    || !Number.isInteger(value.value)
                    || value.value < 0
                    || value.value > 2147483647)
            )
            {
                throw new GameError(errors.invalid);
            }
        }

        for (const key of ["itemId", "uuid", "targetId"])
        {
            const value = params[key];

            if (
                value
                && (value.type !== Type.String
                    || typeof value.value !== "string"
                    || value.value.length > 255
                    || !value.value.isWellFormed())
            )
            {
                throw new GameError(errors.invalid);
            }
        }

        const operation = params.operationId;

        if (
            operation
            && (operation.type !== Type.String
                || typeof operation.value !== "string"
                || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                    .test(
                        operation.value,
                    ))
        )
        {
            throw new GameError(errors.invalid);
        }

        const request: Fields = {};

        for (const key of Object.keys(params).sort())
        {
            if (!["operationId", "_cok_", "cmdBaseTime"].includes(key))
            {
                request[key] = params[key]!;
            }
        }

        const requestId = operation ? (operation.value as string).toLowerCase() : randomUUID();
        const bytes = encode(request);
        const response = await this.execute(
            { owner, requestId, command, request: bytes },
            async (state) => {
                const planner = new InventoryPlanner(state, this.rules, this.runtime, this.now());
                const body = await planner.command(command, decode(bytes));

                return planner.result(body);
            },
        );

        return inventoryReplay(response, requestId);
    }

    async grant(
        owner: string,
        operationId: string,
        itemId: string,
        count: number,
        value = 0,
    ): Promise<Fields>
    {
        inventoryCount(count);

        if (!Number.isInteger(value) || value < 0 || value > 2147483647)
        {
            throw new GameError(errors.invalid);
        }

        const request = encode({
            itemId: sfs.string(itemId),
            count: sfs.int(count),
            value: sfs.int(value),
        });

        return fields(
            decode(
                await this.execute(
                    { owner, requestId: operationId, command: "inventory.grant", request },
                    async (state) => {
                        const planner = new InventoryPlanner(
                            state,
                            this.rules,
                            this.runtime,
                            this.now(),
                        );
                        const item = planner.add(itemId, count, value);

                        return planner.result(inventoryItem({ ...item }, this.rules));
                    },
                ),
            ).body,
        );
    }
}
