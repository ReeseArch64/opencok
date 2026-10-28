import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { createGoldEggsDomain } from "@opencok/services/gold-eggs";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { createRealmCityProgressionStore } from "../../src/composition/city-persistence.ts";
import { createRealmCityProgressionHandlers } from "../../src/composition/city.ts";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { type RealmAuthority } from "@opencok/repositories/realm-authority";
import type { Rules } from "@opencok/rules/game";
import type { GoldEggsRanks } from "@opencok/contracts/gold-eggs";
import type { Database } from "@opencok/repositories/game";
import { gold_eggs } from "@opencok/drizzle/schema/opencok_kingdom/gold_eggs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./city";
import { configureGoldEggs, goldEggsNow } from "../../test/fixtures/gold-eggs";
import type { MutationTransaction } from "@opencok/repositories/mutation";
export function goldEggsCommands(
    db: Database["kingdom"]["db"],
    authority: RealmAuthority,
    rules: Rules,
    now: () => number,
    random: (maximum: number) => number = () => 0,
    ranks?: GoldEggsRanks,
)
{
    const effects = { world: async () => new Map<number, number>(), emperor: async () => null };
    const handlers = createRealmCityProgressionHandlers(
        (tx, owner, at) =>
            createRealmCityProgressionStore(
                tx as MutationTransaction,
                owner,
                at,
                async (_tx, _owner, _at, change) => change(),
            ),
        [createGoldEggsDomain(random, ranks)],
        rules,
        effects,
    );
    const service = new TimedActivityService(
        createActivityExecutor(
            db,
            authority,
            handlers.domains as ReadonlyMap<number, ActivityDomain>,
            now,
            { command: handlers.command, next: handlers.next, accelerate: handlers.accelerate },
        ),
        rules,
        effects,
    );
    return (command: string, params: Fields = {}, owner = "owner") =>
        service.domainCommand(owner, command, {
            ...params,
            operationId: params.operationId ?? sfs.string(randomUUID()),
        });
}
export async function goldFixture()
{
    let draws = 0;
    const h = await cityHarness([
        createGoldEggsDomain(() => {
            draws++;
            return 0;
        }),
    ]);
    h.clock.now = goldEggsNow;
    configureGoldEggs(h.rules);
    const saved = async (owner = "owner") =>
        (await h.db.db.select().from(gold_eggs).where(eq(gold_eggs.uid, owner)))[0]!;
    const gold = async (owner = "owner") =>
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!.gold;
    const count = async (id = "200001") =>
        (
            await h.db.db
                .select()
                .from(user_item)
                .where(and(eq(user_item.ownerId, "owner"), eq(user_item.itemId, id)))
        )[0]?.count ?? 0;
    const smash = (pos: number, params: Fields = {}) =>
        h.command("goldeggs.smashing", { pos: sfs.int(pos), ...params });
    return { ...h, saved, gold, count, smash, draws: () => draws };
}
