import type { ReconnectBaseState, FriendshipMineStore } from "@opencok/contracts/reconnect";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "@opencok/rules/game";
import { ownGeneralSnapshots } from "@opencok/rules/profile-generals";
import { reconnectGenerals, reconnectMine } from "@opencok/dtos/reconnect";
import { initialFriendshipMine, friendshipMineView } from "@opencok/rules/reconnect-mine";
import { decodeGeneralAbilities } from "./profile.ts";

export function reconnectOwnGenerals(state: ReconnectBaseState, rules: Rules, now: number) {
  if (!state.profile) throw new GameError(errors.unsupported, "reconnect");
  const abilities = new Map(
    state.generals.map((general) => [
      text(general, "uuid"),
      decodeGeneralAbilities(general.ability, false),
    ]),
  );
  return reconnectGenerals(
    ownGeneralSnapshots(
      state.generals,
      state.skills,
      abilities,
      text(state.profile, "uid"),
      rules,
      now,
    ),
  );
}

export async function reconnectFriendshipMine(
  store: FriendshipMineStore,
  uid: string,
  rules: Rules,
) {
  if (!uid.trim() || uid.length > 40) throw new GameError(errors.unsupported, "reconnect");
  const mine = await store.friendshipMine(uid, () => initialFriendshipMine(rules));
  return reconnectMine(friendshipMineView(mine, rules));
}
