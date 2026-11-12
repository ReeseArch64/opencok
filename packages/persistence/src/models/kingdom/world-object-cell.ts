import "reflect-metadata";
import { Check, Column, Entity, ForeignKey, Index } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
import { World } from "./world";
import { WorldObject } from "./world-object";
@Entity({ name: "world_object_cells" })
@ForeignKey(() => World, ["worldId"], ["id"], {
    name: "world_object_cell_world",
    onDelete: "RESTRICT",
})
@ForeignKey(() => WorldObject, ["worldObjectId"], ["id"], {
    name: "world_object_cell_object",
    onDelete: "RESTRICT",
})
@Index("world_object_cell_active_position", ["worldId", "cellX", "cellY"], {
    unique: true,
    where: "\"deleted_at\" IS NULL AND \"archived_at\" IS NULL",
})
@Index("world_object_cell_owner", ["worldObjectId"])
@Check(
    "world_object_cell_bounds",
    "\"cell_x\" BETWEEN 1 AND 1200 AND \"cell_y\" BETWEEN 1 AND 1200",
)
export class WorldObjectCell extends BaseEntity
{
    @Column({ name: "world_id", type: "integer" })
    worldId: number;

    @Column({ name: "world_object_id", type: "integer" })
    worldObjectId: number;

    @Column({ name: "cell_x", type: "integer" })
    cellX: number;

    @Column({ name: "cell_y", type: "integer" })
    cellY: number;
}
