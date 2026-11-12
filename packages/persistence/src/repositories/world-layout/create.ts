import type { HydratedDocument } from "mongoose";
import type { WorldLayout } from "../../types/world-layout";
import type { CreateWorldLayout } from "../../types/world-layout-input";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldLayoutRepository
    extends CreateRepository<HydratedDocument<WorldLayout>, CreateWorldLayout>
{}
