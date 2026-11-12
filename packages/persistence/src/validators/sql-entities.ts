import { z } from "zod";
import { internalIdValidator, publicIdValidator } from "./repository";
import {
    maximumDisplayNameBytes,
    maximumObjectFootprintInCells,
    maximumObjectLevel,
    worldWidthInCells,
    worldHeightInCells,
} from "../constants/world";
import { postgresIntegerMaximum } from "../constants/persistence";
import { WorldObjectType } from "../enums/world-object-type";
import { ResourceType } from "../enums/resource-type";
import { ResourceDepositStatus } from "../enums/resource-deposit-status";

const displayName = z.string().min(1).refine(
    value => value.trim().length > 0 && Buffer.byteLength(value) <= maximumDisplayNameBytes,
    "Nome deve conter até 64 bytes e não ser vazio",
);
export const kingdomCreateValidator = z.strictObject({ displayName });
export const kingdomUpdateValidator = kingdomCreateValidator.partial().refine(
    value =>
        Object.keys(value).length > 0 && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um campo",
);
export const worldCreateValidator = z.strictObject({
    widthInCells: z.literal(worldWidthInCells).default(worldWidthInCells),
    heightInCells: z.literal(worldHeightInCells).default(worldHeightInCells),
    activeTerrainLayoutVersion: z.int().min(1).max(postgresIntegerMaximum).default(1),
});
export const worldUpdateValidator = z.strictObject({
    widthInCells: z.literal(worldWidthInCells).optional(),
    heightInCells: z.literal(worldHeightInCells).optional(),
    activeTerrainLayoutVersion: z.int().min(1).max(postgresIntegerMaximum).optional(),
}).refine(
    value =>
        Object.keys(value).length > 0 && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um campo",
);
export const worldObjectCreateValidator = z.strictObject({
    worldId: internalIdValidator.default(1),
    objectType: z.enum(WorldObjectType),
    cellX: z.int().min(1).max(worldWidthInCells),
    cellY: z.int().min(1).max(worldHeightInCells),
    widthInCells: z.int().min(1).max(maximumObjectFootprintInCells).default(1),
    heightInCells: z.int().min(1).max(maximumObjectFootprintInCells).default(1),
    level: z.int().min(0).max(maximumObjectLevel).default(0),
});
export function validateWorldObjectBounds(value: z.output<typeof worldObjectCreateValidator>): void
{
    if (
        value.cellX + value.widthInCells - 1 > worldWidthInCells
        || value.cellY + value.heightInCells - 1 > worldHeightInCells
    )
    {
        throw new RangeError("Objeto fora dos limites do mundo");
    }
}
export const worldObjectUpdateValidator = z.strictObject({
    worldId: internalIdValidator.optional(),
    objectType: z.enum(WorldObjectType).optional(),
    cellX: z.int().min(1).max(worldWidthInCells).optional(),
    cellY: z.int().min(1).max(worldHeightInCells).optional(),
    widthInCells: z.int().min(1).max(maximumObjectFootprintInCells).optional(),
    heightInCells: z.int().min(1).max(maximumObjectFootprintInCells).optional(),
    level: z.int().min(0).max(maximumObjectLevel).optional(),
}).refine(
    value =>
        Object.keys(value).length > 0 && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um campo",
);
const quantity = z.string().regex(/^(0|[1-9][0-9]*)$/).refine(
    value => BigInt(value) <= BigInt(Number.MAX_SAFE_INTEGER),
    "Quantidade fora do intervalo seguro",
);
export const worldResourceDepositCreateValidator = z.strictObject({
    worldObjectId: internalIdValidator,
    resourceType: z.enum(ResourceType),
    configurationPublicId: publicIdValidator,
    initialQuantity: quantity.refine(value => BigInt(value) > 0),
    remainingQuantity: quantity,
    depositStatus: z.enum(ResourceDepositStatus).default(ResourceDepositStatus.Available),
    depletedAt: z.date().nullable().default(null),
});
export function validateWorldResourceDepositState(
    value: z.output<typeof worldResourceDepositCreateValidator>,
): void
{
    const remaining = BigInt(value.remainingQuantity);
    if (remaining > BigInt(value.initialQuantity))
    {
        throw new RangeError("Quantidade restante excede a quantidade inicial");
    }
    if (
        value.depositStatus === ResourceDepositStatus.Available
            ? remaining === 0n || value.depletedAt !== null
            : remaining !== 0n || value.depletedAt === null
    )
    {
        throw new RangeError("Estado do depósito inválido");
    }
}
export const worldResourceDepositUpdateValidator = z.strictObject({
    worldObjectId: internalIdValidator.optional(),
    resourceType: z.enum(ResourceType).optional(),
    remainingQuantity: quantity.optional(),
    depositStatus: z.enum(ResourceDepositStatus).optional(),
    depletedAt: z.date().nullable().optional(),
}).refine(
    value =>
        Object.keys(value).length > 0 && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um campo",
);
