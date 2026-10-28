export interface PrayerResponse
{
    prayCount: number;
    itemPrayCount: number;
    freeFromItem: number;
    wood: number;
    food: number;
    iron: number;
    silver: number;
    steel: number;
    goldwood: number;
    goldfood: number;
    goldiron: number;
    goldsilver: number;
    goldsteel: number;
    isFirstFree: boolean;
    isFirstPay: boolean;
    prayCountFree: number;
    prayCountMax: number;
    isSteelOpen: number;
    resource?: number;
    num?: number;
    hit?: number;
    goldRemain?: bigint;
    WOOD?: bigint;
    STONE?: bigint;
    IRON?: bigint;
    FOOD?: bigint;
    SILVER?: bigint;
}

export interface PrayerLoginResponse
{
    pray: { prayCount: number; freeFromItem: number; prayCountFree: number; prayCountMax: number; };
}

export interface PrayerItemResponse
{
    prayCount: number;
    freeFromItem: number;
}
