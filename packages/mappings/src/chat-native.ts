import type { ChatMessage, PlayerState } from "@opencok/contracts/chat";
import type { ChatPrivateRoomInfo } from "@opencok/contracts/chat-delivery";
export function nativePrivateMessage(
  item: ChatMessage,
  room: ChatPrivateRoomInfo,
  sender?: PlayerState | null,
) {
  const type = item.post !== undefined && item.post >= 100 ? item.post - 100 : 4;
  return {
    seqId: String(item.sequenceId),
    roomId: room.id.replace(/^private_/, ""),
    founder: room.founder,
    name: room.name,
    senderUid: item.senderUid,
    senderName:
      sender?.name ??
      room.members.find((member) => member.uid === item.senderUid)?.name ??
      item.senderUid,
    body: { type, msg: [0, 1, 2, 3].includes(type) ? JSON.parse(item.body) : item.body },
    time: String(Math.floor(Date.parse(item.createdAt) / 1000)),
    lastUpdateTime: "",
    isNotDefaultName: room.isNotDefaultName,
    ...(sender?.pic
      ? {
          senderPic: sender.pic,
          senderPicVer: sender.picVer ?? 0,
          senderpicfraId: sender.picfraId ?? 0,
        }
      : {}),
  };
}
export function nativePrivateRoom(room: ChatPrivateRoomInfo) {
  return {
    id: room.id.replace(/^private_/, ""),
    name: room.name,
    isNotDefaultName: room.isNotDefaultName,
    founder: room.founder,
    members: room.members,
    ...(room.lastMessage
      ? { msg: JSON.stringify(nativePrivateMessage(room.lastMessage, room)) }
      : {}),
  };
}
