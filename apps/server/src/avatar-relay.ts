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
  let cursor: AvatarDeliveryKey | undefined;
  let stopped = false;
  let cancel: (() => void) | undefined;
  let active: Promise<void>;
  const run = async () => {
    try {
      const entry = await next(cursor);
      cursor = entry ? Object.freeze({ ...entry }) : undefined;
      if (entry && !stopped) await deliver(entry.owner, entry.sequence);
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
