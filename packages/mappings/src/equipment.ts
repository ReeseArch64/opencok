import { EquipmentMapper } from "@opencok/equipment/mappings/equipment";
import { PublicEquipmentMapper } from "@opencok/equipment/mappings/public-equipment";
import { integer } from "./profile-values";
import { text, num } from "@opencok/contracts/rows";

const mapper = new EquipmentMapper({ text, num }, new PublicEquipmentMapper({ integer, text }));

export const { equipment, equipmentItem, equipmentItems } = mapper;
