import { expect, test } from "bun:test";
import { ProfilePictureDomain } from "../src/services/profile-picture";
import type { ProfilePictureContext } from "../src/contracts/profile-picture";
import { decode, sfs } from "@opencok/messages/sfs";

function fixture(gold = 1000n, tokens = 0)
{
    const debits: bigint[] = [];
    const spent: string[] = [];
    const context: ProfilePictureContext = {
        owner: "owner",
        rules: {
            kingdomId: 1,
            profile: {
                lordImages: new Map([["53300", { id: "53300", name: "g044", value: "400" }]]),
            },
        },
        state: { profile: { uid: "owner", serverId: 1, pic: "g041", picVer: 0 } },
        write: {},
        economy: {
            gold: (delta) => {
                debits.push(delta);
                gold += delta;
            },
            balance: () => gold,
            quantity: () => tokens,
            item: (id, delta) => {
                spent.push(id);
                tokens += delta;
            },
            resource: () => {
                throw new Error("Unexpected resource change");
            },
        },
    };
    return {
        context,
        debits,
        spent,
        domain: new ProfilePictureDomain(),
        params: { pic: sfs.string("g044"), picid: sfs.string("53300") },
    };
}

test("built-in portrait changes persist the selected code and charge the configured gold", async () => {
    const { context, domain, params, debits } = fixture();
    const response = await domain.prepare(context, "pic.change", params);
    expect(context.write.appearance).toEqual({ pic: "g044", picVer: 0 });
    expect(debits).toEqual([-400n]);
    expect(decode(Buffer.from(response.response))).toEqual({
        result: sfs.bool(true),
        gold: sfs.long(600),
        picVer: sfs.int(0),
    });
});

test("portrait changes consume the existing change token before gold", async () => {
    const { context, domain, params, debits, spent } = fixture(0n, 1);
    const response = await domain.prepare(context, "pic.change", params);
    expect(spent).toEqual(["200026"]);
    expect(debits).toEqual([]);
    expect(decode(Buffer.from(response.response)).result).toEqual(sfs.bool(true));
});

test("insufficient portrait funds leave the saved picture and inventory unchanged", async () => {
    const { context, domain, params, debits, spent } = fixture(399n);
    const response = await domain.prepare(context, "pic.change", params);
    expect(decode(Buffer.from(response.response)).result).toEqual(sfs.bool(false));
    expect(context.write.appearance).toBeUndefined();
    expect(debits).toEqual([]);
    expect(spent).toEqual([]);
});

test("a portrait code must match its catalog ID even when a change token is owned", async () => {
    const { context, domain, params, debits, spent } = fixture(1000n, 1);
    const response = await domain.prepare(context, "pic.change", {
        ...params,
        pic: sfs.string("unregistered"),
    });
    expect(decode(Buffer.from(response.response)).result).toEqual(sfs.bool(false));
    expect(context.write.appearance).toBeUndefined();
    expect(debits).toEqual([]);
    expect(spent).toEqual([]);
});

test("reselecting the saved portrait does not charge again", async () => {
    const { context, domain, params, debits } = fixture();
    context.state.profile.pic = "g044";
    await domain.prepare(context, "pic.change", params);
    expect(debits).toEqual([]);
});

test.each([[17, 1000017], [1000017, 1000017], [2000017, 2000017]])(
    "portrait version %i preserves the native system-version contract",
    async (previous, expected) => {
        const { context, domain, params } = fixture();
        context.state.profile.picVer = previous;
        await domain.prepare(context, "pic.change", params);
        expect(context.write.appearance!.picVer).toBe(expected);
    },
);

test("a portrait change cannot mutate another owner", async () => {
    const { context, domain, params, debits } = fixture();
    context.state.profile.uid = "other";
    await expect(domain.prepare(context, "pic.change", params)).rejects.toThrow();
    expect(context.write.appearance).toBeUndefined();
    expect(debits).toEqual([]);
});
