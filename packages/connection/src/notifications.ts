import type { Fields } from "@opencok/messages/sfs";

type Recipient = (command: string, body: Fields, signal?: AbortSignal) => Promise<boolean>;
export function createRealmNotifications() {
  const recipients = new Map<string, Recipient>();
  return {
    subscribe(owner: string, recipient: Recipient) {
      recipients.set(owner, recipient);
      return () => {
        if (recipients.get(owner) === recipient) recipients.delete(owner);
      };
    },
    async publish(
      owner: string,
      command: string,
      body: Fields,
      signal?: AbortSignal,
    ): Promise<boolean> {
      const recipient = recipients.get(owner);
      if (!recipient || signal?.aborted) return false;
      try {
        const delivered = await recipient(command, body, signal);
        return !signal?.aborted && delivered;
      } catch {
        return false;
      }
    },
  };
}
export type RealmNotifications = ReturnType<typeof createRealmNotifications>;
