import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";

import { WorldObjectType } from "../../enums/world-object-type";
import { World } from "./world";

@Entity({ name: "world_objects" })
@Index("world_object_id_type_unique", ["id", "objectType"], { unique: true })
@ForeignKey(() => World, ["worldId"], ["id"], {
    name: "world_object_world",
    onDelete: "RESTRICT",
})
@Index("world_object_region", ["worldId", "cellX", "cellY"])
@Check("world_object_id_positive", "\"id\" > 0")
@Check(
    "world_object_footprint",
    "\"width_in_cells\" BETWEEN 1 AND 16 AND \"height_in_cells\" BETWEEN 1 AND 16",
)
@Check(
    "world_object_bounds",
    "\"cell_x\" >= 1 AND \"cell_y\" >= 1 AND \"cell_x\" + \"width_in_cells\" - 1 <= 1200 AND \"cell_y\" + \"height_in_cells\" - 1 <= 1200",
)
@Check("world_object_level", "\"level\" BETWEEN 0 AND 100")
export class WorldObject extends BaseEntity
{
    @Column({ name: "world_id", type: "integer", default: 1 })
    worldId: number;

    @Column({
        name: "object_type",
        type: "enum",
        enum: WorldObjectType,
        enumName: "world_object_type",
    })
    objectType: WorldObjectType;

    @Column({ name: "cell_x", type: "integer" })
    cellX: number;

    @Column({ name: "cell_y", type: "integer" })
    cellY: number;

    @Column({ name: "width_in_cells", type: "smallint", default: 1 })
    widthInCells: number;

    @Column({ name: "height_in_cells", type: "smallint", default: 1 })
    heightInCells: number;

    @Column({ type: "smallint", default: 0 })
    level: number;
}
