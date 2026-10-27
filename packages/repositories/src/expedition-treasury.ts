import { and, eq } from "drizzle-orm";
import { kingdom_info } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_info";
import { kingdom_position } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_position";
import { user_expedition_info } from "@opencok/drizzle/schema/opencok_kingdom/user_expedition_info";
import { king_allot_tax_record } from "@opencok/drizzle/schema/opencok_kingdom/king_allot_tax_record";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import {
  treasuryAssets,
  type ExpeditionTreasuryExecutor,
} from "@opencok/contracts/expedition-treasury";
import { long, text } from "@opencok/contracts/rows";
import { decode, str } from "@opencok/messages/sfs";
import { createMutationExecutor } from "./mutation";
import { insertSystemMail } from "./system-mail";
import type { RealmAuthority } from "./realm-authority";
import type { Database } from "./game";

export function createExpeditionTreasuryExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  now = Date.now,
): ExpeditionTreasuryExecutor {
  const account = `kingdom:${authority.kingdomId}:treasury`;
  const execute = createMutationExecutor(db, authority, now, new Set([account]));

  return (command, plan) =>
    execute(command, async (tx) => {
      const [profile] = await tx
        .select()
        .from(userprofile)
        .where(eq(userprofile.uid, command.owner));

      if (!profile) {throw new Error("Missing treasury operator");}

      const params = decode(Buffer.from(command.request)),
        uid = str(params, "uid", "");
      const [target] = uid
        ? await tx.select().from(userprofile).where(eq(userprofile.uid, uid))
        : [];

      if (uid && (!command.participants?.includes(uid) || target?.serverId !== authority.kingdomId))
        {throw new Error("Unowned treasury recipient");}

      const kings = await tx
        .select()
        .from(kingdom_position)
        .where(
          and(
            eq(kingdom_position.serverId, authority.kingdomId),
            eq(kingdom_position.positionId, "216000"),
            eq(kingdom_position.isSmall, 0),
          ),
        )
        .limit(2)
        .for("share");

      if (kings.length > 1) {throw new Error("Ambiguous current king");}

      const [treasury] = await tx
        .select()
        .from(kingdom_info)
        .where(eq(kingdom_info.serverId, authority.kingdomId))
        .for("update");
      const [received] = uid
        ? await tx
            .select()
            .from(user_expedition_info)
            .where(eq(user_expedition_info.uid, uid))
            .for("update")
        : [];
      const captured = BigInt(now());
      const result = await plan({
        now: captured,
        profile,
        target,
        treasury,
        king: kings[0],
        received,
      });
      const postings = [];

      if (result.balances) {
        if (
          command.command !== "expedition.king.present" ||
          !treasury ||
          !result.record ||
          !result.mail ||
          !target ||
          !result.received
        )
          {throw new Error("Incomplete treasury transfer");}

        for (const asset of treasuryAssets) {
          const before = long(treasury, asset),
            after = result.balances[asset];

          if (after < 0n || after > before || before - after !== long(result.record, asset))
            {throw new Error("Invalid treasury debit");}

          if (before !== after)
            {postings.push({
              account,
              asset: `resource.${asset}`,
              before,
              after,
              reason: command.command,
            });}
        }

        await tx
          .update(kingdom_info)
          .set(result.balances)
          .where(eq(kingdom_info.serverId, authority.kingdomId));
        const record = result.record;

        if (
          record.kingUid !== command.owner ||
          record.toUid !== uid ||
          long(record, "sendTime") !== captured
        )
          {throw new Error("Invalid treasury history");}

        await tx.insert(king_allot_tax_record).values({
          uuid: text(record, "uuid"),
          kingUid: command.owner,
          kingName: text(record, "kingName"),
          toUid: uid,
          toUserName: text(record, "toUserName"),
          sendTime: captured,
          wood: long(record, "wood"),
          food: long(record, "food"),
          iron: long(record, "iron"),
          stone: long(record, "stone"),
        });
        await insertSystemMail(tx, result.mail, uid, result.mail.uid.slice(0, 32), captured);
      } else if (result.mail || result.record) {throw new Error("Unfunded treasury award");}

      if (result.received) {
        if (!target || result.received.uid !== uid || !command.participants?.includes(uid))
          {throw new Error("Foreign treasury counter");}

        const value = {
          uid,
          recieveResource: long(result.received, "recieveResource"),
          lastClearTime: long(result.received, "lastClearTime"),
        };

        if (
          value.recieveResource < 0n ||
          value.lastClearTime < 0n ||
          value.lastClearTime > captured
        )
          {throw new Error("Invalid treasury counter");}

        await tx
          .insert(user_expedition_info)
          .values(value)
          .onConflictDoUpdate({
            target: user_expedition_info.uid,
            set: { recieveResource: value.recieveResource, lastClearTime: value.lastClearTime },
          });
      }

      return { response: result.response, events: result.events, postings };
    });
}
