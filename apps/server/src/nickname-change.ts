import { createNicknameChangeStore } from "@opencok/repositories/nickname-change";
import { nicknameNotification, nicknameChangeReply } from "@opencok/mappings/nickname-change";
import type { NicknameChangeConfiguration } from "@opencok/contracts/nickname-change";
import type { RealmNotifications } from "@opencok/connection/notifications";
import type { createDatabases } from "@opencok/drizzle";
import type { Rules } from "@opencok/rules/game";

export function createNicknameChangeRuntime(options: {
  databases: Pick<ReturnType<typeof createDatabases>, "global" | "getKingdom">;
  kingdomId: number;
  rules: Pick<Rules, "goods">;
  refundRatio: NicknameChangeConfiguration["refundRatio"];
  notifications: RealmNotifications;
  timeoutMs: number;
  report(): void;
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
      itemType: () => goods().type,
      price: () => goods().price,
      refundRatio: options.refundRatio,
    },
    { publish, timeoutMs: options.timeoutMs, report: options.report },
  );
  return {
    store,
    async change(owner: string, operationId: string, validatedName: string, now: number) {
      return nicknameChangeReply(await store.change(owner, operationId, validatedName, now));
    },
    async recover(owner: string, operationId: string, now: number) {
      return nicknameChangeReply(await store.recover(owner, operationId, now));
    },
    deliverNotifications: (owner: string, operationId: string) =>
      store.deliverNotifications(owner, operationId, publish, options.timeoutMs),
  };
}
