import { type GameplayCatalogElement } from "../catalog.ts";

export function part4(): GameplayCatalogElement[] {
  return [
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
              "event": [{ "#text": "761804" }],
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
              "condition": [{ "#text": "24;761804;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761805;<;1" }],
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
              "action": [{ "#text": "761805;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2666", "name": "韩国调税-10-1128", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761805" }],
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
              "condition": [{ "#text": "24;761805;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761806;<;1" }],
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
              "action": [{ "#text": "761806;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2667", "name": "韩国调税-20-1128", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761806" }],
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
              "condition": [{ "#text": "24;761806;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761807;<;1" }],
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
              "action": [{ "#text": "761807;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2668", "name": "韩国调税-50-1128", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761807" }],
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
              "condition": [{ "#text": "24;761807;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761808;<;1" }],
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
              "action": [{ "#text": "761808;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2669", "name": "韩国调税-100-1128", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761809" }],
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
              "condition": [{ "#text": "24;761809;<;3" }],
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
              "action": [{ "#text": "761628;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2670", "name": "韩国调税-100-1128-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761803;<;1" }],
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
              "action": [{ "#text": "761803;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2671", "name": "韩国调税-1-1128", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761607;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761607;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2339", "name": "韩国线下-5", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761607" }],
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
              "condition": [{ "#text": "24;761607;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761608;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761608;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2340", "name": "韩国线下-10", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761608" }],
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
              "condition": [{ "#text": "24;761608;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761609;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761609;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2341", "name": "韩国线下-20", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761609" }],
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
              "condition": [{ "#text": "24;761609;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761610;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761610;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2342", "name": "韩国线下-50", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761610" }],
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
              "condition": [{ "#text": "24;761610;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761611;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761611;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2343", "name": "韩国线下-100", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761612" }],
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
              "condition": [{ "#text": "24;761612;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-09 00:00:00;2017-09-10 00:00:00" }],
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
              "action": [{ "#text": "761612;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2344", "name": "韩国线下-100-高档", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;761802;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;10" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-24 00:00:00;2017-11-27 00:00:00" }],
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
              "action": [{ "#text": "761802;510" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2662", "name": "超超值首充", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "1;761794;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761794;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2620", "name": "黑五-1$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761794" }],
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
              "condition": [{ "#text": "1;761794;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761795;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761795;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2621", "name": "黑五-5$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761795" }],
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
              "condition": [{ "#text": "1;761795;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761796;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761796;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2622", "name": "黑五-10$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761796" }],
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
              "condition": [{ "#text": "1;761797;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761796;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761797;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2623", "name": "黑五-20$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761797" }],
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
              "condition": [{ "#text": "1;761797;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761798;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761798;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2624", "name": "黑五-50$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761798" }],
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
              "condition": [{ "#text": "1;761798;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761799;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761799;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2625", "name": "黑五-100$-1123", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761800" }],
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
              "condition": [{ "#text": "1;761800;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 00:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761800;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2626", "name": "黑五-100$-1123-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;761202;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;7" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
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
              "action": [{ "#text": "761202;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2627", "name": "黑五超值-未付费玩家-1124", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;761433;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "condition": [{ "#text": "1;3;5;0" }],
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
              "action": [{ "#text": "761433;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2058", "name": "龙技能经验-5$-0801", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761433" }],
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
              "condition": [{ "#text": "24;761434;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761433;==;1" }],
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
              "condition": [{ "#text": "1;3;5;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761434;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2059", "name": "龙技能经验-10$-0801", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761434" }],
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
              "condition": [{ "#text": "24;761435;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761434;==;1" }],
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
              "condition": [{ "#text": "1;3;5;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761435;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2060", "name": "龙技能经验-20$-0801", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761435" }],
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
              "condition": [{ "#text": "24;761436;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761435;==;1" }],
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
              "condition": [{ "#text": "1;3;5;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761436;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2061", "name": "龙技能经验-50$-0801", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761436" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761437" }],
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
              "condition": [{ "#text": "24;761437;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761436;==;1" }],
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
              "condition": [{ "#text": "1;3;5;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761437;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2062", "name": "龙技能经验-100$-0801", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761438" }],
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
              "condition": [{ "#text": "24;761438;<;5" }],
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
              "condition": [{ "#text": "1;3;5;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761438;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2063", "name": "龙技能经验-100$-0801-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n" },
  ];
}
