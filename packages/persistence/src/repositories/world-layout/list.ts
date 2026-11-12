import type { HydratedDocument } from "mongoose";
import type { WorldLayout } from "../../types/world-layout";
import { ListRepository } from "../../class/list-repository";

export class ListWorldLayoutRepository extends ListRepository<HydratedDocument<WorldLayout>>
{}
