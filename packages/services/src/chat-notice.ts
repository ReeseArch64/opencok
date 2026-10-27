import type { ChatNoticeCostReader } from "@opencok/contracts/chat-delivery";
import { randomUUID, createHash } from "node:crypto";
import type { InventoryExecutor } from "@opencok/contracts/inventory";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { inventoryReplay } from "@opencok/mappings/inventory";
import { InventoryPlanner, type InventoryEffects } from "./inventory.ts";
import { activityEconomy } from "./timed-activity.ts";
import { long, text, num } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "@opencok/rules/city-progression";

export const noticeCommands = ["chat.notice", "chat.original.notice"];

export class ChatNoticeService {
  constructor(
    readonly execute: InventoryExecutor,
    readonly rules: Rules,
    readonly effects: InventoryEffects,
    readonly now = Date.now,
    readonly authorize?: (owner: string) => Promise<void>,
    readonly costs?: ChatNoticeCostReader,
  ) {}

  async command(owner: string, command: string, params: Fields) {
    if (!noticeCommands.includes(command)) throw new GameError(errors.unsupported);

    if (str(params, "itemId") !== "200011") throw new GameError(errors.invalid);

    const message = str(params, "msg");

    if (!message || [...message].length > 500 || !message.isWellFormed() || message.includes("\0"))
      throw new GameError(errors.invalid);

    const request: Fields = {};

    for (const key of Object.keys(params).sort())
      if (!["operationId", "_cok_", "cmdBaseTime"].includes(key)) request[key] = params[key]!;

    const requestId = params.operationId
      ? str(params, "operationId")
      : params.sendLocalTime
        ? `notice-${createHash("sha256").update(str(params, "sendLocalTime")).digest("hex")}`
        : randomUUID();
    await this.authorize?.(owner);
    const response = await this.execute(
      {
        owner,
        requestId,
        command,
        request: encode(request),
        expiresAt: BigInt(this.now() + 86_400_000),
      },
      async (state) => {
        const now = this.now();

        if (
          long(state.profile, "noticeBanTime") > BigInt(now) ||
          long(state.profile, "chatBanTime") > BigInt(now)
        )
          throw new GameError(errors.invalid, "social_rule");

        const planner = new InventoryPlanner(state, this.rules, this.effects, now);
        const economy = activityEconomy(planner);
        const existing = economy.quantity?.("200011") ?? 0;

        if (existing > 0 || int(params, "usePoint", 0) === 0) planner.spendItems("200011", 1);
        else {
          const price = cityInteger(this.rules.goods.get("200011")?.price);

          if (price <= 0) throw new GameError(errors.invalid);

          economy.gold(-BigInt(price));
        }

        const server =
          command === "chat.original.notice"
            ? num(state.profile, "srcServerId") || num(state.profile, "serverId")
            : num(state.profile, "serverId");
        const roomId = `${command === "chat.original.notice" ? "original" : "country"}_${server}`;
        const result = planner.result({
          gold: sfs.long(planner.total()),
          sendLocalTime: sfs.string(str(params, "sendLocalTime", "")),
          pending: sfs.bool(true),
        });

        return {
          ...result,
          events: [
            ...(result.events ?? []),
            {
              id: "notice",
              type: "social.notice",
              payload: encode({
                roomId: sfs.string(roomId),
                msg: sfs.string(message),
                createdAt: sfs.long(now),
                senderName: sfs.string(text(state.profile, "name")),
              }),
            },
          ],
        };
      },
    );

    return inventoryReplay(response, requestId);
  }

  async refund(owner: string, original: string) {
    if (!this.costs) throw new GameError(errors.unsupported);

    const cost = await this.costs(owner, original);

    if (cost.createdAt + 86_400_000 > this.now() || !cost.postings.length)
      throw new GameError(errors.invalid);

    const requestId = `notice-refund-${createHash("sha256").update(original).digest("hex")}`;
    const response = await this.execute(
      {
        owner,
        requestId,
        command: "chat.notice.refund",
        request: encode({ original: sfs.string(original) }),
      },
      async (state) => {
        const planner = new InventoryPlanner(state, this.rules, this.effects, this.now());

        for (const posting of cost.postings) {
          const amount = posting.before - posting.after;

          if (amount <= 0n) throw new GameError(errors.invalid);

          if (posting.asset.startsWith("item.") && amount === 1n) planner.add("200011", 1);
          else if (
            posting.asset.startsWith("profile.") &&
            [
              "gold",
              "paidGold",
              "paidSpecialGold",
              "dmmGold",
              "dmmPaidGold",
              "dmmPaidSpecialGold",
            ].includes(posting.asset.slice(8))
          ) {
            const pool = posting.asset.slice(8),
              before = planner.balance(pool),
              after = before + amount;
            planner.profile[pool] = after;
            planner.post(posting.asset, before, after, "notice.refund");
          } else throw new GameError(errors.invalid);
        }

        return planner.result({ refunded: sfs.bool(true), original: sfs.string(original) });
      },
    );

    return inventoryReplay(response, requestId);
  }
}
