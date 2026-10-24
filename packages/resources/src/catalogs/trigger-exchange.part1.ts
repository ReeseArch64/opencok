import { type GameplayCatalogElement } from "../catalog.ts";

export function part1(): GameplayCatalogElement[] {
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
              "event": [{ "#text": "761186" }],
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
              "condition": [{ "#text": "24;761186;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761187;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-10 00:00:00;2017-11-10 10:00:00" }],
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
              "action": [{ "#text": "761187;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1874", "name": "年中 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761187" }],
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
              "condition": [{ "#text": "24;761187;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761188;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-10 00:00:00;2017-11-10 10:00:00" }],
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
              "action": [{ "#text": "761188;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1875", "name": "年中 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761188" }],
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
              "condition": [{ "#text": "24;761188;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761189;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-10 00:00:00;2017-11-10 10:00:00" }],
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
              "action": [{ "#text": "761189;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1876", "name": "年中 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761189" }],
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
              "condition": [{ "#text": "24;761189;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761190;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-10 00:00:00;2017-11-10 10:00:00" }],
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
              "action": [{ "#text": "761190;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1877", "name": "年中 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761191" }],
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
              "condition": [{ "#text": "24;761191;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300000;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-10 00:00:00;2017-11-10 10:00:00" }],
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
              "action": [{ "#text": "761191;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1878", "name": "年中 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761196;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "761196;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1883", "name": "十万水晶", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761196" }],
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
              "condition": [{ "#text": "24;761196;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761197;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "2;3;5" }],
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
              "action": [{ "#text": "761197;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1884", "name": "十万水晶 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761197" }],
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
              "condition": [{ "#text": "24;761197;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761198;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "2;3;5" }],
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
              "action": [{ "#text": "761198;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1885", "name": "十万水晶 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761199" }],
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
              "condition": [{ "#text": "24;761199;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761200;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "2;3;5" }],
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
              "action": [{ "#text": "761200;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1887", "name": "十万水晶 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761201" }],
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
              "condition": [{ "#text": "24;761201;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "2;3;5" }],
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
              "action": [{ "#text": "761201;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1888", "name": "十万水晶 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761198" }],
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
              "condition": [{ "#text": "24;761198;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761199;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "2;3;5" }],
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
              "action": [{ "#text": "761199;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1939", "name": "十万水晶 cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760422;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760422;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1737", "name": "30热卖", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760422" }],
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760422;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760423;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760423;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1738", "name": "30热卖 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760423" }],
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760423;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760424;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760424;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1739", "name": "30热卖 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760424" }],
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760424;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760425;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760425;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1740", "name": "30热卖 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760425" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760426" }],
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760425;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760426;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760426;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1741", "name": "30热卖 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760427" }],
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
              "condition": [{ "#text": ">=;30" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760427;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "760427;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1742", "name": "30热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761484;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761484;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1928", "name": "龙韵石-5000-5$-0809", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761484" }],
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
              "condition": [{ "#text": "24;761484;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761492;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761492;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1934", "name": "龙韵石-10000-10$-0809", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761492" }],
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
              "condition": [{ "#text": "24;761492;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761493;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761493;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1935", "name": "龙韵石-20000-20$-0809", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761493" }],
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
              "condition": [{ "#text": "24;761493;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761494;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761494;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1936", "name": "龙韵石-48000-50$-0809", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761494" }],
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
              "condition": [{ "#text": "24;761494;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761495;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761495;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1937", "name": "龙韵石-90000-100$-0809", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761496" }],
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
              "condition": [{ "#text": "24;761496;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "condition": [{ "#text": "1;3;5;6" }],
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
              "action": [{ "#text": "761496;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1938", "name": "龙韵石-90000-100$-0809-大R", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761426" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761426;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761431;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761431;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2048", "name": "新49.99蜡烛", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761431" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761431;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761432;<=;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761432;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2049", "name": "新99.99蜡烛", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761432" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761432;<=;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761432;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2050", "name": "新99.99蜡烛 cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761424;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761424;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2045", "name": "新4.99蜡烛", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761424" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761424;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761425;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761425;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2046", "name": "新9.99蜡烛", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761425" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761425;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761426;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1918" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-20 00:00:00;2017-11-21 00:00:00" }],
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
              "action": [{ "#text": "761426;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2047", "name": "新19.99蜡烛", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759211;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-03-22 00:23:01;2017-03-23 00:00:00" }],
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
              "action": [{ "#text": "759211;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "856", "name": "补包-黑曜石", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759211" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759211;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759211;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-03-22 00:23:01;2017-03-23 00:00:00" }],
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
              "action": [{ "#text": "759212;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "857", "name": "黑曜石 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759212" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759212;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759213;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-03-22 00:23:01;2017-03-23 00:00:00" }],
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
              "action": [{ "#text": "759213;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "858", "name": "黑曜石 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759213" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759213;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759214;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-03-22 00:23:01;2017-03-23 00:00:00" }],
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
              "action": [{ "#text": "759214;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "859", "name": "黑曜石 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759214" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759214;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-03-22 00:23:01;2017-03-23 00:00:00" }],
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
              "action": [{ "#text": "759214;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "860", "name": "黑曜石 cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759264;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759264;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "794", "name": "特殊-蜡烛1", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759264" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759264;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759265;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759265;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "795", "name": "特殊-蜡烛 cp1", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759265" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759265;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759266;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759266;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "796", "name": "特殊-蜡烛 cp cp1", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759266" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759266;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759267;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759267;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "797", "name": "特殊-蜡烛 cp cp cp1", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759267" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759267;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759268;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "798", "name": "特殊-蜡烛 cp cp cp cp1", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759268" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1701" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-24 00:00:00;2017-04-25 00:00:00" }],
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
              "action": [{ "#text": "759268;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "799", "name": "特殊-蜡烛 cp cp cp cp cp1", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759543;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-07 00:00:00;2017-06-08 00:00:00" }],
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
              "action": [{ "#text": "759543;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1155", "name": "补包-龙组合礼包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759183;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759183;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "808", "name": "幸运日-科技幸运日", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759183" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759183;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759184;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759184;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "809", "name": "幸运日-科技幸运日 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759184" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759184;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759185;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759185;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "810", "name": "幸运日-科技幸运日 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759185" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759185;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759186;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759186;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "811", "name": "幸运日-科技幸运日 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759186" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759187" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759186;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759187;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "812", "name": "幸运日-科技幸运日 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759187" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759187;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759187;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "813",
        "name": "幸运日-科技幸运日 cp cp cp cp cp",
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759193;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759193;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1003", "name": "幸运日-洗炼", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759193" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759193;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759194;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759194;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1004", "name": "幸运日-洗炼 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759194" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759194;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759195;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759195;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1005", "name": "幸运日-洗炼 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759195" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759195;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759196;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759196;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1006", "name": "幸运日-洗炼 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759196" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759197" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759196;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759197;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759197;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1007", "name": "幸运日-洗炼 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759197" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759197;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803002" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759197;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1008", "name": "幸运日-洗炼 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759203;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759203;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "897", "name": "幸运日-造兵", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759203" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759203;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759204;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759204;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "898", "name": "幸运日-造兵 cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759204" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759204;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759205;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759205;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "899", "name": "幸运日-造兵 cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759205" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759205;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759206;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759206;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "900", "name": "幸运日-造兵 cp cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759206" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759207" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759206;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759207;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759207;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "901", "name": "幸运日-造兵 cp cp cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759207" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759207;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759207;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "902", "name": "幸运日-造兵 cp cp cp cp cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759198;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759198;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1171", "name": "幸运日-造兵前夕", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759198" }],
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759198;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759199;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759199;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1172", "name": "幸运日-造兵前夕 cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759199" }],
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759199;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759200;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759200;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1173", "name": "幸运日-造兵前夕 cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759200" }],
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759200;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759201;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759201;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1174", "name": "幸运日-造兵前夕 cp cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759201" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759202" }],
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759201;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759202;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759202;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1175", "name": "幸运日-造兵前夕 cp cp cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759202" }],
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
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759202;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-04-05 00:00:00;2017-04-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759202;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1176",
        "name": "幸运日-造兵前夕 cp cp cp cp cp",
        "state": "0",
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759173;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759173;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "871", "name": "幸运日-城建", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759173" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759173;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759174;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759174;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "875", "name": "幸运日-城建 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759174" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759174;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759175;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759175;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "876", "name": "幸运日-城建 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759175" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759175;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759176;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759176;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "877", "name": "幸运日-城建 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759176" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759177" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759176;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759177;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759177;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "878", "name": "幸运日-城建 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759177" }],
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759177;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759177;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "879", "name": "幸运日-城建 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759545;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759545;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1157", "name": "幸运日-贤者之塔前夕", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759545" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759545;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759546;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759546;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1158", "name": "幸运日-贤者之塔前夕 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759546" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759546;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759547;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759547;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1159", "name": "幸运日-贤者之塔前夕 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759547" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759547;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759548;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759548;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1160", "name": "幸运日-贤者之塔前夕 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759548" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759548;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759549;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759549;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1161",
        "name": "幸运日-贤者之塔前夕 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759549" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759549;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1848" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-08 00:00:00;2017-06-09 00:00:00" }],
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
              "action": [{ "#text": "759549;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1162",
        "name": "幸运日-贤者之塔前夕 cp cp cp cp cp",
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759846;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759846;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1163", "name": "幸运日-贤者之塔", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759846" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759846;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759847;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759847;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1164", "name": "幸运日-贤者之塔 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759847" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759847;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759848;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759848;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1165", "name": "幸运日-贤者之塔 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759848" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759848;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759849;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759849;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1166", "name": "幸运日-贤者之塔 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759849" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759849;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759850;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759850;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1167", "name": "幸运日-贤者之塔 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759851" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759851;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "759851;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1168",
        "name": "幸运日-贤者之塔 cp cp cp cp cp",
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
              "condition": [{ "#text": "24;760566;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760567;<;1" }],
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
              "action": [{ "#text": "760566;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1826", "name": "科技幸运日效果提升5%", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "24;760566;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760567;<;1" }],
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
              "action": [{ "#text": "760567" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1827", "name": "科技幸运日效果提升20%", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "24;760568;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760569;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "760568" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1828", "name": "造兵幸运日效果提升5%", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760568;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760569;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "760569" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1829", "name": "造兵幸运日效果提升20%", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760570;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760571;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
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
              "action": [{ "#text": "760570" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1830", "name": "城建幸运日效果提升3%", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760570;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760571;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803004" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760571" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1831", "name": "城建幸运日效果提升10%", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760572;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760573;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760572" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1832", "name": "贤者幸运日效果提升3%", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true" }],
              ":@": { "type": "89", "name": "幸运日活动是否开启", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760572;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760573;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803007" }],
              ":@": { "type": "92", "name": "当前是否是特定幸运日", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760573" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1833", "name": "贤者幸运日效果提升10%", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "761629" }],
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761629;4" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2383", "name": "英雄碎片周卡 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80010" }],
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80010;4" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1414", "name": "英雄碎片周卡", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80009" }],
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
              "condition": [{ "#text": "80009" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80009;7" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1169", "name": "蜡烛周卡（下）", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "9006" }],
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
              "condition": [{ "#text": "9006" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "9006;1" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "922", "name": "老金币月卡", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "760394" }],
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
              "condition": [{ "#text": "<=;14" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760394;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "760394" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760394;1" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "923", "name": "一刀周卡", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80002" }],
              ":@": { "type": "3", "name": "礼包购买验证", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "80002" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80002;2" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "985", "name": "荣耀周卡", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80003" }],
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
              "condition": [{ "#text": "80003" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80003;3" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "986", "name": "4.99成长周卡（下）", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80004" }],
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
              "condition": [{ "#text": "80004" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80004;3" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "987", "name": "9.99成长周卡（下）", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;280005" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.45.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
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
              "action": [{ "#text": "80005;1" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "988", "name": "装备月卡", "state": "-1", "openType": "2" },
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
              "event": [{ "#text": "80006" }],
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
              "condition": [{ "#text": "<;16" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "80006" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80006;3" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "989", "name": "直升16堡周卡（下）", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80007" }],
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
              "action": [{ "#text": "80007;4" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "990", "name": "二队列周卡", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "80008" }],
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
              "condition": [{ "#text": "80008" }],
              ":@": { "type": "97", "name": "月卡下架", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "80008;7" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "994", "name": "龙魔法石周卡（下）", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1800" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758760;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
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
              "action": [{ "#text": "758760;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "276", "name": "巨龙", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1800" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758761;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
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
              "action": [{ "#text": "758761;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "277", "name": "巨龙 cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1500" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758762;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "758762;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "278", "name": "远古", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "758762" }],
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
              "condition": [{ "#text": "1-1500" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758762;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758763;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "758763;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "279", "name": "远古 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-1500" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758764;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "758764;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "280", "name": "远古 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "758764" }],
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
              "condition": [{ "#text": "1-1500" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758764;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758765;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "758765;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "281", "name": "远古 cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759250;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759250;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "893", "name": "老装备礼包", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759250" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759250;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759251;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759251;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "894", "name": "老装备礼包 cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759251" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759252" }],
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759251;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759252;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759252;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "895", "name": "老装备礼包 cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759252" }],
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
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759252;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759252;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "896", "name": "老装备礼包 cp cp cp", "state": "0", "openType": "2" },
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759143;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759143;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "701", "name": "日常-装备材料", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759143" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759143;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759144;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
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
              "action": [{ "#text": "759144;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "702", "name": "周四-装备材料 cp", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759144" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759144;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759145;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
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
              "action": [{ "#text": "759145;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "703", "name": "周四-装备材料 cp cp", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759145" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759145;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759146;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759146;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "704", "name": "周四-装备材料 cp cp cp", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759146" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759146;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759147;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759147;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "705", "name": "周四-装备材料 cp cp cp cp", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759147" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759147;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759147;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "706", "name": "周四-装备材料 cp cp cp cp cp", "state": "1", "openType": "2" },
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
              "event": [{ "#text": "759245" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759245;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759245;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "713", "name": "周四-复仇", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759246" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759246;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759246;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "714", "name": "周四-复仇 cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759163;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759163;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "726", "name": "周五-贤者之塔", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759163" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759163;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759164;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759164;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "728", "name": "周五-贤者之塔 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759164" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759164;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759165;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759165;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "729", "name": "周五-贤者之塔 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759165" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759165;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759166;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759166;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "730", "name": "周五-贤者之塔 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759166" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759166;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759167;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759167;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "731", "name": "周五-贤者之塔 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759167" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759167;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;300000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759167;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "732", "name": "周五-贤者之塔 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759296" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;70001;900000000" }],
              ":@": { "type": "31", "name": "玩家在n天内的付费金币数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759296;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759296;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "573", "name": "组合礼包-资源加速", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759556" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;0;70000" }],
              ":@": { "type": "31", "name": "玩家在n天内的付费金币数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759556;<;5" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759556;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1170", "name": "组合礼包-资源加速 cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759088;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759088;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "611", "name": "日常-加速-通用低档", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759088" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759088;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759089;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759089;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "612", "name": "日常-加速-通用低档 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759089" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759089;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759090;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759090;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "613", "name": "日常-加速-通用低档 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759090" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759090;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759091;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759091;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "614", "name": "日常-加速-通用低档 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759091" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759091;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759092;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759092;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "615",
        "name": "日常-加速-通用低档 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759092" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759092;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759093;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759093;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "616",
        "name": "日常-加速-通用低档 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759093" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759093;<=;4" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;230000" }],
              ":@": { "type": "45", "name": "总付费金币", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
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
              "action": [{ "#text": "759093;250" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "617", "name": "日常-加速-通用高档", "state": "2", "openType": "2" },
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759114;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759114" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "643", "name": "日常-加速-贤者之塔低档", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759114" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759114;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759115;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759115" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "644", "name": "日常-加速-贤者之塔低档 cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759115" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759115;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759116;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759116" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "645", "name": "日常-加速-贤者之塔低档 cp cp", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759116" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759116;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759117;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759117" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "646",
        "name": "日常-加速-贤者之塔低档 cp cp cp",
        "state": "0",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759117" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759117;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759118;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759118" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "647",
        "name": "日常-加速-贤者之塔低档 cp cp cp cp",
        "state": "0",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759118" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759118;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759119;<=;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759119" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "648",
        "name": "日常-加速-贤者之塔低档 cp cp cp cp cp",
        "state": "0",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759119" }],
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
              ":@": { "type": "17", "name": "开服时间下限", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759119;<=;4" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;230000" }],
              ":@": { "type": "45", "name": "总付费金币", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;2;5" }],
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
              "action": [{ "#text": "759119" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "649", "name": "日常-加速-贤者之塔高档", "state": "0", "openType": "2" },
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
              "event": [{ "#text": "759462" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759462;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "880", "name": "日常-组合礼包-英雄碎片", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759450" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759450;280" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "881", "name": "日常-组合礼包-英雄碎片 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761638;<;1" }],
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
              "action": [{ "#text": "761638;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2404", "name": "17中秋特惠-1$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761638" }],
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
              "condition": [{ "#text": "1;761638;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761639;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761639;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2405", "name": "17中秋特惠-5$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761639" }],
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
              "condition": [{ "#text": "1;761639;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761640;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761640;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2406", "name": "17中秋特惠-10$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761640" }],
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
              "condition": [{ "#text": "1;761640;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761641;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761641;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2407", "name": "17中秋特惠-20$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761641" }],
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
              "condition": [{ "#text": "1;761641;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761642;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761642;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2408", "name": "17中秋特惠-50$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761642" }],
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
              "condition": [{ "#text": "1;761642;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761643;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761643;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2409", "name": "17中秋特惠-100$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761644" }],
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
              "condition": [{ "#text": "1;761644;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-30 04:00:00;2017-12-01 00:00:00" }],
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
              "action": [{ "#text": "761644;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2410", "name": "17中秋特惠-100$-0930-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761645;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761645;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2411", "name": "17台湾双十-1$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761645" }],
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
              "condition": [{ "#text": "24;761646;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761645;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761646;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2412", "name": "17台湾双十-5$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761646" }],
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
              "condition": [{ "#text": "24;761647;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761646;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761647;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2413", "name": "17台湾双十-10$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761647" }],
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
              "condition": [{ "#text": "24;761648;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761647;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761648;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2414", "name": "17台湾双十-20$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761648" }],
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
              "condition": [{ "#text": "24;761649;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761648;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761649;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2415", "name": "17台湾双十-50$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761649" }],
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
              "condition": [{ "#text": "24;761650;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761649;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761650;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2416", "name": "17台湾双十-100$-1009", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761651" }],
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
              "condition": [{ "#text": "24;761651;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 04:00:00;2017-10-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW" }],
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
              "action": [{ "#text": "761651;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2417", "name": "17台湾双十-100$-1009-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761631;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761631;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2395", "name": "17国庆特惠-1$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761631" }],
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
              "condition": [{ "#text": "24;761632;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761631;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761632;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2396", "name": "17国庆特惠-5$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761632" }],
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
              "condition": [{ "#text": "24;761633;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761632;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761633;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2397", "name": "17国庆特惠-10$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761633" }],
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
              "condition": [{ "#text": "24;761634;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761633;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761634;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2398", "name": "17国庆特惠-20$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761634" }],
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
              "condition": [{ "#text": "24;761635;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761634;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761635;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2399", "name": "17国庆特惠-50$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761635" }],
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
              "condition": [{ "#text": "24;761636;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761635;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761636;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2400", "name": "17国庆特惠-100$-0930", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761637" }],
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
              "condition": [{ "#text": "24;761637;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
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
              "action": [{ "#text": "761637;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2401", "name": "17国庆特惠-100$-0930-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761652;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761652;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2418", "name": "17秋季促销-1$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761652" }],
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
              "condition": [{ "#text": "24;761653;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761652;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761653;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2419", "name": "17秋季促销-5$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761653" }],
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
              "condition": [{ "#text": "24;761654;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761653;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761654;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2420", "name": "17秋季促销-10$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761654" }],
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
              "condition": [{ "#text": "24;761655;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761654;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761655;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2421", "name": "17秋季促销-20$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761655" }],
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
              "condition": [{ "#text": "24;761656;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761655;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761656;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2422", "name": "17秋季促销-50$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761656" }],
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
              "condition": [{ "#text": "24;761657;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761656;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761657;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2423", "name": "17秋季促销-100$-1010", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "761658" }],
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
              "condition": [{ "#text": "24;761658;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-10 00:00:00;2017-10-11 00:00:00" }],
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
              "action": [{ "#text": "761658;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2424", "name": "17秋季促销-100$-1010-大R", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;758961;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-22 00:00:00;2016-12-29 00:00:00" }],
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
              "action": [{ "#text": "758961" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "469", "name": "活动配合礼包-许愿", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;758962;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-22 00:00:00;2017-01-03 00:00:00" }],
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
              "action": [{ "#text": "758962" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "470", "name": "活动配合礼包-打怪", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;758963;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-01-11 00:00:00;2017-01-18 00:00:00" }],
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
              "action": [{ "#text": "758963" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "471", "name": "活动配合礼包-城外采集", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;758964;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-22 00:00:00;2016-12-29 00:00:00" }],
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
              "action": [{ "#text": "758964" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "472", "name": "活动配合礼包-城内收集", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759463;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759463;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "939", "name": "合服D1-城建", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759463" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759463;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759464;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759464;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "940", "name": "合服D1-城建 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759464" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759464;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759465;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759465;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "941", "name": "合服D1-城建 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759465" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759465;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759466;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759466;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "942", "name": "合服D1-城建 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759466" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759467" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759466;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759467;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759467;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "943", "name": "合服D1-城建 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759467" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759467;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759467;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "944", "name": "合服D1-城建 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759468;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759468;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "945", "name": "合服D2-科技", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759468" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759468;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759469;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759469;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "946", "name": "合服D2-科技 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759469" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759469;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759470;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759470;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "947", "name": "合服D2-科技 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759470" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759470;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759471;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759471;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "948", "name": "合服D2-科技 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759471" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759472" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759471;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759472;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759472;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "949", "name": "合服D2-科技 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759472" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759472;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;24" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759472;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "950", "name": "合服D2-科技 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759473;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759473;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "951", "name": "合服D3-造兵", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759473" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759473;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759474;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759474;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "952", "name": "合服D3-造兵 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759474" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759474;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759475;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759475;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "953", "name": "合服D3-造兵 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759475" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759475;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759476;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759476;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "954", "name": "合服D3-造兵 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759476" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759477" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759476;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759477;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759477;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "955", "name": "合服D3-造兵 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759477" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759477;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;48" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759477;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "956", "name": "合服D3-造兵 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759463;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759463;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "959", "name": "合服D4-城建", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759463" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759463;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759464;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759464;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "960", "name": "合服D4-城建 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759464" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759464;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759465;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759465;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "961", "name": "合服D4-城建 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759465" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759465;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759466;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759466;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "962", "name": "合服D4-城建 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759466" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759467" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759466;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759467;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759467;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "963", "name": "合服D4-城建 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759467" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759467;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;72" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759467;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "964", "name": "合服D4-城建 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759468;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759468;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "965", "name": "合服D5-科技", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759468" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759468;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759469;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759469;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "966", "name": "合服D5-科技 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759469" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759469;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759470;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759470;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "967", "name": "合服D5-科技 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759470" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759470;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759471;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759471;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "968", "name": "合服D5-科技 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759471" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759472" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759471;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759472;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759472;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "969", "name": "合服D5-科技 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759472" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759472;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;96" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759472;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "970", "name": "合服D5-科技 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759473;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759473;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "971", "name": "合服D6-造兵", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759473" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759473;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759474;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759474;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "972", "name": "合服D6-造兵 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759474" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759474;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759475;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759475;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "973", "name": "合服D6-造兵 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759475" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759475;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759476;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759476;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "974", "name": "合服D6-造兵 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759476" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759477" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759476;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759477;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759477;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "975", "name": "合服D6-造兵 cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759477" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759477;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;120" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;144" }],
              ":@": { "type": "90", "name": "合服时间限制(小时)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759477;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "976", "name": "合服D6-造兵 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759678" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759678;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1295", "name": "最强王国-周一采集", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759679" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759679;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1296", "name": "最强王国-周一采集 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759680" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759680;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1297", "name": "最强王国-周一采集 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759696" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759696;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1298", "name": "最强王国-周一采集 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759697" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759697;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1299",
        "name": "最强王国-周一采集 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759698" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759698;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1300",
        "name": "最强王国-周一采集 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759681" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759681;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1301", "name": "最强王国-周二城建", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759682" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759682;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1302", "name": "最强王国-周二城建 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759683" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759683;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1303", "name": "最强王国-周二城建 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759699" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759699;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1304", "name": "最强王国-周二城建 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759700" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759700;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1305",
        "name": "最强王国-周二城建 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759701" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759701;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1306",
        "name": "最强王国-周二城建 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759684" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759684;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1307", "name": "最强王国-周三打怪", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759685" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759685;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1308", "name": "最强王国-周三打怪 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759686" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759686;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1309", "name": "最强王国-周三打怪 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759702" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759702;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1310", "name": "最强王国-周三打怪 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759703" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759703;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1311",
        "name": "最强王国-周三打怪 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759704" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759704;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1312",
        "name": "最强王国-周三打怪 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759687" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759687;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1313", "name": "最强王国-周四科研", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759688" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759688;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1314", "name": "最强王国-周四科研 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759689" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759689;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1315", "name": "最强王国-周四科研 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759705" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759705;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1316", "name": "最强王国-周四科研 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759706" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759706;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1317",
        "name": "最强王国-周四科研 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759707" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759707;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1318",
        "name": "最强王国-周四科研 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759690" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759690;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1319", "name": "最强王国-周五造兵", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759691" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759691;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1320", "name": "最强王国-周五造兵 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759692" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759692;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1321", "name": "最强王国-周五造兵 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759708" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759708;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1322", "name": "最强王国-周五造兵 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759709" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759709;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1323",
        "name": "最强王国-周五造兵 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759710" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "7" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759710;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1324",
        "name": "最强王国-周五造兵 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759693" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759693;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1325", "name": "最强王国-周末远征", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759694" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759694;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1326", "name": "最强王国-周末远征 cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759695" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759695;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1327", "name": "最强王国-周末远征 cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759711" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759711;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1328", "name": "最强王国-周末远征 cp cp cp", "state": "2", "openType": "2" },
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
              "event": [{ "#text": "759712" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759712;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1329",
        "name": "最强王国-周末远征 cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759713" }],
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
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8" }],
              ":@": { "type": "98", "name": "当前处于最强王国哪个阶段", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759713;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1330",
        "name": "最强王国-周末远征 cp cp cp cp cp",
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
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759786" }],
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
              "action": [{ "#text": "759786;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1386", "name": "边境矿脉", "state": "2", "openType": "2" },
    },
  ];
}
