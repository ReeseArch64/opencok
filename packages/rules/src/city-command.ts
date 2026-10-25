export const cityCommands = [
  "build.create",
  "build.upgrade",
  "build.destroy",
  "build.move",
  "buildingUnlock",
  "miracle.unlock",
  "buildingUnlock.info",
  "buildingUnlock.glory",
  "building.reward",
] as const;

export const cityQueueCommands: Readonly<
  Record<
    string,
    { action: "queue.finish" | "queue.cancel"; types: readonly number[]; target?: string }
  >
> = { "science.upgrade": { action: "queue.finish", types: [6], target: "itemId" } };
