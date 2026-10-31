import records from "../data/catalog.json";

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
      "De fortalezas congeladas a castelos nas nuvens. Descubra as aparências que transformam sua cidade.",
    symbol: "♜",
  },
  avatares: {
    name: "Avatares",
    eyebrow: "Toda lenda tem um rosto",
    description:
      "Explore a coleção de retratos e encontre a identidade do seu próximo conquistador.",
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

export const catalog = records.map((item) => ({ ...item, image: `/media/${item.id}.png` }));

export function statusLabel(status) {
  return status === "available" ? "Disponível" : "Em breve";
}
