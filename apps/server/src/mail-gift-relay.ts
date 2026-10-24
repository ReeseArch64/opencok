type Schedule = (run: () => void, delay: number) => () => void;

const schedule: Schedule = (run, delay) => {
  const timer = setTimeout(run, delay);
  return () => clearTimeout(timer);
};

export function startMailGiftRelay(
  dispatch: () => Promise<number>,
  reportFailure: () => void,
  after: Schedule = schedule,
) {
  let stopped = false;
  let cancel: (() => void) | undefined;
  let active: Promise<void>;
  const run = async () => {
    try {
      await dispatch();
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
