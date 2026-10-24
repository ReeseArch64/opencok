import { type GameplayCatalogElement } from "../catalog.ts";

export function part0(): GameplayCatalogElement[] {
  return [
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758578;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758578" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "97", "name": "随机礼包_VIP礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758641;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758641" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "100", "name": "随机礼包_行军加速礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758642;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758642" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "101", "name": "加速界面礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;3" }],
              ":@": { "type": "14", "name": "比较玩家注册时间" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758646;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6330;4320" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758646" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "161", "name": "新手礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758646" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;3" }],
              ":@": { "type": "14", "name": "比较玩家注册时间" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758646;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758647;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6330;4320" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758647" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "162", "name": "新手礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758647" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;3" }],
              ":@": { "type": "14", "name": "比较玩家注册时间" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758647;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758648;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6330;4320" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758648" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "163", "name": "新手礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758649;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758649" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "164", "name": "家园建设", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758649" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758649;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758650;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758650" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "165", "name": "家园建设 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758650" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758650;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758651;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758651" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "166", "name": "家园建设 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758651" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758652;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758651;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758652" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "167", "name": "家园建设 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758652" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758652;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758653;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758653" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "168", "name": "家园建设 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758654;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758654" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "169", "name": "周二城建", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758654" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758654;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758655;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758655" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "170", "name": "周二城建 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758655" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758655;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758656;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758656" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "171", "name": "周二城建 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758656" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758656;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758657;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758657" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "172", "name": "周二城建 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758657" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758657;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758658;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758658" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "173", "name": "周二城建 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758659;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758659" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "175", "name": "周二城建 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758659" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758659;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758660;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758660" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "176", "name": "周二城建 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758661;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758661" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "174", "name": "领主升级", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758661" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758661;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758662;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758662" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "177", "name": "领主升级 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758662" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758662;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758663;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758663" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "179", "name": "领主升级 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758663" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758663;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758664;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758664" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "180", "name": "领主升级 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758664" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758664;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758665;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758665" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "181", "name": "领主升级 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758666;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758666" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "182", "name": "周三采集", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758666" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758666;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758667;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758667" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "183", "name": "周三采集 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758667" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758667;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758668;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758668" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "184", "name": "周三采集 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758668" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758668;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758669;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758669" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "185", "name": "周三采集 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758669" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758669;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758670;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758670" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "186", "name": "周三采集 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758670" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758670;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758671;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758671" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "187", "name": "周三采集 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758672;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758672" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "188", "name": "周三采集 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758672" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758672;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758673;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758673" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "189", "name": "周三采集 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758673" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758673;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758674;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758674" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "190",
        "name": "周三采集 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758675;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758675" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "191", "name": "周三徽记", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758675" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758675;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758676;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758676" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "192", "name": "周三徽记 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758676" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758676;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758677;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758677" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "193", "name": "周三徽记 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758677" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758677;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758678;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758678" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "194", "name": "周三徽记 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758678" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758678;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758679;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758679" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "195", "name": "周三徽记 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758679" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758679;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758680;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758680" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "196", "name": "周三徽记 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758681;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758681" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "197", "name": "周三徽记 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758681" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758681;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758682;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758682" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "198", "name": "周三徽记 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758683;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758683" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "199", "name": "战争礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758683" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758683;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758684;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758684" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "200", "name": "战争礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758684" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758684;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758685;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758685" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "201", "name": "战争礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758685" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758685;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758686;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758686" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "202", "name": "战争礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758686" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758686;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758687;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758687" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "203", "name": "战争礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758688;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4;5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758688" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "204", "name": "战争礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758688" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758688;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758689;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4;5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758689" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "205", "name": "战争礼包 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758689" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758689;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758690;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4;5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758690" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "206", "name": "战争礼包 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758691;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4;5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758691" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "207",
        "name": "战争礼包 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758691" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758691;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758692;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4;5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758692" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "208",
        "name": "战争礼包 cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758693;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758693" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "209", "name": "救火龙韵", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758693" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758693;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758694;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758694" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "210", "name": "救火龙韵 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758694" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758694;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758695;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758695" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "211", "name": "救火龙韵 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758696;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758696" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "212", "name": "传奇联盟", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758696" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758696;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758697;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758697" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "213", "name": "传奇联盟 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758697" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758697;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758698;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758698" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "214", "name": "传奇联盟 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758698" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758698;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758699;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758699" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "215", "name": "传奇联盟 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758699" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758699;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758700;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758700" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "216", "name": "传奇联盟 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758701;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758701" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "217", "name": "周五战斗礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758701" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758701;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758702;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758702" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "218", "name": "周五战斗礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758702" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758702;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758703;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758703" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "219", "name": "周五战斗礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758703" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758703;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758704;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758704" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "220", "name": "周五战斗礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758705;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758705" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "221", "name": "周五战斗礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758705" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758705;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758706;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758706" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "222", "name": "周五战斗礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758707;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758707" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "223", "name": "周五加速", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758707" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758707;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758708;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758708" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "224", "name": "周五加速 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758708" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758708;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758709;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758709" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "225", "name": "周五加速 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758710;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758710" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "226", "name": "周五加速 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758710" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758710;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758711;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758711" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "227", "name": "周五加速 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758712;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758712" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "228", "name": "联盟发展", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758712" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758712;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758713;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758713" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "229", "name": "联盟发展 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758713" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758713;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758714;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758714" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "230", "name": "联盟发展 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758714" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758714;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758715;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758715" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "231", "name": "联盟发展 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758715" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758715;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758716;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758716" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "232", "name": "联盟发展 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758717;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758717" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "233", "name": "周六龙韵", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758717" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758717;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758718;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758718" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "234", "name": "周六龙韵 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758718" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758718;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758719;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758719" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "235", "name": "周六龙韵 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758719" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758719;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758720;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758720" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "236", "name": "周六龙韵 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758720" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758720;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758721;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758721" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "237", "name": "周六龙韵 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758721" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758721;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758722;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758722" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "238", "name": "周六龙韵 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758723;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758723" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "239", "name": "周六龙韵 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758723" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758723;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758724;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758724" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "240", "name": "周六龙韵 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758724" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758724;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758725;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758725" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "241",
        "name": "周六龙韵 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758726;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758726" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "242", "name": "假日礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758726" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758726;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758727;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758727" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "243", "name": "假日礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758727" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758727;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758728;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758728" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "244", "name": "假日礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758728" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758728;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758729;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758729" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "245", "name": "假日礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758729" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758729;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758730;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758730" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "246", "name": "假日礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758731;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758731" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "247", "name": "周日资源", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758731" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758731;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758732;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758732" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "248", "name": "周日资源 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758732" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758732;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758733;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758733" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "249", "name": "周日资源 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758733" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758733;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758734;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758734" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "250", "name": "周日资源 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758734" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758734;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758735;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758735" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "251", "name": "周日资源 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758735" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758735;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758736;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758736" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "252", "name": "周日资源 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758737;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758737" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "253", "name": "周日资源 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758737" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758737;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758738;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758738" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "254", "name": "周日资源 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758738" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758738;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758739;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758739" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "255",
        "name": "周日资源 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758740;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758740" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "256", "name": "装备锻造", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758740" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758740;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758741;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758741" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "257", "name": "装备锻造 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758741" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758741;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758742;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758742" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "258", "name": "装备锻造 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758742" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758742;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758743;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758743" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "259", "name": "装备锻造 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758743" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758743;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758744;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758744" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "260", "name": "装备锻造 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758745;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758745" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "261", "name": "周一材料", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758745" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758745;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758746;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758746" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "262", "name": "周一材料 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758746" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758746;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758747;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758747" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "263", "name": "周一材料 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758747" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758747;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758748;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758748" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "264", "name": "周一材料 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758748" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758748;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758749;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758749" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "265", "name": "周一材料 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758749" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758749;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758750;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758750" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "266", "name": "周一材料 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758751;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758751" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "267", "name": "周一材料 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758751" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758751;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758752;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758752" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "268", "name": "周一材料 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758752" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758752;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758753;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758753" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "269",
        "name": "周一材料 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758754;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758754" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "270", "name": "周一经验", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758754" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758754;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758755;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758755" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "271", "name": "周一经验 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758755" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758755;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758756;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758756" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "272", "name": "周一经验 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758756" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;5" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758756;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758757;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758757" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "273", "name": "周一经验 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758758;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758758" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "274", "name": "周一经验 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758758" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758758;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758759;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758759" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "275", "name": "周一经验 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "6" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758760;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758760" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758761;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "6" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758761" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758762;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758762" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758762" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;230000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758762;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758763;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758763" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758764;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758764" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758764" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1-1500" }], ":@": { "type": "32", "name": "服务器编号" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230001;200000000" }],
              ":@": { "type": "30", "name": "付费金币数量" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758764;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758765;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758765" }], ":@": { "type": "15", "name": "推送礼包" } },
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "1" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758766;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758766" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "282", "name": "小额粮食", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "2" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758767;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758767" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "283", "name": "小额秘银", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "3" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758768;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758768" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "284", "name": "小额建造", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758769;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758769" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "285", "name": "小额铁", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "5" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758770;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758770" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "286", "name": "小额造兵", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "6" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758771;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758771" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "287", "name": "小额木头", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758772;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758772" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "288", "name": "领主升级2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758772" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758772;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758773;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758773" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "289", "name": "领主升级2 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758773" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758773;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758774;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758774" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "290", "name": "领主升级2 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758774" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758774;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758775;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758775" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "291", "name": "领主升级2 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758775" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758775;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758776;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758776" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "292", "name": "领主升级2 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758777;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758777" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "293", "name": "家园建设2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758777" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758777;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758778;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758778" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "294", "name": "家园建设2 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758778" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758778;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758779;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758779" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "295", "name": "家园建设2 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758779" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758779;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758780;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758780" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "296", "name": "家园建设2 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758780" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758780;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758781;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758781" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "297", "name": "家园建设2 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758782;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758782" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "298", "name": "造兵加速礼包2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758782" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758782;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758783;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758783" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "299", "name": "造兵加速礼包2 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758783" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758783;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758784;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758784" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "300", "name": "造兵加速礼包2 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758784" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758784;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758785;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758785" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "301", "name": "造兵加速礼包2 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758785" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758785;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758786;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758786" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "302", "name": "造兵加速礼包2 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758786" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758786;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758787;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758787" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "303", "name": "造兵加速礼包2 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758788;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758788" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "304", "name": "周日资源2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758788" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758788;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758789;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758789" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "305", "name": "周日资源2 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758789" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758789;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758790;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758790" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "306", "name": "周日资源2 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758790" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758790;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758791;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758791" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "307", "name": "周日资源2 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758791" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758791;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758792;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758792" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "308", "name": "周日资源2 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758792" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758792;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758793;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758793" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "309", "name": "周日资源2 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758794;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758794" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "310", "name": "龙韵石单一", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758794" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758794;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758795;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758795" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "311", "name": "龙韵石单一 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758795" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758795;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758796;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758796" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "312", "name": "龙韵石单一 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758796" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758796;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758797;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758797" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "313", "name": "龙韵石单一 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758797" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758797;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758798;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;2;3" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758798" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "314", "name": "龙韵石单一 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758799;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758799" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "315", "name": "VIP礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758799" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758799;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758800;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758800" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "316", "name": "VIP礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758800" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758800;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758801;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758801" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "317", "name": "VIP礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758801" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758801;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758802;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758802" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "318", "name": "VIP礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758802" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758802;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758803;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758803" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "319", "name": "VIP礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758803" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758803;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758804;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;3;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758804" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "320", "name": "VIP礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758805;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758805" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "321", "name": "科研小礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758805" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758805;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758806;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758806" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "322", "name": "科研小礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758806" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758806;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758807;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758807" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "323", "name": "科研小礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758807" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758807;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758808;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758808" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "324", "name": "科研小礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758808" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758808;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758809;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758809" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "325", "name": "科研小礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758809" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758809;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758810;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758810" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "326", "name": "科研小礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758811;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758811" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "327", "name": "20级套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758812;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758812" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "328", "name": "20级套装 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758813;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758813" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "329", "name": "20级套装 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758814;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758814" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "330", "name": "周五战斗礼包2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758814" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758814;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758815;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758815" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "331", "name": "周五战斗礼包2 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758815" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758815;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758816;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758816" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "332", "name": "周五战斗礼包2 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758816" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758816;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758817;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758817" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "333", "name": "周五战斗礼包2 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758817" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758817;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758818;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758818" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "335", "name": "周五战斗礼包2 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758818" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758818;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758819;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758819" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "336", "name": "周五战斗礼包2 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758820;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758820" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "334", "name": "纯水晶", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758820" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758820;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758821;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758821" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "337", "name": "纯水晶 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758821" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758821;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758822;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758822" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "338", "name": "纯水晶 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758822" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758822;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758823;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758823" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "339", "name": "纯水晶 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758823" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758823;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758824;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758824" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "340", "name": "纯水晶 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758825;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758825" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "341", "name": "龙升级", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758825" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758825;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758826;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758826" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "342", "name": "龙升级 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758826" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758826;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758827;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758827" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "343", "name": "龙升级 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758827" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758827;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758828;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758828" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "344", "name": "龙升级 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758828" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "168" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "18", "name": "开服时间上限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758828;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "72;758829;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758829" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "345", "name": "龙升级 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758830;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758830" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "346", "name": "散装礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758831;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758831" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "347", "name": "散装礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1440" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758832;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;4;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758832" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "348", "name": "散装礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "2880" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758833;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758833" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "349", "name": "散装礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758834;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758834" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "350", "name": "散装礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758835;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758835" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "351", "name": "散装礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758836;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758836" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "352", "name": "散装礼包 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758837;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758837" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "353", "name": "散装礼包 cp cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758838;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758838" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "354",
        "name": "散装礼包 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758839;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": "1;4" }], ":@": { "type": "10", "name": "时间区间(周几)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758839" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "355",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758840;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758840" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "356",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758841;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758841" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "357",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758842;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758842" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "358",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758843;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758843" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "359",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758844;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758844" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "360",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758845;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758845" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "361",
        "name": "散装礼包 cp cp cp cp cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758846;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758846" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "362", "name": "蓝龙正式", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758846" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758846;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758847;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758847" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "363", "name": "蓝龙正式 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758848;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758848" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "364", "name": "英雄礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758848" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758848;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758849;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758849" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "365", "name": "英雄礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758850;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758850" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "366", "name": "2030级套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758851;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758851" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "367", "name": "2030级套装 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758852;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758852" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "368", "name": "2030级套装 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758853;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758853" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "369", "name": "2030级套装 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758854;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758854" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "370", "name": "2030级套装 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758855;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758855" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "371", "name": "2030级套装 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758856;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758856" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "372", "name": "2030级套装 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758857;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758857" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "373",
        "name": "2030级套装 cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758858;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758858" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "374",
        "name": "2030级套装 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758859;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758859" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "375", "name": "窗口资源礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758859" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758859;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758860;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758860" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "376", "name": "窗口资源礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758861;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758861" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "377", "name": "窗口资源礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758861" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758861;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758862;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758862" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "378", "name": "窗口资源礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758863;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758863" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "379", "name": "窗口资源礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758863" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758863;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758864;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758864" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "380", "name": "窗口资源礼包 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758865;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758865" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "381",
        "name": "窗口资源礼包 cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758865" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758865;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758866;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758866" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "382",
        "name": "窗口资源礼包 cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758867;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758867" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "383",
        "name": "窗口资源礼包 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758868;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758868" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "384",
        "name": "窗口资源礼包 cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758869;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758869" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "385",
        "name": "窗口资源礼包 cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758870;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758870" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "386",
        "name": "窗口资源礼包 cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758871;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758871" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "387", "name": "窗口英勇套装礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758872;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758872" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "388", "name": "窗口英勇套装礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758873;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758873" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "389", "name": "窗口英勇套装礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758874;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758874" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "390", "name": "窗口英勇套装礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758875;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758875" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "391", "name": "窗口英勇套装礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758876;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758876" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "392",
        "name": "窗口英勇套装礼包 cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758877;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758877" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "393", "name": "窗口征服套装礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758877" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758877;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758878;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758878" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "394", "name": "窗口征服套装礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758879;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758879" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "395", "name": "窗口征服套装礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758879" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758879;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758880;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758880" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "396", "name": "窗口征服套装礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758881;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758881" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "397", "name": "窗口征服套装礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758881" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758881;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758882;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758882" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "398",
        "name": "窗口征服套装礼包 cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758883;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758883" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "399",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758883" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758883;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758884;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758884" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "400",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758885;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758885" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "401",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758885" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758885;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758886;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758886" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "402",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758887;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758887" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "403",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758887" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758887;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758888;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758888" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "404",
        "name": "窗口征服套装礼包 cp cp cp cp cp cp cp cp cp cp cp",
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
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758889;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758889" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "405", "name": "窗口怜悯套装礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758890;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758890" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "406", "name": "窗口怜悯套装礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758891;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758891" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "407", "name": "窗口怜悯套装礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758892;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758892" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "408", "name": "窗口怜悯套装礼包 cp cp cp", "state": "2", "openType": "2" },
    },
  ];
}
