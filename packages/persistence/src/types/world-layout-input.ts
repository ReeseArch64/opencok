import type { WorldCell } from "./world-cell";

export type CreateWorldLayout = {
    worldPublicId: string;
    layoutVersion: number;
    templateWidthInCells: number;
    templateHeightInCells: number;
    blockedCells?: WorldCell[];
};
