import { expect, test } from "bun:test";
import type { GameServices } from "@opencok/contracts/game";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import type { SavedResourceArmy } from "@opencok/messages/world-resource-army";
import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import { readResourceRawArmyLoad } from "@opencok/services/world-resource-army-load";
import { Rules } from "@opencok/rules/game";
import vectors from "./fixtures/world-resource-army-vectors.json";

function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("effect", { k1: "78;10" });
    rules.arms.set("troop", { load: "10" });
    const owner: WorldResourceOwnerSnapshot = {
        effects: {
            profile: {
                uid: "owner",
                level: 1,
                civilizationType: 0,
                appVersion: null,
                decomposeSuitEffect: null,
            },
            generals: [],
            sciences: [],
            civilizationSciences: [],
            sagaSciences: [],
            foreignSciences: [],
            equipment: [],
            heroes: [],
            dragons: [],
            dragonSkills: [],
            states: [],
            vip: undefined,
            allianceSciences: [],
            prestige: [],
            military: undefined,
            miracle: undefined,
            office: undefined,
            kingdomFights: [],
            territoryTrees: [],
            luckyDay: undefined,
            powerServer: undefined,
            throneRewards: [],
        },
        buildings: [],
        newGenerals: { moved: false, generals: [], statuses: [], equipment: [], offices: [] },
    };
    const army: SavedResourceArmy = {
        owner: "owner",
        cachedLoad: 0,
        soldiers: [{ owner: "unused", armsId: "troop", total: 10, dead: 0, loadEffect: 0 }],
    };
    const state = { reads: 0, failAt: 0, ticks: 0 };
    const realms: number[] = [];
    const services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage"> =
        {
            worldPowerEffects: async (realm) => {
                realms.push(realm!);
                state.reads++;
                if (state.failAt === state.reads)
                {
                    throw new Error("Synthetic owner modifier failure");
                }
                return new Map([["78", JSON.stringify({ value: String(state.reads * 10) })]]);
            },
        };
    const identity = { ownerUid: "owner", residentOwner: false };
    const resolve = (snapshot: WorldResourceOwnerSnapshot | undefined = owner, input = army) =>
        readResourceRawArmyLoad(
            input,
            identity,
            snapshot,
            rules,
            { kingdomId: 2, now: 1000 },
            services,
            () => {
                state.ticks++;
                return 1000n;
            },
        );
    const withoutOwner = () =>
        readResourceRawArmyLoad(
            army,
            identity,
            undefined,
            rules,
            { kingdomId: 2, now: 1000 },
            services,
            () => 1000n,
        );
    return { rules, owner, army, state, realms, services, identity, resolve, withoutOwner };
}

test("decoded saved armies reach the cached branch before unused troop or owner data", async () => {
    const f = fixture();
    const decoded = decodeWorldResourceArmy(Buffer.from(vectors.arrayList, "base64"))!;
    Object.defineProperty(decoded, "soldiers", {
        get()
        {
            throw new Error("Unused troops");
        },
    });
    Object.defineProperty(f.owner, "effects", {
        get()
        {
            throw new Error("Unused owner");
        },
    });
    expect(await f.resolve(f.owner, decoded)).toBe(123);
    expect(f.state.reads).toBe(0);
    expect(f.state.ticks).toBe(0);
});

test("resident armies ignore saved positive load and resolve current effects for each applicable troop in order", async () => {
    const f = fixture();
    f.identity.residentOwner = true;
    f.army.cachedLoad = 777;
    f.army.soldiers!.push({ ...f.army.soldiers![0]! });
    const before = structuredClone({ army: f.army, owner: f.owner });
    expect(await f.resolve()).toBe(250);
    expect(f.state.reads).toBe(2);
    expect(f.realms).toEqual([2, 2]);
    expect({ army: f.army, owner: f.owner }).toEqual(before);
});

test("nonpositive saved load falls back to available owner effects without equating database presence with residency", async () => {
    for (const cached of [0, -1, -2147483648])
    {
        const f = fixture();
        f.army.cachedLoad = cached;
        expect(await f.resolve()).toBe(120);
        expect(f.state.reads).toBe(1);
    }
    const f = fixture();
    f.army.cachedLoad = 1;
    expect(await f.resolve()).toBe(1);
    expect(f.state.reads).toBe(0);
});

test("absent fallback owners retain saved troop modifiers while missing required resident-owner state rejects", async () => {
    const f = fixture();
    f.army.soldiers![0]!.loadEffect = 10;
    expect(await f.withoutOwner()).toBe(110);
    expect(f.state.reads).toBe(0);
    f.identity.residentOwner = true;
    await expect(f.withoutOwner()).rejects.toThrow("102192");
    f.army.soldiers = [];
    expect(await f.withoutOwner()).toBe(0);
});

