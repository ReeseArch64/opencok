import type { AvatarVersionKey } from "@opencok/contracts/avatar-version";
import type { AvatarDeliveryKey } from "@opencok/contracts/files";

type Schedule = (run: () => void, delay: number) => () => void;
const schedule: Schedule = (run, delay) => {
  const timer = setTimeout(run, delay);
  return () => clearTimeout(timer);
};
export function startAvatarRelay(
  next: (cursor?: AvatarDeliveryKey) => Promise<AvatarDeliveryKey | undefined>,
  deliver: (owner: string, sequence: number) => Promise<void>,
  reportFailure: () => void,
  after: Schedule = schedule,
) {
  return startRelay(next, (entry) => deliver(entry.owner, entry.sequence), reportFailure, after);
}

export function startAvatarVersionRelay(
  next: (cursor?: AvatarVersionKey) => Promise<AvatarVersionKey | undefined>,
  deliver: (owner: string, operationId: string) => Promise<void>,
  reportFailure: () => void,
  after: Schedule = schedule,
) {
  return startRelay(next, (entry) => deliver(entry.owner, entry.operationId), reportFailure, after);
}

function startRelay<Key extends object>(
  next: (cursor?: Key) => Promise<Key | undefined>,
  deliver: (entry: Key) => Promise<void>,
  reportFailure: () => void,
  after: Schedule,
) {
  let cursor: Key | undefined;
  let stopped = false;
  let cancel: (() => void) | undefined;
  let active: Promise<void>;
  const run = async () => {
    try {
      const entry = await next(cursor);
      cursor = entry ? Object.freeze({ ...entry }) : undefined;
      if (entry && !stopped) await deliver(entry);
    } catch {
      try {
        reportFailure();
      } catch {}
    }
    if (!stopped)
      cancel = after(() => {
        cancel = undefined;
        active = run();
      }, 5000);
  };
  active = run();
  return {
    close: async () => {
      stopped = true;
      cancel?.();
      cancel = undefined;
      await active;
    },
  };
}
