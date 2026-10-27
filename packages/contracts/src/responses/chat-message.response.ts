import type { RoomGroup } from "../chat.ts";

export interface ChatMessageResponse {
  sender: string;
  msg: string;
  serverTime: number;
  sendTime: number;
  group: RoomGroup;
  roomId: string;
  seqId: number;
  extra: { seqId: number };
}
