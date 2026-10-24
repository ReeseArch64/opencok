import { randomBytes } from "node:crypto";
import type {
  AvatarVersionInspector,
  AvatarVersionResult,
  AvatarVersionService,
} from "@opencok/contracts/avatar-version";
import type { AvatarMailDelivery } from "@opencok/contracts/files";
import type { Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import {
  avatarFinishMinimumLevel,
  avatarFinishInterval,
  checkAvatarLevel,
  checkAvatarRecord,
} from "@opencok/rules/avatar";
import { avatarVersionPlan } from "@opencok/rules/avatar-version";
import { avatarMailPush } from "@opencok/dtos/avatar-mail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function createAvatarVersion(options: {
  rules: Rules;
  kingdomId: number;
  commit(
    owner: string,
    operationId: string,
    now: number,
    inspect: AvatarVersionInspector,
  ): Promise<AvatarVersionResult>;
  mail(owner: string, operationId: string): Promise<AvatarMailDelivery>;
  profile(owner: string, operationId: string): Promise<void>;
  chat(owner: string, operationId: string): Promise<void>;
  notify(owner: string, command: string, body: Fields): Promise<void>;
  report(effect: "mail" | "profile" | "chat" | "notification"): void;
}): AvatarVersionService {
  const { rules, kingdomId, commit, mail, profile, chat, notify, report } = options;
  const reportFailure = (effect: Parameters<typeof report>[0]) => {
    try {
      report(effect);
    } catch {}
  };
  return {
    async update(owner, now) {
      if (!/^[0-9]{1,20}$/.test(owner) || !Number.isSafeInteger(now) || now < 0)
        throw new GameError(errors.invalid, "avatar_rule");
      const operationId = randomBytes(16).toString("hex");
      const template = rules.mail.get("10111");
      const capturedTemplate = template ? { ...template } : undefined;
      return commit(owner, operationId, now, async (profile, readers) => {
        const minimum = avatarFinishMinimumLevel(rules);
        let interval: bigint | null = null;
        if (minimum !== undefined) {
          checkAvatarLevel(await readers.castleLevel(), minimum);
          interval = avatarFinishInterval(rules);
          const record = await readers.uploadRecord();
          if (record && record.uid !== owner) throw new GameError(errors.invalid, "avatar_rule");
          checkAvatarRecord(rules, record, now);
        }
        return avatarVersionPlan(profile, now, minimum !== undefined, interval, capturedTemplate);
      });
    },
    async deliver(owner, operationId) {
      try {
        const result = await mail(owner, operationId);
        if (result.mail) {
          if (
            result.profile?.uid !== owner ||
            result.profile.serverId !== kingdomId ||
            result.mail.owner !== owner
          )
            throw new Error("Invalid avatar version mail recipient");
          try {
            const full = rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false;
            await notify(owner, "push.mail", avatarMailPush(result.mail, full));
          } catch {
            reportFailure("notification");
          }
        }
      } catch {
        reportFailure("mail");
      }
      for (const [effect, send] of [
        ["profile", profile],
        ["chat", chat],
      ] as const) {
        try {
          await send(owner, operationId);
        } catch {
          reportFailure(effect);
        }
      }
    },
  };
}
