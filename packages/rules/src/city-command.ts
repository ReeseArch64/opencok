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
        {
            action: "queue.finish" | "queue.cancel";
            types: readonly number[];
            target?: string;
            queueKey?: string;
        }
    >
> = {
    "equip.q.finish": { action: "queue.finish", types: [11], queueKey: "qUUID" },
    "havest.tool": { action: "queue.finish", types: [12], queueKey: "quuid" },
    "race.science.upgrade": { action: "queue.finish", types: [19], target: "itemId" },
    "science.upgrade": { action: "queue.finish", types: [6], target: "itemId" },
    "army.complete": { action: "queue.finish", types: [1, 8, 9, 10, 17], target: "id" },
    "hospital.cure.done": { action: "queue.finish", types: [3] },
    "hospital.cancel": { action: "queue.cancel", types: [3] },
    "fort.build.done": { action: "queue.finish", types: [2], target: "id" },
    "fort.cancel": { action: "queue.cancel", types: [2], target: "id" },
};
