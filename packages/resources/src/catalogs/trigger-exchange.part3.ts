import { type GameplayCatalogElement } from "../catalog.ts";

export function part3(): GameplayCatalogElement[] {
  return [
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761692;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761692;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2466", "name": "SNK联动-1$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761692" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761693;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761692;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761693;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2467", "name": "SNK联动-5$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761693" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761694;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761693;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761694;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2468", "name": "SNK联动-10$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761694" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761695;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761694;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761695;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2469", "name": "SNK联动-20$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761695" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761696;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761695;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761696;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2470", "name": "SNK联动50$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761696" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761697;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761696;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761697;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2471", "name": "SNK联动-100$-1030", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761698" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761698;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-31 06:00:00;2017-11-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761698;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2472", "name": "SNK联动-100$-1030-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;0" }],
              ":@": { "type": "41", "name": "VIP等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;761570;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-19 00:00:00;2017-11-21 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761570;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2316", "name": "活动-VIP礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;5" }],
              ":@": { "type": "41", "name": "VIP等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;761571;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-19 00:00:00;2017-11-21 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761571;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2317", "name": "活动-VIP礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;10" }],
              ":@": { "type": "41", "name": "VIP等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;761572;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-19 00:00:00;2017-11-21 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761572;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2318", "name": "活动-VIP礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "41", "name": "VIP等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;761573;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-19 00:00:00;2017-11-21 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761573;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2319", "name": "活动-VIP礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761555" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761555;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2295", "name": "17七夕-牛郎织女皮肤", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761557" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-31 00:00:00;2017-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761557;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2296", "name": "17七夕-七夕礼盒-1$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761558" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-31 00:00:00;2017-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761558;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2297", "name": "17七夕-七夕礼盒-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761566" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761566;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761566;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2304", "name": "七夕特惠-100$-0828-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761560;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761560;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2298", "name": "七夕特惠-1$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761560" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761561;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761560;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761561;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2299", "name": "七夕特惠-5$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761561" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761562;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761561;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761562;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2300", "name": "七夕特惠-10$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761562" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761563;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761562;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761563;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2301", "name": "七夕特惠-20$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761563" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761564;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761563;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761564;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2302", "name": "七夕特惠-50$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761564" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761565;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761564;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-28 00:00:00;2017-08-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761565;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2303", "name": "七夕特惠-100$-0828", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761717" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-02 00:00:00;2017-11-03 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761717;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2490", "name": "万圣节礼盒-10$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761718" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-02 00:00:00;2017-11-03 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761718;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2491", "name": "万圣节礼盒-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "56", "name": "购买任意礼包成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_1" }],
              ":@": { "type": "104", "name": "验证购买礼包的档次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "1;1;1000;3;1440;9440066;1;0" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2143", "name": "4.99礼包红包", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "56", "name": "购买任意礼包成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_2" }],
              ":@": { "type": "104", "name": "验证购买礼包的档次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;1;10000;5;1440;9440067;0;5000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2144", "name": "9.99礼包红包", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "56", "name": "购买任意礼包成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_3" }],
              ":@": { "type": "104", "name": "验证购买礼包的档次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "1;1;10000;5;1440;9440068;1;0" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2145", "name": "19.99礼包红包", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "56", "name": "购买任意礼包成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_4" }],
              ":@": { "type": "104", "name": "验证购买礼包的档次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;1;10000;5;1440;9440069;1;0" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2146", "name": "49.99礼包红包", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "56", "name": "购买任意礼包成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_5" }],
              ":@": { "type": "104", "name": "验证购买礼包的档次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;10000;5;1440;9440070;1;0" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2147", "name": "99.99礼包红包", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761596;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-06 00:00:00;2017-09-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761596;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2329", "name": "三周年特惠-1$-0905", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761597;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761597;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2330", "name": "三周年特惠-5$-0905", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761597" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761598;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761597;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761598;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2331", "name": "三周年特惠-10$-0905", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761598" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761599;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761598;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761599;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2332", "name": "三周年特惠-20$-0905", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761599" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761600;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761599;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761600;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2333", "name": "三周年特惠-50$-0905", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761600" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761601;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761600;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761601;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2334", "name": "三周年特惠-100$-0905", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761602" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761602;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-11 06:00:00;2017-09-12 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761602;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2335", "name": "三周年特惠-100$-0905-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761595" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-26 00:00:00;2017-10-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761595;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2328", "name": "三周年尊享版皮肤", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761603" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-14 00:00:00;2017-09-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761603;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2336", "name": "三周年礼盒-1$ ", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761604" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-14 00:00:00;2017-09-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761604;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2337", "name": "三周年礼盒-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761613" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761613;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1900" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761613;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2352", "name": "侦查道具可选包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761486;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761486;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2017", "name": "纯科研加速-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761486" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761487;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761486;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761487;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2018", "name": "纯科研加速-10$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761487" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761488;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761487;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761488;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2020", "name": "纯科研加速-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761488" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761489;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761488;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761489;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2021", "name": "纯科研加速-50$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761414" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761490;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761489;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761490;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2022", "name": "纯科研加速-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761491" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761491;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761491;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2024", "name": "纯科研加速-100$-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761423" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761423;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761423;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2064", "name": "超级科研包-100$-0731-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761417;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761417;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2030", "name": "超级科研包-1$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761417" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761418;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761417;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761418;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2031", "name": "超级科研包-5$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761418" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761419;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761418;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761419;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2032", "name": "超级科研包-10$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761419" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761420;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761419;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761420;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2033", "name": "超级科研包-20$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761420" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761421;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761420;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761421;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2034", "name": "超级科研包-50$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761421" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761422;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761421;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761422;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2035", "name": "超级科研包-100$-0731", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761580;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761580;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2311", "name": "促销-造兵加速-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761580" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761581;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761580;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761581;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2312", "name": "促销-造兵加速-10$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761581" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761582;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761581;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761582;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2313", "name": "促销-造兵加速-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761582" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761583;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761582;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761583;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2314", "name": "促销-造兵加速-50$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761583" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761584;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761583;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761584;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2315", "name": "促销-造兵加速-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761585" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761585;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761585;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1243", "name": "促销-造兵加速-100-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;2" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-03 00:00:00;2017-11-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;761726;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<;7" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761726;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2501", "name": "俄罗斯民族统一日-1$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761727;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761727;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2502", "name": "俄罗斯民族统一日-5$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761727" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761728;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761727;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761728;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2503", "name": "俄罗斯民族统一日-10$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761728" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761729;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761728;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761729;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2504", "name": "俄罗斯民族统一日-20$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761729" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761730;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761729;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761730;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2505", "name": "俄罗斯民族统一日-50$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761730" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761731;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761730;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761731;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2506", "name": "俄罗斯民族统一日-100$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761732" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761732;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;RU" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-07 00:00:00;2017-11-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761732;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2507", "name": "俄罗斯民族统一日100$-1102", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761752;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761752;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2531", "name": "双十一-1$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761752" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761753;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761752;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761753;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2532", "name": "双十一-5$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761753" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761754;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761753;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761754;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2533", "name": "双十一-10$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761754" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761755;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761754;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761755;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2534", "name": "双十一-20$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761755" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761756;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761755;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761756;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2535", "name": "双十一-50$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761756" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761757;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761756;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761757;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2536", "name": "双十一-100$-1110", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761758" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761758;<;2" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-28 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761758;520" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2537", "name": "双十一-100$-1110-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761586;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761586;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2321", "name": "古尔邦节-1$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761586" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761587;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761586;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761587;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2322", "name": "古尔邦节-5$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761587" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761588;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761587;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761588;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2323", "name": "古尔邦节-10$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761588" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761589;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761588;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761589;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2324", "name": "古尔邦节-20$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761589" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761590;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761589;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761590;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2325", "name": "古尔邦节-50$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761590" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761591;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761590;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761591;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2326", "name": "古尔邦节-100$-0831", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761593" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761593;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "true;AE;BH;DZ;EG;IQ;IR;JO;KW;LY;MA;OM;QA;SA;SD;SO;SY;TN;YE" },
              ],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-04 00:00:00;2017-09-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761593;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2327", "name": "古尔邦节-100$-0831-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761673;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761673;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2440", "name": "城堡之夜-1$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761673" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761674;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761673;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761674;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2441", "name": "城堡之夜-5$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761674" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761675;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761674;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761675;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2442", "name": "城堡之夜-10$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761675" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761676;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761675;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761676;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2443", "name": "城堡之夜-20$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761676" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761677;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761676;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761677;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2444", "name": "城堡之夜-50$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761677" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761678;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761677;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761678;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2445", "name": "城堡之夜-100$-1021", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761679" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761679;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-13 00:00:00;2017-11-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761679;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2446", "name": "城堡之夜-100$-1021-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761379;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761379;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1912", "name": "纯城建加速-290-5-0811", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761379" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761379;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761380;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761380;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1913", "name": "纯城建加速-570-10-0811", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761380" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761380;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761381;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761381;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1914", "name": "纯城建加速-1115-20-0811", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761381" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761381;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761382;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761382;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1915", "name": "纯城建加速-2750-50-0811", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761382" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761383" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761382;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761383;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761383;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1916", "name": "纯城建加速-5500-100-0811", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761384" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761384;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761384;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1917", "name": "纯城建加速-5500-100-0811-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761480" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761480;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761480;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2166", "name": "声望之书-窗口-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761474" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761475;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761474;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761475;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2167", "name": "声望之书-10$-0808", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761474;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761474;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2168", "name": "声望之书-5$-0808", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761475" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761476;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761475;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761476;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2169", "name": "声望之书-20$-0808", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761476" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761477;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761476;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761477;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2170", "name": "声望之书-50$-0808", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761477" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761478;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761477;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761478;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2171", "name": "声望之书-100$-0808", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761479" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761479;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.54.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761479;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2172", "name": "声望之书-100$-0808-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761816;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761816;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2677", "name": "声望华夏-5$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761816" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761816;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761817;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761817;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2678", "name": "声望华夏-10$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761817" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761817;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761818;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761818;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2679", "name": "声望华夏-20$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761818" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761818;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761819;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761819;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2680", "name": "声望华夏-50$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761819" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761819;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761820;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761820;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2681", "name": "声望华夏-100$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761821" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761821;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 06:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761821;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2682", "name": "声望华夏-100$-1130-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761749" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761749;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-09 00:00:00;2017-11-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761749;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2526", "name": "套装材料-促销-100-1109", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761702" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761702" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2476", "name": "套装图纸-5-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761703" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761703" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2477", "name": "套装图纸-20-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761704" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761704" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2478", "name": "套装图纸-100-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761709" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761709" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2482", "name": "套装图纸-5-窗口-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761710" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761710" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2483", "name": "套装图纸-20-窗口-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761711" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761711" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2484", "name": "套装图纸-100-窗口-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761813" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761813;<;6" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 00:00:00;2017-12-03 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761813;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2675", "name": "学士套装（蓝）-5$-1129", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761814" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761814;<;6" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 00:00:00;2017-12-03 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761814;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2676", "name": "学士套装（紫）-20$-1129", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;7" }],
              ":@": { "type": "54", "name": "天未付费", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761614;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2353", "name": "小额超值", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761617;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761617;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2371", "name": "巨龙世界杯-5-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761617" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761617;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761618;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761618;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2372", "name": "巨龙世界杯-10-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761618" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761618;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761619;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761619;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2373", "name": "巨龙世界杯-20-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761619" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761619;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761620;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761620;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2374", "name": "巨龙世界杯-50-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761620" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761620;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761621;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761621;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2375", "name": "巨龙世界杯-100-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761622" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761622;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-18 00:00:00;2017-09-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761622;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2376", "name": "巨龙世界杯-100-大R-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759864" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759864;<;5" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "231;520;430;472;1314;1000;1037;275" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759864;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2447", "name": "巨龙季后赛-20$-1021", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759865" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759865;<;5" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "231;520;430;472;1314;1000;1037;275" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759865;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2448", "name": "巨龙季后赛-100$-1021", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761785" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;35" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-24 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761785;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761785;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2612", "name": "感恩节纹章+精铁-100$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761786;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761786;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2613", "name": "感恩节-1$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761786" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761786;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761787;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761787;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2614", "name": "感恩节-5$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761787" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761787;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761788;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761788;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2615", "name": "感恩节-10$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761788" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761788;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761789;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761789;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2616", "name": "感恩节-20$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761789" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761789;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761790;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761790;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2617", "name": "感恩节-50$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761790" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761790;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761791;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761791;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2618", "name": "感恩节-100$-1123", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761792" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761792;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-23 00:00:00;2017-11-25 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761792;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2619", "name": "感恩节-100$-1123-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761777;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761777;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2565", "name": "感恩节前夕-1$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761777" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761778;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761777;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761778;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2566", "name": "感恩节前夕-5$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761778" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761779;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761778;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761779;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2567", "name": "感恩节前夕-10$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761779" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761780;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761779;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761780;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2568", "name": "感恩节前夕-20$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761780" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761781;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761780;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761781;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2569", "name": "感恩节前夕-50$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761781" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761782;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761781;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761782;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2570", "name": "感恩节前夕-100$-1120", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761783" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761783;<;2" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761783;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2571", "name": "感恩节前夕-100$-1120-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761616" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761616;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-28 00:00:00;2017-09-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1900" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761616;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2370", "name": "单兵攻城BUFF加强版", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761822" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;35" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761822;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;8801-8820" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761822;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2683", "name": "打架三件套", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761539" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761539;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1900" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-28 00:00:00;2017-09-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761539;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2245", "name": "单兵攻城BUFF", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761524" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761524;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761524;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2214", "name": "日常-城建加速-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761525" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761525;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761525;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2215", "name": "日常-城建加速-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761526" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761526;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761526;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2216", "name": "日常-城建加速-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761527" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761527;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761527;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2228", "name": "日常-城建混合-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761528" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761528;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761528;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2229", "name": "日常-城建混合-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761529" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761529;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761529;240" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2231", "name": "日常-城建混合-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761540" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761540;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761540;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2254", "name": "日常-水晶-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761541" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761541;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761541;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2255", "name": "日常-水晶-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761542" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761542;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761542;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2256", "name": "日常-水晶-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761514" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761514;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761514;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2199", "name": "日常-科研加速-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761515" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761515;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761515;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2200", "name": "日常-科研加速-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761516" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761516;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761516;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2202", "name": "日常-科研加速-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761518" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761518;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761518;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1538", "name": "日常-科研混合-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761519" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761519;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761519;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1541", "name": "日常-科研混合-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761520" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761520;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761520;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1543", "name": "日常-科研混合-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760395" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760395;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760395;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2208", "name": "日常-科研石-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760397" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760397;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760397;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2209", "name": "日常-科研石-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760399" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760399;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760399;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2210", "name": "日常-科研石-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761549" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761549;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761549;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2277", "name": "日常-英雄经验-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761550" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761550;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761550;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2278", "name": "日常-英雄经验-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761551" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761551;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761551;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2279", "name": "日常-英雄经验-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761567" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761567;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761567;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2306", "name": "日常-资源-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761568" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761568;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761568;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2307", "name": "日常-资源-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761569" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761569;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761569;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2308", "name": "日常-资源-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759133" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759133;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759133;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2237", "name": "日常-造兵混合-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759135" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759135;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759135;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2238", "name": "日常-造兵混合-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759137" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759137;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759137;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2239", "name": "日常-造兵混合-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761546" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761546;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761546;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2274", "name": "日常-领主经验-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761547" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761547;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761547;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2275", "name": "日常-领主经验-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761548" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761548;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761548;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2276", "name": "日常-领主经验-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761543" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761543;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761543;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2257", "name": "日常-龙技能-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761544" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761544;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761544;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2258", "name": "日常-龙技能-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761545" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761545;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761545;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2259", "name": "日常-龙技能-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761535" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761535;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761535;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2240", "name": "日常-龙韵石-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761536" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761536;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761536;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2241", "name": "日常-龙韵石-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761537" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761537;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761537;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2242", "name": "日常-龙韵石-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761552" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761552;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761552;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2284", "name": "日常-龙魔法石-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761553" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761553;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761553;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2285", "name": "日常-龙魔法石-20$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761554" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761554;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761554;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2286", "name": "日常-龙魔法石-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761823;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761823;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2684", "name": "日本appbank-1$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761823" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761823;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761825;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761825;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2685", "name": "日本appbank-5$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761825" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761825;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761826;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761826;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2686", "name": "日本appbank-10$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761826" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761826;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761827;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761827;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2687", "name": "日本appbank-20$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761827" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761827;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761828;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761828;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2688", "name": "日本appbank-50$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761828" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761828;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761829;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761829;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2689", "name": "日本appbank-100$-1130", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761830" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761830;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761830;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2690", "name": "日本appbank-100$-1130-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761450" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761450;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761450;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2090", "name": "干TMD资源商-秘银4800K", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761452" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761452;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761452;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2102", "name": "干TMD资源商-秘银48M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761406" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761406;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761406;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1991", "name": "干TMD资源商-木粮120M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761407" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761407;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761407;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1994", "name": "干TMD资源商-木粮1200M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761409" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761409;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761409;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2009", "name": "干TMD资源商-铁19M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761410" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761410;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761410;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2010", "name": "干TMD资源商-铁192M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761669;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761669;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2436", "name": "活动-每日充值-造兵", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761671;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761671;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2437", "name": "活动-每日充值-造兵 cp", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761672;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761672;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2438", "name": "活动-每日充值-造兵 cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761681;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761681;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2450", "name": "活动-每日充值-城建", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761682;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761682;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2452", "name": "活动-每日充值-城建 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761683;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761683;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2453", "name": "活动-每日充值-城建 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761684;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761684;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2454", "name": "活动-每日充值-科研", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761685;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761685;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2455", "name": "活动-每日充值-科研 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761686;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761686;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2456", "name": "活动-每日充值-科研 cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761776" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-12-09 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "9999;761776;<;6" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761776;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2562", "name": "炼金学士-10-171117", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761750" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-15 00:00:00;2017-11-16 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761750;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2528", "name": "熊猫礼盒-10$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761751" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-15 00:00:00;2017-11-16 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761751;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2529", "name": "熊猫礼盒-100$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761759" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;35" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761759;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761759;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2540", "name": "精铁-日常-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761735;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761735;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2512", "name": "纯文明结晶", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761735" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761735;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761736;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761736;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2513", "name": "纯文明结晶 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761736" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761736;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761737;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761737;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2514", "name": "纯文明结晶 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761737" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761737;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761738;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761738;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2515", "name": "纯文明结晶 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761738" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761738;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761739;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761739;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2516", "name": "纯文明结晶 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761739" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761739;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761740;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761740;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2517", "name": "纯文明结晶 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761741" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761741;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-29 00:00:00;2017-11-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761741;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2518", "name": "纯文明结晶 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761623;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761623;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2377", "name": "美国线下-5-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761623" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761623;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761624;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761624;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2378", "name": "美国线下-10-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761624" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761624;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761625;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761625;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2379", "name": "美国线下-20-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761625" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761625;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761626;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761626;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2380", "name": "美国线下-50-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761626" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761626;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761627;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761627;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2381", "name": "美国线下-100-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761628" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761628;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-16 00:00:00;2017-09-17 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;US" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761628;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2382", "name": "美国线下-100-大R-0915", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761630" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        { "conditions": [] },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761630;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2389", "name": "联盟捐献道具-5$", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761760" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761760" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2541", "name": "英雄图纸-5-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761761" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761761" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2542", "name": "英雄图纸-20-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761762" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761762" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2543", "name": "英雄图纸-100-页签-171114", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761763" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761763" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2544", "name": "英雄图纸-5-窗口-171114", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761764" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761764" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2545", "name": "英雄图纸-20-窗口-171114", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761765" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761765" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2546", "name": "英雄图纸-100-窗口-171114", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761502" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761502;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;false" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761502;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "2175",
        "name": "贤者之塔加速-6000H-100$-0810-大R",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761497;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761497;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2176", "name": "贤者之塔加速-400H-5$-0810", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761497" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761498;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761497;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761498;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2177", "name": "贤者之塔加速-800H-10$-0810", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761498" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761499;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761498;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761499;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2178", "name": "贤者之塔加速-1400H-20$-0810", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761499" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761500;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761499;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761500;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2179", "name": "贤者之塔加速-3200H-50$-0810", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761500" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761501;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761500;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5;99.99;1;5;300000;990000000;true" }],
              ":@": {
                "type": "105",
                "name":
                  "玩家X次充值内，有[a,b]次购买了了Y$的礼包并且该玩家总购买金币数量范围为[m,n]",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761501;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2180", "name": "贤者之塔加速-6000H-100$-0810", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761766" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761766" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2547", "name": "钢-1-页签-171115", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761767" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761767" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2548", "name": "钢-20-页签-171115", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761768" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761768" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2549", "name": "钢-1-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761769" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761769" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2550", "name": "钢-20-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761771" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761771" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2551", "name": "钢-100-页签-171115", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761770" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761770" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2552", "name": "钢-100-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761784" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761784;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-21 00:00:00;2017-11-22 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761784;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2609", "name": "钻石-100-促销-171121", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761733" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761733" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2554", "name": "钻石-5-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761774" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761774" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2555", "name": "钻石-20-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761775" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761775" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2556", "name": "钻石-100-窗口-171115", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761831;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761831;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2693", "name": "阿联酋国庆-1$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761831" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761831;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761832;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761832;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2694", "name": "阿联酋国庆-5$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761832" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761832;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761833;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761833;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2695", "name": "阿联酋国庆-10$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761833" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761833;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761834;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761834;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2696", "name": "阿联酋国庆-20$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761834" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761834;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761835;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761835;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2697", "name": "阿联酋国庆-50$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761835" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761835;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761836;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761836;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2698", "name": "阿联酋国庆-100$-1201", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761837" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761837;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 08:00:00;2017-12-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;AE" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761837;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2699", "name": "阿联酋国庆-100$-1201-大R", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761803" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761803;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761804;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-28 00:00:00;2017-11-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;KR" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761804;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2665", "name": "韩国调税-5-1128", "state": "2", "openType": "2" },
    },
  ];
}
