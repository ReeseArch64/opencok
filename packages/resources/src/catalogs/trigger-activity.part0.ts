import { repeatCatalogElements, type GameplayCatalogElement } from "../catalog.ts";

export function part0(): GameplayCatalogElement[] {
  return [
    { "#text": "\n  " },
    { "version": [{ "#text": "e82cac44f930536b4c5e5fce133a1fbd" }] },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "9400;9401;9402;9403;9404;9405;9406;9407;9408;9409;9410;9411;9412;9413;9414;9415;9416;9417;9418;9419;9420;9421;9422;9423;9424;9425;9426;9427;9428;9429",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-10-30 00:00:00;2024-12-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$worldboss_icedragon_count;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$worldboss_icedragon_count;==;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "60",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(3Special)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;500;false;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2465", "name": "SKN-世界BOSS", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1" }],
              ":@": { "type": "69", "name": "VIP升级", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "6" }],
              ":@": { "type": "69", "name": "VIP升级", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "11" }],
              ":@": { "type": "69", "name": "VIP升级", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "16" }],
              ":@": { "type": "69", "name": "VIP升级", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-10000" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "<;1" }],
                  ":@": { "type": "86", "group": "1", "name": "加入联盟时间(小时)" },
                },
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "==;5" }],
                  ":@": { "type": "88", "group": "1", "name": "合服时间限制(天)" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "52", "name": "或 - 2", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$vip_level;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "761570;360" }],
                  ":@": { "type": "15", "group": "1", "name": "推送礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$vip_level;==;6" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "761571;360" }],
                  ":@": { "type": "15", "group": "1", "name": "推送礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$vip_level;==;11" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "761572;360" }],
                  ":@": { "type": "15", "group": "1", "name": "推送礼包" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$vip_level;==;16" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "761573;360" }],
                  ":@": { "type": "15", "group": "1", "name": "推送礼包" },
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
      ":@": { "id": "2427", "name": "VIP升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9401" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9402" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9403" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9404" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-07 11:08:18;2024-03-08 11:08:24" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "<;1" }],
                  ":@": { "type": "86", "group": "1", "name": "加入联盟时间(小时)" },
                },
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "==;5" }],
                  ":@": { "type": "88", "group": "1", "name": "合服时间限制(天)" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "52", "name": "或 - 2", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_treasure_hour_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week2_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "817", "name": "test_test", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-11-23 00:00:00;2024-11-29 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;12000;30;1440;152842;1;12000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2611", "name": "红包_99.99红包礼包测试", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211319" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-24 17:00:00;2024-09-09 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$use_item_server;<;50" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item_server;==;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "52",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item_server;==;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "52",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "565" }],
                  ":@": { "type": "2", "group": "1", "name": "关闭 Trigger" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_shop_fixed_count_2;0" }],
                  ":@": { "type": "24", "group": "1", "name": "变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "21", "name": "执行多个操作 2", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "565", "name": "刷BOSS", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "21", "name": "收获资源", "group": "1" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆", "group": "1" } },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "10" }],
              ":@": { "type": "68", "name": "商店购买", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-09 17:29:19;2024-03-10 17:29:24" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;1" }],
              ":@": { "type": "19", "name": "玩家VIP等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;5" }],
              ":@": { "type": "41", "name": "VIP等级(值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "249161" }],
              ":@": { "type": "48", "name": "触发reward奖励", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_a_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                ...repeatCatalogElements(
                  8,
                  { "#text": "\n        " },
                  { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                ),
                { "#text": "\n      " },
              ],
              ":@": { "type": "21", "name": "执行多个操作", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "921", "name": "test2", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-02-19 16:48:18;2024-02-21 16:48:21" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;15" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;20" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "1" }],
                  ":@": { "type": "32", "group": "1", "name": "服务器编号" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">=;15" }],
                      ":@": { "type": "41", "group": "1", "name": "VIP等级(值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "ACTIVITY;1111;LOVE_PUSH" }],
                      ":@": { "type": "55", "group": "1", "name": "给全服发送离线推送" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>;100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week1_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "123456" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newplayer_1day_kill-3;$newplayer_1day_kill-1;$newplayer_1day_kill-2;1;claim|info",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "688", "name": "ee", "state": "0", "openType": "2" },
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
              "condition": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": ">;14" }],
                  ":@": { "type": "48", "group": "1", "name": "天没登录" },
                },
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$last_login_exchange;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "52", "name": "或 - 2", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$last_login_exchange;1" }],
              ":@": { "type": "24", "name": "变量赋值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2527", "name": "xjhtest001", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;5" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "111" }],
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
              "action": [{ "#text": "$var_test_v2;+;5" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "---------------------------------------------------${S$long_var_test_v2}----------------------------------------------",
                },
              ],
              ":@": { "type": "30", "name": "打印一个Log 带参数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$key_rewardId;<;$key_trial_field_sequence" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "817" }],
                      ":@": { "type": "2", "group": "1", "name": "关闭 Trigger" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "817" }],
                      ":@": { "type": "1", "group": "1", "name": "开启触发器" },
                    },
                    ...repeatCatalogElements(
                      7,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "817" }],
                      ":@": { "type": "1", "group": "1", "name": "开启触发器" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "689", "name": "变量测试V2", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9401" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9402" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9403" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9404" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9405" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9406" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9407" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9408" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9409" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-11-15 00:00:00;2024-11-16 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-8902" }],
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
              "action": [{ "#text": "false;100;900907;30;15;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2460", "name": "1-10级怪", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9411" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9412" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9413" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9410" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9414" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9415" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9416" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9417" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9418" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9419" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-10-26 00:00:00;2024-11-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-8902" }],
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
              "action": [{ "#text": "false;30;900908;30;15;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2462", "name": "11-20级怪 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9425" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9426" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9427" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9428" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9429" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9420" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9421" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9422" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9423" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9424" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-10-26 00:00:00;2024-11-07 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-8902" }],
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
              "action": [{ "#text": "false;30;900909;30;15;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2463", "name": "21-30级野怪 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212023" }],
              ":@": { "type": "57", "name": "请求领取道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_cake_taken;==;0" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [
                        {
                          "#text": "$3th_anniversary_cake_count;<;$3th_anniversary_cake_count_max",
                        },
                      ],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$3th_anniversary_cake_taken;+;1" }],
                          ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$3th_anniversary_cake_count;+;1" }],
                          ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "250156" }],
                          ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$3th_week1_score_count;+;45" }],
                          ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                        },
                        ...repeatCatalogElements(
                          6,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_anniversary_cake_taken}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2065", "name": "周年蛋糕_1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "45" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-10-31 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212024;1" }],
              ":@": { "type": "73", "name": "验证要消耗的物品ID，并删除通过验证", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "509877;86400" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "509876;3600" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "509877;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "509878;3600" }],
                  ":@": {
                    "type": "33",
                    "group": "1",
                    "name": "添加状态status,持续时间不填默认读表",
                  },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2066", "name": "周年蛋糕_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "509878" }],
              ":@": { "type": "59", "name": "城堡皮肤变化(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "12290" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_avatar_cake_count;<;$3th_anniversary_avatar_cake_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_avatar_cake_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week1_score_count;+;150" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_anniversary_avatar_cake_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2067", "name": "周年蛋糕_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212025" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_a_count;<;$3th_avviversary_paint_a_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;7" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_a_count;<;$3th_avviversary_paint_a_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_a_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_avviversary_paint_a_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2068", "name": "集画换好礼_1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212026" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_b_count;<;$3th_avviversary_paint_b_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;15" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_b_count;<;$3th_avviversary_paint_b_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_b_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_avviversary_paint_b_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2069", "name": "集画换好礼_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212027" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_c_count;<;$3th_avviversary_paint_c_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;30" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_c_count;<;$3th_avviversary_paint_c_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_c_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_avviversary_paint_c_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2070", "name": "集画换好礼_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212028" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_d_count;<;$3th_avviversary_paint_d_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;150" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_d_count;<;$3th_avviversary_paint_d_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_d_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_avviversary_paint_d_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2071", "name": "集画换好礼_4", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$3th_anniversary_mail_send_count;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "12286" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_mail_send_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_anniversary_mail_send_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2072", "name": "登录送福利", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930013" }],
              ":@": { "type": "64", "name": "攻击世界BOSS一次(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930014" }],
              ":@": { "type": "64", "name": "攻击世界BOSS一次(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930015" }],
              ":@": { "type": "64", "name": "攻击世界BOSS一次(指定boss_id)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_boss_killed_count;<;$3th_anniversary_dragon_boss_killed_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;20" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_boss_killed_count;<;$3th_anniversary_dragon_boss_killed_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_dragon_boss_killed_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
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
      ":@": { "id": "2073", "name": "周年龙BOSS_1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900821;900822;900823;900824;900825;900826;900827;900828;900829;900830;900831;900832;900833;900834;900835;900836;900837;900838;900839;900840;900841;900842;900843;900844;900845;900846;900847;900848;900849;900850",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_enemy_killed_count;<;$3th_anniversary_dragon_enemy_killed_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;3" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_enemy_killed_count;<;$3th_anniversary_dragon_enemy_killed_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_dragon_enemy_killed_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
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
      ":@": { "id": "2074", "name": "周年龙BOSS_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212031" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_item_count;<;$3th_anniversary_dragon_item_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_item_count;<;$3th_anniversary_dragon_item_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_dragon_item_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
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
      ":@": { "id": "2075", "name": "周年龙BOSS_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;-1" }],
              ":@": { "type": "62", "name": "兑换活动奖励", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_exchange_count;<;$3th_anniversary_dragon_exchange_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;30" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_dragon_exchange_count;<;$3th_anniversary_dragon_exchange_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_dragon_exchange_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
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
      ":@": { "id": "2076", "name": "周年龙BOSS_4", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;true" }],
              ":@": { "type": "63", "name": "探索遗迹", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_time_count;<;$3th_anniversary_treasure_time_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_treasure_time_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week2_score_count;+;10" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2077", "name": "龙之宝藏_1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;false" }],
              ":@": { "type": "63", "name": "探索遗迹", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_explore_time;+;180" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_1;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_2;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_3;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_1;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_explore_time;>=;14400" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_2;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_1;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_2;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_3;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;30" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_explore_time;0" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
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
      ":@": { "id": "2078", "name": "龙之宝藏_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212032" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_getitem_count;<;$3th_anniversary_treasure_getitem_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;25" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_getitem_count;<;$3th_anniversary_treasure_getitem_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_getitem_count;+;$key_itemNum" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
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
      ":@": { "id": "2079", "name": "龙之宝藏_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212032" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_useitem_count;<;$3th_anniversary_treasure_useitem_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;55" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_useitem_count;<;$3th_anniversary_treasure_useitem_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_useitem_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
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
      ":@": { "id": "2080", "name": "龙之宝藏_4", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1" }],
              ":@": { "type": "67", "name": "福袋操作", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_blessingbag_open_count;<;$3th_anniversary_blessingbag_open_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_blessingbag_open_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week3_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2081", "name": "周年福袋_1", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "2" }],
              ":@": { "type": "67", "name": "福袋操作", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_blessingbag_refresh_count;<;$3th_anniversary_blessingbag_refresh_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_blessingbag_refresh_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week3_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2082", "name": "周年福袋_2", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "3" }],
              ":@": { "type": "67", "name": "福袋操作", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_blessingbag_goldopen_count;<;$3th_anniversary_blessingbag_goldopen_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_blessingbag_goldopen_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week3_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2083", "name": "周年福袋_3", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "10" }],
              ":@": { "type": "68", "name": "商店购买", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$key_shopId;==;1000152" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                {
                  "#text":
                    "$3th_anniversary_fire_buy_time_count;<;$3th_anniversary_fire_buy_time_count_max",
                },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_fire_buy_time_count;<;$3th_anniversary_fire_buy_time_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_fire_buy_time_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week3_score_count;+;150" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2084", "name": "烟花灿烂_1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930016" }],
              ":@": { "type": "64", "name": "攻击世界BOSS一次", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                {
                  "#text":
                    "$3th_anniversary_fire_attack_boss_count;<;$3th_anniversary_fire_attack_boss_count_max",
                },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week3_score_count;+;15" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_fire_attack_boss_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2085", "name": "烟花灿烂_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "212033" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                {
                  "#text": "$3th_anniversary_get_fire_count;<;$3th_anniversary_get_fire_count_max",
                },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_shop_fixed_count;0" }],
              ":@": { "type": "24", "name": "变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_shop_fixed_count_1;0" }],
              ":@": { "type": "24", "name": "变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_shop_fixed_count_2;0" }],
              ":@": { "type": "24", "name": "变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_shop_fixed_count;+;$key_itemNum" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$3th_anniversary_shop_fixed_count_1;+;$3th_anniversary_get_fire_count_max",
                },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text": "$3th_anniversary_shop_fixed_count_1;-;$3th_anniversary_get_fire_count",
                },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_shop_fixed_count;>=;$3th_anniversary_shop_fixed_count_1",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    {
                      "#text":
                        "$3th_anniversary_shop_fixed_count_2;+;$3th_anniversary_shop_fixed_count_1",
                    },
                  ],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    {
                      "#text":
                        "$3th_anniversary_shop_fixed_count_2;+;$3th_anniversary_shop_fixed_count",
                    },
                  ],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为其他变量的值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text": "$3th_anniversary_get_fire_count;+;$3th_anniversary_shop_fixed_count_2",
                },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "$3th_week3_score_count;+;$3th_anniversary_shop_fixed_count_2" },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2086", "name": "烟花灿烂_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400;9401;9402" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_shadow_kill_candle_count;<;$3th_anniversary_shadow_kill_candle_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_shadow_kill_candle_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2091", "name": "反叛军的阴谋_1", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930004" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930005" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "930006" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_shadow_kill_boss_count;<;$3th_anniversary_shadow_kill_boss_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_shadow_kill_boss_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "2092", "name": "反叛军的阴谋_2", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1" }],
              ":@": { "type": "66", "name": "试炼场事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "$3th_anniversary_trial_count;<;$3th_anniversary_trial_count_max" },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_trial_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week3_score_count;+;20" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2093", "name": "试炼场_1", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_anniversary_cake_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;45" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_anniversary_use_cake_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "$3th_week1_fix_box_score;+;$3th_anniversary_avatar_cake_count" },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;150" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_a_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;7" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_b_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;15" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_c_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;30" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_d_count" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;150" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_abcd_count" },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;550" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "$3th_week1_fix_box_score;+;$3th_anniversary_mail_recived_count" },
              ],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;*;150" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_score_count;+;$3th_week1_fix_box_score" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week1_fix_box_score;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2349", "name": "修复积分错误-第一周", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "2" }],
              ":@": { "type": "66", "name": "试炼场事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                {
                  "#text":
                    "$3th_anniversary_trial_pass_count;<;$3th_anniversary_trial_pass_count_max",
                },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$key_trial_field_sequence;==;8" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "------------${C$key_trial_field_sequence}------------------" },
              ],
              ":@": { "type": "30", "name": "打印一个Log 带参数", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_trial_pass_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week3_score_count;+;150" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2094", "name": "试炼场_2", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;false" }],
              ":@": { "type": "63", "name": "探索遗迹", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-01 00:00:00;2024-09-30 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_explore_time;+;180" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_1;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_2;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_treasure_hour_var_3;0" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_1;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_explore_time;>=;$3th_anniversary_explore_request_time",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_2;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_1;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_2;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_var_3;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_treasure_hour_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week2_score_count;+;30" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_treasure_hour_var_3;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_explore_time;0" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "123456" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2350", "name": "龙之宝藏_2 cp", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [
                        {
                          "#text":
                            "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                        },
                      ],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_mail_send_count;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;150" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [
                        {
                          "#text":
                            "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                        },
                      ],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_mail_send_count;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_mail_recived_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
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
      ":@": { "id": "2351", "name": "修复邮件错误-第一周", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "45" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212024;1" }],
              ":@": { "type": "73", "name": "验证要消耗的物品ID，并删除通过验证", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "509877;86400" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "509876;3600" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "509877;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "509878;3600" }],
                  ":@": {
                    "type": "33",
                    "group": "1",
                    "name": "添加状态status,持续时间不填默认读表",
                  },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_use_cake_count;<;$3th_anniversary_use_cake_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_use_cake_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week1_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_use_cake_total_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_use_cake_total_count;==;30" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "12288" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_use_cake_total_count;==;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "12289" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_anniversary_use_cake_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2354", "name": "周年蛋糕_活动版", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "2" }],
              ":@": { "type": "66", "name": "试炼场事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                {
                  "#text":
                    "$3th_avviversary_trial_pass6_count;<;$3th_avviversary_trial_pass6_count_max",
                },
              ],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$key_trial_field_sequence;==;6" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_avviversary_trial_pass6_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_week3_score_count;+;40" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2356", "name": "试炼场_3", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;7200" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [],
              ":@": { "type": "52", "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;152829;SAN_ZHOU_NIAN_BOSS" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2367", "name": "烟花灿烂_4", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-10-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>=;100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week1_box_1_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12324" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>=;300" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week1_box_2_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12325" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>=;600" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week1_box_3_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12326" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>=;1100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week1_box_4_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12327" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week1_score_count;>=;1900" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week1_box_5_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12328" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2385", "name": "三周年_第一周积分宝箱_补发", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-10-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week2_score_count;>=;100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week2_box_1_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12329" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week2_score_count;>=;300" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week2_box_2_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12330" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week2_score_count;>=;600" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week2_box_3_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12331" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week2_score_count;>=;1100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week2_box_4_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12332" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week2_score_count;>=;1900" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week2_box_5_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12333" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2386", "name": "三周年_第二周积分宝箱_补发", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-27 02:00:00;2024-10-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week3_score_count;>=;100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week3_box_1_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12334" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week3_score_count;>=;300" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week3_box_2_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12335" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week3_score_count;>=;600" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week3_box_3_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12336" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week3_score_count;>=;1100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week3_box_4_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12337" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week3_score_count;>=;1900" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week3_box_5_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12338" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2387", "name": "三周年_第三周积分宝箱_补发", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-10-04 02:00:00;2024-10-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week4_score_count;>=;100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_1_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12339" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week4_score_count;>=;300" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_2_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12340" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week4_score_count;>=;600" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_3_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12341" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week4_score_count;>=;1100" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_4_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12342" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_week4_score_count;>=;1900" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_5_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12343" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2388", "name": "三周年_第四周积分宝箱_补发", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "gold_8" }],
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
              "action": [{ "#text": "0;0;250;5;1440;152842;1;250" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2390", "name": "红包_0.99礼包红包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900881" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900882" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900883" }],
              ":@": { "type": "65", "name": "击杀世界BOSS(指定boss_id)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_ajatar_killed;<;$3th_anniversary_ajatar_killed_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_ajatar_killed;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;30" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2391", "name": "恶龙-消灭恶龙", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "137456" }],
              ":@": { "type": "61", "name": "邮件领奖(指定title)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-10-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_ajatar_get_mail;<;$3th_anniversary_ajatar_get_mail_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_ajatar_get_mail;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2392", "name": "恶龙-领取联盟邮件", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203036" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203037" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203038" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203039" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203040" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_get_dragon_face;<;$3th_avviversary_get_dragon_face_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_avviversary_get_dragon_face;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;200" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2393", "name": "恶龙-获得任意皮肤", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "203040" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_get_30day_dragon_face;<;$3th_avviversary_get_30day_dragon_face_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_avviversary_get_30day_dragon_face;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;500" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2394", "name": "恶龙-获得30天皮肤", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "152625" }],
              ":@": { "type": "61", "name": "邮件领奖(指定title)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;150" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_mail_recived_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_anniversary_mail_recived_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2148", "name": "登录送福利~", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250080" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250081" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250082" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250083" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250084" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-04 00:00:00;2024-09-13 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250080" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250080" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250080" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week1_box_1_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250081" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250081" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250081" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week1_box_2_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250082" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250082" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250082" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week1_box_3_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250083" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250083" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250083" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week1_box_4_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250084" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250084" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250084" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week1_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week1_box_5_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$key_rewardId}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2207", "name": "第一周_积分宝箱_领取", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250085" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250086" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250087" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250088" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250089" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250085" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250085" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250085" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week2_box_1_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250086" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250086" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250086" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week2_box_2_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250087" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250087" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250087" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week2_box_3_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250088" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250088" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250088" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week2_box_4_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250089" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250089" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250089" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week2_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week2_box_5_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$key_rewardId}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2211", "name": "第二周_积分宝箱_领取", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250090" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250091" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250092" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250093" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250094" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-19 00:00:00;2024-09-27 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250090" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250090" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250090" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week3_box_1_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250091" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250091" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250091" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week3_box_2_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250092" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250092" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250092" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week3_box_3_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250093" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250093" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250093" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week3_box_4_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250094" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250094" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250094" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week3_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_anniversary_week3_box_5_flag;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$key_rewardId}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2212", "name": "第三周_积分宝箱_领取", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250095" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250096" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250097" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250098" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;250099" }],
              ":@": { "type": "58", "name": "请求奖励或预览奖励(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250095" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_1_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_1_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250095" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250096" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_2_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_2_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250096" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250097" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_3_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_3_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250097" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250098" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_4_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_4_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250098" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_rewardId;==;250099" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$3th_anniversary_week4_box_5_flag;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 2" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_week4_box_5_flag;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250099" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "----------------------------------key_rewardId--------${$key_rewardId}-------------------",
                },
              ],
              ":@": { "type": "30", "name": "打印一个Log 带参数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2213", "name": "第四周_积分宝箱_领取", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "44" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-13 00:00:00;2024-09-20 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212025;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212026;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212027;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "212028;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "212025,1|212026,1|212027,1|212028,1;2;250151" }],
              ":@": { "type": "46", "name": "物品兑换", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_abcd_count;<;$3th_avviversary_paint_abcd_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_week1_score_count;+;550" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_avviversary_paint_abcd_count;<;$3th_avviversary_paint_abcd_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$3th_avviversary_paint_abcd_count;+;1" }],
                  ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${$3th_avviversary_paint_abcd_count}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2236", "name": "集画换好礼_5", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_cake_boss_count;800;true;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2243", "name": "蛋糕BOSS-进度条", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400;9401;9402" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-01 00:00:00;2024-09-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_cake_boss_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$3th_anniversary_cake_boss_count;==;800" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "38", "group": "1", "name": "这个BOSS是一个及其特殊的世界BOSS" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$3th_anniversary_cake_boss_count;800;false;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2244", "name": "蛋糕BOSS-召唤", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_redpacket_buy_time_count;<;$3th_anniversary_redpacket_buy_time_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_redpacket_buy_time_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;200" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2246", "name": "红包_购买1次红包礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;>=;500" }],
              ":@": { "type": "81", "name": "验证领取红包的大小", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_redpacket_get_more_money_number;<;$3th_anniversary_redpacket_get_more_money_number_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "$3th_anniversary_redpacket_get_more_money_number;+;1" },
                      ],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;50" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2247", "name": "红包_在红包中抢到XX金币", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;>=;1" }],
              ":@": { "type": "81", "name": "验证领取红包的大小", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    {
                      "#text":
                        "$3th_anniversary_redpacket_get_money_count;<;$3th_anniversary_redpacket_get_money_count_max",
                    },
                  ],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_anniversary_redpacket_get_money_count;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$3th_week4_score_count;+;15" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 2" },
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
      ":@": { "id": "2248", "name": "红包_抢到红包XX次 ", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;750;8;1440;152842;1;750" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2249", "name": "红包_4.99礼包红包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;1500;10;1440;152842;1;1500" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2250", "name": "红包_9.99红包礼包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;2400;15;1440;152842;1;2400" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2251", "name": "红包_19.99红包礼包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;6000;20;1440;152842;1;6000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2252", "name": "红包_49.99红包礼包", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-09-26 00:00:00;2024-10-04 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
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
              "action": [{ "#text": "0;0;12000;30;1440;152842;1;12000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2253", "name": "红包_99.99红包礼包", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900705;900706;900707;900708;900709;900710;900711;900712;900713;900714;900715;900716;900717;900718;900719;900720;900721;900722;900723;900724;900725;900726;900727;900728;900729;900730;900731;900732;900733;900734",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-21 00:00:00;2024-11-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$worldboss_icedragon_count;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;+;100" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$worldboss_icedragon_count;==;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "60",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(3Special)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;500;false;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1359", "name": "冰龙世界BOSS", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-08-21 00:00:00;2024-11-11 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;500;true;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1373", "name": "冰龙-怪物进度条显示", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$worldboss_icedragon_count;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "38", "group": "1", "name": "这个BOSS是一个及其特殊的世界BOSS" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$worldboss_icedragon_count;1;false;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1901", "name": "冰龙世界BOSS cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900705;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1419", "name": "冰龙-野怪刷新规则_1", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9401" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900706;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1420", "name": "冰龙-野怪刷新规则_2", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9402" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900707;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1421", "name": "冰龙-野怪刷新规则_3", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9403" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900708;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1422", "name": "冰龙-野怪刷新规则_4", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9404" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900709;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1423", "name": "冰龙-野怪刷新规则_5", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9405" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900710;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1424", "name": "冰龙-野怪刷新规则_6", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9406" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900711;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1425", "name": "冰龙-野怪刷新规则_7", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9407" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900712;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1426", "name": "冰龙-野怪刷新规则_8", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9408" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900713;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1427", "name": "冰龙-野怪刷新规则_9", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9409" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900714;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1428", "name": "冰龙-野怪刷新规则_10", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9410" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900715;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1429", "name": "冰龙-野怪刷新规则_11", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9411" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900716;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1430", "name": "冰龙-野怪刷新规则_12", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9412" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900717;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1431", "name": "冰龙-野怪刷新规则_13", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9413" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900718;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1432", "name": "冰龙-野怪刷新规则_14", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9414" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900719;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1433", "name": "冰龙-野怪刷新规则_15", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9415" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900720;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1436", "name": "冰龙-野怪刷新规则_16", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9416" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900721;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1437", "name": "冰龙-野怪刷新规则_17", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9417" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900722;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1438", "name": "冰龙-野怪刷新规则_18", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9418" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900723;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1439", "name": "冰龙-野怪刷新规则_19", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9419" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900724;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1440", "name": "冰龙-野怪刷新规则_20", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9420" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900725;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1441", "name": "冰龙-野怪刷新规则_21", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9421" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900726;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1442", "name": "冰龙-野怪刷新规则_22", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9422" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900727;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1443", "name": "冰龙-野怪刷新规则_23", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9423" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900728;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1444", "name": "冰龙-野怪刷新规则_24", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9424" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900729;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1445", "name": "冰龙-野怪刷新规则_25", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9425" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900730;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1446", "name": "冰龙-野怪刷新规则_26", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9426" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900731;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1447", "name": "冰龙-野怪刷新规则_27", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9427" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900732;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1448", "name": "冰龙-野怪刷新规则_28", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9428" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900733;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1450", "name": "冰龙-野怪刷新规则_29", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9429" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900734;15;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1451", "name": "冰龙-野怪刷新规则_30", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900705;900706;900707;900708;900709;900710;900711;900712;900713;900714;900715;900716;900717;900718;900719;900720;900721;900722;900723;900724;900725;900726;900727;900728;900729;900730;900731;900732;900733;900734",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2013-05-06 00:00:00;2024-07-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${trigger_icedragon_boss}${monster_id}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1460", "name": "冰龙-击杀活动怪", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;600" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-06-13 02:00:00;2024-07-25 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-5000" }],
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
              "action": [{ "#text": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;600;100" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "101003" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1952", "name": "军魂_丰收时代", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-06-13 02:00:00;2024-07-25 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-5000" }],
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
              "action": [{ "#text": "$activity_troops_count;500;true;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1728", "name": "军魂-进度条", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900736;900737;900738;900739;900740;900741;900742;900743;900744;900745;900746;900747;900748;900749;900750;900751;900752;900753;900754;900755;900756;900757;900758;900759;900760;900761;900762;900763;900764;900765",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-06-13 02:00:00;2024-07-25 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-5000" }],
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
              "action": [{ "#text": "$activity_troops_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$activity_troops_count;500;false;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$activity_troops_count;==;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "2024-07-19 00:00:00;2024-07-19 23:59:59" }],
                      ":@": { "type": "9", "group": "1", "name": "时间区间" },
                    },
                    { "#text": "\n          " },
                    { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;100" }],
                      ":@": {
                        "type": "58",
                        "group": "1",
                        "name": "添加作用于整个服的作用号(持续到当天24点)",
                      },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
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
      ":@": { "id": "1734", "name": "军魂_杀怪计数", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "51" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-20 02:00:00;2024-01-29 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$cn_activity_panel_weibo" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "541", "name": "CN活动中心-微博", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall_weixin" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-20 02:00:00;2024-01-29 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$cn_activity_panel_wechat;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$cn_activity_panel_wechat;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11932" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "542", "name": "CN分享发奖-微信", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall_weibo" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-20 02:00:00;2024-01-29 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$cn_activity_panel_weibo;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$cn_activity_panel_weibo;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11932" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "550", "name": "CN分享发奖-微博", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "52" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-20 02:00:00;2024-01-29 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$cn_activity_panel_wechat" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "552", "name": "CN活动中心-微信", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "50" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-14 02:00:00;2024-04-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$thk_share" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "882", "name": "TW/HK/KR活动中心", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-14 02:00:00;2024-04-01 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$thk_share;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$thk_share;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11932" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "883", "name": "TW/HK/KR活动中心分享发奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "50" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-01 00:00:00;2024-03-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$KR_activity_pannel;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$KR_activity_pannel" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "429", "name": "KR活动中心", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-01 00:00:00;2024-03-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$KR_activity_pannel;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$KR_activity_pannel;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11886" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "430", "name": "KR分享发奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "50" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-01 00:00:00;2024-03-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$HKTW_activity_pannel" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "431", "name": "HKTW活动中心", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-03-01 00:00:00;2024-03-10 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$HKTW_activity_pannel;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$HKTW_activity_pannel;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11886" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "432", "name": "HKTW分享发奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "50" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-22 02:00:00;2024-01-01 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$MO_activity_pannel" }],
              ":@": { "type": "43", "name": "给客户端返回活动中心的请求的时间消息", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "439", "name": "MO活动中心", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "recall" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-22 02:00:00;2024-01-01 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$MO_activity_pannel;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$MO_activity_pannel;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11886" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "440", "name": "MO分享发奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "46" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-20 02:00:00;2024-01-03 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "211197;1" }],
              ":@": {
                "type": "36",
                "name": "许愿树活动执行,匹配消耗物品，添加数据库记录",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "421", "name": "许愿签使用", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "wishing" }],
              ":@": { "type": "47", "name": "客户端分享成功", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-20 02:00:00;2024-01-03 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$wish_share;<;1" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$wish_share;1" }],
              ":@": { "type": "24", "name": "给整数变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11879" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "423", "name": "首次许愿客户端分享", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "45" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-20 02:00:00;2024-09-09 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211218;1" }],
              ":@": { "type": "73", "name": "验证要消耗的物品ID，并删除通过验证", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "505589;86400" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "505601;3600" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;10" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;151460;SNOWMAN_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;30" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;151461;SNOWMAN_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;60" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;151462;SNOWMAN_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;60" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "505607;3600" }],
                  ":@": {
                    "type": "33",
                    "group": "1",
                    "name": "添加状态status,持续时间不填默认读表",
                  },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;10" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11895" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;30" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11894" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505589;60" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11893" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "424", "name": "扔雪球", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-05 00:00:00;2024-01-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kill_monster;1;true" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "425", "name": "界面怪物进度条显示", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900633" }],
              ":@": { "type": "48", "name": "击杀普通的放置世界BOSS", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900600;900601;900602;900603;900604;900605;900606;900607;900608;900609;900610;900611;900612;900613;900614;900615;900616;900617;900618;900619;900620;900621;900622;900623;900624;900625;900626;900627;900628;900629;900630;900631;900632;900634",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-05 00:00:00;2024-01-06 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kill_monster;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$kill_monster;==;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": { "type": "38", "group": "1", "name": "这个BOSS是一个及其特殊的世界BOSS" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kill_monster;80;false;1" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "426", "name": "双旦世界boss出现逻辑", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-01-06 02:00:00;2024-01-13 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n      " },
            { "condition": [], ":@": { "type": "74", "name": "验证许愿树是否领奖", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [],
              ":@": { "type": "37", "name": "许愿树活动执行发送奖励", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "428", "name": "许愿最终发奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900633" }],
              ":@": { "type": "48", "name": "击杀普通的放置世界BOSS", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "900600;900601;900602;900603;900604;900605;900606;900607;900608;900609;900610;900611;900612;900613;900614;900615;900616;900617;900618;900619;900620;900621;900622;900623;900624;900625;900626;900627;900628;900629;900630;900631;900632;900634",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2016-12-20 02:00:00;2024-01-03 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间(具体日期)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${trigger_xmas_boss}${monster_id}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "434", "name": "击杀放置boss与活动怪计数", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;600" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
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
              "action": [{ "#text": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;600;100" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_WHOLE_WORLD_COLLECT_SPEED_SKILl;600;30" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "656", "name": "合服后的丰收时代", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;1" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_MONSTER_FIGHT_REWARD;600;100" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "1203", "name": "合服打怪掉落双倍 cp", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;600" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;24" }],
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
              "action": [{ "#text": "TRIGGER_MONSTER_FIGHT_REWARD;600;100" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "748", "name": "合服打怪掉落双倍", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "-1;600" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "<=;168" }],
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
              "action": [{ "#text": "TRIGGER_SIGN_IN;600;100" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "749", "name": "合服签到奖励双倍", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211429" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 04:00:00;2024-02-28 04:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$flower;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$flower;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower1;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11982" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower1;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower10;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11983" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower10;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower50;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11984" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower50;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower100;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11985" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower100;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower200;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11986" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower200;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower350;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11987" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower350;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed_max;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$flower_max;1" }],
                      ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_bleed;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11989" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower_bleed;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
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
      ":@": { "id": "650", "name": "祈祷-花束", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211430" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 04:00:00;2024-02-28 04:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$bleed;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$bleed;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed1;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11974" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed1;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed10;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11975" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed10;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed50;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11976" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed50;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed100;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11977" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed100;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed200;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11978" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed200;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$bleed350;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11979" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$bleed350;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_max;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$bleed_max;1" }],
                      ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_bleed;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11981" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower_bleed;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
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
      ":@": { "id": "651", "name": "献祭-鲜血", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211429" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211430" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 10:00:00;2024-02-28 10:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$flower_bleed;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_bleed;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11989" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower_bleed;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_bleed;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "11981" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$bleed;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$flower_bleed;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
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
      ":@": { "id": "652", "name": "最终获奖", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9415" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9416" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9417" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9418" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9419" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9420" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9421" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9422" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9423" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9424" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9425" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9426" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9427" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9428" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9429" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 04:00:00;2024-02-28 04:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;60;900701;100;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "655", "name": "杀野怪出邪神16-30", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211429" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-13 08:00:00;2024-02-28 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$blood_count;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$blood_count;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;1" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11974" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;2" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11975" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;2" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;3" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11976" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;3" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;4" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11977" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;4" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;5" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11978" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$blood_rank;==;5" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$blood_rank;6" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11979" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
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
      ":@": { "id": "660", "name": "W-祈祷-花束", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211430" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-13 08:00:00;2024-02-28 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$flower_count;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$flower_count;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;1" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11982" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;10" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;1" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;2" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11983" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;2" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;3" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11984" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;3" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;4" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11985" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;4" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;5" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11986" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_rank;==;5" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_rank;6" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11987" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
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
      ":@": { "id": "662", "name": "W-献祭-鲜血", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211429" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211430" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-13 08:00:00;2024-02-28 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$flower_blood;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$flower_count;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_blood;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_blood;1" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11989" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$blood_count;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$flower_blood;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "$flower_blood;1" }],
                          ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                        },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "11981" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        ...repeatCatalogElements(
                          8,
                          { "#text": "\n            " },
                          {
                            "action": [],
                            ":@": { "type": "27", "group": "1", "name": "Do Nothing" },
                          },
                        ),
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "41", "group": "1", "name": "if (" },
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
      ":@": { "id": "663", "name": "W-最终唯一奖励", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900701" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 04:00:00;2024-02-28 04:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${trigger_cantabra_monster}${monster_id}" }],
              ":@": { "type": "30", "name": "打印一个Log 带参数", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "687", "name": "怪物打点", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9401" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9402" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9403" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9404" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9405" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9406" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9407" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9408" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9409" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9410" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9411" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9412" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9413" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9414" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-21 04:00:00;2024-02-28 04:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900701;100;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "690", "name": "杀野怪出邪神1-15", "state": "0", "openType": "2" },
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
              "condition": [{ "#text": "2024-10-01 02:00:00;2024-11-03 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$kingwar_testitem_sent;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "==;30" }],
                  ":@": { "type": "13", "group": "1", "name": "主城等级(值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "250580" }],
                  ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kingwar_testitem_sent;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2498", "name": "发送测试道具", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "2024-11-08 00:00:00;2024-11-09 11:30:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-500" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$kingwar_testitem_sent_2;<;2" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "250580" }],
              ":@": { "type": "48", "name": "触发reward奖励", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kingwar_testitem_sent_2;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2500", "name": "正式_发送测试道具", "state": "2", "openType": "2" },
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
              "condition": [{ "#text": "2024-11-01 02:00:00;2024-11-07 12:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-80" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;20" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$kingwar_testitem_sent_1;<;2" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "250580" }],
              ":@": { "type": "48", "name": "触发reward奖励", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$kingwar_testitem_sent_1;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2510", "name": "正式_发送测试道具 8小时行军", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9400" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9401" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9402" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9403" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9404" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9405" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9406" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9407" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9408" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9409" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9410" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9411" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9412" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9413" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9414" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-14 02:00:00;2024-02-21 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;30;900694;30;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "570", "name": "击杀1-15级野怪", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9415" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9416" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9417" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9418" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9419" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9420" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9421" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9422" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9423" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9424" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9425" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9426" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9427" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9428" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9429" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-14 02:00:00;2024-02-21 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "false;70;900695;30;5;100" }],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "571", "name": "击杀16-30级野怪", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211390" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-14 08:00:00;2024-02-21 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "152093;NOTICE_TYPE_USER;0;NOTICE_TYPE_ITEM;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(2个参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "572", "name": "获得名牌公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "45" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-02-14 02:00:00;2024-02-21 08:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211427;1" }],
              ":@": { "type": "73", "name": "验证要消耗的物品ID，并删除通过验证", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$use_item211427;<;200" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item211427;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "505679;86400" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "505678;3600" }],
              ":@": { "type": "33", "name": "添加状态status,持续时间不填默认读表", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;10" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;152097;LOVE_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;30" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;152098;LOVE_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "ACTIVITY;152099;LOVE_PUSH" }],
                  ":@": { "type": "39", "group": "1", "name": "离线推送" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "500527;3600" }],
                  ":@": {
                    "type": "33",
                    "group": "1",
                    "name": "添加状态status,持续时间不填默认读表",
                  },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "152110;NOTICE_TYPE_USER;0;NOTICE_TYPE_TARGET_USER;1" }],
                  ":@": { "type": "45", "group": "1", "name": "世界滚屏公告(2个参)" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;10" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11955" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;30" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11956" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "505679;50" }],
                  ":@": { "type": "72", "group": "1", "name": "验证status叠加层数" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11957" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n        " },
                { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                { "#text": "\n      " },
              ],
              ":@": { "type": "13", "name": "If Else", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item211427;==;50" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11958" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item211427;==;100" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11959" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item211427;==;200" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "11960" }],
                  ":@": { "type": "4", "group": "1", "name": "发送邮件" },
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
      ":@": { "id": "587", "name": "送爱意", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "21", "name": "收获资源", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-06-14 00:00:00;2024-06-27 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$activity_ramadan_count;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$activity_ramadan_count;>;2" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "249800" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$activity_ramadan_count;0" }],
                      ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
                    },
                    ...repeatCatalogElements(
                      8,
                      { "#text": "\n          " },
                      { "action": [], ":@": { "type": "27", "group": "1", "name": "Do Nothing" } },
                    ),
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作" },
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
      ":@": { "id": "1844", "name": "斋月-城内收集", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        { "events": [] },
        { "#text": "\n    " },
        { "conditions": [] },
        { "#text": "\n    " },
        { "actions": [] },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2560", "name": "新玩家活动_第一天_大本", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [
                {
                  "#text":
                    "9400;9401;9402;9403;9404;9405;9406;9407;9408;9409;9410;9411;9412;9413;9414;9415;9416;9417;9418;9419;9420;9421;9422;9423;9424;9425;9426;9427;9428;9429",
                },
              ],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180002_process;<;$newbie_180002_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180002_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180002_process;$newbie_180002_reward;$newbie_180002_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2561", "name": "新玩家活动_第一天_消灭野怪", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [],
              ":@": { "type": "89", "name": "客户端完成登录所有加载事件", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "53;2" }],
              ":@": { "type": "51", "name": "客户端请求变量", "group": "2" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                {
                  "#text":
                    "$newbie_180000_process;$newbie_180000_reward;$newbie_180001_process;$newbie_180001_reward;$newbie_180002_process;$newbie_180002_reward;$newbie_180003_process;$newbie_180003_reward;$newbie_180004_process;$newbie_180004_reward;$newbie_180005_process;$newbie_180005_reward;$newbie_180006_process;$newbie_180006_reward;$newbie_180007_process;$newbie_180007_reward;$newbie_180008_process;$newbie_180008_reward;$newbie_180009_process;$newbie_180009_reward;$newbie_180010_process;$newbie_180010_reward;$newbie_180011_process;$newbie_180012_process;$newbie_180012_reward;$newbie_180013_process;$newbie_180013_reward;$newbie_180014_process;$newbie_180014_reward;$newbie_180015_process;$newbie_180015_reward;$newbie_180016_process;$newbie_180016_reward;$newbie_180017_process;$newbie_180017_reward;$newbie_180018_process;$newbie_180018_reward;$newbie_180019_process;$newbie_180019_reward;$newbie_180020_process;$newbie_180020_reward;$newbie_180021_process;$newbie_180021_reward;$newbie_180022_process;$newbie_180022_reward;$newbie_180023_process;$newbie_180023_reward;$newbie_180024_process;$newbie_180024_reward;$newbie_180025_process;$newbie_180025_reward;$newbie_180026_process;$newbie_180026_reward;$newbie_180027_process;$newbie_180027_reward;$newbie_180028_process;$newbie_180028_reward;$newbie_180029_process;$newbie_180029_reward;$newbie_180030_process;$newbie_180030_reward;$newbie_180031_process;$newbie_180031_reward;$newbie_180032_process;$newbie_180032_reward;$newbie_register_starttime;$newbie_180000_max;$newbie_180001_max;$newbie_180002_max;$newbie_180003_max;$newbie_180004_max;$newbie_180005_max;$newbie_180006_max;$newbie_180007_max;$newbie_180008_max;$newbie_180010_max;$newbie_180009_max;$newbie_180011_max;$newbie_180011_reward;$newbie_180012_max;$newbie_180013_max;$newbie_180014_max;$newbie_180015_max;$newbie_180017_max;$newbie_180016_max;$newbie_180018_max;$newbie_180019_max;$newbie_180020_max;$newbie_180021_max;$newbie_180022_max;$newbie_180023_max;$newbie_180024_max;$newbie_180025_max;$newbie_180026_max;$newbie_180027_max;$newbie_180029_max;$newbie_180028_max;$newbie_180030_max;$newbie_180031_max;$newbie_180032_max;1;info",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2564", "name": "新玩家活动_推送变量", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "12", "name": "点击造兵", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180003_process;<;$newbie_180003_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180003_process;+;$key_soilder_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180003_process;$newbie_180003_max;$newbie_180003_reward;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2572", "name": "新玩家活动_第一天_造兵", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400;6" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型、等级)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_register_starttime" }],
              ":@": { "type": "62", "name": "变量赋值为当前时间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2573", "name": "新玩家活动_开启活动", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54" }],
              ":@": { "type": "51", "name": "客户端请求事件（无参）", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;6" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_got_finial_reward;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180000" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180000_process;>=;$newbie_180000_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180000_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180000_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250581" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180000_reward;$newbie_180000_process;$newbie_180000_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2576", "name": "新玩家活动_领奖", "state": "-1", "openType": "2" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180001_process;<;$newbie_180001_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180001_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180001_process;$newbie_180001_reward;$newbie_180001_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2577", "name": "新玩家活动_第一天_大本升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "74", "name": "领取时间礼包", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180004_process;<;$newbie_180004_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180004_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180004_process;$newbie_180004_reward;$newbie_180004_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2579", "name": "新玩家活动_第一天_领时间礼包", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "76", "name": "加入联盟", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180005_process;<;$newbie_180005_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180005_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180005_process;$newbie_180005_reward;$newbie_180005_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2580", "name": "新玩家活动_第一天_加入联盟", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "$newbie_180006_process;<;$newbie_180006_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180006_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180006_process;$newbie_180006_reward;$newbie_180006_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2581", "name": "新玩家活动_第二天_登录", "state": "1", "openType": "2" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180007_process;<;$newbie_180007_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180007_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180007_process;$newbie_180007_reward;$newbie_180007_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2582", "name": "新玩家活动_第二天_大本升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "11", "name": "许愿", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180008_process;<;$newbie_180008_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180008_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180008_process;$newbie_180008_reward;$newbie_180008_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2583", "name": "新玩家活动_第二天_许愿", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "0;1" }],
              ":@": { "type": "55", "name": "世界采集", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "3;1" }],
              ":@": { "type": "55", "name": "世界采集", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "2;1" }],
              ":@": { "type": "55", "name": "世界采集", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1;1" }],
              ":@": { "type": "55", "name": "世界采集", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180009_process;<;$newbie_180009_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180009_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180009_process;$newbie_180009_reward;$newbie_180009_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2584", "name": "新玩家活动_第二天_采集资源", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "88", "name": "添加好友成功", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180010_process;<;$newbie_180010_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180010_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180010_process;$newbie_180010_reward;$newbie_180010_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2585", "name": "新玩家活动_第二天_拥有好友", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "17", "name": "点击升级科技", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180011_process;<;$newbie_180011_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180011_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180011_process;$newbie_180011_max;$newbie_180011_reward;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2586", "name": "新玩家活动_第二天_科技研究", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "77", "name": "联盟科技捐献", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;0" }],
              ":@": { "type": "86", "name": "加入联盟时间(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180012_process;<;$newbie_180012_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180012_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180012_process;$newbie_180012_reward;$newbie_180012_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2587", "name": "新玩家活动_第二天_联盟捐献", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "$newbie_180013_process;<;$newbie_180013_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180013_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180013_process;$newbie_180013_reward;$newbie_180013_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2588", "name": "新玩家活动_第三天_登录", "state": "1", "openType": "2" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180014_process;<;$newbie_180014_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180014_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180014_process;$newbie_180014_reward;$newbie_180014_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2589", "name": "新玩家活动_第三天_大本升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "78", "name": "领取锻造装备", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180015_process;<;$newbie_180015_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180015_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180015_process;$newbie_180015_reward;$newbie_180015_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2590", "name": "新玩家活动_第三天_锻造装备", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "19", "name": "点击恢复伤兵", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180016_process;<;$newbie_180016_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180016_process;+;$key_soilder_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180016_process;$newbie_180016_reward;$newbie_180016_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2591", "name": "新玩家活动_第三天_治疗伤兵", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "86", "name": "挖掘联盟宝藏", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;0" }],
              ":@": { "type": "87", "name": "联盟创建时间(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">;23" }],
              ":@": { "type": "86", "name": "加入联盟时间(小时)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180017_process;<;$newbie_180017_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180017_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180017_process;$newbie_180017_reward;$newbie_180017_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2592", "name": "新玩家活动_第三天_联盟宝藏", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "false" }],
              ":@": { "type": "63", "name": "探索遗迹（无需类型）", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180018_process;<;$newbie_180018_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180018_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180018_process;$newbie_180018_reward;$newbie_180018_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2593", "name": "新玩家活动_第三天_探索遗迹", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "79", "name": "充值金币", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180019_process;<;$newbie_180019_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180019_process;+;$key_buy_gold_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180019_process;$newbie_180019_reward;$newbie_180019_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2594", "name": "新玩家活动_第三天_累积充值", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "$newbie_180020_process;<;$newbie_180020_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180020_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180020_process;$newbie_180020_reward;$newbie_180020_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2595", "name": "新玩家活动_第四天_登录", "state": "1", "openType": "2" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180021_process;<;$newbie_180021_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180021_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180021_process;$newbie_180021_reward;$newbie_180021_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2596", "name": "新玩家活动_第四天_大本升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [],
              ":@": { "type": "80", "name": "从联盟商店购买到玩家背包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180022_process;<;$newbie_180022_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180022_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180022_process;$newbie_180022_reward;$newbie_180022_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "2597",
        "name": "新玩家活动_第四天_联盟商店购买",
        "state": "1",
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
            { "event": [], ":@": { "type": "81", "name": "龙升级", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$key_pet_dragon_level;>=;10" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180023_process;<;$newbie_180023_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180023_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180023_process;$newbie_180023_reward;$newbie_180023_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2598", "name": "新玩家活动_第四天_龙升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "21", "name": "收获资源", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180024_process;<;$newbie_180024_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180024_process;+;$resource_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180024_process;$newbie_180024_reward;$newbie_180024_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2599", "name": "新玩家活动_第四天_收集资源", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "82", "name": "龙游历", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180025_process;<;$newbie_180025_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180025_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180025_process;$newbie_180025_reward;$newbie_180025_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2600", "name": "新玩家活动_第四天_龙游历", "state": "1", "openType": "2" },
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
              "condition": [{ "#text": "$newbie_180026_process;<;$newbie_180026_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180026_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180026_process;$newbie_180026_reward;$newbie_180026_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2601", "name": "新玩家活动_第五天_登录", "state": "1", "openType": "2" },
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
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180027_process;<;$newbie_180027_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180027_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180027_process;$newbie_180027_reward;$newbie_180027_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2602", "name": "新玩家活动_第五天_大本升级", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "83", "name": "联盟帮助", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180028_process;<;$newbie_180028_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180028_process;+;$key_alliance_help_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180028_process;$newbie_180028_reward;$newbie_180028_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2603", "name": "新玩家活动_第五天_帮助盟友", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "84", "name": "购买旅行商人", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180029_process;<;$newbie_180029_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180029_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180029_process;$newbie_180029_reward;$newbie_180029_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2604", "name": "新玩家活动_第五天_旅行商人", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "85", "name": "使用加速道具", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180030_process;<;$newbie_180030_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180030_process;+;$key_itemNum" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180030_process;$newbie_180030_reward;$newbie_180030_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2605", "name": "新玩家活动_第五天_使用加速", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "87", "name": "龙塔试炼", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180031_process;<;$newbie_180031_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180031_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180031_process;$newbie_180031_reward;$newbie_180031_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2606", "name": "新玩家活动_第五天_龙塔试炼", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "79", "name": "充值金币", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_180032_process;<;$newbie_180032_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180032_process;+;$key_buy_gold_num" }],
              ":@": { "type": "9", "name": "修改变量为其他变量的值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180032_process;$newbie_180032_reward;$newbie_180032_max;1;update",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2607", "name": "新玩家活动_第五天_累积充值", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [],
              ":@": { "type": "89", "name": "客户端完成登录所有加载事件", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "53;2" }],
              ":@": { "type": "51", "name": "客户端请求变量", "group": "2" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_got_finial_reward;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "$newbie_180000_process;$newbie_180000_reward;$newbie_180001_process;$newbie_180001_reward;$newbie_180002_process;$newbie_180002_reward;$newbie_180003_process;$newbie_180003_reward;$newbie_180004_process;$newbie_180004_reward;$newbie_180005_process;$newbie_180005_reward;$newbie_180006_process;$newbie_180006_reward;$newbie_180007_process;$newbie_180007_reward;$newbie_180008_process;$newbie_180008_reward;$newbie_180009_process;$newbie_180009_reward;$newbie_180010_process;$newbie_180010_reward;$newbie_180011_process;$newbie_180012_process;$newbie_180012_reward;$newbie_180013_process;$newbie_180013_reward;$newbie_180014_process;$newbie_180014_reward;$newbie_180015_process;$newbie_180015_reward;$newbie_180016_process;$newbie_180016_reward;$newbie_180017_process;$newbie_180017_reward;$newbie_180018_process;$newbie_180018_reward;$newbie_180019_process;$newbie_180019_reward;$newbie_180020_process;$newbie_180020_reward;$newbie_180021_process;$newbie_180021_reward;$newbie_180022_process;$newbie_180022_reward;$newbie_180023_process;$newbie_180023_reward;$newbie_180024_process;$newbie_180024_reward;$newbie_180025_process;$newbie_180025_reward;$newbie_180026_process;$newbie_180026_reward;$newbie_180027_process;$newbie_180027_reward;$newbie_180028_process;$newbie_180028_reward;$newbie_180029_process;$newbie_180029_reward;$newbie_180030_process;$newbie_180030_reward;$newbie_180031_process;$newbie_180031_reward;$newbie_180032_process;$newbie_180032_reward;$newbie_register_starttime;$newbie_180000_max;$newbie_180001_max;$newbie_180002_max;$newbie_180003_max;$newbie_180004_max;$newbie_180005_max;$newbie_180006_max;$newbie_180007_max;$newbie_180008_max;$newbie_180010_max;$newbie_180009_max;$newbie_180011_max;$newbie_180011_reward;$newbie_180012_max;$newbie_180013_max;$newbie_180014_max;$newbie_180015_max;$newbie_180017_max;$newbie_180016_max;$newbie_180018_max;$newbie_180019_max;$newbie_180020_max;$newbie_180021_max;$newbie_180022_max;$newbie_180023_max;$newbie_180024_max;$newbie_180025_max;$newbie_180026_max;$newbie_180027_max;$newbie_180029_max;$newbie_180028_max;$newbie_180030_max;$newbie_180031_max;$newbie_180032_max;1;info",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2608", "name": "新玩家活动_推送", "state": "-1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180000" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180000" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180000_process;>=;$newbie_180000_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180000_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180000_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250581" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180000_reward;$newbie_180000_process;$newbie_180000_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2628", "name": "新玩家活动_第一天_登录领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180001" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180001" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180001_process;>=;$newbie_180001_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180001_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180001_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250582" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180001_process;$newbie_180001_reward;$newbie_180001_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2629",
        "name": "新玩家活动_第一天_大本8级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180002" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180002" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180002_process;>=;$newbie_180002_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180002_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180002_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250583" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180002_process;$newbie_180002_reward;$newbie_180002_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2630",
        "name": "新玩家活动_第一天_击杀野怪5次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180003" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180003" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180003_process;>=;$newbie_180003_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180003_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180003_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250584" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180003_process;$newbie_180003_reward;$newbie_180003_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2631",
        "name": "新玩家活动_第一天_训练100士兵领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180004" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180004" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180004_process;>=;$newbie_180004_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180004_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180004_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250585" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180004_process;$newbie_180004_reward;$newbie_180004_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2632",
        "name": "新玩家活动_第一天_领取时间礼包3次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180005" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180005" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180005_process;>=;$newbie_180005_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180005_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180005_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250586" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180005_process;$newbie_180005_reward;$newbie_180005_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2633",
        "name": "新玩家活动_第一天_加入一个联盟领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180006" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180006" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180006_process;>=;$newbie_180006_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180006_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180006_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250587" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180006_process;$newbie_180006_reward;$newbie_180006_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2634", "name": "新玩家活动_第二天_登录领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180007" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180007" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180007_process;>=;$newbie_180007_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180007_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180007_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250588" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180007_process;$newbie_180007_reward;$newbie_180007_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2635",
        "name": "新玩家活动_第二天_大本等级10级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180008" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180008" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180008_process;>=;$newbie_180008_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180008_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180008_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250589" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180008_process;$newbie_180008_reward;$newbie_180008_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2636",
        "name": "新玩家活动_第二天_许愿5次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180009" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180009" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180009_process;>=;$newbie_180009_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180009_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180009_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250590" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180009_process;$newbie_180009_reward;$newbie_180009_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2637",
        "name": "新玩家活动_第二天_采集资源3次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180010" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180010" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180010_process;>=;$newbie_180010_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180010_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180010_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250591" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180010_process;$newbie_180010_reward;$newbie_180010_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2638",
        "name": "新玩家活动_第二天_拥有5名好友领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180011" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180011" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180011_process;>=;$newbie_180011_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180011_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180011_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250592" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180011_process;$newbie_180011_max;$newbie_180011_reward;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2639",
        "name": "新玩家活动_第二天_科技研究2次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180012" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180012" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180012_process;>=;$newbie_180012_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180012_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180012_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250593" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180012_process;$newbie_180012_reward;$newbie_180012_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2640",
        "name": "新玩家活动_第二天_联盟捐献10次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180013" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180013" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180013_process;>=;$newbie_180013_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180013_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180013_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250594" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180013_process;$newbie_180013_reward;$newbie_180013_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2641", "name": "新玩家活动_第三天_登录领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180014" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180014" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180014_process;>=;$newbie_180014_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180014_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180014_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250595" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180014_process;$newbie_180014_reward;$newbie_180014_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2642",
        "name": "新玩家活动_第三天_大本等级12级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180015" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180015" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180015_process;>=;$newbie_180015_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180015_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180015_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250596" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180015_process;$newbie_180015_reward;$newbie_180015_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2643",
        "name": "新玩家活动_第三天_锻造装备领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180016" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180016" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180016_process;>=;$newbie_180016_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180016_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180016_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250597" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180016_process;$newbie_180016_reward;$newbie_180016_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2644",
        "name": "新玩家活动_第三天_治疗伤兵领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180017" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180017" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180017_process;>=;$newbie_180017_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180017_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180017_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250598" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180017_process;$newbie_180017_reward;$newbie_180017_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2645",
        "name": "新玩家活动_第三天_开联盟宝藏领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180018" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180018" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180018_process;>=;$newbie_180018_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180018_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180018_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250599" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180018_process;$newbie_180018_reward;$newbie_180018_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2646",
        "name": "新玩家活动_第三天_探索遗迹领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180019" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180019" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180019_process;>=;$newbie_180019_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180019_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180019_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250600" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180019_process;$newbie_180019_reward;$newbie_180019_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2647",
        "name": "新玩家活动_第三天_累积充值3000金币领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180020" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180020" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180020_process;>=;$newbie_180020_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180020_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180020_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250601" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180020_process;$newbie_180020_reward;$newbie_180020_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2648", "name": "新玩家活动_第四天_登录领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180021" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180021" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180021_process;>=;$newbie_180021_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180021_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180021_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250602" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180021_process;$newbie_180021_reward;$newbie_180021_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2649",
        "name": "新玩家活动_第四天_大本等级14级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180022" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180022" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180022_process;>=;$newbie_180022_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180022_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180022_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250603" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180022_process;$newbie_180022_reward;$newbie_180022_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2650",
        "name": "新玩家活动_第四天_联盟商店购买领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180023" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180023" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180023_process;>=;$newbie_180023_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180023_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180023_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250604" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180023_process;$newbie_180023_reward;$newbie_180023_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2651",
        "name": "新玩家活动_第四天_龙等级10级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180024" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180024" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180024_process;>=;$newbie_180024_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180024_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180024_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250605" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180024_process;$newbie_180024_reward;$newbie_180024_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2652",
        "name": "新玩家活动_第四天_收集资源领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180025" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180025" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180025_process;>=;$newbie_180025_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180025_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180025_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250606" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180025_process;$newbie_180025_reward;$newbie_180025_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2653", "name": "新玩家活动_第四天_龙游历领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180026" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180026" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180026_process;>=;$newbie_180026_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180026_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180026_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250607" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180026_process;$newbie_180026_reward;$newbie_180026_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": { "id": "2654", "name": "新玩家活动_第五天_登录领奖", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54;180027" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180027" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180027_process;>=;$newbie_180027_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180027_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180027_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250608" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180027_process;$newbie_180027_reward;$newbie_180027_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2655",
        "name": "新玩家活动_第五天_大本等级15级领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180028" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180028" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180028_process;>=;$newbie_180028_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180028_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180028_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250609" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180028_process;$newbie_180028_reward;$newbie_180028_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2656",
        "name": "新玩家活动_第五天_帮助盟友10次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180029" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180029" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180029_process;>=;$newbie_180029_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180029_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180029_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250610" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180029_process;$newbie_180029_reward;$newbie_180029_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2657",
        "name": "新玩家活动_第五天_旅行商人购买领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180030" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180030" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180030_process;>=;$newbie_180030_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180030_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180030_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250611" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180030_process;$newbie_180030_reward;$newbie_180030_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2658",
        "name": "新玩家活动_第五天_使用加速道具5次领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180031" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180031" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180031_process;>=;$newbie_180031_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180031_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180031_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250612" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180031_process;$newbie_180031_reward;$newbie_180031_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2659",
        "name": "新玩家活动_第五天_参加龙塔试炼领奖",
        "state": "1",
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
              "event": [{ "#text": "54;180032" }],
              ":@": { "type": "51", "name": "客户端请求事件（含参）", "group": "3" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$key_client_event_var1;==;180032" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180032_process;>=;$newbie_180032_max" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                    },
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": "$newbie_180032_reward;==;0" }],
                      ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "51", "group": "1", "name": "与 - 3" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "$newbie_180032_reward;+;1" }],
                      ":@": { "type": "9", "group": "1", "name": "修改变量为具体值" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "250613" }],
                      ":@": { "type": "48", "group": "1", "name": "触发reward奖励" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        {
                          "#text":
                            "$newbie_180032_process;$newbie_180032_reward;$newbie_180032_max;1;claim",
                        },
                      ],
                      ":@": { "type": "29", "group": "1", "name": "给客户端推送一组变量" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "21", "group": "1", "name": "执行多个操作 3" },
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
      ":@": {
        "id": "2660",
        "name": "新玩家活动_第五天_累积充值6000金币领奖",
        "state": "1",
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
              "condition": [{ "#text": ">=;6" }],
              ":@": { "type": "13", "name": "主城等级(值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_got_finial_reward;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$newbie_register_starttime;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_register_starttime;7;1" }],
                  ":@": {
                    "type": "110",
                    "group": "1",
                    "name": "变量最后一次刷新时间到现在是否在区间内",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "53", "name": "非", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_got_finial_reward;1" }],
              ":@": { "type": "24", "name": "变量赋值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180000_process;>=;$newbie_180000_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180001_process;>=;$newbie_180001_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180002_process;>=;$newbie_180002_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180003_process;>=;$newbie_180003_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180004_process;>=;$newbie_180004_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180005_process;>=;$newbie_180005_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180006_process;>=;$newbie_180006_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180007_process;>=;$newbie_180007_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180008_process;>=;$newbie_180008_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180009_process;>=;$newbie_180009_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180010_process;>=;$newbie_180010_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180011_process;>=;$newbie_180011_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180012_process;>=;$newbie_180012_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180013_process;>=;$newbie_180013_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180014_process;>=;$newbie_180014_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180015_process;>=;$newbie_180015_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180016_process;>=;$newbie_180016_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180017_process;>=;$newbie_180017_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180018_process;>=;$newbie_180018_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180019_process;>=;$newbie_180019_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180020_process;>=;$newbie_180020_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180021_process;>=;$newbie_180021_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180022_process;>=;$newbie_180022_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180023_process;>=;$newbie_180023_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180024_process;>=;$newbie_180024_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180025_process;>=;$newbie_180025_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180026_process;>=;$newbie_180026_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180027_process;>=;$newbie_180027_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180028_process;>=;$newbie_180028_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180029_process;>=;$newbie_180029_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180030_process;>=;$newbie_180030_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180031_process;>=;$newbie_180031_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$newbie_180032_process;>=;$newbie_180032_max" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 变量)" },
                },
                { "#text": "\n        " },
                {
                  "action": [
                    { "#text": "\n          " },
                    {
                      "condition": [{ "#text": ">;1" }],
                      ":@": { "type": "45", "group": "1", "name": "总付费金币" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [
                        { "#text": "3" },
                        { "#text": "\n            " },
                        {
                          "action": [{ "#text": "12352" }],
                          ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                        },
                        { "#text": "\n          " },
                      ],
                      ":@": { "type": "14", "group": "1", "name": "重复执行" },
                    },
                    { "#text": "\n          " },
                    {
                      "action": [{ "#text": "12352" }],
                      ":@": { "type": "4", "group": "1", "name": "发送邮件" },
                    },
                    { "#text": "\n        " },
                  ],
                  ":@": { "type": "13", "group": "1", "name": "If Else" },
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
      ":@": { "id": "2663", "name": "新玩家活动_活动结束", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "54" }],
              ":@": { "type": "51", "name": "客户端请求事件（无参）", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$key_client_event_var1;==;180000" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "2132131" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "2672",
        "name": "新玩家活动_第一天_登录领奖 cp",
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
              "condition": [{ "#text": "$newbie_180000_process;<;$newbie_180000_max" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 变量)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "ALL" }],
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
              "action": [{ "#text": "$newbie_180000_process;+;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text": "$newbie_180000_process;$newbie_180000_max;$newbie_180000_reward;1;info",
                },
              ],
              ":@": { "type": "29", "name": "给客户端推送一组变量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2559", "name": "新玩家活动_第一天_登录", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "288;300" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-11 00:04:30;2024-01-16 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151751;NOTICE_TYPE_INT;30" }],
              ":@": { "type": "45", "name": "世界滚屏公告(1个参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151756;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "521", "name": "红包-全服公告（秒）", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211319" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-01-23 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$use_item_server;<;350" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item_server;>=;350" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "52",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;350;false;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "538", "name": "世界boss-创建350", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-01-23 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;350;true;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "539", "name": "世界boss-进度条350", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [],
              ":@": { "type": "53", "name": "击杀特殊世界NPCBOSS怪物", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;50" }],
              ":@": {
                "type": "58",
                "name": "添加作用于整个服的作用号(持续到当天24点)",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "540", "name": "世界boss-死亡", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900680;900681;900628;900683;900684;900685" }],
              ":@": { "type": "4", "name": "击杀怪物检查", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "${trigger_spring2017_monster}${monster_id}" }],
              ":@": { "type": "42", "name": "打印一个行为Log", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "551", "name": "击杀怪物打点", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "3;28800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-29 00:00:00;2024-01-29 23:59:58" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151752" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;100;10;11111;1111" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151758;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "553", "name": "红包-系统发29", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "3;28800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-30 00:00:00;2024-01-30 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151752" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;6000;50;180;151765" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151758;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "554", "name": "红包-系统发30", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "720;1800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-16 00:00:00;2024-01-20 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151752" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;1500;50;180;151765" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151758;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "557", "name": "红包-107测试", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "720;1800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-15 23:59:00;2024-01-20 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151750;NOTICE_TYPE_INT;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(1个参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151756;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "558", "name": "红包-107测试-公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-16 00:00:00;2024-01-30 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;>=;100" }],
              ":@": { "type": "81", "name": "验证领取红包的大小", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(2个参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "559", "name": "红包-107测试-领取公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "8;10800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-18 03:50:00;2024-01-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
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
              "action": [{ "#text": "151750;NOTICE_TYPE_INT;10" }],
              ":@": { "type": "45", "name": "世界滚屏公告(1个参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151756;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "560", "name": "红包-线上1服测试-公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "8;10800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-18 04:00:00;2024-01-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
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
              "action": [{ "#text": "151752" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;500;10;180;151765" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151758;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "561", "name": "红包-线上1服测试-发放", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-18 04:00:00;2024-01-19 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;>=;50" }],
              ":@": { "type": "81", "name": "验证领取红包的大小", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1" }],
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
              "action": [{ "#text": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(2个参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "562", "name": "红包-线上1服测试-领取公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211319" }],
              ":@": { "type": "54", "name": "使用道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-24 00:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$use_item_server;<;500" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;+" }],
              ":@": { "type": "57", "name": "修改变量为使用物品的数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$use_item_server;>=;500" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [],
                  ":@": {
                    "type": "52",
                    "group": "1",
                    "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)",
                  },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;500;false;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "563", "name": "世界boss-创建500", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "49" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-24 00:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$use_item_server;500;true;2" }],
              ":@": {
                "type": "40",
                "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
                "group": "1",
              },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "564", "name": "世界boss-进度条500", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "3;28800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-28 00:00:00;2024-01-28 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151752" }],
              ":@": { "type": "45", "name": "世界滚屏公告(无参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "0;0;2000;50;180;151765" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151758;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "487", "name": "红包-系统发28", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "52", "name": "红包领取触发", "group": "1" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-28 00:00:00;2024-01-30 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "true;>=;100" }],
              ":@": { "type": "81", "name": "验证领取红包的大小", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(2个参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "488", "name": "红包-领取公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "9;28800" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-27 23:59:00;2024-01-30 23:59:59" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151750;NOTICE_TYPE_INT;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(1个参)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "ACTIVITY;151756;RED_SYSTEM_PUSH" }],
              ":@": { "type": "55", "name": "给全服发送离线推送", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "489", "name": "红包-全服公告（分）", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211384" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "event": [{ "#text": "211385" }],
              ":@": { "type": "40", "name": "获得道具(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "151748;NOTICE_TYPE_USER;0;NOTICE_TYPE_ITEM;1" }],
              ":@": { "type": "45", "name": "世界滚屏公告(2个参)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "490", "name": "获得道具公告", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "44" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-09-09 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211279;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211281;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211280;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211282;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "211279,1|211280,1|211281,1|211282,1;2;248772" }],
              ":@": { "type": "46", "name": "物品兑换", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11923" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "492", "name": "年画-兑换皮肤", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "44" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-09-09 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211283;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211284;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211285;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211286;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "211283,1|211284,1|211285,1|211286,1;2;248773" }],
              ":@": { "type": "46", "name": "物品兑换", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "11924" }],
              ":@": { "type": "4", "name": "发送邮件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "493", "name": "年画-兑换名牌", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "42" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$gacha_refresh;<;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "6900101,6900102,6900103|2000,500,100;6" }],
                  ":@": { "type": "50", "group": "1", "name": "砸金蛋刷新" },
                },
                { "#text": "\n      " },
              ],
              ":@": { "type": "41", "name": "if (", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$gacha_day;$gacha_day;6;50" }],
              ":@": { "type": "51", "name": "砸金蛋盘面发送客户端", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "$gacha_refresh;<;1" }],
                  ":@": { "type": "7", "group": "1", "name": "数值的比较(变量 vs 数值)" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "$gacha_refresh;1" }],
                  ":@": { "type": "24", "group": "1", "name": "给整数变量赋值" },
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
      ":@": { "id": "494", "name": "砸蛋-客户端请求", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "41" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$gacha_day;>;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "6900101,6900102,6900103|2000,500,100;6" }],
              ":@": { "type": "50", "name": "砸金蛋刷新", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$gacha_day;-;1" }],
              ":@": { "type": "9", "name": "修改变量为具体值", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$gacha_day;$gacha_day;6;50" }],
              ":@": { "type": "51", "name": "砸金蛋盘面发送客户端", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "495", "name": "砸蛋-免费刷新", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "41" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$gacha_day;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": ">=;50;true" }],
              ":@": { "type": "83", "name": "验证金币", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "6900101,6900102,6900103|2000,500,100;6" }],
              ":@": { "type": "50", "name": "砸金蛋刷新", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$gacha_day;$gacha_day;6;50" }],
              ":@": { "type": "51", "name": "砸金蛋盘面发送客户端", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "496", "name": "砸蛋-金币刷新", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "43" }],
              ":@": { "type": "51", "name": "客户端请求事件", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "211276;1" }],
              ":@": { "type": "82", "name": "验证要消耗的物品ID和数量", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text":
                    "6;248707,248706,248705;6900101,6900102,6900103;211276,211276,211276;1,3,5",
                },
              ],
              ":@": { "type": "49", "name": "砸金蛋", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "$gacha_day;$gacha_day;6;50" }],
              ":@": { "type": "51", "name": "砸金蛋盘面发送客户端", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "497", "name": "砸蛋-砸", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "900685" }],
              ":@": { "type": "39", "name": "击杀怪物(指定ID)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-01-22 02:00:00;2024-02-07 02:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [
                {
                  "#text": "true;1000,1000,500,500,100;900680,900681,900682,900683,900684;60;2;100",
                },
              ],
              ":@": { "type": "54", "name": "在死亡怪物周围刷新怪物(随机出现)", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [
                { "#text": "\n        " },
                {
                  "condition": [{ "#text": "900684" }],
                  ":@": { "type": "84", "group": "1", "name": "验证创建的怪物是谁" },
                },
                { "#text": "\n        " },
                {
                  "action": [{ "#text": "151755;NOTICE_TYPE_USER;0;COMMON_TYPE_POS;1" }],
                  ":@": { "type": "45", "group": "1", "name": "世界滚屏公告(2个参)" },
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
      ":@": { "id": "499", "name": "拜访-机制", "state": "0", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "4" }],
              ":@": { "type": "70", "name": "累充达到档位", "group": "1" },
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
              "action": [{ "#text": "1;0;2000;10;1440;9440889;1;2000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2530", "name": "月中累充红包1", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "6" }],
              ":@": { "type": "70", "name": "累充达到档位", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-11-01 00:00:00;2024-12-02 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "$3_lc_rank_6;==;0" }],
              ":@": { "type": "7", "name": "数值的比较(变量 vs 数值)", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "1;0;6000;30;1440;9440889;1;6000" }],
              ":@": { "type": "47", "name": "系统发红包", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2558", "name": "月中累充红包2", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "1680;360" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "1-60" }],
              ":@": { "type": "32", "name": "服务器编号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "2024-12-01 00:00:00;2024-12-08 00:00:00" }],
              ":@": { "type": "9", "name": "时间区间", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_BUILD_RESOURCE_REDUCE;360;5" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_ATT_MONSTER_ADD_ATTACK;360;25" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_RESEARCH_COST_REDUCE;360;10" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2691", "name": "王国限时增益 1963 1964", "state": "1", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "168;1" }],
              ":@": { "type": "43", "name": "定时器", "group": "1" },
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
              "action": [{ "#text": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n      " },
            {
              "action": [{ "#text": "TRIGGER_CURE_COST_REDUCE;1200;120" }],
              ":@": { "type": "53", "name": "添加作用于整个服的作用号", "group": "1" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "2287", "name": "正式版  111111", "state": "-1", "openType": "2" },
    },
  ];
}
