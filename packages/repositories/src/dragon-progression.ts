import { dragon_talent_skill } from "@opencok/drizzle/schema/opencok_kingdom/dragon_talent_skill";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { user_pet_dragon_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon_skill";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { num, long, text } from "@opencok/contracts/rows";
import type { DragonProgressionWrite } from "@opencok/contracts/city-progression";
import type { MutationTransaction } from "./mutation";

export async function readDragonProgression(tx: MutationTransaction, owner: string) {
  const dragons = await tx
    .select()
    .from(user_pet_dragon)
    .where(eq(user_pet_dragon.uid, owner))
    .orderBy(asc(user_pet_dragon.uuid))
    .limit(129)
    .for("update");
  const skills = await tx
    .select()
    .from(user_pet_dragon_skill)
    .where(eq(user_pet_dragon_skill.uid, owner))
    .orderBy(asc(user_pet_dragon_skill.uuid))
    .limit(4097)
    .for("update");
  const marches = await tx
    .select({ armyInfo: world_march.armyInfo })
    .from(world_march)
    .where(eq(world_march.ownerUid, owner))
    .limit(257);
  const [switched] = await tx
    .select({ time: mutation_outbox.createdAt })
    .from(mutation_outbox)
    .where(
      and(
        eq(mutation_outbox.ownerUid, owner),
        eq(mutation_outbox.eventType, "petdragon.change.use.flag"),
      ),
    )
    .orderBy(desc(mutation_outbox.createdAt))
    .limit(1);

  if (dragons.length > 128 || skills.length > 4096 || marches.length > 256)
    throw new Error("Dragon aggregate exceeds bound");

  const talents = await tx
    .select()
    .from(dragon_talent_skill)
    .where(eq(dragon_talent_skill.uid, owner))
    .limit(1025);

  if (talents.length > 1024) throw new Error("Dragon talent aggregate exceeds bound");

  return { dragons, skills, marches, talents, switchedAt: switched?.time ?? 0n };
}

export async function writeDragonProgression(
  tx: MutationTransaction,
  owner: string,
  write: DragonProgressionWrite,
) {
  for (const row of write.talents ?? []) {
    if (row.uid !== owner) throw new Error("Foreign dragon talent");

    const value = {
      uid: owner,
      dragonId: num(row, "dragonId"),
      skillId: text(row, "skillId"),
      startTime: long(row, "startTime"),
      actTime: long(row, "actTime"),
      endTime: long(row, "endTime"),
      stat: num(row, "stat"),
      level: num(row, "level"),
      exp: num(row, "exp"),
      totalExp: num(row, "totalExp"),
    };
    await tx
      .insert(dragon_talent_skill)
      .values(value)
      .onConflictDoUpdate({
        target: [
          dragon_talent_skill.uid,
          dragon_talent_skill.dragonId,
          dragon_talent_skill.skillId,
        ],
        set: value,
      });
  }

  for (const row of write.dragons ?? []) {
    if (row.uid !== owner) throw new Error("Foreign dragon write");

    const value = {
      uuid: text(row, "uuid"),
      uid: owner,
      itemId: num(row, "itemId"),
      dragonState: num(row, "dragonState"),
      friendly: num(row, "friendly"),
      clickBubbleTimesForDay: num(row, "clickBubbleTimesForDay"),
      clickBubbleTotalTimes: num(row, "clickBubbleTotalTimes"),
      gainEggTime: long(row, "gainEggTime"),
      clickEggTime: long(row, "clickEggTime"),
      lastClickBubbleTime: long(row, "lastClickBubbleTime"),
      useFlag: num(row, "useFlag"),
      friendShipDecreaseTime: long(row, "friendShipDecreaseTime"),
      travelData: row.travelData == null ? null : text(row, "travelData"),
      communicateData: row.communicateData == null ? null : text(row, "communicateData"),
      exp: num(row, "exp"),
      initFriendShipFlag: num(row, "initFriendShipFlag"),
      lastUpLevelTime: long(row, "lastUpLevelTime"),
      lv: num(row, "lv"),
      nickName: row.nickName == null ? null : text(row, "nickName"),
    };
    const [existing] = await tx
      .select({ uid: user_pet_dragon.uid })
      .from(user_pet_dragon)
      .where(eq(user_pet_dragon.uuid, value.uuid));

    if (existing && existing.uid !== owner) throw new Error("Foreign dragon identity");

    await tx
      .insert(user_pet_dragon)
      .values(value)
      .onConflictDoUpdate({ target: user_pet_dragon.uuid, set: value });
  }

  for (const row of write.skills ?? []) {
    if (row.uid !== owner) throw new Error("Foreign dragon skill write");

    const value = {
      uuid: text(row, "uuid"),
      uid: owner,
      skillId: text(row, "skillId"),
      level: num(row, "level"),
      exp: num(row, "exp"),
      totalExp: num(row, "totalExp"),
      ownerId: num(row, "ownerId"),
      index1: num(row, "index1"),
      strengthenLevel: num(row, "strengthenLevel"),
    };
    const [existing] = await tx
      .select({ uid: user_pet_dragon_skill.uid })
      .from(user_pet_dragon_skill)
      .where(eq(user_pet_dragon_skill.uuid, value.uuid));

    if (existing && existing.uid !== owner) throw new Error("Foreign dragon skill identity");

    await tx
      .insert(user_pet_dragon_skill)
      .values(value)
      .onConflictDoUpdate({ target: user_pet_dragon_skill.uuid, set: value });
  }

  if (write.deletedSkills?.length)
    await tx
      .delete(user_pet_dragon_skill)
      .where(
        and(
          eq(user_pet_dragon_skill.uid, owner),
          inArray(user_pet_dragon_skill.uuid, [...write.deletedSkills]),
        ),
      );
}
