import { mail_gift_log } from "@opencok/drizzle/schema/opencok_global/mail_gift_log";
import { asc } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { mail_gift_opening } from "@opencok/drizzle/schema/opencok_kingdom/mail_gift_opening";
import { mail_chat_read_intent } from "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent";
import type { MailIntegrationBacklog } from "../contracts/integration-worker";
import { MailIntegrationKind } from "../enums/integration-kind";

export async function mailIntegrationBacklog(
    db: DatabaseClient<"kingdom">,
    kind: MailIntegrationKind,
): Promise<MailIntegrationBacklog>
{
    const rows = kind === MailIntegrationKind.Gift
        ? await db.select({ at: mail_gift_opening.openedAt }).from(mail_gift_opening).orderBy(
            asc(mail_gift_opening.openedAt),
            asc(mail_gift_opening.mailUid),
            asc(mail_gift_opening.sendTime),
        ).limit(1001)
        : await db.select({ at: mail_chat_read_intent.requestedAt }).from(mail_chat_read_intent)
            .orderBy(
                asc(mail_chat_read_intent.requestedAt),
                asc(mail_chat_read_intent.commandId),
                asc(mail_chat_read_intent.effectIndex),
            ).limit(1001);

    return { pending: rows.length, limited: rows.length === 1001, oldestAt: rows[0]?.at ?? null };
}

export async function checkMailGiftProjection(db: DatabaseClient<"global">): Promise<void>
{
    await db.select({ uid: mail_gift_log.uid }).from(mail_gift_log).limit(0);
}
