import { PublicEquipmentMapper } from "@opencok/equipment/mappings/public-equipment";
import { integer } from "./profile-values";
import { text } from "@opencok/contracts/rows";

export const publicEquipment = new PublicEquipmentMapper({ integer, text }).publicEquipment;
