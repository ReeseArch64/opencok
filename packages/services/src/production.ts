import { activityEconomy } from "./timed-activity";
import { productionBoost } from "@opencok/mappings/production";
import { randomUUID } from "node:crypto";
import type { ProductionExecutor, ProductionAccount } from "@opencok/contracts/timed-activity";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import {
  settleProduction,
  changeProductionRate,
  activityInstant,
} from "@opencok/rules/timed-activity";
import type { Rules } from "@opencok/rules/game";
import { sfs, encode, str, type Fields } from "@opencok/messages/sfs";
import { inventoryReplay } from "@opencok/mappings/inventory";
import { resource } from "@opencok/mappings/city";
import { InventoryPlanner, type InventoryEffects } from "./inventory";
import { debit } from "./timed-activity";

const assets = ["wood", "stone", "iron", "food"] as const;

const boosters = ["200027", "200030", "200029", "200028"] as const;

export class ProductionService {
  constructor(
    readonly execute: ProductionExecutor,
    readonly rules: Rules,
    readonly effects: InventoryEffects,
  ) {}

  async command(owner: string, command: string, params: Fields) {
    if (!["build.collect", "building.addOutPut", "production.settle"].includes(command))
      throw new Error("Unsupported production command");

    const supplied = str(params, "operationId", "") || randomUUID();

    if (command !== "production.settle" && !/^[A-Za-z0-9:._-]{1,128}$/.test(supplied))
      throw new Error("Stable operationId required for production mutation");

    const requestId = supplied || randomUUID();
    const request: Fields = {};

    for (const key of Object.keys(params).sort())
      if (!["operationId", "_cok_", "cmdBaseTime"].includes(key)) request[key] = params[key]!;

    const response = await this.execute(
      { owner, requestId, command, request: encode(request) },
      async (state) => {
        const ledger = new InventoryPlanner(state, this.rules, this.effects, Number(state.now));
        const selected =
          command === "production.settle"
            ? state.buildings.filter((row) => this.asset(row) !== undefined)
            : state.buildings.filter((row) => row.uuid === str(params, "uuid"));

        if (command !== "production.settle" && selected.length !== 1)
          throw new Error("Production building not found");

        const accounts: ProductionAccount[] = [],
          buildings: Row[] = [];
        let body: Fields = {};

        for (const building of selected) {
          const kind = this.asset(building);

          if (kind === undefined || num(building, "level") < 1)
            throw new Error("Invalid production building");

          const asset = assets[kind]!;
          const previous = state.accounts.find((row) => row.buildingId === building.uuid);
          const from =
            long(building, "refreshTime") > 0n
              ? long(building, "refreshTime")
              : state.now > 5000n
                ? state.now - 5000n
                : 0n;
          let account = previous ?? {
            buildingId: text(building, "uuid"),
            ownerId: owner,
            asset,
            settledAt: from,
            amount: 0n,
            remainder: 0n,
            rates: await state.rates(building, from),
          };
          account = settleProduction(account, state.now);
          let collected = 0n;
          const collect = () => {
            collected += account.amount;
            const before = ledger.resources[asset] ?? long(state.resource, asset),
              after = before + account.amount;

            if (after > 9223372036854775807n) throw new Error("Production balance overflow");

            ledger.resources[asset] = after;
            ledger.post(`resource.${asset}`, before, after, "production.collect");
            account = { ...account, amount: 0n };
          };

          if (command === "build.collect") {
            collect();
            buildings.push({ ...building, refreshTime: state.now });
            body = resource({ ...state.resource, ...ledger.resources });
          } else if (command === "building.addOutPut") {
            if (long(building, "effectTime") > state.now)
              throw new Error("Production boost already active");

            const useItem = !!str(params, "goods", "").trim();
            let seconds: number;
            let goods: Fields | undefined;

            if (useItem) {
              const id = boosters[kind]!;
              ledger.spendItems(id, 1);
              const item = [...ledger.changed.values()].find((row) => row.itemId === id)!;
              goods = {
                uuid: sfs.string(item.uuid),
                itemId: sfs.string(item.itemId),
                count: sfs.int(item.count),
              };
              seconds = Number(this.rules.goods.get(id)?.para2);
            } else {
              collect();
              const definition = this.rules.building(
                text(building, "itemId"),
                num(building, "level"),
                num(building, "star"),
                num(building, "progress"),
              );
              const price = Number(definition.clientParameters?.[2]?.value);

              if (!Number.isSafeInteger(price) || price < 0) throw new Error("Missing boost price");

              debit(ledger, BigInt(price), "production.boost");
              seconds = Number(this.rules.items.get("building_base")?.k6);
            }

            if (!Number.isSafeInteger(seconds) || seconds <= 0)
              throw new Error("Invalid production boost duration");

            const effectTime = activityInstant(state.now + BigInt(seconds) * 1000n);
            const changed = {
              ...building,
              effectTime,
              refreshTime: useItem ? long(building, "refreshTime") : state.now,
            };
            account = changeProductionRate(
              account,
              state.now,
              await state.rates(changed, state.now),
            );
            buildings.push(changed);
            body = productionBoost(effectTime, long(changed, "refreshTime"), ledger.total(), goods);
          }

          if (collected > 0n)
            await state.recordAction?.(
              "harvest",
              String(kind),
              Number(collected > 2147483647n ? 2147483647n : collected),
              activityEconomy(ledger),
            );

          accounts.push(account);
        }

        const result = ledger.result(body);

        return {
          ...result,
          accounts,
          buildings,
          events: [
            ...(result.events ?? []),
            {
              id: "production",
              type: command,
              payload: encode({ at: sfs.long(state.now), buildings: sfs.int(accounts.length) }),
            },
          ],
        };
      },
    );

    return inventoryReplay(response, requestId);
  }

  asset(building: Row): number | undefined {
    if (num(building, "level") < 1) return undefined;

    const type = this.rules.building(
      text(building, "itemId"),
      num(building, "level"),
      num(building, "star"),
      num(building, "progress"),
    ).effects?.productionResourceId;

    return type !== undefined && type >= 0 && type < 4 ? type : undefined;
  }
}
