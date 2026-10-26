import type { PlayerState, PlayerStateLoader, Room, RoomAuthorizer } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
const languagePattern = /^[a-z]{2,3}(?:[-_][a-zA-Z]{2,4})?$/;
const alliancePattern = /^[a-zA-Z0-9_-]{1,40}$/;

function positiveServerId(value: unknown): value is number {
  return isSafeInteger(value) && value > 0;
}

function roomsForState(state: PlayerState | null): Room[] {
  if (
    !state ||
    state.banned ||
    (state.banUntil ?? 0) > Date.now() ||
    !positiveServerId(state.serverId) ||
    !positiveServerId(state.originalServerId) ||
    typeof state.language !== "string" ||
    !languagePattern.test(state.language)
  ) {
    return [];
  }

  const rooms: Room[] = [
    { group: "original", roomId: `original_${state.originalServerId}` },
    { group: "country", roomId: `country_${state.serverId}` },
    { group: "global", roomId: "global_public" },
    { group: "local", roomId: `local_${state.language}` },
  ];
  if (
    typeof state.allianceId === "string" &&
    alliancePattern.test(state.allianceId) &&
    state.membershipAllianceId === state.allianceId
  ) {
    rooms.push({
      group: "alliance",
      roomId: `alliance_${state.originalServerId}_${state.allianceId}`,
    });
  }
  return rooms;
}

export function createRoomAuthorizer(getPlayerStateById: PlayerStateLoader): RoomAuthorizer {
  return async (uid, claimedRoomId) => {
    if (typeof uid !== "string" || !uid || typeof claimedRoomId !== "string") return null;
    const state = await getPlayerStateById(uid);
    return roomsForState(state).find((room) => room.roomId === claimedRoomId) ?? null;
  };
}
