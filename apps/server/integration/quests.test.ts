import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { questsDomain } from "@opencok/services/quests";
import { user_14day_login } from "@opencok/drizzle/schema/opencok_kingdom/user_14day_login";
import { user_story_task } from "@opencok/drizzle/schema/opencok_kingdom/user_story_task";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { sfs } from "@opencok/messages/sfs";

test("quest claims are durable, concurrent, replayable, and isolated by owner", async () => {
  const h = await cityHarness([questsDomain]);
  try {
    await h.command("signIn.info", {});
    const operationId = sfs.string(randomUUID());
    const results = await Promise.allSettled([
      h.command("signIn.reward", { operationId }),
      h.command("signIn.reward", { operationId: sfs.string(randomUUID()) }),
    ]);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    const [record] = await h.db.db
      .select()
      .from(user_14day_login)
      .where(eq(user_14day_login.uid, "owner"));
    expect(record?.day).toBe(1);
    await expect(h.command("signIn.reward", {})).rejects.toThrow();
    h.clock.now = 86400000 + 1000000;
    await h.command("signIn.reward", {});
    expect(
      (await h.db.db.select().from(user_14day_login).where(eq(user_14day_login.uid, "owner")))[0]
        ?.day,
    ).toBe(2);
    expect(
      await h.db.db.select().from(user_14day_login).where(eq(user_14day_login.uid, "other")),
    ).toHaveLength(0);
    const tasks = await h.db.db.select().from(user_task).where(eq(user_task.uid, "owner"));
    expect(tasks.length).toBeGreaterThan(0);
    const story = await h.db.db
      .select()
      .from(user_story_task)
      .where(eq(user_story_task.uid, "owner"));
    expect(story).toHaveLength(57);
    await expect(h.command("story.task.reward", { id: sfs.int(2906530) })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 60000);
