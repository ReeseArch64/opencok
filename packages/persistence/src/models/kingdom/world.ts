import "reflect-metadata";
import { Check, Column, Entity } from "typeorm";
import { BaseEntity } from "../../base/base-entity";
@Entity({ name: "worlds" })
@Check("world_main_id", "\"id\" = 1")
@Check(
    "world_dimensions_supported",
    "\"width_in_cells\" = 1200 AND \"height_in_cells\" = 1200",
)
@Check("world_layout_version_positive", "\"active_terrain_layout_version\" >= 1")
export class World extends BaseEntity
{
    @Column({ name: "width_in_cells", type: "integer", default: 1200 })
    widthInCells: number;

    @Column({ name: "height_in_cells", type: "integer", default: 1200 })
    heightInCells: number;

    @Column({
        name: "active_terrain_layout_version",
        type: "integer",
        default: 1,
    })
    activeTerrainLayoutVersion: number;
}
