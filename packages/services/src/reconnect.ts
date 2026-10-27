import type { FriendshipMineStore } from "@opencok/contracts/reconnect";

import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "@opencok/rules/game";

import { reconnectMine } from "@opencok/mappings/reconnect";
import { initialFriendshipMine, friendshipMineView } from "@opencok/rules/reconnect-mine";

export async function reconnectFriendshipMine(
  store: FriendshipMineStore,
  uid: string,
  rules: Rules,
) {
  if (!uid.trim() || uid.length > 40) throw new GameError(errors.unsupported, "reconnect");

  const mine = await store.friendshipMine(uid, () => initialFriendshipMine(rules));

  return reconnectMine(friendshipMineView(mine, rules));
}
