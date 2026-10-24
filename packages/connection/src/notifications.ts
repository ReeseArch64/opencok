import type { Fields } from "@opencok/messages/sfs";

type Recipient = (command: string, body: Fields) => Promise<boolean>;
export function createRealmNotifications() {
  const recipients = new Map<string, Recipient>();
  return {
    subscribe(owner: string, recipient: Recipient) {
      recipients.set(owner, recipient);
      return () => {
        if (recipients.get(owner) === recipient) recipients.delete(owner);
      };
    },
    async publish(owner: string, command: string, body: Fields): Promise<boolean> {
      const recipient = recipients.get(owner);
      if (!recipient) return false;
      try {
        return await recipient(command, body);
      } catch {
        return false;
      }
    },
  };
}
export type RealmNotifications = ReturnType<typeof createRealmNotifications>;