test("troops without a load field skip counts, saved effects and owner dependencies; invalid catalogs fail before owner reads", async () => {
    const f = fixture();
    f.identity.residentOwner = true;
    f.rules.arms.set("troop", {});
    const soldier = f.army.soldiers![0]!;
    for (const key of ["owner", "total", "dead", "loadEffect"])
    {
        Object.defineProperty(soldier, key, {
            get()
            {
                throw new Error("Unused troop field");
            },
        });
    }
    Object.defineProperty(f.owner, "effects", {
        get()
        {
            throw new Error("Unused owner");
        },
    });
    expect(await f.resolve()).toBe(0);
    f.rules.arms.delete("troop");
    await expect(f.resolve()).rejects.toThrow("102192");
    for (const load of ["bad", "2147483648", "1 "])
    {
        f.rules.arms.set("troop", { load });
        await expect(f.resolve()).rejects.toThrow("102192");
    }
    expect(f.state.reads).toBe(0);
});

test("decoded root ownership must match the march before cached returns; unused soldier ownership does not redirect effects", async () => {
    const f = fixture();
    f.army.cachedLoad = 123;
    for (const uid of ["other", "", "\u2000", "a".repeat(41), "\0", "\ud800"])
    {
        f.identity.ownerUid = uid;
        await expect(f.resolve()).rejects.toThrow("102192");
    }
    f.identity.ownerUid = "owner";
    for (const uid of ["other", null])
    {
        f.army.owner = uid;
        await expect(f.resolve()).rejects.toThrow("102192");
    }
    f.army.owner = "owner";
    f.army.cachedLoad = 0;
    f.owner.effects.profile.uid = "other";
    await expect(f.resolve()).rejects.toThrow("102192");
    expect(f.state.reads).toBe(0);
    f.owner.effects.profile.uid = "owner";
    Object.defineProperty(f.army.soldiers![0]!, "owner", {
        get()
        {
            throw new Error("Unused soldier owner");
        },
    });
    expect(await f.resolve()).toBe(120);
});

test("structural and width failures reject without manufacturing an empty army or reading owner effects", async () => {
    const f = fixture();
    await expect(
        readResourceRawArmyLoad(
            null,
            f.identity,
            f.owner,
            f.rules,
            { kingdomId: 2, now: 1000 },
            f.services,
            () => 1000n,
        ),
    ).rejects.toThrow("102192");
    for (const cached of [NaN, 0.5, Infinity, 2147483648, -2147483649])
    {
        f.army.cachedLoad = cached;
        await expect(f.resolve()).rejects.toThrow("102192");
    }
    f.army.cachedLoad = 0;
    f.army.soldiers = null;
    await expect(f.resolve()).rejects.toThrow("102192");
    f.army.cachedLoad = 123;
    expect(await f.resolve()).toBe(123);
    f.army.cachedLoad = 0;
    f.army.soldiers = Array(4097).fill({
        owner: null,
        armsId: "troop",
        total: 1,
        dead: 0,
        loadEffect: 0,
    });
    await expect(f.resolve()).rejects.toThrow("102192");
    f.army.soldiers = [{ owner: null, armsId: null, total: 1, dead: 0, loadEffect: 0 }];
    await expect(f.resolve()).rejects.toThrow("102192");
    expect(f.state.reads).toBe(0);
});

test("later modifier failures abort the result without persisting a partial load or consuming later troops", async () => {
    const f = fixture();
    f.state.failAt = 2;
    f.army.soldiers = Array.from({ length: 3 }, () => ({ ...f.army.soldiers![0]! }));
    const before = structuredClone(f.army);
    await expect(f.resolve()).rejects.toThrow("Synthetic owner modifier failure");
    expect(f.state.reads).toBe(2);
    expect(f.army).toEqual(before);
});

test("decoded signed troop arithmetic wraps through the controller without recalculating saved load effects", async () => {
    const f = fixture();
    const decoded = decodeWorldResourceArmy(Buffer.from(vectors.arrayList, "base64"))!;
    decoded.cachedLoad = 0;
    decoded.soldiers = decoded.soldiers!.slice(0, 2);
    f.rules.arms.set("100001", { load: "1" });
    const before = structuredClone(decoded);
    expect(
        await readResourceRawArmyLoad(
            decoded,
            f.identity,
            undefined,
            f.rules,
            { kingdomId: 2, now: 1000 },
            f.services,
            () => 1000n,
        ),
    ).toBe(858993472);
    expect(decoded).toEqual(before);
    expect(f.state.reads).toBe(0);
});
