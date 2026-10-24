import { type GameplayCatalogElement } from "../catalog.ts";

export function part2(): GameplayCatalogElement[] {
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
              "event": [{ "#text": "759787" }],
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
              "action": [{ "#text": "759787;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1387", "name": "边境矿脉 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759788" }],
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
              "action": [{ "#text": "759788;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1388", "name": "边境矿脉 cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761458;<;1" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761458;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2158", "name": "资料片礼包0.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761458" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761459;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761458;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "336" }],
              ":@": { "type": "17", "name": "开服时间不小于", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761459;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2159", "name": "资料片礼包4.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761459" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761459;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761460;<;1" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761460;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2160", "name": "资料片礼包9.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761460" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761460;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761461;<;1" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761461;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2161", "name": "资料片礼包19.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761461" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761461;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761462;<;1" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761462;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2162", "name": "资料片礼包49.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761462" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761462;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761463;<;1" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761463;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2163", "name": "资料片礼包99.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761464" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761464;<;3" }],
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
              "condition": [{ "#text": "2017-10-14 00:00:00;2017-10-15 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761464;490" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2164", "name": "尊享资料片礼包99.99 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;761465;<;1" }],
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
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761465;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2151", "name": "资料片魔法石0.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761465" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761466;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761465;>;0" }],
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761466;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2152", "name": "资料片魔法石4.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761466" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761466;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761467;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761467;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2153", "name": "资料片魔法石9.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761467" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761467;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761468;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761468;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2154", "name": "资料片魔法石19.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761468" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761468;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761469;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761469;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2155", "name": "资料片魔法石49.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761469" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761470" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761469;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761470;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761470;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2156", "name": "资料片魔法石99.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761471" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761471;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "condition": [{ "#text": "4;24" }],
              ":@": { "type": "99", "name": "时间区间(当天几点-几点)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2;4;5;6" }],
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
              "action": [{ "#text": "761471;460" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2157", "name": "尊享资料片魔法石99.99", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "500;761439;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761439;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2095", "name": "日本专用0.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761439" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761440;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761439;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761440;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2101", "name": "日本专用4.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761440" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761440;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761441;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761441;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2103", "name": "日本专用9.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761441" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761441;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761442;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761442;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2104", "name": "日本专用19.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761442" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761442;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761443;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761443;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2105", "name": "日本专用49.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761443" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761444" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761443;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761444;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761444;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2106", "name": "日本专用99.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761444" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761444;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-07-31 00:00:00;2017-08-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
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
              "action": [{ "#text": "761444;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2107", "name": "尊享日本专用99.99", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "500;761445;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
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
              "action": [{ "#text": "761445;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2123", "name": "香港专用4.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761445" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761445;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761446;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761446;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2124", "name": "香港专用9.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761446" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761446;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761447;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761447;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2125", "name": "香港专用19.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761447" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761447;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761448;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761448;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2126", "name": "香港专用49.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761448" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761449" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761448;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761449;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761449;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2127", "name": "香港专用99.99 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761449" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761449;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;HK" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-04 00:00:00;2017-08-14 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761449;440" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2128", "name": "尊享香港专用99.99", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "500;761451;<;1" }],
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
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
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
              "action": [{ "#text": "761451;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2129", "name": "夏日特惠专用0.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761451" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761453;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761451;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761453;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2130", "name": "夏日特惠专用4.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761453" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761453;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761454;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761454;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2131", "name": "夏日特惠专用9.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761454" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761454;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761455;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761455;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2132", "name": "夏日特惠专用19.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761455" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761455;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761456;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761456;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2133", "name": "夏日特惠专用49.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761456" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761457" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "500;761456;>;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "500;761457;<;3" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761457;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2134", "name": "夏日特惠专用99.99", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761457" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;761457;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;7" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;CN;HK;TW" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
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
              "action": [{ "#text": "761457;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2135", "name": "尊享夏日特惠专用99.99", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;758642;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "758642" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
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
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759750" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "759750;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1347", "name": "窗口资源", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759751" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "759751;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1348", "name": "窗口资源 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759752" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "759752;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1349", "name": "窗口资源 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759753" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "759753;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1350", "name": "窗口资源 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759754" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759754;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1351", "name": "窗口资源 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759755" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759755;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1352", "name": "窗口资源 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759756" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759756;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1353", "name": "窗口资源 cp cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759757" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759757;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "1354",
        "name": "窗口资源 cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "24;758969;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "758969" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "476", "name": "联盟资源II", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758969" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758969;>=;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758970;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "758970" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "477", "name": "联盟资源II cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758970" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758970;>=;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758971;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "758971" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "478", "name": "联盟资源II cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759031;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "759031" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "513", "name": "蓝龙碎片 cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759033;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "759033" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "515", "name": "蓝龙碎片 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761483" }],
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
              "action": [{ "#text": "761483;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2173", "name": "蓝龙-100$-窗口", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759563" }],
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
              "action": [{ "#text": "759563;20" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "750", "name": "红龙", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759564" }],
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
              "action": [{ "#text": "759564;30" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "751", "name": "红龙 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759300" }],
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
              "action": [{ "#text": "759300;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "752", "name": "蓝龙-5$-窗口", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;759299;<;2" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759299;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "755", "name": "蓝龙-20$-窗口", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759029;<;1" }],
              ":@": { "type": "63", "name": "小时内，购买", "group": "1" },
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
              "action": [{ "#text": "759029" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "511", "name": "蓝龙碎片", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759052" }],
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
              "action": [{ "#text": "759052" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "567", "name": "5$招募官放量", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759051" }],
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
              "action": [{ "#text": "759051" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "568", "name": "10$招募官放量", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759050" }],
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
              "action": [{ "#text": "759050" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "569", "name": "20$招募官放量", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759412" }],
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
              "action": [{ "#text": "759412;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "833", "name": "窗口-英雄洗炼", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759413" }],
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
              "action": [{ "#text": "759413;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "834", "name": "窗口-英雄洗炼 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759414" }],
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
              "action": [{ "#text": "759414;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "835", "name": "窗口-英雄洗炼 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759415" }],
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
              "action": [{ "#text": "759415;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "836", "name": "窗口-英雄洗炼 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759416" }],
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
              "action": [{ "#text": "759416;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "837", "name": "窗口-英雄洗炼 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759417" }],
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
              "action": [{ "#text": "759417;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "838", "name": "窗口-英雄洗炼 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759418" }],
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
              "action": [{ "#text": "759418;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "839",
        "name": "窗口-英雄洗炼 cp cp cp cp cp cp",
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
              "event": [{ "#text": "759419" }],
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
              "action": [{ "#text": "759419;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "840",
        "name": "窗口-英雄洗炼 cp cp cp cp cp cp cp",
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
              "event": [{ "#text": "759121" }],
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
              "action": [{ "#text": "759121" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "657", "name": "刺葵", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759122" }],
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
              "action": [{ "#text": "759122" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "658", "name": "刺葵 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759482" }],
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
              "action": [{ "#text": "759482;90" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1060", "name": "svip商城小礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759483" }],
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
              "action": [{ "#text": "759483;90" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1061", "name": "svip商城小礼包 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761659" }],
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
              "action": [{ "#text": "761659;90" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2425", "name": "svip商城小礼包 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761660" }],
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
              "action": [{ "#text": "761660;90" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2426", "name": "svip商城小礼包 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759526" }],
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
              "action": [{ "#text": "759526;190" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1127", "name": "窗口-蜡烛", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759527" }],
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
              "action": [{ "#text": "759527;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1128", "name": "窗口-蜡烛 cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760548;<;1" }],
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
              "action": [{ "#text": "760548;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1814", "name": "魔法石", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760548" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760548;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760549;<;1" }],
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
              "action": [{ "#text": "760549;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1815", "name": "魔法石 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760549" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760549;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760550;<;1" }],
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
              "action": [{ "#text": "760550;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1816", "name": "魔法石 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760550" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760550;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760551;<;1" }],
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
              "action": [{ "#text": "760551;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1817", "name": "魔法石 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760551" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760551;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760552;<;1" }],
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
              "action": [{ "#text": "760552;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1818", "name": "魔法石 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760553" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760553;<;5" }],
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
              "action": [{ "#text": "760553;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1819", "name": "魔法石 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760512;<;1" }],
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
              "action": [{ "#text": "760512;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1777", "name": "加速", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760512" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760512;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760513;<;1" }],
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
              "action": [{ "#text": "760513;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1778", "name": "加速 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760513" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760513;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760514;<;1" }],
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
              "action": [{ "#text": "760514;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1779", "name": "加速 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760514" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760514;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760515;<;1" }],
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
              "action": [{ "#text": "760515;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1780", "name": "加速 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760515" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760515;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760516;<;1" }],
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
              "action": [{ "#text": "760516;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1781", "name": "加速 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760517" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760517;<;5" }],
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
              "action": [{ "#text": "760517;150" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1782", "name": "加速 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;8" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;9" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758492;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758492" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "79", "name": "8级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758492" }],
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
              "condition": [{ "#text": ">=;8" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;9" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758492;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758493;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758493" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "81", "name": "8级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758493" }],
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
              "condition": [{ "#text": ">=;8" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;9" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758493;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758494;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758494" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "82", "name": "8级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758495" }],
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
              "condition": [{ "#text": ">=;8" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;9" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758495;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758496;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758496" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "84", "name": "8级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758494" }],
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
              "condition": [{ "#text": ">=;8" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;9" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758494;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758495;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758495" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "85", "name": "8级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;11" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;12" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758497;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758497" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "86", "name": "11级城堡热卖", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759768;<;1" }],
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
              "action": [{ "#text": "759768;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1366", "name": "新城堡热卖-25", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758497" }],
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
              "condition": [{ "#text": ">=;11" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;12" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758497;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758498;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758498" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "87", "name": "11级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759768" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759768;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759769;<;1" }],
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
              "action": [{ "#text": "759769;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1367", "name": "新城堡热卖-25 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758498" }],
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
              "condition": [{ "#text": ">=;11" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;12" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758498;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758499;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758499" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "88", "name": "11级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759769" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759769;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759770;<;1" }],
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
              "action": [{ "#text": "759770;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1368", "name": "新城堡热卖-25 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758499" }],
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
              "condition": [{ "#text": ">=;11" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;12" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758499;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758500;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "89", "name": "11级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759770" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759770;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759771;<;1" }],
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
              "action": [{ "#text": "759771;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1369", "name": "新城堡热卖-25 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758500" }],
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
              "condition": [{ "#text": ">=;11" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;12" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758500;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758501;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758501" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "90", "name": "11级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759771" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759771;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759772;<;1" }],
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
              "action": [{ "#text": "759772;320" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1370", "name": "新城堡热卖-25 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759773" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;25" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170428;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759773;<;5" }],
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
              "action": [{ "#text": "759773;360" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1371", "name": "新城堡热卖-25 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758503;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758503" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "92", "name": "14级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758503" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758503;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758504;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758504" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "93", "name": "14级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758504" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758504;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758505;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758505" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "102", "name": "14级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758505" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758505;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758506;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758506" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "103", "name": "14级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758506" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758506;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758507;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758507" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "104", "name": "14级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758507" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758507;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758508;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758508" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "105", "name": "14级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758508" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758508;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758509;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758509" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "106",
        "name": "14级城堡热卖 cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758509" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758509;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758510;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758510" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "107",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758510" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758510;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758511;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758511" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "108",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758511" }],
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
              "condition": [{ "#text": ">=;14" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758511;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758512;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758512" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "109",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759808;<;1" }],
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
              "action": [{ "#text": "759808;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1389", "name": "新城堡热卖-22", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758513;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758513" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "110", "name": "18级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759808" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759808;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759809;<;1" }],
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
              "action": [{ "#text": "759809;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1390", "name": "新城堡热卖-22 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758513" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758513;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758514;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758514" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "111", "name": "18级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759809" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759809;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759810;<;1" }],
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
              "action": [{ "#text": "759810;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1391", "name": "新城堡热卖-22 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758514" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758514;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758515;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758515" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "112", "name": "18级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759810" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759810;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759811;<;1" }],
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
              "action": [{ "#text": "759811;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1392", "name": "新城堡热卖-22 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758515" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758515;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758516;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758516" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "113", "name": "18级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759811" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759811;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759812;<;1" }],
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
              "action": [{ "#text": "759812;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1393", "name": "新城堡热卖-22 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758516" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758516;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758517;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758517" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "114", "name": "18级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759813" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "170422;4320" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759813;<;5" }],
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
              "action": [{ "#text": "759813;330" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1394", "name": "新城堡热卖-22 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758517" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758517;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758518;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758518" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "115", "name": "18级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758518" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758518;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758519;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758519" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "116",
        "name": "18级城堡热卖 cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758519" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758519;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758520;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758520" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "117",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758520" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758520;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758521;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758521" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "118",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758521" }],
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
              "condition": [{ "#text": ">=;18" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758521;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758522;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758522" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "119",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758523;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758523" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "120", "name": "20级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758523" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758523;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758524;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758524" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "121", "name": "20级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758524" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758524;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758525;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758525" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "122", "name": "20级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758525" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758525;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758526;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758526" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "123", "name": "20级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758526" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758526;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758527;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758527" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "124", "name": "20级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758527" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758527;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758528;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758528" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "125", "name": "20级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758528" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758528;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758529;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758529" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "126",
        "name": "20级城堡热卖 cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758529" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758529;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758530;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758530" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "127",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758530" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758530;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758531;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758531" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "128",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758531" }],
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
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;21" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758531;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758532;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758532" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "129",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758533;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758533" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "130", "name": "22级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758533" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758533;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758534;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758534" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "131", "name": "22级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758534" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758534;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758535;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758535" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "132", "name": "22级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758535" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758535;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758536;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758536" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "133", "name": "22级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758536" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758536;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758537;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758537" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "134", "name": "22级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758537" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758537;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758538;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758538" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "135", "name": "22级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758538" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758538;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758539;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758539" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "136",
        "name": "22级城堡热卖 cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758539" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758539;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758540;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758540" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "137",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758540" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758540;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758541;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758541" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "138",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758541" }],
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
              "condition": [{ "#text": ">=;22" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;23" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758541;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758542;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758542" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "139",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)", "group": "1" },
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758543;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758543" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "140", "name": "24级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758543" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758543;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758544;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758544" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "141", "name": "24级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758544" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758544;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758545;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758545" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "142", "name": "24级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758545" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758545;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758546;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758546" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "143", "name": "24级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758546" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758546;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758547;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758547" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "144", "name": "24级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758547" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758547;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758548;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758548" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "145", "name": "24级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "758548" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758548;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758549;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758549" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "146",
        "name": "24级城堡热卖 cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758549" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758549;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758550;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758550" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "147",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758550" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758550;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758551;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758551" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "148",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp cp",
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
            {
              "event": [{ "#text": "758551" }],
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
              "condition": [{ "#text": "==;24" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758551;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758552;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
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
              "action": [{ "#text": "758552" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "149",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp cp cp",
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759840;<;1" }],
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
              "action": [{ "#text": "759840;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1453", "name": "新城堡热卖-28", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759840" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759840;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759841;<;1" }],
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
              "action": [{ "#text": "759841;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1455", "name": "新城堡热卖-28 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759841" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759841;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759842;<;1" }],
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
              "action": [{ "#text": "759842;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1456", "name": "新城堡热卖-28 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759842" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759842;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759843;<;1" }],
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
              "action": [{ "#text": "759843;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1457", "name": "新城堡热卖-28 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759843" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759843;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759844;<;1" }],
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
              "action": [{ "#text": "759844;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1458", "name": "新城堡热卖-28 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759845" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "300001;990000000" }],
              ":@": { "type": "30", "name": "总付费金币所在区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1704028;1440" }],
              ":@": {
                "type": "11",
                "name": "条件出现，定时消失参数：秒（仅限礼包用）",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759845;<;5" }],
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
              "action": [{ "#text": "759845;340" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1459", "name": "新城堡热卖-28 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759873" }],
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
              "action": [{ "#text": "759873;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1481", "name": "N日目标配合礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759874" }],
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
              "action": [{ "#text": "759874;300" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1482", "name": "N日目标配合礼包 cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759956;<;1" }],
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
              "action": [{ "#text": "759956;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1551", "name": "页签-造兵加速", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759956" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759956;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759957;<;1" }],
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
              "action": [{ "#text": "759957;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1552", "name": "页签-造兵加速 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759957" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759957;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759958;<;1" }],
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
              "action": [{ "#text": "759958;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1553", "name": "页签-造兵加速 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759958" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759958;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759959;<;1" }],
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
              "action": [{ "#text": "759959;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1554", "name": "页签-造兵加速 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759959" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759959;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759960;<;1" }],
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
              "action": [{ "#text": "759960;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1555", "name": "页签-造兵加速 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759961" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759961;<;5" }],
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
              "action": [{ "#text": "759961;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1556", "name": "页签-造兵加速 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759962;<;1" }],
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
              "action": [{ "#text": "759962;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1558", "name": "页签-徽记", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759962" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759962;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759963;<;1" }],
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
              "action": [{ "#text": "759963;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1559", "name": "页签-徽记 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759963" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759963;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759964;<;1" }],
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
              "action": [{ "#text": "759964;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1560", "name": "页签-徽记 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759964" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759964;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759965;<;1" }],
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
              "action": [{ "#text": "759965;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1561", "name": "页签-徽记 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759965" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759965;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759966;<;1" }],
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
              "action": [{ "#text": "759966;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1562", "name": "页签-徽记 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759967" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": ">=;28" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "300001;999999999" }],
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;4;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759967;<;5" }],
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
              "action": [{ "#text": "759967;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1563", "name": "页签-徽记 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760005" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "1;2;4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;760005;<;5" }],
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
              "action": [{ "#text": "760005;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1575", "name": "页签-VIP cp cp cp cp cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761742" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "761742;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1592", "name": "10美金日常材料（新）", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761743" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "761743;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1594", "name": "20美金日常材料（新）", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760006" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "760006;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1600", "name": "页签页签-VIP", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760007" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "760007;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1601", "name": "页签页签-VIP cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760008" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "760008;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1602", "name": "页签页签-VIP cp cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "24;759762;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759762;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1360", "name": "五折", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759762" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759762;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759763;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759763;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1361", "name": "五折 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759763" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759763;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759764;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759764;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1362", "name": "五折 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759764" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759764;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759765;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759765;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1363", "name": "五折 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759765" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759765;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759766;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759766;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1364", "name": "五折 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759767" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "24;759767;<;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-06-28 00:00:00;2017-06-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "759767;420" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1365", "name": "五折 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761744" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "action": [{ "#text": "761744;220" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1714", "name": "100美金日常材料（新）", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759883;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "759883;370" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1498", "name": "页签-1刀", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759884;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
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
              "action": [{ "#text": "759884;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1499", "name": "页签-1刀 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759886;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "3" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
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
              "action": [{ "#text": "759886;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1501", "name": "页签-1刀 cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759887;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "4" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
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
              "action": [{ "#text": "759887;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1502", "name": "页签-1刀 cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759888;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
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
              "action": [{ "#text": "759888;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1503", "name": "页签-1刀 cp cp cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "24;759889;<;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;300000" }],
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
              "action": [{ "#text": "759889;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1504", "name": "页签-1刀 cp cp cp cp cp cp", "state": "2", "openType": "2" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759890;<;1" }],
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
              "action": [{ "#text": "759890;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1505", "name": "页签-全资源", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759890" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759890;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759891;<;1" }],
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
              "action": [{ "#text": "759891;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1506", "name": "页签-全资源 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759891" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759891;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759892;<;1" }],
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
              "action": [{ "#text": "759892;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1507", "name": "页签-全资源 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759892" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759892;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759893;<;1" }],
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
              "action": [{ "#text": "759893;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1508", "name": "页签-全资源 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759893" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759893;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759894;<;1" }],
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
              "action": [{ "#text": "759894;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1509", "name": "页签-全资源 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759895" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0;1;2;3;4;5;6" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759895;<;5" }],
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
              "action": [{ "#text": "759895;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1510", "name": "页签-全资源 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759908" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "3;6" }],
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
              "action": [{ "#text": "759908;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1519", "name": "页签-铁", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759909" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "3;6" }],
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
              "action": [{ "#text": "759909;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1520", "name": "页签-铁 cp", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759910" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "3;6" }],
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
              "action": [{ "#text": "759910;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1521", "name": "页签-铁 cp cp", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759913" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "3;6" }],
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
              "action": [{ "#text": "759913;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1522", "name": "页签-铁 cp cp cp", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759914" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0" }],
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
              "action": [{ "#text": "759914;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1523", "name": "页签-银", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759915" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0" }],
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
              "action": [{ "#text": "759915;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1524", "name": "页签-银 cp", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759916" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0" }],
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
              "action": [{ "#text": "759916;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1525", "name": "页签-银 cp cp", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759919" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0" }],
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
              "action": [{ "#text": "759919;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1526", "name": "页签-银 cp cp cp", "state": "-1", "openType": "2" },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759920;<;1" }],
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
              "action": [{ "#text": "759920;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1530", "name": "页签-城建", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759920" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759920;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759921;<;1" }],
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
              "action": [{ "#text": "759921;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1531", "name": "页签-城建 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759921" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759921;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759922;<;1" }],
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
              "action": [{ "#text": "759922;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1532", "name": "页签-城建 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759922" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759922;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759923;<;1" }],
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
              "action": [{ "#text": "759923;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1533", "name": "页签-城建 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759923" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              ":@": { "type": "30", "name": "付费金币数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759923;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759924;<;1" }],
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
              "action": [{ "#text": "759924;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1534", "name": "页签-城建 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759925" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
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
              "condition": [{ "#text": "0;1;3;5" }],
              ":@": { "type": "10", "name": "时间区间(周几)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;759925;<;5" }],
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
              "action": [{ "#text": "759925;350" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1535", "name": "页签-城建 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760879" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "760879;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1857", "name": "无畏套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760880" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "760880;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1858", "name": "军需官套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761184" }],
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
              "action": [{ "#text": "761184" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1870", "name": "英勇套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761185" }],
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
              "action": [{ "#text": "761185" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1872", "name": "征服套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761192" }],
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
              "action": [{ "#text": "761192" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1879", "name": "怜悯套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761193" }],
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
              "action": [{ "#text": "761193" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1880", "name": "旅行家套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761194" }],
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
              "action": [{ "#text": "761194" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1881", "name": "庇护者套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761195" }],
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
              "action": [{ "#text": "761195" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1882", "name": "角斗士套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761473" }],
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
              "action": [{ "#text": "761473;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2165", "name": "文明切换道具", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761503" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "761503" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2181", "name": "远古先知套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761504" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-17 00:00:00;2017-08-18 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;20" }],
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
              "action": [{ "#text": "761504;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2182", "name": "远古先知套装-促销", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
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
        { "conditions": [] },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761405;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2260", "name": "荣耀套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
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
        { "conditions": [] },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761408;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2261", "name": "女王套装", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759047" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "10;759047" }],
              ":@": {
                "type": "85",
                "name": "联盟团购礼包购买最大份数(需配置下推礼包ID)",
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
              "action": [{ "#text": "759047" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "555", "name": "联盟团购", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759048" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "10;759048" }],
              ":@": {
                "type": "85",
                "name": "联盟团购礼包购买最大份数(需配置下推礼包ID)",
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
              "action": [{ "#text": "759048" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "556", "name": "联盟团购 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759408" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "action": [{ "#text": "759408;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "832", "name": "洗练徽章", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760277" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760277;<;1" }],
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
              "action": [{ "#text": "760277;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1605", "name": "军需官窗口", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761183" }],
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
              "action": [{ "#text": "761183;200" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1865", "name": "战争女王", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;759759;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "action": [{ "#text": "759759;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1356", "name": "新首冲新冲 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759759" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759759;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759760;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "action": [{ "#text": "759760;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1357", "name": "新首冲新冲 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "759760" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759760;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;759761;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;5" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
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
              "action": [{ "#text": "759761;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1358", "name": "新首冲新冲 cp cp cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "<=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760292;<;1" }],
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
              "action": [{ "#text": "760292;50" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1635", "name": "成长基金", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "760277" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760277;<;1" }],
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
              "action": [{ "#text": "760277;400" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2661", "name": "军需官促销", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761485" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "24;761485;<=;5" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-08-17 00:00:00;2017-08-18 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "761485;430" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2174", "name": "战争女王 cp", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;760357;==;0" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;2" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<;7" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
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
              "action": [{ "#text": "760357;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1670", "name": "17年6月首冲", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;760359;<;1" }],
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
              "action": [{ "#text": "760359;100" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1671", "name": "龙宝藏", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;758906;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "758906" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "418", "name": "表情包1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
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
              "condition": [{ "#text": "<;14" }],
              ":@": { "type": "14", "name": "比较玩家注册时间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;760357;==;1" }],
              ":@": { "type": "80", "name": "多少小时内购买礼包次数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;19" }],
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
              "action": [{ "#text": "761391;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1954", "name": "首冲4件城建套装", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "-1;759833;<;1" }],
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
              "action": [{ "#text": "759833;500" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1452", "name": "拉你入坑", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "761691" }],
              ":@": { "type": "41", "name": "购买礼包成功", "group": "1" },
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
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-01 00:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "100;761691;<;2" }],
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
              "action": [{ "#text": "761691;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2464", "name": "snk-不知火舞皮肤", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;TW;JP" }],
              ":@": { "type": "16", "name": "玩家所在国家", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-01 00:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "100;761734;<;1" }],
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
              "action": [{ "#text": "761734;450" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2519", "name": "snk-不知火舞铭牌", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": ">=;10" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2017-11-01 00:00:00;2017-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "100;761773;<;1" }],
              ":@": { "type": "79", "name": "几天内购买礼包次数", "group": "1" },
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
              "action": [{ "#text": "761773;480" }],
              ":@": { "type": "15", "name": "推送礼包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2553", "name": "snk-不知火舞气泡", "state": "2", "openType": "2" },
    },
  ];
}
