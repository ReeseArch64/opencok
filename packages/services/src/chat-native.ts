import type { ChatRepository, ChatMessage, PlayerState } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
import { createRoomAuthorizer } from "@opencok/identity/chat-rooms";
export const nativeChatCommands = [
  "chat.logout",
  "chat.country",
  "chat.original",
  "chat.get",
  "chat.get.by.seq",
  "chat.get.new",
  "chat.translate",
  "chat.translate.improve",
  "chat.mi.bind.account",
];
export class ChatNativeService {
  constructor(
    readonly repository: ChatRepository,
    readonly now = Date.now,
  ) {}
  room(state: PlayerState, type: number) {
    if (type === 2 && state.allianceId && state.membershipAllianceId === state.allianceId)
      return `alliance_${state.originalServerId}_${state.allianceId}`;
    if (type === 0) return `country_${state.serverId}`;
    throw new ChatCommandError("invalid_room");
  }
  async execute(
    owner: string,
    command: string,
    params: Record<string, unknown>,
    operationId: string,
  ): Promise<Record<string, unknown>> {
    const state = await this.repository.getPlayerStateById(owner);
    if (!state || state.banned || (state.banUntil ?? 0) > this.now())
      throw new ChatCommandError("unauthorized");
    if (
      command === "chat.translate" ||
      command === "chat.translate.improve" ||
      command === "chat.mi.bind.account"
    )
      throw new ChatCommandError("provider_unavailable");
    if (command === "chat.logout") {
      await this.repository.sessions.revoke?.(owner);
      return { status: "ok" };
    }
    const authorize = createRoomAuthorizer(this.repository.getPlayerStateById);
    if (command === "chat.country" || command === "chat.original") {
      const post = params.post ?? 0;
      if (![0, 2].includes(Number(post)) || typeof params.msg !== "string")
        throw new ChatCommandError("invalid_message");
      const roomId =
        Number(post) === 2
          ? this.room(state, 2)
          : command === "chat.original"
            ? `original_${state.originalServerId}`
            : this.room(state, 0);
      if (!(await authorize(owner, roomId))) throw new ChatCommandError("invalid_room");
      if (this.repository.access && !(await this.repository.access.canSend(owner)))
        throw new ChatCommandError("chat_muted");
      const saved = await this.repository.messages.create({
        roomId,
        senderUid: owner,
        idempotencyKey: operationId,
        body: params.msg,
        now: new Date(this.now()),
      });
      return {
        seqId: String(saved.sequenceId),
        timeLong: Date.parse(saved.createdAt),
        sendLocalTime: params.sendLocalTime ?? "",
      };
    }
    const frame = (item: ChatMessage) => ({
      senderUid: item.senderUid,
      msg: item.body,
      type: item.roomId.startsWith("alliance_") ? 2 : 0,
      post: item.post ?? 0,
      timeLong: Date.parse(item.createdAt),
      time: Date.parse(item.createdAt),
      seqId: String(item.sequenceId),
    });
    if (command === "chat.get.new") {
      let rooms: unknown = params.rooms;
      if (typeof params.params === "string") {
        try {
          rooms = JSON.parse(params.params);
        } catch {
          throw new ChatCommandError("invalid_room");
        }
      }
      if (!Array.isArray(rooms) || rooms.length > 16) throw new ChatCommandError("invalid_room");
      const results = [];
      for (const room of rooms) {
        if (!room || typeof room !== "object" || Array.isArray(room))
          throw new ChatCommandError("invalid_room");
        results.push(
          await this.execute(
            owner,
            "chat.get.by.seq",
            room as Record<string, unknown>,
            operationId,
          ),
        );
      }
      return { rooms: results };
    }
    if (command !== "chat.get" && command !== "chat.get.by.seq")
      throw new ChatCommandError("unsupported_command");
    const type = Number(params.type ?? 0);
    if (type === 1) {
      if (typeof params.id !== "string" || !params.id || !this.repository.mailbox)
        throw new ChatCommandError("invalid_target");
      if (this.repository.access && !(await this.repository.access.canReceive(owner, params.id)))
        return { msg: [] };
      const rows = await this.repository.mailbox.list(owner, state.serverId, params.id, 3, 100);
      return {
        msg: rows.map((row) => ({
          uid: row.id,
          senderUid: row.sender ?? row.peer,
          msg: row.body,
          timeLong: Number(row.createdAt),
          type: 1,
        })),
      };
    }
    const roomId = this.room(state, type);
    if (!(await authorize(owner, roomId))) throw new ChatCommandError("invalid_room");
    const integer = (value: unknown, fallback: number) => {
      if (value === undefined || value === "") return fallback;
      const number = Number(value);
      if (!Number.isSafeInteger(number) || number < 0) throw new ChatCommandError("invalid_cursor");
      return number;
    };
    let rows: ChatMessage[];
    if (command === "chat.get.by.seq") {
      if (!this.repository.messages.page) throw new ChatCommandError("unavailable");
      const before = integer(params.end, 0);
      rows = (
        await this.repository.messages.page({
          roomId,
          before,
          limit: 100,
          archive: params.archive === true,
        })
      ).messages;
      const after = integer(params.start, 0);
      rows = rows.filter((row) => row.sequenceId >= after);
    } else
      rows = await this.repository.messages.getAllByRange(
        roomId,
        integer(params.start, 0),
        integer(params.end, this.now() + 1),
      );
    const visible = [];
    for (const row of rows)
      if (!this.repository.access || (await this.repository.access.canRead(owner, row)))
        visible.push(frame(row));
    return { msg: visible };
  }
}
