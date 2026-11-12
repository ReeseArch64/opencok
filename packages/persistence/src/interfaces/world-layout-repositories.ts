import type { HydratedDocument } from "mongoose";
import type { WorldLayout } from "../types/world-layout";
import type { CreateWorldLayout } from "../types/world-layout-input";
import type { PublishRepositories } from "./repository";

export interface WorldLayoutRepositories
    extends PublishRepositories<HydratedDocument<WorldLayout>, CreateWorldLayout>
{}
