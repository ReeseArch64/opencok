import type {
  AvatarFiles,
  AvatarFinishStore,
  AvatarFinishService,
  AvatarMailDelivery,
  AvatarProfileDelivery,
} from "@opencok/contracts/files";
import type { Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { avatarSystemMail } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { finishAvatar } from "./avatar-finish.ts";

export function createAvatarCompletion(options: {
  store: AvatarFinishStore;
  files: Pick<AvatarFiles, "find">;
  rules: Rules;
  kingdomId: number;
  mail(owner: string, sequence: number): Promise<AvatarMailDelivery>;
  profile(owner: string, sequence: number): Promise<AvatarProfileDelivery>;
  chat(owner: string, sequence: number): Promise<AvatarProfileDelivery>;
  notify(owner: string, command: string, body: Fields): Promise<void>;
  report(effect: "mail" | "profile" | "chat" | "notification"): void;
}): AvatarFinishService {
  const { store, files, rules, kingdomId, mail, profile, chat, notify, report } = options;
  const reportFailure = (effect: Parameters<typeof report>[0]) => {
    try {
      report(effect);
    } catch {}
  };

  return {
    finish(owner, receipt, now) {
      return finishAvatar(
        {
          commit: (uid, query, find, inspect) =>
            store.commit(uid, query, find, async (profile, readers) => {
              const plan = await inspect(profile, readers);

              if (plan.pendingEffects & 1)
                {avatarSystemMail(
                  {
                    ownerUid: uid,
                    sequence: query.sequence,
                    hash: query.hash,
                    committedAt: BigInt(query.now),
                    ...plan,
                  },
                  "0".repeat(32),
                );}

              return plan;
            }),
        },
        files,
        rules,
        owner,
        receipt,
        now,
      );
    },
    async deliver(owner, sequence) {
      try {
        const result = await mail(owner, sequence);

        if (result.mail) {
          if (
            result.profile?.uid !== owner ||
            result.profile.serverId !== kingdomId ||
            result.mail.owner !== owner
          )
            {throw new Error("Invalid avatar mail recipient");}

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
          await send(owner, sequence);
        } catch {
          reportFailure(effect);
        }
      }
    },
  };
}
