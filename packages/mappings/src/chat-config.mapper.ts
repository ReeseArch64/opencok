import type { ChatConfigResponse } from "@opencok/contracts/responses/chat-config.response";

export class ChatConfigMapper
{
    public map(websocketUrl: string): ChatConfigResponse
    {
        return {
            code: 1,
            data: {
                websocket: { urlArray: [websocketUrl] },
                url: { websocket: [websocketUrl] },
                messageShow: {
                    allianceSystemMessageCount: 0,
                    countrySystemMessageCount: 0,
                    countryNormalMessageTypes: [0],
                    countrySystemMessageTypes: [],
                    allianceNormalMessageTypes: [0],
                    allianceSystemMessageTypes: [],
                    singleNormalMessageTypes: [],
                    groupNormalMessageTypes: [],
                    show_translate_button_post_arry: [],
                    knightTeamMessageTypes: [],
                },
                normalMessageTypes: { 0: [0], 1: [0], 12: [0], 13: [0] },
            },
        };
    }
}
