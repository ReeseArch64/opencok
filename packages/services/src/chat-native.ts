import { nativePrivateMessage } from "@opencok/mappings/chat-native";
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

export class ChatNativeService
{
    constructor(
        readonly repository: ChatRepository,
        readonly now = Date.now,
    )
    {}

    room(state: PlayerState, type: number)
    {
        if (type === 2 && state.allianceId && state.membershipAllianceId === state.allianceId)
        {
            return `alliance_${state.originalServerId}_${state.allianceId}`;
        }

        if (type === 0)
        {
            return `country_${state.serverId}`;
        }

        throw new ChatCommandError("invalid_room");
    }

    async execute(
        owner: string,
        command: string,
        params: Record<string, unknown>,
        operationId: string,
    ): Promise<Record<string, unknown>>
    {
        const state = await this.repository.getPlayerStateById(owner);

        if (!state || state.banned || (state.banUntil ?? 0) > this.now())
        {
            throw new ChatCommandError("unauthorized");
        }

        if (
            command === "chat.translate"
            || command === "chat.translate.improve"
            || command === "chat.mi.bind.account"
        )
        {
            throw new ChatCommandError("provider_unavailable");
        }

        if (command === "chat.logout")
        {
            await this.repository.sessions.revoke?.(owner);

            return { status: "ok" };
        }

        const authorize = createRoomAuthorizer(this.repository.getPlayerStateById);

        if (command === "chat.country" || command === "chat.original")
        {
            const post = params.post ?? 0;

            if (![0, 2].includes(Number(post)) || typeof params.msg !== "string")
            {
                throw new ChatCommandError("invalid_message");
            }

            const roomId = Number(post) === 2
                ? this.room(state, 2)
                : command === "chat.original"
                ? `original_${state.originalServerId}`
                : this.room(state, 0);

            if (!(await authorize(owner, roomId)))
            {
                throw new ChatCommandError("invalid_room");
            }

            if (this.repository.access && !(await this.repository.access.canSend(owner)))
            {
                throw new ChatCommandError("chat_muted");
            }

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

        const frame = async (item: ChatMessage) => ({
            senderUid: item.senderUid,
            senderName: (await this.repository.getPlayerStateById(item.senderUid))?.name
                ?? item.senderUid,
            msg: item.body,
            type: item.roomId.startsWith("alliance_") ? 2 : 0,
            post: item.post ?? 0,
            timeLong: Date.parse(item.createdAt),
            time: Date.parse(item.createdAt),
            seqId: String(item.sequenceId),
        });

        if (command === "chat.get.new")
        {
            let rooms: unknown = params.rooms;

            if (typeof params.params === "string")
            {
                try
                {
                    rooms = JSON.parse(params.params);
                }
                catch
                {
                    throw new ChatCommandError("invalid_room");
                }
            }

            if (!Array.isArray(rooms) || rooms.length > 16)
            {
                throw new ChatCommandError("invalid_room");
            }

            const results = [];

            for (const room of rooms)
            {
                if (!room || typeof room !== "object" || Array.isArray(room))
                {
                    throw new ChatCommandError("invalid_room");
                }

                results.push(
                    await this.history(owner, state, room as Record<string, unknown>, true, frame),
                );
            }

            return { rooms: results };
        }

        if (command !== "chat.get" && command !== "chat.get.by.seq")
        {
            throw new ChatCommandError("unsupported_command");
        }

        if (command === "chat.get.by.seq")
        {
            return this.history(owner, state, params, false, frame);
        }

        const type = Number(params.type ?? 0);

        if (type === 1)
        {
            return this.direct(owner, state, params);
        }

        const roomId = this.room(state, type);

        if (!(await authorize(owner, roomId)))
        {
            throw new ChatCommandError("invalid_room");
        }

        const rows = await this.repository.messages.getAllByRange(
            roomId,
            this.integer(params.start, 0),
            this.integer(params.end, this.now() + 1),
        );
        const visible = [];

        for (const row of rows)
        {
            if (!this.repository.access || (await this.repository.access.canRead(owner, row)))
            {
                visible.push(await frame(row));
            }
        }

        return { msg: visible };
    }

    integer(value: unknown, fallback: number)
    {
        if (value === undefined || value === "")
        {
            return fallback;
        }

        const number = Number(value);

        if (!Number.isSafeInteger(number) || number < 0)
        {
            throw new ChatCommandError("invalid_cursor");
        }

        return number;
    }

    async direct(owner: string, state: PlayerState, params: Record<string, unknown>)
    {
        const peer = params.id ?? "";

        if (typeof peer !== "string" || !this.repository.mailbox)
        {
            throw new ChatCommandError("invalid_target");
        }

        const rows = await this.repository.mailbox.list(owner, state.serverId, peer, 3, 100);
        const messages = [];

        for (const row of rows)
        {
            if (
                this.repository.access
                && !(await this.repository.access.canReceive(owner, row.peer))
            )
            {
                continue;
            }

            const senderUid = row.sender ?? row.peer;
            const sender = await this.repository.getPlayerStateById(senderUid);
            messages.push({
                uid: row.id,
                senderUid,
                senderName: sender?.name ?? senderUid,
                msg: row.body,
                timeLong: Number(row.createdAt),
                type: 1,
            });
        }

        return { msg: messages };
    }

    async history(
        owner: string,
        state: PlayerState,
        params: Record<string, unknown>,
        latest: boolean,
        frame: (item: ChatMessage) => Promise<Record<string, unknown>>,
    ): Promise<Record<string, unknown>>
    {
        const type = Number(params.type ?? 3);

        if (!Number.isInteger(type) || type < 0 || type === 4)
        {
            throw new ChatCommandError("invalid_room");
        }

        if (type === 2)
        {
            return {
                id: params.id ?? "",
                type,
                firstSeqId: "-1",
                lastSeqId: "-1",
                ...(await this.direct(owner, state, params)),
            };
        }

        let roomId: string;

        if (type === 0 || type === 1)
        {
            roomId = this.room(state, type === 1 ? 2 : 0);
        }
        else
        {
            if (typeof params.id !== "string")
            {
                throw new ChatCommandError("invalid_room");
            }

            roomId = params.id.startsWith("private_") ? params.id : `private_${params.id}`;
        }

        const room = type >= 3
            ? await this.repository.access?.roomInfo?.(owner, roomId)
            : undefined;

        if (
            type >= 3
                ? !room
                : !(await createRoomAuthorizer(this.repository.getPlayerStateById)(owner, roomId))
        )
        {
            throw new ChatCommandError("invalid_room");
        }

        if (!this.repository.messages.page)
        {
            throw new ChatCommandError("unavailable");
        }

        const end = latest ? 0 : this.integer(params.end, 0);
        const rows = (
            await this.repository.messages.page({
                roomId,
                before: end ? end + 1 : 0,
                limit: 100,
                archive: params.archive === true,
            })
        ).messages;
        const start = latest
            ? (params.seqid === "-1" ? 0 : this.integer(params.seqid, 0)) + 1
            : this.integer(params.start, 0);
        const visible = [];
        const sequences: number[] = [];

        for (const row of rows)
        {
            if (this.repository.access && !(await this.repository.access.canRead(owner, row)))
            {
                continue;
            }

            sequences.push(row.sequenceId);

            if (row.sequenceId < start)
            {
                continue;
            }

            visible.push(
                room
                    ? nativePrivateMessage(
                        row,
                        room,
                        await this.repository.getPlayerStateById(row.senderUid),
                    )
                    : await frame(row),
            );
        }

        return {
            id: room ? room.id.replace(/^private_/, "") : String(params.id ?? "0"),
            type,
            ...(room ? { founder: room.founder, roomName: room.name } : {}),
            ...(latest
                ? {
                    firstSeqId: sequences.length ? String(Math.min(...sequences)) : "-1",
                    lastSeqId: sequences.length ? String(Math.max(...sequences)) : "-1",
                }
                : {}),
            msg: visible,
        };
    }
}
