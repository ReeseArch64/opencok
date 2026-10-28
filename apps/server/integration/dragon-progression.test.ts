import { dragonTalentsDomain } from "@opencok/services/dragon-talents";
import { dragon_talent_skill } from "@opencok/drizzle/schema/opencok_kingdom/dragon_talent_skill";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { user_pet_dragon_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon_skill";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { dragonProgressionDomain } from "@opencok/services/dragon-progression";
import { sfs, fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test(
    "dragon incubation, feeding, levels, skills and travel persist atomically across retries and recovery",
    async () => {
        const h = await cityHarness([dragonProgressionDomain, dragonTalentsDomain]);
        try
        {
            for (
                const key of [
                    "dragon_new",
                    "dragon_levelup",
                    "dragon_skill",
                    "dragon_skill_levelup",
                    "dragon_skill_learn",
                    "dragon_friendship",
                    "dragon_travel",
                    "dragon_nickname",
                ]
            )
            {
                h.rules.features.set(key, {
                    id: key,
                    version: "1.0.0",
                    online: "all",
                    test: "all",
                });
            }
            await h.db.db.insert(user_pet_dragon).values({
                uuid: "dragon",
                uid: "owner",
                itemId: 109000,
                dragonState: 0,
                lv: 1,
                gainEggTime: 1000000n,
            });
            const request = { petDragonUid: sfs.string("dragon") };
            const command = (name: string, extra = {}) =>
                h.command(name, { ...request, ...extra, operationId: sfs.string(randomUUID()) });
            await expect(
                command("petdragon.getinfo", { petDragonUid: sfs.string("foreign") }),
            ).rejects.toThrow();
            await command("petdragon.startincubate");
            await expect(command("petdragon.incubate")).rejects.toThrow();
            h.clock.now += 3600000;
            const hatch = { ...request, operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("petdragon.incubate", hatch)),
            );
            const saved = async () =>
                (await h.db.db.select().from(user_pet_dragon).where(
                    eq(user_pet_dragon.uuid, "dragon"),
                ))[0]!;
            expect((await saved()).dragonState).toBe(3);
            expect((await saved()).useFlag).toBe(1);
            await command("petdragon.eat.exp", { eatExpType: sfs.int(0), count: sfs.int(20) });
            expect((await saved()).exp).toBeGreaterThanOrEqual(2000);
            await h.db.db
                .insert(user_item)
                .values({
                    uuid: "stones",
                    ownerId: "owner",
                    itemId: "210488",
                    count: 10,
                    value: 0,
                });
            const upgrade = { ...request, operationId: sfs.string(randomUUID()) };
            await Promise.all(
                Array.from({ length: 3 }, () => h.command("petdragon.level.up", upgrade)),
            );
            expect((await saved()).lv).toBe(2);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "stones")))[0]!
                    .count,
            ).toBe(8);
            await command("petdragon.modify.nickName", { nickName: sfs.string("Aster") });
            expect((await saved()).nickName).toBe("Aster");
            await command("petdragon.travel", { travelType: sfs.int(1) });
            await expect(command("petdragon.travel.take.reward")).rejects.toThrow();
            h.clock.now += 7200000;
            const recovered = await command("petdragon.getinfo");
            expect(fields(recovered.body.travelInfo).travelState!.value).toBe(2);
            const reward = { ...request, operationId: sfs.string(randomUUID()) };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("petdragon.travel.take.reward", reward)),
            );
            expect(replies[0]!.body.awardItems).toBeDefined();
            expect(JSON.parse((await saved()).travelData!).travelState).toBe(0);
            await expect(command("petdragon.travel.take.reward")).rejects.toThrow();
            const skillIds = [...(h.rules.power.dragonSkills?.values() ?? [])]
                .filter((row) => !row.born_dragon && Number(row.maxLv) > 1 && row.type === "1")
                .slice(0, 2);
            expect(skillIds.length).toBe(2);
            for (const [index, rule] of skillIds.entries())
            {
                await h.db.db.insert(user_pet_dragon_skill).values({
                    uuid: `skill${index}`,
                    uid: "owner",
                    skillId: rule.id!,
                    level: 1,
                    exp: 0,
                    totalExp: index === 0 ? 0 : 100000,
                    ownerId: 0,
                    index1: -1,
                    strengthenLevel: 0,
                });
            }
            const skillRequest = {
                uuid: sfs.string("skill0"),
                materialArr: sfs.array([sfs.string("skill1")]),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(
                Array.from({ length: 3 }, () => h.command("petdragon.upgrade.skill", skillRequest)),
            );
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_pet_dragon_skill)
                        .where(eq(user_pet_dragon_skill.uuid, "skill1"))
                ).length,
            ).toBe(0);
            const consumed = await h.db.db
                .select()
                .from(user_pet_dragon_skill)
                .where(eq(user_pet_dragon_skill.uuid, "skill0"));
            expect(consumed[0]!.level).toBeGreaterThan(1);
            h.rules.features.set("dragon_talentskill", {
                id: "dragon_talentskill",
                version: "1.0.0",
                online: "all",
                test: "all",
            });
            await h.db.db.insert(user_item).values({
                uuid: "talent-material",
                ownerId: "owner",
                itemId: "211320",
                count: 200,
                value: 0,
            });
            const unlock = {
                M__REQUEST_ID__H: sfs.string("unlock"),
                id: sfs.string("109000"),
                skillId: sfs.string("4906142"),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(Array.from({ length: 3 }, () => h.command("dragonskill", unlock)));
            expect(
                (await h.db.db.select().from(user_item).where(
                    eq(user_item.uuid, "talent-material"),
                ))[0]!
                    .count,
            ).toBe(100);
            await expect(
                h.command("dragonskill", { ...unlock, operationId: sfs.string(randomUUID()) }),
            ).rejects.toThrow();
            await h.command("dragonskill", {
                ...unlock,
                M__REQUEST_ID__H: sfs.string("use"),
                operationId: sfs.string(randomUUID()),
            });
            const [talent] = await h.db.db
                .select()
                .from(dragon_talent_skill)
                .where(eq(dragon_talent_skill.uid, "owner"));
            expect(talent!.actTime).toBe(BigInt(h.clock.now) + 7200000n);
            expect(talent!.endTime).toBe(BigInt(h.clock.now) + 3600000n);
            await expect(
                h.command("dragonskill", {
                    ...unlock,
                    M__REQUEST_ID__H: sfs.string("use"),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "dragon skill strengthening precedes ordinary materials and discards capped experience",
    async () => {
        const h = await cityHarness([dragonProgressionDomain]);
        try
        {
            for (const id of ["dragon_new", "dragon_skill", "dragon_skill_levelup"])
            {
                h.rules.features.set(id, { id, version: "1.0.0", online: "all", test: "all" });
            }
            const skill = {
                id: "synthetic-target",
                type: "1",
                quality: "999",
                maxLv: "2",
                boost_level: "2",
                boost_condition: "synthetic-booster",
            };
            h.rules.power.dragonSkills!.set(skill.id, skill);
            h.rules.power.dragonSkills!.set("synthetic-booster", {
                ...skill,
                id: "synthetic-booster",
            });
            for (let level = 1; level <= 4; level++)
            {
                h.rules.advanced.dragonSkillExp!.set(`synthetic-${level}`, {
                    id: `synthetic-${level}`,
                    quality: "999",
                    level: String(level),
                    exp: "100",
                });
            }
            for (const owner of ["owner", "other"])
            {
                for (const id of ["target", "ordinary", "boost1", "boost2"])
                {
                    await h.db.db.insert(user_pet_dragon_skill).values({
                        uuid: `${owner}-${id}`,
                        uid: owner,
                        skillId: id.startsWith("boost") ? "synthetic-booster" : skill.id,
                        level: id === "target" ? 2 : 1,
                        exp: 0,
                        totalExp: id === "target" ? 100 : 1000,
                        ownerId: 0,
                        index1: -1,
                        strengthenLevel: 0,
                    });
                }
            }
            const upgrade = (owner: string, order: string[]) => ({
                uuid: sfs.string(`${owner}-target`),
                materialArr: sfs.array(order.map((id) => sfs.string(`${owner}-${id}`))),
                operationId: sfs.string(randomUUID()),
            });
            await expect(
                h.command("petdragon.upgrade.skill", upgrade("owner", ["ordinary"])),
            ).rejects.toThrow();
            const request = upgrade("owner", ["ordinary", "boost1", "boost2"]);
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("petdragon.upgrade.skill", request)),
            );
            await h.command(
                "petdragon.upgrade.skill",
                upgrade("other", ["boost1", "boost2", "ordinary"]),
                "other",
            );
            const all = await h.db.db.select().from(user_pet_dragon_skill);
            for (const owner of ["owner", "other"])
            {
                const target = all.find((row) => row.uuid === `${owner}-target`)!;
                expect(target.level).toBe(4);
                expect(target.strengthenLevel).toBe(2);
                expect(target.exp).toBe(99);
                expect(target.totalExp).toBe(399);
                expect(all.find((row) => row.uuid === `${owner}-ordinary`)!.totalExp).toBe(1000);
                expect(all.some((row) => row.uuid === `${owner}-boost1`)).toBe(false);
                expect(all.some((row) => row.uuid === `${owner}-boost2`)).toBe(false);
            }
            await expect(
                h.command("petdragon.upgrade.skill", upgrade("owner", ["ordinary"])),
            ).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
