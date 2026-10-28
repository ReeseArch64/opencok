export interface ChatConfigResponse
{
    code: 1;
    data: {
        websocket: { urlArray: string[]; };
        url: { websocket: string[]; };
        messageShow: {
            allianceSystemMessageCount: number;
            countrySystemMessageCount: number;
            countryNormalMessageTypes: number[];
            countrySystemMessageTypes: number[];
            allianceNormalMessageTypes: number[];
            allianceSystemMessageTypes: number[];
            singleNormalMessageTypes: number[];
            groupNormalMessageTypes: number[];
            show_translate_button_post_arry: number[];
            knightTeamMessageTypes: number[];
        };
        normalMessageTypes: Record<0 | 1 | 12 | 13, number[]>;
    };
}
