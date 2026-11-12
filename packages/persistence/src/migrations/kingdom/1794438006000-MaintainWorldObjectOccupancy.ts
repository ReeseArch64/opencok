import type { MigrationInterface, QueryRunner } from "typeorm";

export class MaintainWorldObjectOccupancy1794438006000 implements MigrationInterface
{
    name = "MaintainWorldObjectOccupancy1794438006000";

    async up(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(
            `CREATE FUNCTION public.guard_world_object_cells() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF pg_trigger_depth() < 2 THEN
                RAISE EXCEPTION 'world_object_cells is maintained by world_objects; change the parent object instead' USING ERRCODE = '23514';
            END IF;
            IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
            RETURN NEW;
        END $$`,
        );
        await queryRunner.query(
            `CREATE TRIGGER guard_world_object_cells BEFORE INSERT OR UPDATE OR DELETE ON public.world_object_cells FOR EACH ROW EXECUTE FUNCTION public.guard_world_object_cells()`,
        );
        await queryRunner.query(
            `CREATE FUNCTION public.sync_world_object_cells() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF TG_OP = 'UPDATE' THEN
                IF (NEW.world_id, NEW.cell_x, NEW.cell_y, NEW.width_in_cells, NEW.height_in_cells, NEW.deleted_at, NEW.archived_at)
                   IS NOT DISTINCT FROM
                   (OLD.world_id, OLD.cell_x, OLD.cell_y, OLD.width_in_cells, OLD.height_in_cells, OLD.deleted_at, OLD.archived_at)
                   AND EXISTS (SELECT 1 FROM public.world_object_cells WHERE world_object_id = NEW.id AND deleted_at IS NULL AND archived_at IS NULL) THEN
                    RETURN NEW;
                END IF;
            END IF;
            UPDATE public.world_object_cells SET archived_at = now(), updated_at = now()
              WHERE world_object_id = NEW.id AND deleted_at IS NULL AND archived_at IS NULL;
            IF NEW.deleted_at IS NULL AND NEW.archived_at IS NULL THEN
                INSERT INTO public.world_object_cells(world_id,world_object_id,cell_x,cell_y)
                  SELECT NEW.world_id,NEW.id,x,y
                  FROM generate_series(NEW.cell_x,NEW.cell_x+NEW.width_in_cells-1) AS x
                  CROSS JOIN generate_series(NEW.cell_y,NEW.cell_y+NEW.height_in_cells-1) AS y;
            END IF;
            RETURN NEW;
        END $$`,
        );
        await queryRunner.query(
            `CREATE TRIGGER sync_world_object_cells AFTER INSERT OR UPDATE OF world_id,cell_x,cell_y,width_in_cells,height_in_cells,deleted_at,archived_at ON public.world_objects FOR EACH ROW EXECUTE FUNCTION public.sync_world_object_cells()`,
        );
        await queryRunner.query(
            "UPDATE public.world_objects SET cell_x = cell_x WHERE deleted_at IS NULL AND archived_at IS NULL",
        );
    }

    async down(queryRunner: QueryRunner): Promise<void>
    {
        await queryRunner.query(
            "DROP TRIGGER sync_world_object_cells ON public.world_objects",
        );
        await queryRunner.query(
            "DROP FUNCTION public.sync_world_object_cells()",
        );
        await queryRunner.query(
            "DROP TRIGGER guard_world_object_cells ON public.world_object_cells",
        );
        await queryRunner.query(
            "DROP FUNCTION public.guard_world_object_cells()",
        );
    }
}
