import type {
  MailListEntry,
  MailCategoryReaders,
  MailCategoryPresentation,
  MailTranslationLookup,
  MailTranslation,
  MailSender,
} from "@opencok/contracts/mail";
import { mailCategorySenders, mailTranslationRequest, mailBlank } from "@opencok/rules/mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { storedMailText } from "./mail-contents.ts";

export async function resolveMailPresentation(
  entries: readonly MailListEntry[],
  readers: MailCategoryReaders,
  chat: boolean,
  enabled: boolean,
  updateTime: () => Promise<string>,
  resolvedSenders?: ReadonlyMap<string, MailSender>,
): Promise<MailCategoryPresentation> {
  const senders = resolvedSenders ?? (await readers.senders(mailCategorySenders(entries)));
  const requests = new Map<string, { id: string; fromLang: string; toLang: string }>();

  if (chat && enabled)
    {for (const entry of entries) {
      if (entry.type !== 22 && entry.type !== 24) {continue;}

      const sender = entry.fromUser === null ? undefined : senders.get(entry.fromUser);
      const request = mailTranslationRequest(entry.translationId, sender ? sender.lang : "");

      if (request) {requests.set(entry.uid, request);}
    }}

  const lookups = new Map<string, MailTranslationLookup>();

  for (const request of requests.values())
    {lookups.set(JSON.stringify([request.id, request.toLang]), {
      id: request.id,
      language: request.toLang,
    });}

  const translated = lookups.size ? await readers.translations([...lookups.values()]) : [];
  const stored = new Map<string, string>();

  for (const row of translated) {
    const key = JSON.stringify([row.id, row.language]);

    if (!lookups.has(key) || stored.has(key)) {throw new GameError(errors.invalid);}

    stored.set(key, storedMailText(row.contents, false));
  }

  const translations = new Map<string, MailTranslation>();

  for (const [id, request] of requests) {
    const translatedText = stored.get(JSON.stringify([request.id, request.toLang]));

    if (!mailBlank(translatedText))
      {translations.set(id, { originalLang: request.fromLang, translationMsg: translatedText! });}
  }

  const recipientUpdateTime = chat && entries.length ? await updateTime() : "";

  return { senders, translations, translationEnabled: enabled, recipientUpdateTime };
}
