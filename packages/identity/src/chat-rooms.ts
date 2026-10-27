import type { PlayerState, PlayerStateLoader, Room, RoomAuthorizer } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatRoomGroup } from "@opencok/enums/chat-room-group";

export class ChatRoomAuthorizer {
  public constructor(private readonly getPlayerStateById: PlayerStateLoader) {}

  public readonly authorize: RoomAuthorizer = async (uid, claimedRoomId) => {
    if (typeof uid !== "string" || !uid || typeof claimedRoomId !== "string") return null;

    const state = await this.getPlayerStateById(uid);

    return this.roomsForState(state).find((room) => room.roomId === claimedRoomId) ?? null;
  };

  private roomsForState(state: PlayerState | null): Room[] {
    if (
      !state ||
      state.banned ||
      (state.banUntil ?? 0) > Date.now() ||
      !isSafeInteger(state.serverId) ||
      state.serverId <= 0 ||
      !isSafeInteger(state.originalServerId) ||
      state.originalServerId <= 0 ||
      typeof state.language !== "string" ||
      !/^[a-z]{2,3}(?:[-_][a-zA-Z]{2,4})?$/.test(state.language)
    ) {
      return [];
    }

    const rooms: Room[] = [
      { group: ChatRoomGroup.Original, roomId: `original_${state.originalServerId}` },
      { group: ChatRoomGroup.Country, roomId: `country_${state.serverId}` },
      { group: ChatRoomGroup.Global, roomId: "global_public" },
      { group: ChatRoomGroup.Local, roomId: `local_${state.language}` },
    ];

    if (
      typeof state.allianceId === "string" &&
      /^[a-zA-Z0-9_-]{1,40}$/.test(state.allianceId) &&
      state.membershipAllianceId === state.allianceId
    ) {
      rooms.push({
        group: ChatRoomGroup.Alliance,
        roomId: `alliance_${state.originalServerId}_${state.allianceId}`,
      });
    }

    return rooms;
  }
}

export function createRoomAuthorizer(getPlayerStateById: PlayerStateLoader): RoomAuthorizer {
  return new ChatRoomAuthorizer(getPlayerStateById).authorize;
}
