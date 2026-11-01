import records from "../data/catalog.json";
import { classifyCosmetic } from "./cosmetics.mjs";

export const categories = {
  tropas: {
    name: "Tropas",
    eyebrow: "O poder do seu exército",
    description:
      "Conheça cada unidade. Explore as famílias de tropas, compare tiers e prepare sua próxima formação.",
    symbol: "⚔",
  },
  skins: {
    name: "Skins",
    eyebrow: "Um reino com a sua identidade",
    description:
      "Explore skins de Aura, Moldura de Avatar, Asas, Efeito, Placa de Identificação, Bolha, Decoração, Fila e Castelo. Cada detalhe do reino tem seu próprio estilo.",
    symbol: "♜",
  },
  avatares: {
    name: "Avatares",
    eyebrow: "Toda lenda tem um rosto",
    description:
      "Escolha a aparência do seu senhor: o personagem que representa você no reino. Encontre o visual da sua próxima história.",
    symbol: "♛",
  },
  eventos: {
    name: "Eventos",
    eyebrow: "O próximo capítulo do reino",
    description:
      "Batalhas, celebrações e desafios para a sua aliança. Acompanhe o que está por vir.",
    symbol: "✦",
  },
};

export const catalog = records.map((item) => ({
  ...item,
  ...classifyCosmetic(item.sourceTable, item.cosmeticType),
  image: item.source === null ? null : `/media/${item.id}.png`,
}));

export function statusLabel(status) {
  return status === "available" ? "Disponível" : "Em breve";
}
