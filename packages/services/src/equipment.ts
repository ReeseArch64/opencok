import { EquipmentFactory } from "@opencok/equipment/services/factory";
import { EquipmentPolicy } from "@opencok/equipment/rules/equipment";
import { text, num } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { chooseWeight } from "@opencok/rules/weighted-choice";

export const newEquipment =
    new EquipmentFactory(new EquipmentPolicy({ text, num, cityInteger, cityAmount, chooseWeight }))
        .newEquipment;
