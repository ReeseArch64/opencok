import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import type { EquipmentCatalog, EquipmentContext } from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { EquipmentPolicy } from "../rules/equipment";
import { EquipmentMapper } from "../mappings/equipment";
import { EquipmentCommand } from "../enums/equipment-command";
import { EquipmentFactory } from "./factory";
import { EquipmentAccess } from "./access";
import { EquipmentMaterials } from "./materials";
import { EquipmentForge } from "./forge";
import { EquipmentCommands } from "./commands";
import { EquipmentActivity } from "./activity";

export class EquipmentDomain<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
> extends ActivityDomain<TContext>
{
    public readonly commands = [
        EquipmentCommand.Initialize,
        EquipmentCommand.Create,
        EquipmentCommand.Buy,
        EquipmentCommand.Break,
        EquipmentCommand.PutOn,
        EquipmentCommand.TakeOff,
        EquipmentCommand.Strengthen,
        EquipmentCommand.Reforge,
        EquipmentCommand.CreateSuitEquipment,
        EquipmentCommand.CreateSuit,
        EquipmentCommand.DecomposeSuit,
        EquipmentCommand.SelectSuitEffect,
        EquipmentCommand.CreateMaterial,
        EquipmentCommand.BreakMaterial,
    ];
    public readonly types = [11];
    public readonly prepare: ActivityDomain<TContext>["prepare"];
    public readonly apply: ActivityDomain<TContext>["apply"];

    public constructor(
        runtime: EquipmentRuntime<TCatalog, TContext>,
        policy: EquipmentPolicy,
        mapper: EquipmentMapper,
    )
    {
        super();
        const factory = new EquipmentFactory(policy);
        const access = new EquipmentAccess(runtime);
        const materials = new EquipmentMaterials(runtime, mapper);
        const forging = new EquipmentForge(runtime, access, policy, factory);
        this.prepare =
            new EquipmentCommands(runtime, access, policy, mapper, factory, forging, materials)
                .prepare;
        this.apply = new EquipmentActivity(runtime, access, mapper).apply;
    }
}
