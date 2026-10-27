import { sfs, type Fields } from "@opencok/messages/sfs";
import type {
  CityExtinguishResponse,
  CityRepairResponse,
} from "@opencok/contracts/responses/city-defense";

export function extinguishedCity(response: CityExtinguishResponse): Fields {
  return { remainGold: sfs.long(response.remainGold), cityDef: sfs.int(response.cityDef) };
}
export function repairedCity(response: CityRepairResponse): Fields {
  return {
    lastCityDefTime: sfs.long(response.lastCityDefTime),
    cityDefValue: sfs.int(response.cityDefValue),
  };
}
