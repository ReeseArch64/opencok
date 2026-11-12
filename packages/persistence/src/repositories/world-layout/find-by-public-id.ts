import type { HydratedDocument } from "mongoose";
import type { WorldLayout } from "../../types/world-layout";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdWorldLayoutRepository
    extends FindByPublicIdRepository<HydratedDocument<WorldLayout>>
{}
