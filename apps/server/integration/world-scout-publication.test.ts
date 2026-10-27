import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { scoutHarness } from "./support/world-scout";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { createWorldScoutMailReader } from "@opencok/repositories/world-scout-publication";
import { publishWorldScoutMail } from "@opencok/services/world-scout-publication";
import { decode, fields, str, type Fields } from "@opencok/messages/sfs";
test("scout outbox publishes actor intel and defender notice through persisted same-realm mail facts", async () => {
  const h = await scoutHarness();
  try {
    await h.scout();
    const [checkpoint] = await h.db.db.select().from(world_march_checkpoint);
    h.clock.now = Number(checkpoint!.dueAt);
    await h.tick();
    const events = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "world.scout.mail"));
    expect(events.length).toBe(2);
    expect(events.every((event) => event.ownerUid === "owner")).toBe(true);
    const reader = createWorldScoutMailReader(h.db.db, 1),
      sent: { owner: string; body: Fields }[] = [];
    for (const event of events)
      {await publishWorldScoutMail(
        event.payload,
        event.ownerUid,
        reader,
        async (owner, command, body) => {
          expect(command).toBe("push.mail");
          sent.push({ owner, body });
        },
      );}
    expect(sent.map((row) => row.owner).sort()).toEqual(["other", "owner"]);
    expect(sent.find((row) => row.owner === "other")!.body.fromUid!.value).toBe("owner");
    expect(sent.find((row) => row.owner === "owner")!.body.type!.value).toBe(8);
    const defenderEvent = events.find((event) => str(decode(event.payload), "owner") === "other")!;
    const defenderUid = str(fields(decode(defenderEvent.payload).mail), "uid");
    await expect(reader("owner", defenderUid)).rejects.toThrow();
    await h.db.db.update(mail).set({ rewardId: "goods,1,1" }).where(eq(mail.uid, defenderUid));
    await expect(
      publishWorldScoutMail(defenderEvent.payload, "owner", reader, async () => {}),
    ).rejects.toThrow();
    await h.db.db.update(mail).set({ rewardId: null }).where(eq(mail.uid, defenderUid));
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "other"));
    await expect(
      publishWorldScoutMail(defenderEvent.payload, "owner", reader, async () => {}),
    ).rejects.toThrow();
    await h.db.db.update(userprofile).set({ serverId: 1 }).where(eq(userprofile.uid, "other"));
    await h.db.db.delete(mail).where(eq(mail.uid, defenderUid));
    await publishWorldScoutMail(defenderEvent.payload, "owner", reader, async () => {
      throw new Error("Deleted mail must not publish");
    });
    expect((await reader("other", defenderUid)).mail).toBeUndefined();
    await expect(reader("missing", defenderUid)).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
