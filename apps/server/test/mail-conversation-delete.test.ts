import { expect, test } from "bun:test";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import type {
    MailConversationDeleteQuery,
    MailConversationReadQuery,
} from "@opencok/contracts/mail";
import { sfs } from "@opencok/messages/sfs";
const now = 1000;
function app(enabled = true)
{
    const deleted: MailConversationDeleteQuery[] = [],
        read: MailConversationReadQuery[] = [];
    const profile = { uid: "self", serverId: 1, banFlag: 0 };
    const game = new Game(
        {
            mailConversationDelete: async (uid: string, query: MailConversationDeleteQuery) => {
                expect(uid).toBe("self");
                deleted.push(query);
                return { profile };
            },
            mailConversationRead: async (uid: string, query: MailConversationReadQuery) => {
                expect(uid).toBe("self");
                read.push(query);
                return { profile };
            },
        } as unknown as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => now,
        { mailChatEnabled: enabled },
    );
    return { game, deleted, read, profile };
}
test("sender deletion binds owner and keeps sender-over-type and null semantics", async () => {
    const { game, deleted } = app();
    expect(
        (
            await game.execute("self", "chatMail.delete", {
                fromUser: sfs.null(),
                type: sfs.string("ignored"),
                mod: sfs.int(1),
                _cok_: sfs.int(9),
            })
        ).body,
    ).toEqual({ success: sfs.bool(true), _cok_: sfs.int(9) });
    expect(deleted).toEqual([{ now, senders: [null], moderation: true, bottle: false }]);
});
test("batch deletion preserves Java trailing-empty splitting and bottle/mail versus moderator/chat precedence", async () => {
    const { game, deleted } = app();
    await game.execute("self", "chatMail.delete.batch", {
        users: sfs.string("a,,b,,"),
        mod: sfs.int(1),
        driftingBottle: sfs.int(1),
    });
    expect(deleted[0]).toEqual({ now, senders: ["a", "", "b"], moderation: true, bottle: true });
    await game.execute("self", "chatMail.delete.batch", { users: sfs.string("") });
    expect(deleted[1]?.senders).toEqual([""]);
    await game.execute("self", "chatMail.delete.batch", { users: sfs.string(",,,") });
    expect(deleted[2]?.senders).toEqual([]);
});
test("chat-dependent reads become available only with configured durable delivery", async () => {
    const { game, read } = app();
    await game.execute("self", "chatMail.read", {
        fromUser: sfs.string("peer"),
        driftingBottle: sfs.int(1),
    });
    expect(read[0]?.effects).toEqual([
        { kind: "mail", fromUser: "peer", types: [43, 44], unreadOnly: false },
        { kind: "chat", others: "peer", types: ["3"] },
    ]);
    const unavailable = app(false);
    await expect(
        unavailable.game.execute("self", "chatMail.read", { fromUser: sfs.string("peer") }),
    ).rejects.toThrow();
    await expect(
        unavailable.game.execute("self", "chatMail.delete.batch", { users: sfs.string("peer") }),
    ).rejects.toThrow();
    expect(unavailable.read).toEqual([]);
    expect(unavailable.deleted).toEqual([]);
});
test("oversized or malformed conversation selections reject before mutation", async () => {
    const { game, deleted } = app();
    for (const users of ["x".repeat(41), "x\0", Array(1001).fill("a").join(","), "\ud800"])
    {
        await expect(
            game.execute("self", "chatMail.delete.batch", { users: sfs.string(users) }),
        ).rejects.toThrow();
    }
    await expect(
        game.execute("self", "chatMail.delete.batch", { users: sfs.int(1) }),
    ).rejects.toThrow();
    expect(deleted).toEqual([]);
});
