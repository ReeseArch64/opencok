import { type GameplayCatalogElement } from "../catalog.ts";

export function part0(): GameplayCatalogElement[] {
  return [
    { "#text": "\n  " },
    { "version": [{ "#text": "b8d5685121b4e921d84482fca3a9e53c" }] },
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
              "condition": [{ "#text": "false;7002" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;2.45.0;all" }],
              ":@": {
                "type": "75",
                "name": "验证服务器，版本，以及测试服务器的开关",
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
              "action": [{ "#text": "760278;7" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1834", "name": "分档周卡-资源", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7002" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;2.45.0;all" }],
              ":@": {
                "type": "75",
                "name": "验证服务器，版本，以及测试服务器的开关",
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
              "action": [{ "#text": "760279;7" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1835", "name": "分档周卡-资源 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7002" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;2.45.0;all" }],
              ":@": {
                "type": "75",
                "name": "验证服务器，版本，以及测试服务器的开关",
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
              "action": [{ "#text": "760280;7" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1836", "name": "分档周卡-资源 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761481" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761481;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;6" }],
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
              "action": [{ "#text": "761481;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1856", "name": "精铁", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7006" }],
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
              "action": [{ "#text": "761615;10" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2368", "name": "9.99荣耀徽记周卡 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">;14" }],
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
      ":@": { "id": "1890", "name": "拉你入坑 170630", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760409" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "2017-07-12 00:00:00;2017-07-13 00:00:00" }],
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
              "action": [{ "#text": "760409;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2402", "name": "套装材料-10 cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;760293;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-15 00:00:00;2017-06-16 00:00:00" }],
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
              "action": [{ "#text": "760293;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1636", "name": "打怪体力", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760293" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760293;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760294;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-15 00:00:00;2017-06-16 00:00:00" }],
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
              "action": [{ "#text": "760294;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1637", "name": "打怪体力 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761370" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761370;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
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
              "action": [{ "#text": "761370;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1638", "name": "8k徽记", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761377" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "109001;>=;1" }],
              ":@": { "type": "62", "name": "龙等级判定", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "109002;>=;1" }],
              ":@": { "type": "62", "name": "龙等级判定", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-06 00:00:00;2017-10-30 00:00:00" }],
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
              "action": [{ "#text": "761377;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1902", "name": "龙天赋", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761378" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "109001;>=;1" }],
              ":@": { "type": "62", "name": "龙等级判定", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "109002;>=;1" }],
              ":@": { "type": "62", "name": "龙等级判定", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-06 00:00:00;2017-07-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
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
              "action": [{ "#text": "761378;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1904", "name": "龙天赋 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761812" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8801-8803" }],
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
              "action": [{ "#text": "761812" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2673", "name": "霸主战超级集结-50", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761811" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8801-8803" }],
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
              "action": [{ "#text": "761811" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2674", "name": "霸主战超级集结-10", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761663" }],
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
              "action": [{ "#text": "761663" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2430", "name": "霸王战入场券", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761664" }],
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
              "action": [{ "#text": "761664" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2431", "name": "霸王战保护", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761665" }],
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
              "action": [{ "#text": "761665" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2432", "name": "霸王战行军加速", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758961" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758961;<;2" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-11 00:00:00;2017-07-12 00:00:00" }],
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
              "action": [{ "#text": "758961;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1921", "name": "1-20服临时礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761666" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-06 00:00:00;2017-10-25 00:00:00" }],
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
              "action": [{ "#text": "761666" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2433", "name": "帝王战入场券", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761667" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-06 00:00:00;2017-10-25 00:00:00" }],
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
              "action": [{ "#text": "761667" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2434", "name": "帝王战保护", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761668" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-06 00:00:00;2017-10-25 00:00:00" }],
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
              "action": [{ "#text": "761668" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2435", "name": "帝王战行军加速", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "3" }],
              ":@": { "type": "100", "name": "检测收入，自动上架", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759253;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-26 00:00:00;2017-05-27 00:00:00" }],
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
              "action": [{ "#text": "759253;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1416", "name": "内网测试自动补包", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "4" }],
              ":@": { "type": "100", "name": "检测收入，自动上架", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759253;<;1" }],
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
              "action": [{ "#text": "759275;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1417", "name": "内网测试自动补包 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761680" }],
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
              "action": [{ "#text": "761680;110" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2449", "name": "设置页面迁服道具", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "false;7004" }],
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
              "action": [{ "#text": "761395;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1940", "name": "4.99十全月卡", "state": "-1", "openType": "2" },
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
              "condition": [{ "#text": "false;7004" }],
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
              "action": [{ "#text": "761393;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1941", "name": "9.99十全月卡 cp", "state": "-1", "openType": "2" },
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
              "condition": [{ "#text": "false;7004" }],
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
              "action": [{ "#text": "761394;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1942", "name": "24.99十全月卡 cp cp", "state": "-1", "openType": "2" },
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
              "condition": [{ "#text": "false;7005" }],
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
              "action": [{ "#text": "761397;9" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1943", "name": "4.99新资源周卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7011" }],
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
              "action": [{ "#text": "761687;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2457", "name": "新4.99十全月卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7005" }],
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
              "action": [{ "#text": "761398;9" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1946", "name": "9.99新资源周卡 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "all;>=;2.45.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "false;7011" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761688;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2458", "name": "新9.99十全月卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7005" }],
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
              "action": [{ "#text": "761399;9" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1947", "name": "24.99新资源周卡 cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "all;>=;2.45.0;all" }],
              ":@": {
                "type": "102",
                "name": "验证服务器，版本，以及测试服务器的开关(新版)",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "false;7011" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761689;11" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2459", "name": "新24.99十全月卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7006" }],
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
              "action": [{ "#text": "761400;10" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1948", "name": "4.99荣耀徽记周卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7007" }],
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
              "action": [{ "#text": "761401;8" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1949", "name": "4.99金币月卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7007" }],
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
              "action": [{ "#text": "761402;8" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1950", "name": "9.99金币月卡 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7007" }],
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
              "action": [{ "#text": "761403;8" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1951", "name": "24.99金币月卡 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760357" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
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
              "condition": [{ "#text": "-1;761391;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<;7" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760357;==;1" }],
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
              "action": [{ "#text": "761391;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1953", "name": "内网测试-首冲4件城建套装", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761699" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761699" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2473", "name": "5美金装备材料", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761700" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761700" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2474", "name": "10美金装备材料", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761701" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761701" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2475", "name": "100美金装备材料", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761706" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761706" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2479", "name": "5美金装备材料-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761707" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761707" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2480", "name": "10美金装备材料-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761708" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761708" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2481", "name": "100美金装备材料-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761712" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761712;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2485", "name": "5美金普通材料-获取更多", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761746" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761746;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2486", "name": "10美金普通材料-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761747" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761747;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2487", "name": "20美金普通材料-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761715" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761715;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2488", "name": "50美金普通材料-获取更多", "state": "0", "openType": "2" },
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
        { "conditions": [] },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760376;510" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1721", "name": "内网测试", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761748" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761748;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2489", "name": "100美金普通材料-获取更多", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7008" }],
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "101", "name": "主城荣耀等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761521;13" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2234", "name": "49.99骑士纹章周卡", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7009" }],
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "101", "name": "主城荣耀等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761522;12" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2235", "name": "49.99精铁周卡", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761719" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761719;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2492", "name": "5美金普通黑曜石-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761720" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761720;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2493", "name": "10美金普通黑曜石-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761721" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761721;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2494", "name": "20美金普通黑曜石-获取更多", "state": "2", "openType": "2" },
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
        { "conditions": [] },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760376;510" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1983", "name": "内网测试 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761722" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761722;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2495", "name": "10美金精良黑曜石-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761723" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761723;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2496", "name": "20美金精良黑曜石-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761724" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761724;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2497", "name": "100美金精良黑曜石-获取更多", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761725" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761725;260" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2499", "name": "100美金复活道具-获取更多", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760408" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "300001;999999999" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-12 00:00:00;2017-07-13 00:00:00" }],
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
              "action": [{ "#text": "760408;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1735", "name": "套装材料-100", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760409" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "2017-07-12 00:00:00;2017-07-13 00:00:00" }],
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
              "action": [{ "#text": "760409;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1736", "name": "套装材料-10", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "false;7010" }],
              ":@": { "type": "65", "name": "是否购买过该组礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "all;>=;2.55.0;all" }],
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
              "action": [{ "#text": "761523;12" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2262", "name": "19.99$声望周卡", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761664" }],
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
              "action": [{ "#text": "761664" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "41" }],
                  ":@": { "type": "49", "group": "1", "name": "触发事件类型" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "32", "group": "1", "name": "该事件触发后，通知客户端请求礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2557", "name": "霸主战保护", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759287;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-24 00:00:00;2017-09-25 00:00:00" }],
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
              "action": [{ "#text": "759287;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "791", "name": "促销-小额金币", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759287" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759287;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759288;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-24 00:00:00;2017-09-25 00:00:00" }],
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
              "action": [{ "#text": "759288;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "792", "name": "促销-小额金币 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759288" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759288;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759289;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-24 00:00:00;2017-09-25 00:00:00" }],
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
              "action": [{ "#text": "759289;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "793", "name": "促销-小额金币 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759502" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759502;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1070", "name": "送皮肤", "state": "2", "openType": "2" },
    },
    { "#text": "\n\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759528" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759528;380" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1132", "name": "送皮肤 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761838" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761838;380" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "113201", "name": "送皮肤 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n\n  \n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759881" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "2017-07-08 00:00:00;2017-07-09 00:00:00" }],
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
              "action": [{ "#text": "759881;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1650", "name": "情侣皮肤（男）", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759882" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "2017-07-08 00:00:00;2017-07-09 00:00:00" }],
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
              "action": [{ "#text": "759882;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1651", "name": "情侣皮肤（女）", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761405" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;35" }],
              ":@": { "type": "44", "name": "领主等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761405;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1970", "name": "荣耀套装测试", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761408" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": ">=;35" }],
              ":@": { "type": "44", "name": "领主等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "761408;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1982", "name": "女王套装测试", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759627" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-23 00:00:00;2017-08-23 00:00:00" }],
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
              "action": [{ "#text": "759627;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1251", "name": "送皮肤 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759500" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759500;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6;0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
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
              "action": [{ "#text": "759500;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1042", "name": "行军加速超级包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "1;761505;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761505;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "784", "name": "促销-三倍金币", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761505" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "1;761505;>;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761506;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761506;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "785", "name": "促销-三倍金币 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761506" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "1;761506;>;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761507;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761507;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "786", "name": "促销-三倍金币 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761507" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "1;761507;>;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761508;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761508;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "787", "name": "促销-三倍金币 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761508" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "1;761508;>;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761509;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761509;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "788", "name": "促销-三倍金币 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761509" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761510" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "1;761509;>;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761510;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761510;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "789", "name": "促销-三倍金币 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761511" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "300000;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;761511;<;3" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-12-01 06:00:00;2017-12-02 00:00:00" }],
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
              "action": [{ "#text": "761511;520" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "790",
        "name": "促销-三倍金币 cp cp cp cp cp cp",
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
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759301;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759301;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "777", "name": "元旦十全", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759301" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759301;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759302;<;1" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759302;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "778", "name": "元旦十全 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759302" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759302;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759303;<;1" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759303;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "779", "name": "元旦十全 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759303" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759303;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759304;<;1" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759304;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "780", "name": "元旦十全 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759304" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759304;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759305;<;1" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759305;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "781", "name": "元旦十全 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759305" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759306" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759305;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759306;<;5" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759306;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "782", "name": "元旦十全 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759306" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759306;<;5" }],
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
              "condition": [{ "#text": "2017-08-27 00:00:00;2017-08-28 00:00:00" }],
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
              "action": [{ "#text": "759306;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "783", "name": "元旦十全 cp cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759619;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759620;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759620;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1908", "name": "促销-除夕夜 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759619;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759619;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1244", "name": "促销-除夕夜", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759620" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759620;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759621;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759621;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1246", "name": "促销-除夕夜 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759621" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759621;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759622;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759622;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1247", "name": "促销-除夕夜 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759622" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759622;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759623;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759623;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1248", "name": "促销-除夕夜 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759623" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759623;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759624;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759624;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1249", "name": "促销-除夕夜 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759625" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759625;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-07 00:00:00;2017-08-08 00:00:00" }],
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
              "action": [{ "#text": "759625;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1250",
        "name": "促销-除夕夜 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759582" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759582;<;5" }],
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
              "condition": [{ "#text": "2017-08-11 00:00:00;2017-08-12 00:00:00" }],
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
              "action": [{ "#text": "759582;485" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1201", "name": "5W-造兵上限", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759583" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759583;<;5" }],
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
              "condition": [{ "#text": "2017-08-11 00:00:00;2017-08-12 00:00:00" }],
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
              "action": [{ "#text": "759583;485" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1202", "name": "5W-造兵上限 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759987" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759987;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1595", "name": "页签页签-老装备 cp cp cp", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "24;759796;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
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
              "action": [{ "#text": "759796;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1395", "name": "黑曜石英雄攻防buff", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759797" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759797;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759798;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
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
              "action": [{ "#text": "759798;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1397", "name": "黑曜石英雄攻防buff cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759798" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759798;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759799;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
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
              "action": [{ "#text": "759799;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1398", "name": "黑曜石英雄攻防buff cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759799" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759799;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759800;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
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
              "action": [{ "#text": "759800;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1399",
        "name": "黑曜石英雄攻防buff cp cp cp cp",
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
              "event": [{ "#text": "759801" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759801;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
              "action": [{ "#text": "759801;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1400",
        "name": "黑曜石英雄攻防buff cp cp cp cp cp",
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
              "event": [{ "#text": "759796" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759796;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759797;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
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
              "action": [{ "#text": "759797;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1964", "name": "黑曜石英雄攻防buff cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759802;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759802;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1402", "name": "徽记科研石龙韵石", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759802" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759802;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759803;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759803;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1403", "name": "徽记科研石龙韵石 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759803" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759803;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759804;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759804;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1404", "name": "徽记科研石龙韵石 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759804" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759804;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759805;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759805;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1405", "name": "徽记科研石龙韵石 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759805" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759805;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759806;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759806;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1406", "name": "徽记科研石龙韵石 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759807" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759807;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-08 00:00:00;2017-08-09 00:00:00" }],
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
              "action": [{ "#text": "759807;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1407",
        "name": "徽记科研石龙韵石 cp cp cp cp cp",
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759875;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759875;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1475", "name": "龙魔法石", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759875" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759875;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759876;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759876;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1476", "name": "龙魔法石 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759876" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759876;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759877;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759877;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1477", "name": "龙魔法石 cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759877" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759877;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759878;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759878;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1478", "name": "龙魔法石 cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759878" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759878;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759879;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759879;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1479", "name": "龙魔法石 cp cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759880" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759880;<;15" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-03 00:00:00;2017-08-04 00:00:00" }],
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
              "action": [{ "#text": "759880;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1480", "name": "龙魔法石 cp cp cp cp cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;759730;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759730;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1044", "name": "促销-买三赠一-城建", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759730" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759730;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759731;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759731;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1045", "name": "促销-买三赠一-城建 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759731" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759731;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759732;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759732;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1046", "name": "促销-买三赠一-城建 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759732" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759732;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759733;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759733;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1047", "name": "促销-买三赠一-城建 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759733" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759733;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759734;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759734;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1048",
        "name": "促销-买三赠一-城建 cp cp cp cp",
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759735;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759735;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1049",
        "name": "促销-买三赠一-城建 cp cp cp cp cp",
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
              "event": [{ "#text": "759735" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759735;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759736;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759736;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1050",
        "name": "促销-买三赠一-城建 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759736" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759736;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759737;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759737;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1051",
        "name": "促销-买三赠一-城建 cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759737" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759737;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759738;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759738;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1052",
        "name": "促销-买三赠一-城建 cp cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759738" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759738;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759739;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
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
              "action": [{ "#text": "759739;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1053",
        "name": "促销-买三赠一-城建 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "24;759740;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759740;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "861", "name": "促销-买三赠一-造兵", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759740" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759740;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759741;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759741;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "862", "name": "促销-买三赠一-造兵 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759741" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759741;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759742;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759742;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "863", "name": "促销-买三赠一-造兵 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759742" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759742;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759743;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759743;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "864", "name": "促销-买三赠一-造兵 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759743" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759743;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759744;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759744;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "865",
        "name": "促销-买三赠一-造兵 cp cp cp cp",
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759745;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759745;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "866",
        "name": "促销-买三赠一-造兵 cp cp cp cp cp",
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
              "event": [{ "#text": "759745" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759745;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759746;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759746;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "867",
        "name": "促销-买三赠一-造兵 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759746" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759746;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759747;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759747;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "868",
        "name": "促销-买三赠一-造兵 cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759747" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759747;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759748;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759748;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "869",
        "name": "促销-买三赠一-造兵 cp cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759748" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759748;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759749;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803003" }],
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
              "action": [{ "#text": "759749;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "870",
        "name": "促销-买三赠一-造兵 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "24;759720;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759720;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1110", "name": "促销-买三赠一-铁银", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759720" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759720;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759721;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759721;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1111", "name": "促销-买三赠一-铁银 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759721" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759721;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759722;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759722;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1112", "name": "促销-买三赠一-铁银 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759722" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759722;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759723;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759723;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1113", "name": "促销-买三赠一-铁银 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759723" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759723;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759724;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759724;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1114",
        "name": "促销-买三赠一-铁银 cp cp cp cp",
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759725;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759725;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1115",
        "name": "促销-买三赠一-铁银 cp cp cp cp cp",
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
              "event": [{ "#text": "759725" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759725;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759726;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759726;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1116",
        "name": "促销-买三赠一-铁银 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759726" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759726;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759727;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759727;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1117",
        "name": "促销-买三赠一-铁银 cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759727" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759727;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759728;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759728;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1118",
        "name": "促销-买三赠一-铁银 cp cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759728" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759728;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759729;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-05 00:00:00" }],
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
              "action": [{ "#text": "759729;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1119",
        "name": "促销-买三赠一-铁银 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "24;759592;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759592;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1223", "name": "促销-买三赠一-科技", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759592" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759592;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759593;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759593;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1224", "name": "促销-买三赠一-科技 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759593" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759593;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759594;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759594;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1225", "name": "促销-买三赠一-科技 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759594" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759594;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759595;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759595;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1226", "name": "促销-买三赠一-科技 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759595" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759595;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759596;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759596;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1227",
        "name": "促销-买三赠一-科技 cp cp cp cp",
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
              "condition": [{ "#text": "300001;900000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759597;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759597;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1228",
        "name": "促销-买三赠一-科技 cp cp cp cp cp",
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
              "event": [{ "#text": "759597" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759597;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759598;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759598;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1229",
        "name": "促销-买三赠一-科技 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759598" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759598;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759599;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759599;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1230",
        "name": "促销-买三赠一-科技 cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759599" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759599;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759600;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759600;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1231",
        "name": "促销-买三赠一-科技 cp cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759600" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759600;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759601;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;16803001" }],
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
              "action": [{ "#text": "759601;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1232",
        "name": "促销-买三赠一-科技 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759356;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759356;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "930", "name": "春节-通用加速", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759356" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759356;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759357;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759357;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "931", "name": "春节-通用加速 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759357" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759357;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759358;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759358;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "932", "name": "春节-通用加速 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759358" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759358;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759359;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759359;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "933", "name": "春节-通用加速 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759359" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759359;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759360;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759360;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "934", "name": "春节-通用加速 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759360" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759361" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759360;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759361;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759361;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "935", "name": "春节-通用加速 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759361" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759361;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-21 00:00:00;2017-08-22 00:00:00" }],
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
              "action": [{ "#text": "759361;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "936",
        "name": "春节-通用加速 cp cp cp cp cp cp",
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
              "condition": [{ "#text": "24;759338;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759338;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "978", "name": "春节-经验", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759338" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759338;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759339;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759339;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "979", "name": "春节-经验 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759339" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759339;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759340;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759340;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "980", "name": "春节-经验 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759340" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759340;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759341;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759341;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "981", "name": "春节-经验 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759341" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759341;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759342;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759342;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "982", "name": "春节-经验 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759342" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759343" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759342;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759343;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759343;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "983", "name": "春节-经验 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759343" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759343;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759343;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "984", "name": "春节-经验 cp cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759362;==;0" }],
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
              "action": [{ "#text": "759362;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1062", "name": "春节-黑曜石", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759362" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759362;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759363;==;0" }],
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
              "action": [{ "#text": "759363;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1063", "name": "春节-黑曜石 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759363" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759363;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759364;==;0" }],
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
              "action": [{ "#text": "759364;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1064", "name": "春节-黑曜石 cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759364" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759364;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759365;==;0" }],
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
              "action": [{ "#text": "759365;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1065", "name": "春节-黑曜石 cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759365" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759365;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759366;==;0" }],
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
              "action": [{ "#text": "759366;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1066", "name": "春节-黑曜石 cp cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759366" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759367" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759366;==;1" }],
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
              "action": [{ "#text": "759367;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1067", "name": "春节-黑曜石 cp cp cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759367" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759367;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1068",
        "name": "春节-黑曜石 cp cp cp cp cp cp",
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759326;==;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759326;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1142", "name": "春节-金币", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759326" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759326;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759327;==;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759327;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1143", "name": "春节-金币 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759327" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759327;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759328;==;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759328;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1144", "name": "春节-金币 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759328" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759328;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759329;==;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759329;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1145", "name": "春节-金币 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759329" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759329;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759330;==;0" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759330;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1146", "name": "春节-金币 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759330" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759331" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759330;==;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759331;<;2" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759331;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1147", "name": "春节-金币 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759331" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1;759331;<;5" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-27 00:00:00;2017-11-28 00:00:00" }],
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
              "action": [{ "#text": "759331;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1148", "name": "春节-金币 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759663" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759663;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759664;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759664;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1280", "name": "P6放量-资源 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759665" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759665;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759665;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1281", "name": "P6放量-资源 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759660;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759660;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1276", "name": "P6放量-资源", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759660" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759660;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759661;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759661;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1277", "name": "P6放量-资源 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759661" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759661;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759662;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759662;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1278", "name": "P6放量-资源 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759662" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759662;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759663;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-05 00:00:00;2017-06-06 00:00:00" }],
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
              "action": [{ "#text": "759663;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1279", "name": "P6放量-资源 cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760284;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760284;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1613", "name": "秘银600M", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760284" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760284;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760285;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760285;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1614", "name": "秘银600M cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760285" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760285;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760286;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760286;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1615", "name": "秘银600M cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760286" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760286;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760287;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760287;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1616", "name": "秘银600M cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760287" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760287;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760288;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760288;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1617", "name": "秘银600M cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760289" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760289;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-05-23 00:00:00;2017-05-24 00:00:00" }],
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
              "action": [{ "#text": "760289;390" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1618", "name": "秘银600M cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759858;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759858;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1622", "name": "母亲节改权心", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759858" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759858;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759859;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759859;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1623", "name": "母亲节改权心10", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759859" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759859;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759860;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759860;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1624", "name": "母亲节改权心20", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759860" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759860;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759861;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759861;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1625", "name": "母亲节改权心50", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759861" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759861;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759862;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759862;470" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1626", "name": "母亲节改权心100", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759863" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;759863;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-09-07 00:00:00;2017-09-08 00:00:00" }],
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
              "action": [{ "#text": "759863;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1627", "name": "母亲节改权心100高档", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759630" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759630;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-16 00:00:00;2017-06-17 00:00:00" }],
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
              "action": [{ "#text": "759630;380" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1339", "name": "图纸放量", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759631" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759631;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-16 00:00:00;2017-06-17 00:00:00" }],
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
              "action": [{ "#text": "759631;380" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1340", "name": "图纸放量 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761574;<;1" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761574;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1715", "name": "纯科研石", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761574" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761574;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761575;<;1" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761575;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1716", "name": "纯科研石 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761575" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761575;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761576;<;1" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761576;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1717", "name": "纯科研石 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761576" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761576;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761577;<;1" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761577;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1718", "name": "纯科研石 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761577" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761577;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761578;<;1" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761578;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1719", "name": "纯科研石 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761579" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761579;<;5" }],
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
              "condition": [{ "#text": "3;5" }],
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
              "action": [{ "#text": "761579;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1720", "name": "纯科研石 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760339;<;1" }],
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
              "action": [{ "#text": "760339;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1675", "name": "超级造兵包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760339" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760339;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760340;<;1" }],
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
              "action": [{ "#text": "760340;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1676", "name": "超级造兵包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760340" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760340;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760341;<;1" }],
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
              "action": [{ "#text": "760341;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1677", "name": "超级造兵包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760341" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760341;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760342;<;1" }],
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
              "action": [{ "#text": "760342;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1678", "name": "超级造兵包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760342" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760342;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760343;<;1" }],
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
              "action": [{ "#text": "760343;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1679", "name": "超级造兵包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760344" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760344;<;5" }],
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
              "action": [{ "#text": "760344;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1680", "name": "超级造兵包 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760345;<;1" }],
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
              "action": [{ "#text": "760345;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1681", "name": "超级城建包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760345" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760345;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760346;<;1" }],
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
              "action": [{ "#text": "760346;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1682", "name": "超级城建包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760346" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760346;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760347;<;1" }],
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
              "action": [{ "#text": "760347;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1683", "name": "超级城建包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760347" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760347;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760348;<;1" }],
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
              "action": [{ "#text": "760348;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1684", "name": "超级城建包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760348" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760348;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760349;<;5" }],
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
              "action": [{ "#text": "760349;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1685", "name": "超级城建包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760350" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760350;<;5" }],
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
              "action": [{ "#text": "760350;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1686", "name": "超级城建包 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760402;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "760402;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1722", "name": "高考", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760402" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760402;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760403;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
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
              "action": [{ "#text": "760403;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1723", "name": "高考 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760403" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760403;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760404;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
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
              "action": [{ "#text": "760404;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1724", "name": "高考 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760404" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760404;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760405;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
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
              "action": [{ "#text": "760405;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1725", "name": "高考 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760405" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760405;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760406;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
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
              "action": [{ "#text": "760406;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1726", "name": "高考 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760407" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760407;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;26" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "8;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
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
              "action": [{ "#text": "760407;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1727", "name": "高考 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760574;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;5" }],
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
              "action": [{ "#text": "760574;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1838", "name": "贤者之塔超级包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760574" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760574;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760575;<;1" }],
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
              "action": [{ "#text": "760575;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1839", "name": "贤者之塔超级包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760575" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760575;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760576;<;1" }],
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
              "action": [{ "#text": "760576;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1840", "name": "贤者之塔超级包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760576" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760576;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760577;<;1" }],
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
              "action": [{ "#text": "760577;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1841", "name": "贤者之塔超级包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760577" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760577;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760578;<;1" }],
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
              "action": [{ "#text": "760578;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1842", "name": "贤者之塔超级包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760579" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760579;<;5" }],
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
              "action": [{ "#text": "760579;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1843",
        "name": "贤者之塔超级包 cp cp cp cp cp",
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
              "event": [{ "#text": "760593" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760593;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760594;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760594;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1845", "name": "徽记科研buff-20", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760594" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760594;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760595;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760595;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1846", "name": "徽记科研buff-50", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760597" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760597;<;10" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760597;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1848", "name": "徽记科研buff-100-大R", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760595" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760595;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760596;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760596;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1910", "name": "徽记科研buff-100", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760592;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760592;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1743", "name": "徽记科研buff-5", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760592" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760592;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760593;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-09 00:00:00;2017-07-10 00:00:00" }],
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
              "action": [{ "#text": "760593;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1745", "name": "徽记科研buff-10", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;760881;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760881;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1859", "name": "奥林匹克", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760881" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760881;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760882;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760882;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1860", "name": "奥林匹克 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760882" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760882;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760883;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760883;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1861", "name": "奥林匹克 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760883" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760883;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760884;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760884;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1862", "name": "奥林匹克 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760884" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760884;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760885;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760885;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1863", "name": "奥林匹克 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760886" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;760886;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-29 00:00:00;2017-06-30 00:00:00" }],
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
              "action": [{ "#text": "760886;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1864", "name": "奥林匹克 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761186;<;1" }],
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
              "action": [{ "#text": "761186;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1873", "name": "年中", "state": "2", "openType": "2" },
    },
  ];
}
