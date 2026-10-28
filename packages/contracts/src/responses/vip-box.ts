import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface VipBoxNoticeResponse
{
    name: string;
    itemid: string;
    itemnum: string;
}

export interface VipBoxResponse
{
    box_vip_list: readonly {
        table_info: Readonly<Record<string, ResponseValue>>;
        itemidlist: string;
        free: boolean;
        stepNum: number;
    }[];
    show_list: readonly VipBoxNoticeResponse[];
    vip_now_level: number;
}
