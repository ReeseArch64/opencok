import type { ChatNicknamePublisher } from "@opencok/contracts/chat-nickname";
import { createNicknameChangeStore } from "@opencok/repositories/nickname-change";
import { nicknameNotification, nicknameChangeReply } from "@opencok/mappings/nickname-change";
import type { NicknameChangeConfiguration } from "@opencok/contracts/nickname-change";
import type { RealmNotifications } from "@opencok/connection/notifications";
import type { createDatabases } from "@opencok/drizzle";
import type { Rules } from "@opencok/rules/game";
import type { Cache } from "@opencok/storage/session";
import type { SharedUserLayout } from "@opencok/contracts/shared-user";
import { createNicknameAllianceDelivery } from "@opencok/services/nickname-alliance";
import { sharedUserInfo } from "@opencok/mappings/shared-user";

export function createNicknameChangeRuntime(options: {
  databases: Pick<ReturnType<typeof createDatabases>, "global" | "getKingdom">;
  kingdomId: number;
  rules: Pick<Rules, "goods">;
  refundRatio: NicknameChangeConfiguration["refundRatio"];
  notifications: RealmNotifications;
  timeoutMs: number;
  report(): void;
  prepareRefund?(owner: string, now: number): Promise<void>;
  confirmedSpending?: NicknameChangeConfiguration["confirmedSpending"];
  chat?: ChatNicknamePublisher;
  alliance?: {
    rules: Pick<Rules, "items" | "configuration" | "mail">;
    resolveMailReward?: (rewardId: string, owner: string) => string | null;
  };
  sharedUser?: {
    cache: Pick<Cache, "publishSharedUserInfo">;
    rules: Pick<Rules, "power">;
    layout?: SharedUserLayout;
  };
}) {
  const goods = () => {
    const row = options.rules.goods.get("200021");

    if (!row) throw new Error("Nickname goods unavailable");

    return row;
  };
  const publish = async (
    owner: string,
    snapshot: Parameters<typeof nicknameNotification>[0],
    signal: AbortSignal,
  ) => {
    signal.throwIfAborted();
    const message = nicknameNotification(snapshot, options.rules);
    const delivered = await options.notifications.publish(
      owner,
      message.command,
      message.body,
      signal,
    );
    signal.throwIfAborted();

    return delivered;
  };
  const store = createNicknameChangeStore(
    options.databases,
    options.kingdomId,
    {
      confirmedSpending: options.confirmedSpending,
      itemType: () => goods().type,
      price: () => goods().price,
      refundRatio: options.refundRatio,
    },
    { publish, timeoutMs: options.timeoutMs, report: options.report },
  );
  const deliverAlliance = options.alliance
    ? createNicknameAllianceDelivery({ store, kingdomId: options.kingdomId, ...options.alliance })
    : undefined;
  const deliver = async (owner: string, operationId: string, now: number) => {
    await options.prepareRefund?.(owner, now);
    const record = await store.recover(owner, operationId, now);

    if (record.state !== "committed") return;

    for (const effect of [
      () => {
        if (!deliverAlliance) throw new Error("Alliance delivery unavailable");

        return deliverAlliance(owner, operationId, now);
      },
      () => {
        if (!options.chat) throw new Error("Chat delivery unavailable");

        return store.deliverChat(owner, operationId, options.chat, options.timeoutMs);
      },
      () => store.deliverThrone(owner, operationId, now),
      () => {
        const shared = options.sharedUser;

        if (!shared) throw new Error("Shared user delivery unavailable");

        return store.deliverSharedUser(
          owner,
          operationId,
          now,
          (row, realm, version, time) => sharedUserInfo(row, shared.rules, realm, version, time),
          async (update, signal) => {
            signal.throwIfAborted();
            await shared.cache.publishSharedUserInfo(update, shared.layout);
            signal.throwIfAborted();
          },
          options.timeoutMs,
        );
      },
    ]) {
      try {
        await effect();
      } catch {
        options.report();
      }
    }
  };

  return {
    store,
    deliver,
    next: store.nextPending,
    async command(owner: string, operationId: string, validatedName: string, now: number) {
      if (!deliverAlliance || !options.chat || !options.sharedUser)
        throw new Error("Nickname runtime incomplete");

      await options.prepareRefund?.(owner, now);
      const record = await store.change(owner, operationId, validatedName, now);

      try {
        await deliver(owner, operationId, now);
      } catch {
        options.report();
      }

      return record;
    },
    async change(owner: string, operationId: string, validatedName: string, now: number) {
      await options.prepareRefund?.(owner, now);

      return nicknameChangeReply(await store.change(owner, operationId, validatedName, now));
    },
    async recover(owner: string, operationId: string, now: number) {
      await options.prepareRefund?.(owner, now);

      return nicknameChangeReply(await store.recover(owner, operationId, now));
    },
    deliverNotifications: (owner: string, operationId: string) =>
      store.deliverNotifications(owner, operationId, publish, options.timeoutMs),
    async deliverAlliance(owner: string, operationId: string, now: number) {
      if (!deliverAlliance) throw new Error("Alliance task runtime unavailable");

      return deliverAlliance(owner, operationId, now);
    },
    async deliverSharedUser(owner: string, operationId: string, now: number) {
      const shared = options.sharedUser;

      if (!shared) throw new Error("Shared user runtime unavailable");

      return store.deliverSharedUser(
        owner,
        operationId,
        now,
        (row, kingdomId, version, time) =>
          sharedUserInfo(row, shared.rules, kingdomId, version, time),
        async (update, signal) => {
          signal.throwIfAborted();
          await shared.cache.publishSharedUserInfo(update, shared.layout);
          signal.throwIfAborted();
        },
        options.timeoutMs,
      );
    },
  };
}
