import type { Schedule } from "./schedule.ts";

export class TimeoutScheduler {
  public readonly schedule: Schedule = (run, delay) => {
    const timer = setTimeout(run, delay);

    return () => clearTimeout(timer);
  };
}
