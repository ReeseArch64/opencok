import { test, expect } from "bun:test";
import { publishWorldScoutMail } from "@opencok/services/world-scout-publication";
import type { Row } from "@opencok/contracts/rows";
import type { WorldScoutMailReader } from "@opencok/contracts/world-scout-publication";
import { encode, sfs, type Fields } from "@opencok/messages/sfs";
const uid = "a".repeat(32) + "00";
const payload = (recipient = "other") =>
    encode({
        owner: sfs.string(recipient),
        mail: sfs.object({
            uid: sfs.string(uid),
            title: sfs.string("forged"),
            type: sfs.int(99),
            rewardId: sfs.string("loot"),
            fromUid: sfs.string("impostor"),
        }),
    });
const row = (change: Row = {}): Row => ({
    uid,
    toUser: "other",
    fromUser: "owner",
    fromName: "Saved name",
    title: "1",
    type: 6,
    itemIdFlag: 0,
    rewardId: null,
    rewardStatus: 1,
    contents: Buffer.from("Attacker|1|1204"),
    createTime: 1000n,
    ...change,
});
const read = (mail?: Row, realm = 1): WorldScoutMailReader => async () => ({
    kingdomId: 1,
    realm,
    mail,
});
test("scout notifications reconstruct recipient headers from persisted mail instead of payload headers", async () => {
    const sent: { recipient: string; command: string; body: Fields; }[] = [];
    const publish = async (recipient: string, command: string, body: Fields) => {
        sent.push({ recipient, command, body });
    };
    await publishWorldScoutMail(payload(), "owner", read(row()), publish);
    await publishWorldScoutMail(
        payload("owner"),
        "owner",
        read(
            row({
                toUser: "owner",
                fromUser: null,
                type: 8,
                title: "",
                contents: Buffer.from("{}"),
            }),
        ),
        publish,
    );
    expect(sent.map((item) => [item.recipient, item.command])).toEqual([
        ["other", "push.mail"],
        ["owner", "push.mail"],
    ]);
    expect(sent[0]!.body.title!.value).toBe("1");
    expect(sent[0]!.body.type!.value).toBe(6);
    expect(sent[0]!.body.rewardId!.value).toBe("");
    expect(sent[0]!.body.fromUid!.value).toBe("owner");
    expect(sent[0]!.body.fromName!.value).toBe("Saved name");
    expect(sent[0]!.body.createTime!.value).toBe(1000n);
    expect(sent[0]!.body.contents).toBeUndefined();
});
test("scout publication rejects wrong owner, foreign realm, unrelated mail, loot and impersonation", async () => {
    let count = 0;
    const publish = async () => {
        count++;
    };
    for (
        const invalid of [
            row({ uid: "b".repeat(32) + "00" }),
            row({ toUser: "wrong" }),
            row({ type: 9 }),
            row({ rewardId: "goods,1,1" }),
            row({ rewardStatus: 0 }),
            row({ fromUser: "impostor" }),
            row({ fromUser: null }),
            row({ title: "2" }),
            row({ contents: Buffer.from("not a scout notice") }),
            row({ type: 8, fromUser: null }),
        ]
    )
    {
        await expect(
            publishWorldScoutMail(payload(), "owner", read(invalid), publish),
        ).rejects.toThrow();
    }
    await expect(
        publishWorldScoutMail(payload(), "owner", read(row(), 2), publish),
    ).rejects.toThrow();
    await expect(
        publishWorldScoutMail(payload("owner"), "owner", read(row({ toUser: "owner" })), publish),
    ).rejects.toThrow();
    expect(count).toBe(0);
});
test("only exact Source blank-sender protection templates can publish type two and six notices", async () => {
    const cases = [
        ["owner", 2, "114102", "105522", "114005"],
        ["other", 2, "105523", "105522", "105554|Attacker"],
        ["owner", 6, "114163", "105519", "114164|Defender"],
        ["owner", 6, "114102", "105522", "114162|Defender"],
        ["owner", 6, "114102", "105522", "164142|Defender"],
        ["other", 6, "105523", "105522", "105554|Attacker"],
    ] as const;
    let count = 0;
    const publish = async () => {
        count++;
    };
    for (const [recipient, type, title, fromName, contents] of cases)
    {
        const saved = row({
            toUser: recipient,
            type,
            title,
            fromName,
            fromUser: null,
            itemIdFlag: 1,
            contents: Buffer.from(contents),
        });
        await publishWorldScoutMail(payload(recipient), "owner", read(saved), publish);
        await expect(
            publishWorldScoutMail(
                payload(recipient),
                "owner",
                read({ ...saved, title: "forged" }),
                publish,
            ),
        ).rejects.toThrow();
        await expect(
            publishWorldScoutMail(
                payload(recipient),
                "owner",
                read({ ...saved, contents: Buffer.from("999999|unrelated") }),
                publish,
            ),
        ).rejects.toThrow();
    }
    expect(count).toBe(cases.length);
});
test("removed mail is a no-op while reader failures remain failures", async () => {
    let count = 0;
    await publishWorldScoutMail(payload(), "owner", read(), async () => {
        count++;
    });
    expect(count).toBe(0);
    await expect(
        publishWorldScoutMail(
            payload(),
            "owner",
            async () => {
                throw new Error("recipient is foreign");
            },
            async () => {},
        ),
    ).rejects.toThrow("recipient is foreign");
});
