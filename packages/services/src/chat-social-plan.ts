import { randomUUID } from "node:crypto";
import type {
    ChatSocialOperation,
    ChatSocialTransaction,
    ChatSocialResponse,
    SocialRelation,
    SocialFeed,
} from "@opencok/contracts/chat-social";
import { ChatCommandError } from "@opencok/errors/chat";
import { contactTransition, requireRoomRole } from "@opencok/rules/chat-social";

export async function planChatSocial(
    input: ChatSocialOperation,
    tx: ChatSocialTransaction,
): Promise<ChatSocialResponse>
{
    const { actor, target, now } = tx;

    if (actor.banned || (actor.banUntil ?? 0) > Number(now))
    {
        throw new ChatCommandError("unauthorized");
    }

    if (
        ["chat.private", "chat.room.mk", "chat.room.send", "chat.feed.send"].includes(input.command)
        && !tx.canSend
    )
    {
        throw new ChatCommandError("chat_muted");
    }

    const event = (
        cmd: string,
        data: Record<string, unknown>,
        recipient: string | null = null,
        room = "",
    ) => tx.event(input.owner, cmd, data, recipient, room);
    const relation = (
        owner: string,
        other: string,
        kind: string,
        state: number,
        description = "",
    ): SocialRelation => ({
        owner,
        other,
        kind,
        state,
        description,
        id: other,
        facebookId: null,
        facebookName: null,
        createdAt: now,
    });
    const roomControl = (roomId: string, type: number, members: readonly string[] | string) =>
        tx.append(
            roomId,
            input.owner,
            `${input.operationId}:control:${roomId}`,
            typeof members === "string"
                ? members
                : JSON.stringify(
                    members.map((uid) => ({ uid, name: tx.players.get(uid)?.name ?? uid })),
                ),
            100 + type,
        );
    const feedAccess = (row: SocialFeed) =>
        row.owner === input.owner
        || (row.realm === actor.serverId
            && !!row.alliance
            && row.alliance === actor.allianceId
            && actor.allianceId === actor.membershipAllianceId);

    if (input.command === "chat.room.invitee")
    {
        return { members: tx.invitees };
    }

    if (input.command === "fb.friend.get")
    {
        return { friends: tx.facebookPlayers };
    }

    if (input.command === "fb.friend.favo")
    {
        if (!target?.facebookId || !actor.facebookId || input.owner === input.target)
        {
            throw new ChatCommandError("facebook_binding_required");
        }

        await tx.putRelation({
            ...relation(input.owner, input.target, "facebook", 2),
            facebookId: target.facebookId,
            facebookName: target.name ?? "",
        });

        return { friendUid: input.target, stat: 2 };
    }

    if (input.command.startsWith("contact."))
    {
        if (["contact.get", "contact.get.server.current", "contact.audit"].includes(input.command))
        {
            const contacts = await tx.relations(input.owner, "contact");
            const rows = [
                ...contacts,
                ...(await tx.relations(input.owner, "facebook")).filter(
                    (row) => !contacts.some((contact) => contact.other === row.other),
                ),
            ];
            const selected = input.command === "contact.audit"
                ? rows.filter((row) => row.state === 4)
                : rows;
            const entries = selected.map((row) => ({
                uid: row.owner,
                friendUid: row.other,
                stat: row.state,
                description: row.description,
            }));
            const contactList = selected
                .map((row) => ({
                    uid: row.other,
                    friendUid: row.other,
                    relation: row.state,
                    description: row.description,
                    name: tx.players.get(row.other)?.name ?? row.other,
                    serverId: tx.players.get(row.other)?.serverId ?? 0,
                }))
                .filter(
                    (row) =>
                        input.command !== "contact.get.server.current"
                        || ([1, 2].includes(row.relation) && row.serverId === actor.serverId),
                );

            return {
                contacts: entries,
                contactList,
                ...(input.command === "contact.audit"
                    ? { uid: selected.map((row) => row.other) }
                    : {}),
            };
        }

        if (
            !target || input.owner === input.target || (await tx.blocked(input.owner, input.target))
        )
        {
            throw new ChatCommandError("invalid_contact");
        }

        const rows = await tx.pair(input.owner, input.target);
        const own = rows.find((row) => row.owner === input.owner),
            other = rows.find((row) => row.owner === input.target);

        if (
            input.command === "contact.favo.cancel"
            && !own
            && (await tx.relations(input.owner, "facebook")).some((row) =>
                row.other === input.target
            )
        )
        {
            await tx.removeRelations(input.owner, "facebook", [input.target]);

            return { friendUid: input.target, stat: 0 };
        }

        const states = contactTransition(input.command, own?.state ?? 0, other?.state ?? 0);

        for (const [index, owner] of [input.owner, input.target].entries())
        {
            const friend = owner === input.owner ? input.target : input.owner;
            const old = index === 0 ? own : other;

            if (!states[index])
            {
                await tx.removeRelations(owner, "contact", [friend]);
            }
            else
            {
                await tx.putRelation({
                    ...(old ?? relation(owner, friend, "contact", states[index]!)),
                    state: states[index]!,
                    description: index === 0 && input.command === "contact.desc"
                        ? input.description
                        : (old?.description ?? ""),
                });
            }
        }

        if (input.command === "contact.delete")
        {
            await tx.removeRelations(input.owner, "facebook", [input.target]);
        }

        await event("push.contact", { friendUid: input.owner, stat: states[1] }, input.target);

        return {
            uid: input.owner,
            friendUid: input.target,
            stat: states[0],
            description: input.command === "contact.desc"
                ? input.description
                : (own?.description ?? ""),
        };
    }

    if (input.command === "chat.lock")
    {
        if (!target || input.owner === input.target)
        {
            throw new ChatCommandError("invalid_target");
        }

        if ((await tx.relations(input.owner, "block")).length >= 1000)
        {
            throw new ChatCommandError("block_limit");
        }

        await tx.putRelation(relation(input.owner, input.target, "block", 1));

        return { uuid: input.target, uid: input.target };
    }

    if (input.command === "chat.unlock" || input.command === "chat.unlock.batch")
    {
        const ids = input.command === "chat.unlock" ? [input.target] : input.ids;

        if (!ids.length || ids.length > 100)
        {
            throw new ChatCommandError("invalid_target");
        }

        await tx.removeRelations(input.owner, "block", ids);

        return {};
    }

    if (input.command === "chat.shield.list")
    {
        return {
            list: (await tx.relations(input.owner, "block")).map((row) => ({
                uuid: row.id || row.other,
                owner: row.owner,
                other: row.other,
                time: Number(row.createdAt),
            })),
        };
    }

    if (input.command === "chat.report")
    {
        if (!target || input.owner === input.target || !input.body)
        {
            throw new ChatCommandError("invalid_report");
        }

        return { id: await tx.report(input.owner, input.target, input.body) };
    }

    if (["chat.ban", "chat.unban", "notice.ban", "notice.unban"].includes(input.command))
    {
        if (
            !target
            || !actor.gmFlag
            || actor.moderationAllowed === false
            || input.owner === input.target
            || (target.gmFlag ?? 0) >= actor.gmFlag
        )
        {
            throw new ChatCommandError("moderation_denied");
        }

        const until = input.command.endsWith("unban")
            ? 0n
            : now + BigInt(actor.gmFlag === 5 ? 3_600_000 : input.duration);
        const notice = input.command.startsWith("notice.");
        await tx.moderate(input.target, input.owner, input.body, notice, until);
        await event(
            "push.chat.ban",
            { uid: input.target, until: Number(until), notice },
            input.target,
        );

        return {};
    }

    if (input.command === "chat.private")
    {
        if (
            !target
            || input.owner === input.target
            || !input.body
            || (await tx.blocked(input.owner, input.target))
        )
        {
            throw new ChatCommandError("private_message_denied");
        }

        const id = await tx.direct(
            input.owner,
            input.target,
            input.body,
            actor.serverId,
            target.serverId,
        );

        return { uid: input.target, name: target.name ?? input.target, id, timeLong: Number(now) };
    }

    if (input.command === "chat.message.delete")
    {
        if (!actor.gmFlag || actor.moderationAllowed === false)
        {
            throw new ChatCommandError("moderation_denied");
        }

        await tx.removeMessage(input.sequence);

        return {};
    }

    if (input.command === "chat.feed.send")
    {
        if (
            (!input.body && input.feedType !== 101)
            || input.notices.length > 50
            || input.notices.some((uid) => !/^[a-zA-Z0-9_-]{1,40}$/.test(uid))
        )
        {
            throw new ChatCommandError("invalid_message");
        }

        const alliance = input.feedAuth === "alliance"
                && actor.allianceId
                && actor.membershipAllianceId === actor.allianceId
            ? actor.allianceId
            : "";

        if (input.feedAuth === "alliance" && !alliance)
        {
            throw new ChatCommandError("invalid_room");
        }

        let parent: string | null = null;

        if ([101, 102].includes(input.feedType))
        {
            const original = await tx.feed(input.feedId);

            if (!original || original.parent || !feedAccess(original))
            {
                throw new ChatCommandError("feed_permission_denied");
            }

            parent = original.id;
        }

        const id = `${input.owner}${now}${randomUUID().slice(0, 8)}`;
        const body = {
            id,
            time: Number(now),
            type: input.feedType,
            msg: input.body,
            data: input.feedData,
            sender: input.owner,
            fid: parent ?? "",
            status: 1,
            authority: alliance ? { alliance } : { owner: input.owner },
        };
        await tx.putFeed({
            id,
            owner: input.owner,
            realm: actor.serverId,
            alliance,
            parent,
            type: input.feedType,
            body,
            createdAt: now,
            expiresAt: now + 30n * 86_400_000n,
            deletedAt: null,
        });

        for (const uid of new Set(input.notices))
        {
            const state = tx.players.get(uid);

            if (
                !state
                || !alliance
                || state.allianceId !== alliance
                || state.membershipAllianceId !== alliance
                || (await tx.blocked(input.owner, uid))
            )
            {
                continue;
            }

            await tx.feedNotice(uid, id);
            await event("push.chat.feed.notice", { id }, uid);
        }

        return { id, ...(input.localId ? { localid: input.localId } : {}) };
    }

    if (input.command === "chat.feed.del")
    {
        const feed = await tx.feed(input.feedId);

        if (!feed || (feed.owner !== input.owner && !(actor.gmFlag && actor.moderationAllowed)))
        {
            throw new ChatCommandError("feed_permission_denied");
        }

        await tx.removeFeed(feed.id);

        return {};
    }

    if (input.command === "chat.feed.notice.del")
    {
        await tx.removeFeedNotices(input.owner, input.ids);

        return {};
    }

    if (input.command === "chat.feed.get")
    {
        const feed = [];

        for (
            const row of await tx.feeds(
                input.owner,
                actor.serverId,
                actor.allianceId === actor.membershipAllianceId ? (actor.allianceId ?? "") : "",
            )
        )
        {
            if (feedAccess(row) && !(await tx.blocked(input.owner, row.owner)))
            {
                feed.push(row.body);
            }
        }

        return { feed };
    }

    if (input.command === "chat.room.mk")
    {
        const members = [...new Set([input.owner, ...input.members])];

        if (
            members.length < 2 || members.length > 50 || members.some((uid) => !tx.players.get(uid))
        )
        {
            throw new ChatCommandError("invalid_room");
        }

        if ((await tx.myRooms(input.owner)).length >= 50)
        {
            throw new ChatCommandError("room_limit");
        }

        for (const uid of members)
        {
            if (await tx.blocked(input.owner, uid))
            {
                throw new ChatCommandError("invalid_member");
            }
        }

        const id = randomUUID(),
            name = input.name || members.join(", ").slice(0, 100),
            roomId = `private_${id}`;
        await tx.putRoom({
            id,
            owner: input.owner,
            name: input.name,
            version: 1,
            createdAt: now,
            deletedAt: null,
        });

        for (const owner of members)
        {
            await tx.putMember({
                room: id,
                owner,
                role: owner === input.owner ? 2 : 0,
                joinedAt: now,
                leftAt: null,
                readSequence: 0n,
            });
        }

        const result = { id: roomId, roomId, name, members };
        await roomControl(roomId, 0, members);

        for (const uid of members)
        {
            await event("push.chat.room.invite", result, uid);
        }

        if (input.body)
        {
            await tx.append(roomId, input.owner, input.operationId, input.body);
        }

        return result;
    }

    if (input.command === "chat.room.user.rooms")
    {
        return {
            rooms: (await tx.myRooms(input.owner)).map((row) => ({
                ...row,
                createdAt: Number(row.createdAt),
                deletedAt: row.deletedAt === null ? null : Number(row.deletedAt),
                roomId: `private_${row.id}`,
            })),
        };
    }

    const rooms = input.command === "chat.room.member.quitmult" ? input.ids : [input.room];

    if (!rooms.length || rooms.some((room) => !/^private_[a-f0-9-]{36}$/.test(room)))
    {
        throw new ChatCommandError("invalid_room");
    }

    let result: ChatSocialResponse = {};

    for (const roomId of rooms)
    {
        const id = roomId.slice(8),
            room = await tx.room(id),
            members = await tx.members(id),
            member = members.find((row) => row.owner === input.owner);
        requireRoomRole(member?.role, 0);

        if (!room || !member)
        {
            throw new ChatCommandError("invalid_room");
        }

        if (input.command === "chat.room.members")
        {
            result = {
                members: members.map((row) => ({ uid: row.owner, role: row.role === 2 ? 0 : 1 })),
            };
        }
        else if (input.command === "chat.room.name")
        {
            requireRoomRole(member.role, 2);

            if (!input.name)
            {
                throw new ChatCommandError("invalid_name");
            }

            await tx.putRoom({ ...room, name: input.name, version: room.version + 1 });
            await roomControl(roomId, 5, input.name);
            await event("push.chat.room.name", { roomId, name: input.name }, null, roomId);
        }
        else if (input.command === "chat.room.member.invite")
        {
            requireRoomRole(member.role, 2);
            const additions = input.members.filter((uid) =>
                !members.some((old) => old.owner === uid)
            );

            if (members.length + additions.length > 50)
            {
                throw new ChatCommandError("room_capacity");
            }

            for (const uid of additions)
            {
                if (!tx.players.get(uid) || (await tx.blocked(input.owner, uid)))
                {
                    throw new ChatCommandError("invalid_member");
                }

                if ((await tx.myRooms(uid)).length >= 50)
                {
                    throw new ChatCommandError("room_limit");
                }

                await tx.putMember({
                    room: id,
                    owner: uid,
                    role: 0,
                    joinedAt: now,
                    leftAt: null,
                    readSequence: 0n,
                });
                await event("push.chat.room.invite", { roomId, name: room.name }, uid);
            }

            if (additions.length)
            {
                await roomControl(roomId, 1, additions);
            }
        }
        else if (
            ["chat.room.member.kick", "chat.room.member.quit", "chat.room.member.quitmult"]
                .includes(
                    input.command,
                )
        )
        {
            const leaving = input.command === "chat.room.member.kick"
                ? input.members
                : [input.owner];

            if (input.command === "chat.room.member.kick")
            {
                requireRoomRole(member.role, 2);

                if (leaving.includes(room.owner))
                {
                    throw new ChatCommandError("room_permission_denied");
                }
            }

            for (const row of members)
            {
                if (leaving.includes(row.owner))
                {
                    await tx.putMember({ ...row, leftAt: now });
                }
            }

            if (leaving.includes(room.owner))
            {
                const successor = members.find((row) => !leaving.includes(row.owner));

                if (successor)
                {
                    await tx.putMember({ ...successor, role: 2 });
                    await tx.putRoom({
                        ...room,
                        owner: successor.owner,
                        version: room.version + 1,
                    });
                }
                else
                {
                    await tx.putRoom({ ...room, deletedAt: now, version: room.version + 1 });
                }
            }

            await roomControl(roomId, input.command === "chat.room.member.kick" ? 2 : 3, leaving);

            for (const uid of leaving)
            {
                await event("push.chat.room.quit", { roomId, uid }, uid);
            }
        }
        else if (input.command === "chat.room.send")
        {
            if (!input.body)
            {
                throw new ChatCommandError("invalid_message");
            }

            const saved = await tx.append(roomId, input.owner, input.operationId, input.body);
            result = { roomId, seqId: saved.sequenceId, serverTime: Number(now) };
        }
        else if (input.command === "chat.room.msg")
        {
            const messages = [];

            for (
                const item of await tx.history(roomId, member.joinedAt, input.sequence, input.limit)
            )
            {
                if (
                    [100, 101, 102, 103, 105].includes(item.post ?? 0)
                    || !(await tx.blocked(input.owner, item.senderUid))
                )
                {
                    messages.push({
                        ...item,
                        msg: item.body,
                        seqId: String(item.sequenceId),
                        timeLong: Date.parse(item.createdAt),
                    });
                }
            }

            result = { id: roomId, msg: messages };
        }
        else if (input.command === "chat.set.status")
        {
            await tx.markRead(id, input.owner, input.sequence);
        }
        else
        {
            throw new ChatCommandError("unsupported_command");
        }
    }

    return result;
}
