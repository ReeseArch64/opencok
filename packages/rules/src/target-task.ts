import { TargetTaskPolicy } from "@opencok/tasks/rules/target-task";
import { cityInteger } from "./city-progression";

export const { targetSchedule } = new TargetTaskPolicy({ cityInteger });
