import type { InferSchemaType } from "mongoose";
import type { worldLayoutSchema } from "../schemas/kingdom/world-layout";

export type WorldLayout = InferSchemaType<typeof worldLayoutSchema>;
