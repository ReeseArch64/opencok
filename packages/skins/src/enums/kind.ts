export enum CosmeticKind
{
    City = 100,
    March = 101,
    Ground = 102,
    Chat = 103,
    Nameplate = 104,
    Bubble = 105,
    Shield = 106,
    Effect = 108,
    Wings = 109,
    Civilization = 110,
    CivilizationFortress = 114,
    Frame = 115,
    Aura = 116,
    HeroMarch = 117,
    ActivityEffect = 118,
    TeleportEffect = 121,
    InnerCastle = 123,
    InnerDecoration = 124,
    Overlap = 200,
}

export const cosmeticKinds: readonly number[] = [
    CosmeticKind.City,
    CosmeticKind.March,
    CosmeticKind.Ground,
    CosmeticKind.Chat,
    CosmeticKind.Nameplate,
    CosmeticKind.Bubble,
    CosmeticKind.Effect,
    CosmeticKind.Wings,
    CosmeticKind.Frame,
    CosmeticKind.Aura,
    CosmeticKind.Overlap,
];

export const cosmeticWorldFields = {
    [CosmeticKind.Nameplate]: "npavatar",
    [CosmeticKind.Bubble]: "bubble",
    [CosmeticKind.Effect]: "castleEffect",
    [CosmeticKind.Wings]: "wings",
    [CosmeticKind.Frame]: "avatarframe",
    [CosmeticKind.Aura]: "aura",
    [CosmeticKind.Overlap]: "overlap",
} as const;

export const worldCosmeticKinds: readonly number[] = [
    CosmeticKind.City,
    ...Object.keys(cosmeticWorldFields).map(Number),
];
