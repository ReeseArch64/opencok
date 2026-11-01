import skinTypes from "../data/cosmetic-types.json";

export { skinTypes };

export const skinGroups = [116, 115, 109, 108, 104, 103, 102, 101, 100].map(
  (type) => skinTypes[type],
);

export function classifyCosmetic(sourceTable, type) {
  if (sourceTable === "lord_image") {
    return { category: "avatares", group: "Aparência do senhor" };
  }
  if (sourceTable === "status" && Object.hasOwn(skinTypes, String(type))) {
    return { category: "skins", group: skinTypes[String(type)] };
  }
  return null;
}
