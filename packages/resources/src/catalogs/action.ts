import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "AcceptTaskReward", "lv_limit1": "16", "count1": "350", "count": "500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "RentQueue", "lv_limit1": "16", "count1": "100", "count": "100" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "ReadMail", "lv_limit1": "16", "count1": "350", "count": "500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "UseItem", "lv_limit1": "16", "count1": "650", "count": "1000" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "AllianceSearchUser", "lv_limit1": "16", "count1": "300", "count": "500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "BindingAccountHandler",
            "lv_limit1": "16",
            "count1": "100",
            "count": "100",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "GetUserPrayInfo", "lv_limit1": "16", "count1": "250", "count": "400" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "GetScienceInfo", "lv_limit1": "16", "count1": "250", "count": "500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "PrayResourceHandler", "lv_limit1": "16", "count1": "250", "count": "500" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "GetWorldInfo", "lv_limit1": "16", "count1": "7500", "count": "20000" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "CancelQueue", "lv_limit1": "16", "count1": "100", "count": "100" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "MoveWorldPointCrossServer",
            "lv_limit1": "16",
            "count1": "100",
            "count": "100",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "GetWorldPointDetail",
            "lv_limit1": "16",
            "count1": "3500",
            "count": "10000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "GetUserAllMarchRecord",
            "lv_limit1": "16",
            "count1": "1250",
            "count": "2000",
          },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "LotteryStart", "lv_limit1": "16", "count1": "2400", "count": "5760" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "ClickSoldierReward",
            "lv_limit1": "16",
            "count1": "1250",
            "count": "2000",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
