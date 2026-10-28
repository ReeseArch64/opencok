export interface PublicEquipmentResponse
{
    readonly uuid: string;
    readonly itemId: string;
    readonly extraProperty: string;
    readonly refineProperty: string;
    readonly lockProperty?: string;
    readonly suit_effect?: string;
    readonly suit_value?: string;
    readonly suit_value_type?: string;
    readonly suit_value_sign?: string;
    readonly Buff?: string;
    readonly buff?: string;
    readonly buff_str?: string;
    readonly buff_Str?: string;
    readonly buffStr?: string;
    readonly BuffStr?: string;
    readonly on: number;
    readonly reforgeCount: number;
    readonly strength_level?: number;
}
