-- Generated schema-only baseline. Original ROW_FORMAT=COMPACT becomes DYNAMIC, as in the legacy importer.
SET NAMES utf8mb4;
--> statement-breakpoint
CREATE TABLE `ability_page` (
  `uid` varchar(40) NOT NULL,
  `page` int(11) NOT NULL DEFAULT 0,
  `ability` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`page`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `accept_fb_record` (
  `uid` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `account_lock` (
  `uid` varchar(255) NOT NULL,
  `lastLoginIp` varchar(50) DEFAULT NULL,
  `lastDeviceId` varchar(255) DEFAULT NULL,
  `lockSwitch` tinyint(4) DEFAULT NULL,
  `locked` tinyint(4) DEFAULT NULL,
  `emailAddr` varchar(200) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `verifCode` varchar(4) DEFAULT NULL,
  `verifCodeTime` bigint(20) DEFAULT NULL,
  `todayTime` bigint(20) DEFAULT NULL,
  `passwordErrorNum` int(11) DEFAULT NULL,
  `passwordErrorTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_0` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_1` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_2` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_3` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_4` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_5` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_6` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_7` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_8` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2024_9` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_record_pack` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `type1` int(11) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `powerDelta` bigint(20) DEFAULT NULL,
  `deadDelta` int(11) NOT NULL DEFAULT 0,
  `armyDelta` int(11) NOT NULL DEFAULT 0,
  `item` varchar(40) DEFAULT NULL,
  `param` varchar(1024) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  KEY `uid` (`uid`,`type`,`type1`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activation` (
  `code` varchar(40) NOT NULL,
  `series` int(11) DEFAULT NULL,
  `user` varchar(40) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`code`) USING BTREE,
  KEY `index_user` (`user`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity` (
  `id` int(10) unsigned NOT NULL,
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `type` int(11) NOT NULL,
  `openTime` bigint(20) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `info1` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity_cost` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `total` bigint(20) DEFAULT NULL,
  `para1` bigint(20) DEFAULT NULL COMMENT 'gold_paid',
  `para2` bigint(20) DEFAULT NULL COMMENT 'gold_free',
  `lv` int(11) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `getLv` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity_cost_log` (
  `uid` varchar(40) NOT NULL,
  `userId` varchar(40) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `total` bigint(20) DEFAULT NULL,
  `lv` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity_group_buys` (
  `id` varchar(40) NOT NULL,
  `curRound` int(11) NOT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `roundInfo` text DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity_minstrel` (
  `uid` varchar(32) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `listen` int(11) NOT NULL,
  `listentime` bigint(20) DEFAULT NULL,
  `share` int(11) DEFAULT NULL,
  `sharetime` bigint(20) DEFAULT NULL,
  `reward` int(11) DEFAULT NULL,
  `rewardtime` bigint(20) DEFAULT NULL,
  `resettime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='吟游诗人';
--> statement-breakpoint
CREATE TABLE `activity_monster` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `id` int(11) NOT NULL,
  `flushTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`id`,`flushTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activity_new` (
  `type` varchar(11) NOT NULL,
  `activityInfo` varchar(2000) DEFAULT '',
  PRIMARY KEY (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ad_building_attachment` (
  `uuid` varchar(36) NOT NULL,
  `serverid` int(11) DEFAULT NULL,
  `skillid` int(11) DEFAULT NULL,
  `cdtime` bigint(20) DEFAULT NULL,
  `skillstate` int(11) DEFAULT NULL,
  `donateresource` varchar(300) DEFAULT NULL,
  UNIQUE KEY `uss_index` (`uuid`,`serverid`,`skillid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ad_mat` (
  `uid` varchar(40) NOT NULL,
  `matId` varchar(200) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_query` (`matId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ad_reward` (
  `uid` varchar(40) NOT NULL,
  `type` varchar(40) NOT NULL,
  `device` varchar(255) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `location` varchar(40) DEFAULT NULL,
  `dplink_type` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`type`,`dplink_type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `admin` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `passmd5` varchar(40) NOT NULL,
  `language` varchar(8) NOT NULL,
  `auth` text NOT NULL,
  `groupid` int(11) NOT NULL DEFAULT 0,
  `addtime` bigint(20) NOT NULL,
  `lastactive` bigint(20) NOT NULL,
  `roleIds` varchar(100) DEFAULT NULL,
  `default_module_id` int(11) DEFAULT -1,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `affairs` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `ownerId` varchar(40) NOT NULL,
  `affairId` varchar(20) NOT NULL,
  `contentsId` varchar(20) NOT NULL,
  `rewardTime` bigint(20) NOT NULL,
  `rewardNum` int(11) NOT NULL,
  `opt` int(11) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`,`rewardTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `affairs_value` (
  `uid` varchar(40) NOT NULL,
  `people` int(11) NOT NULL DEFAULT 0,
  `refreshTime` bigint(20) NOT NULL,
  `leagueTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance` (
  `uid` varchar(40) NOT NULL,
  `alliancename` varchar(40) DEFAULT NULL,
  `abbr` varchar(10) DEFAULT NULL,
  `abbrRename` int(11) DEFAULT 0,
  `intro` varchar(200) DEFAULT NULL,
  `announce` varchar(200) DEFAULT NULL,
  `icon` varchar(40) DEFAULT NULL,
  `language` varchar(40) DEFAULT NULL,
  `country` varchar(40) DEFAULT NULL,
  `curMember` int(11) DEFAULT 0,
  `maxMember` int(11) DEFAULT NULL,
  `recruit` int(11) DEFAULT NULL,
  `oldfightpower` int(11) DEFAULT NULL,
  `giftlevel` int(11) DEFAULT 0,
  `alliancepoint` bigint(20) DEFAULT NULL,
  `reicon` int(11) DEFAULT 0,
  `rankone` varchar(10) DEFAULT NULL,
  `ranktwo` varchar(10) DEFAULT NULL,
  `rankthree` varchar(10) DEFAULT NULL,
  `rankfour` varchar(10) DEFAULT NULL,
  `rankfive` varchar(10) DEFAULT NULL,
  `createtime` bigint(20) NOT NULL,
  `dau` int(11) DEFAULT 0,
  `rallyPoint` int(11) DEFAULT NULL,
  `ally` varchar(255) DEFAULT NULL,
  `enemy` varchar(255) DEFAULT NULL,
  `other` varchar(255) DEFAULT NULL,
  `powerRestriction` bigint(20) DEFAULT 0,
  `castleRestriction` int(11) DEFAULT 0,
  `camp` int(11) DEFAULT 0,
  `crossFightEnemy` varchar(255) DEFAULT NULL,
  `ckfThroneFightFlag` int(11) DEFAULT 0,
  `cdfIndex` int(11) DEFAULT NULL,
  `cdfVersion` int(11) DEFAULT NULL,
  `targetScience` varchar(255) DEFAULT NULL COMMENT '科技引导信息',
  `permission` varchar(255) DEFAULT NULL COMMENT '联盟成员权限',
  `wood` bigint(20) DEFAULT 0,
  `food` bigint(20) DEFAULT 0,
  `iron` bigint(20) DEFAULT 0,
  `stone` bigint(20) DEFAULT 0,
  `sandstone` bigint(20) DEFAULT 0,
  `diamond` bigint(20) DEFAULT 0,
  `marble` bigint(20) DEFAULT 0,
  `granite` bigint(20) DEFAULT 0,
  `limestone` bigint(20) DEFAULT 0,
  `donateItem` varchar(255) DEFAULT NULL,
  `bannerStyle` varchar(50) NOT NULL,
  `taskNum` int(11) DEFAULT 0,
  `taskLimit` varchar(255) DEFAULT NULL,
  `taskFlushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `name_idx` (`alliancename`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_apply` (
  `uid` varchar(40) NOT NULL,
  `userId` varchar(40) DEFAULT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `message` blob DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `applyTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`userId`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE,
  KEY `index_time` (`applyTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_battle_record` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `attAllianceId` varchar(40) NOT NULL DEFAULT '',
  `defAllianceId` varchar(40) NOT NULL DEFAULT '',
  `type` int(11) NOT NULL,
  `report` blob NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_battle_team` (
  `id` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `targetId` int(11) NOT NULL,
  `targetUid` varchar(40) DEFAULT NULL,
  `targetName` varchar(255) DEFAULT NULL,
  `targetPic` varchar(40) DEFAULT NULL,
  `targetAName` varchar(40) DEFAULT NULL,
  `targetAAbbr` varchar(40) DEFAULT NULL,
  `targetAIcon` varchar(40) DEFAULT NULL,
  `targetType` int(11) DEFAULT 0,
  `leaderUid` varchar(40) NOT NULL,
  `leaderName` varchar(40) NOT NULL,
  `leaderId` int(11) DEFAULT NULL,
  `allianceId` varchar(40) NOT NULL,
  `allianceName` varchar(40) DEFAULT NULL,
  `allianceAbbr` varchar(40) DEFAULT NULL,
  `allianceIcon` varchar(40) DEFAULT NULL,
  `maxSoldiers` int(11) NOT NULL,
  `waitTime` bigint(20) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `worldId` int(11) NOT NULL DEFAULT 0,
  `failBackItem` int(11) DEFAULT 0,
  `superTeam` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_blacklist` (
  `allianceId` varchar(40) NOT NULL COMMENT '联盟唯一编号',
  `black` varchar(500) DEFAULT NULL COMMENT '联盟黑名单',
  `white` varchar(500) DEFAULT NULL COMMENT '联盟白名单',
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_boss` (
  `uid` varchar(40) NOT NULL,
  `itemNum` int(11) DEFAULT 0,
  `bossLevel` varchar(255) DEFAULT NULL,
  `todayCount` int(11) DEFAULT 0,
  `lastChallengeTime` bigint(20) DEFAULT 0,
  `bossId` varchar(255) DEFAULT NULL,
  `maxHp` int(11) DEFAULT 0,
  `hp` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `power` int(11) DEFAULT 0,
  `rewards` varchar(255) DEFAULT NULL,
  `pointId` int(11) DEFAULT 0,
  `attackerNum` int(11) DEFAULT 0,
  `attackTimes` int(11) DEFAULT 0,
  `killUser` varchar(255) DEFAULT NULL,
  `lastHurt` int(11) DEFAULT 0,
  `userAttackInfo` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_boss_rank` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `bossId` varchar(40) DEFAULT NULL,
  `useTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_boss_record` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `bossId` varchar(40) DEFAULT NULL,
  `maxHp` int(11) DEFAULT 0,
  `hp` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `pointId` int(11) DEFAULT 0,
  `attackerNum` int(11) DEFAULT 0,
  `attackTimes` int(11) DEFAULT 0,
  `killUser` varchar(40) DEFAULT NULL,
  `lastHurt` int(11) DEFAULT 0,
  `userAttackInfo` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_build_cost_record` (
  `uid` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`time`,`userId`,`type`) USING BTREE,
  KEY `index_type` (`userId`,`time`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_comment` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `senderUid` varchar(40) DEFAULT NULL,
  `senderAllianceId` varchar(40) DEFAULT NULL,
  `message` blob DEFAULT NULL,
  `lang` varchar(10) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `abbr` varchar(10) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL,
  `username` varchar(40) DEFAULT NULL,
  `userpic` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_allianceId` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_comment_shield` (
  `uuid` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL,
  `abbr` varchar(10) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_allianceId` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_diplomacy` (
  `uid` varchar(255) NOT NULL,
  `ally` blob DEFAULT NULL,
  `enemy` blob DEFAULT NULL,
  `other` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_donate` (
  `uerid` varchar(45) NOT NULL,
  `scienceid` int(11) NOT NULL,
  `highres` varchar(45) DEFAULT NULL,
  `midres` varchar(45) DEFAULT NULL,
  `lowres` varchar(45) DEFAULT NULL,
  `highnum` int(11) DEFAULT 0,
  `midnum` int(11) DEFAULT 0,
  `lownum` int(11) DEFAULT 0,
  `higprogress` int(11) DEFAULT 0,
  `midprogress` int(11) DEFAULT 0,
  `lowprogress` int(11) DEFAULT 0,
  `highcontribute` int(11) DEFAULT 0,
  `midcontribute` int(11) DEFAULT 0,
  `lowcontribute` int(11) DEFAULT 0,
  `lastrefreshtime` bigint(20) DEFAULT 0,
  `highNotUse` int(11) DEFAULT 0,
  `midNotUse` int(11) DEFAULT 0,
  `midAvailable` int(11) DEFAULT 0,
  `highAvailable` int(11) DEFAULT 0,
  PRIMARY KEY (`uerid`,`scienceid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_dragon_battle` (
  `allianceId` varchar(40) NOT NULL,
  `joinMemberCnt` int(11) DEFAULT 0,
  `leftTeleportTimes` int(11) DEFAULT NULL,
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_dragonplayoff_award` (
  `version` int(11) NOT NULL,
  `allianceId` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `uid` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` int(11) NOT NULL,
  `state` int(11) NOT NULL,
  `addr` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`version`,`allianceId`,`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_fight_of_king` (
  `type` int(11) NOT NULL,
  `id` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `serverId` int(11) NOT NULL,
  `occupyTime` bigint(20) NOT NULL,
  PRIMARY KEY (`type`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_gift` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `allianceid` varchar(40) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `typeId` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  `expiretime` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_group_buys` (
  `id` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `round` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  `info` varchar(1000) DEFAULT NULL,
  `reward` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`uid`,`round`) USING BTREE,
  KEY `index_allianceId` (`allianceId`) USING BTREE,
  KEY `index_time` (`buyTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_help` (
  `helpId` varchar(255) NOT NULL DEFAULT '',
  `allianceId` varchar(255) NOT NULL,
  `senderId` varchar(255) NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `isvalid` int(11) DEFAULT 1,
  `maxcount` int(11) DEFAULT 0,
  `nowcount` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `reduceSec` int(11) DEFAULT NULL,
  `itemId` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `helpers` blob DEFAULT NULL,
  `star` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT 0,
  PRIMARY KEY (`helpId`) USING BTREE,
  KEY `allianceId_index` (`allianceId`) USING BTREE,
  KEY `index_alliance_help` (`content`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_helper` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `helpId` varchar(255) DEFAULT NULL,
  `senderId` varchar(255) DEFAULT NULL,
  `recvId` varchar(255) DEFAULT NULL,
  `stats` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_alliance_helper` (`helpId`,`recvId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_invite_move` (
  `inviter` varchar(255) NOT NULL,
  `invitee` varchar(255) NOT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`inviter`,`invitee`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_member` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `point` int(11) DEFAULT 0,
  `accPoint` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT 0,
  `donateTime` bigint(20) DEFAULT NULL,
  `todaydonate` int(11) DEFAULT 0,
  `todayprogress` int(11) DEFAULT 0,
  `jointime` bigint(20) DEFAULT 0,
  `wood` int(11) DEFAULT 0,
  `stone` int(11) DEFAULT 0,
  `iron` int(11) DEFAULT 0,
  `food` int(11) DEFAULT 0,
  `silver` int(11) DEFAULT 0,
  `gold` int(11) DEFAULT 0,
  `donateCDTime` bigint(20) DEFAULT 0,
  `donateAvailable` int(11) DEFAULT 1,
  `yesterdayLogin` int(11) DEFAULT 0,
  `fight` int(11) DEFAULT 0,
  `playoffFight` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_allianceId` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_member_bak` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `point` int(11) DEFAULT 0,
  `accPoint` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT 0,
  `donateTime` bigint(20) DEFAULT NULL,
  `todaydonate` int(11) DEFAULT 0,
  `todayprogress` int(11) DEFAULT 0,
  `jointime` bigint(20) DEFAULT 0,
  `wood` int(11) DEFAULT 0,
  `stone` int(11) DEFAULT 0,
  `iron` int(11) DEFAULT 0,
  `food` int(11) DEFAULT 0,
  `silver` int(11) DEFAULT 0,
  `gold` int(11) DEFAULT 0,
  `donateCDTime` bigint(20) DEFAULT 0,
  `donateAvailable` int(11) DEFAULT 1,
  `yesterdayLogin` int(11) DEFAULT 0,
  `fight` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_allianceId` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_member_dragon_right` (
  `uid` varchar(50) NOT NULL,
  `allianceId` varchar(50) NOT NULL,
  `canFight` tinyint(1) DEFAULT NULL,
  `leaveTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_mission` (
  `uuid` varchar(255) NOT NULL,
  `missionId` varchar(50) NOT NULL,
  `mType` int(11) DEFAULT NULL,
  `triggerType` int(11) DEFAULT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `conditionValue` varchar(100) DEFAULT NULL,
  `para` varchar(100) DEFAULT NULL,
  `rewardFlag` varchar(100) DEFAULT NULL,
  `rewardId` varchar(100) DEFAULT NULL,
  `currentValue` bigint(20) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `aid_idx` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_mission_record` (
  `uid` varchar(255) NOT NULL,
  `missionUUID` varchar(255) NOT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `mType` int(11) DEFAULT NULL,
  `rewardFlag` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uid`,`missionUUID`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `mid_idx` (`missionUUID`) USING BTREE,
  KEY `allianceId` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_new_resource_log` (
  `uuid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` varchar(40) NOT NULL,
  `sandstone` bigint(20) DEFAULT 0,
  `diamondstone` bigint(20) DEFAULT 0,
  `marble` bigint(20) DEFAULT 0,
  `granite` bigint(20) DEFAULT 0,
  `limestone` bigint(20) DEFAULT 0,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1887 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_offical` (
  `allianceId` varchar(40) NOT NULL,
  `officalOneUid` varchar(40) NOT NULL DEFAULT '',
  `officalTwoUid` varchar(40) NOT NULL DEFAULT '',
  `officalThreeUid` varchar(40) NOT NULL DEFAULT '',
  `officalFourUid` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_offical_apply` (
  `uuid` varchar(40) NOT NULL,
  `userId` varchar(40) NOT NULL DEFAULT '',
  `allianceId` varchar(40) NOT NULL DEFAULT '',
  `applyType` int(11) NOT NULL DEFAULT 0,
  `applyTime` bigint(20) NOT NULL DEFAULT 0,
  `operateType` int(11) NOT NULL DEFAULT 0,
  `operateTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_user` (`userId`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_science` (
  `allianceId` varchar(40) NOT NULL,
  `scienceId` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `wood` int(11) DEFAULT NULL,
  `stone` int(11) DEFAULT NULL,
  `iron` int(11) DEFAULT NULL,
  `food` int(11) DEFAULT NULL,
  `silver` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `donateprogress` int(11) DEFAULT 0,
  `donatefinish` int(11) DEFAULT 0,
  `researchstarttime` bigint(20) DEFAULT 0,
  `effectflag` int(11) DEFAULT 0,
  `power` int(11) DEFAULT 0,
  PRIMARY KEY (`allianceId`,`scienceId`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_science_upgrade` (
  `allianceId` varchar(40) NOT NULL,
  `scienceId` int(11) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `needTime` bigint(20) DEFAULT NULL,
  `accelerate` blob DEFAULT NULL,
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_shop` (
  `allianceId` varchar(40) NOT NULL,
  `goodsId` varchar(40) NOT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`allianceId`,`goodsId`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_shop_buyrecord` (
  `allianceId` varchar(40) NOT NULL,
  `goodsId` varchar(40) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `count` int(11) NOT NULL,
  `buytime` bigint(20) NOT NULL,
  PRIMARY KEY (`allianceId`,`buytime`) USING BTREE,
  KEY `buytime` (`buytime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_shop_buytoallianceshoprecord` (
  `allianceId` varchar(40) NOT NULL,
  `goodsId` varchar(40) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `count` int(11) NOT NULL,
  `buytime` bigint(20) NOT NULL,
  PRIMARY KEY (`allianceId`,`buytime`) USING BTREE,
  KEY `buytime` (`buytime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_shop_make` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) NOT NULL,
  `goodsId` varchar(40) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `needTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_shophis` (
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `userId` varchar(40) DEFAULT NULL,
  `goodsId` varchar(40) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_alliance` (`allianceId`) USING BTREE,
  KEY `index_user` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_skill` (
  `uuid` varchar(128) NOT NULL,
  `skillId` varchar(128) DEFAULT NULL,
  `curEnergy` int(11) DEFAULT NULL,
  `costEnergy` int(11) DEFAULT NULL,
  `buildingUid` varchar(256) DEFAULT NULL,
  `effect` int(11) DEFAULT 0,
  `effectValue` int(11) DEFAULT 0,
  `statusId` varchar(11) DEFAULT '0',
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_stats` (
  `uid` varchar(255) NOT NULL,
  `event_type` int(11) DEFAULT NULL,
  `fromUser` varchar(255) DEFAULT NULL,
  `toUser` varchar(255) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `extraParam` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_task` (
  `uid` varchar(255) NOT NULL,
  `taskId` varchar(255) NOT NULL,
  `allianceId` varchar(255) NOT NULL,
  `publishUid` varchar(255) NOT NULL,
  `acceptUid` varchar(255) DEFAULT NULL,
  `vanishTime` bigint(20) DEFAULT NULL,
  `finishTime` bigint(20) DEFAULT NULL,
  `publishStat` int(11) DEFAULT 0,
  `acceptStat` int(11) DEFAULT NULL,
  `acceptReward` varchar(255) DEFAULT NULL,
  `baseReward` varchar(255) DEFAULT NULL,
  `extraReward` varchar(255) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT 0,
  `publishTime` bigint(20) DEFAULT 0,
  `freequeue` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `al_idx` (`allianceId`) USING BTREE,
  KEY `publish_idx` (`publishUid`) USING BTREE,
  KEY `accept_idx` (`acceptUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_task_log` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `castleLevel` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `taskId` int(11) DEFAULT NULL,
  `color` int(11) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `behavior` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `castle_color` (`castleLevel`,`color`) USING BTREE,
  KEY `level_index` (`level`) USING BTREE,
  KEY `color_index` (`color`) USING BTREE,
  KEY `castle_index` (`castleLevel`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_task_record` (
  `uid` varchar(255) NOT NULL,
  `publishCount` int(11) DEFAULT 0,
  `refreshCount` int(11) DEFAULT 0,
  `clearCount` int(11) DEFAULT 0,
  `itemRefreshCount` int(11) DEFAULT 0,
  `itemPublishCount` int(11) DEFAULT 0,
  `itemPublishUseCount` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT 0,
  `colorRate2` int(11) DEFAULT 0,
  `colorRate3` int(11) DEFAULT 0,
  `colorRate4` int(11) DEFAULT 0,
  `colorRate5` int(11) DEFAULT 0,
  `colorSysRate2` int(11) DEFAULT 0,
  `colorSysRate3` int(11) DEFAULT 0,
  `colorSysRate4` int(11) DEFAULT 0,
  `colorSysRate5` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_task_unpublish` (
  `uid` varchar(255) NOT NULL,
  `taskId` varchar(255) NOT NULL,
  `publishUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `vanishTime` bigint(20) DEFAULT NULL,
  `finishTime` bigint(20) DEFAULT NULL,
  `acceptReward` varchar(255) DEFAULT NULL,
  `baseReward` varchar(255) DEFAULT NULL,
  `extraReward` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `pub_idx` (`publishUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_territory` (
  `uid` varchar(255) NOT NULL,
  `pointId` int(11) DEFAULT NULL,
  `atWorldId` int(11) NOT NULL DEFAULT 0,
  `towerPoint` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `resType` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT 1,
  `allianceId` varchar(255) NOT NULL,
  `allianceName` varchar(255) NOT NULL,
  `allianceAbbr` varchar(255) DEFAULT NULL,
  `stat` int(11) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  `level` int(11) DEFAULT 0,
  `maxDef` int(11) DEFAULT NULL,
  `curDef` int(11) DEFAULT NULL,
  `createId` varchar(255) DEFAULT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `flag` varchar(255) DEFAULT NULL,
  `buildingSpd` double(20,10) DEFAULT 0.0000000000,
  `updateTime` bigint(20) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `lastUpdateTime` bigint(20) DEFAULT NULL,
  `donateItemNum` int(11) DEFAULT NULL,
  `arrowHarmPower` int(11) DEFAULT 0,
  `neighbour` varchar(1000) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT 0,
  `activateTime` bigint(20) DEFAULT NULL,
  `trapNum` int(11) DEFAULT 0,
  `reduceTime` bigint(20) DEFAULT 0,
  `skinsStr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `skinExpStr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `nextChangeSkinTime` bigint(20) DEFAULT 0,
  `activeSkin` varchar(10) DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE,
  UNIQUE KEY `pointId_worldId_idx` (`pointId`,`atWorldId`) USING BTREE,
  KEY `alliance_idx` (`allianceId`) USING BTREE,
  KEY `update_idx` (`updateTime`) USING BTREE,
  KEY `start_idx` (`startTime`) USING BTREE,
  KEY `lastup_idx` (`lastUpdateTime`) USING BTREE,
  KEY `tower_idx` (`towerPoint`) USING BTREE,
  KEY `pointId_idx` (`pointId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_territory_fix_log` (
  `uuid` varchar(255) NOT NULL,
  `pointId` int(11) NOT NULL,
  `territoryId` varchar(255) NOT NULL,
  `territoryType` int(11) NOT NULL,
  `playerId` varchar(255) DEFAULT NULL,
  `runTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_title` (
  `allianceId` varchar(40) NOT NULL,
  `title` int(11) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `uName` varchar(255) DEFAULT NULL,
  `applicant` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`allianceId`,`title`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance_vedio` (
  `allianceId` varchar(40) NOT NULL,
  `vedioURL` varchar(200) DEFAULT NULL,
  `thumbnailURL` varchar(200) DEFAULT NULL,
  `vedioW` int(11) NOT NULL DEFAULT 0,
  `vedioH` int(11) NOT NULL DEFAULT 0,
  `vedioSize` int(11) NOT NULL DEFAULT 0,
  `vedioLength` int(11) NOT NULL DEFAULT 0,
  `checkSign` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `anniversary_allianceinfo` (
  `num` int(11) NOT NULL,
  `allnum` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `anniversary_userinfo` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `regtop` bigint(20) DEFAULT 0,
  `power` bigint(20) DEFAULT 0,
  `powerpercent` double(10,2) DEFAULT NULL,
  `food` bigint(20) NOT NULL DEFAULT 0,
  `wood` bigint(20) NOT NULL DEFAULT 0,
  `train` bigint(20) NOT NULL DEFAULT 0,
  `armytype` int(11) NOT NULL,
  `maxtrain` bigint(20) NOT NULL DEFAULT 0,
  `maxtrainpercent` double(10,2) DEFAULT NULL,
  `dead` int(11) NOT NULL,
  `deadpercent` double(10,2) DEFAULT NULL,
  `kill` int(11) NOT NULL,
  `killpercent` double(10,2) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `arena_battle_team` (
  `id` varchar(255) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `targetId` int(11) DEFAULT NULL,
  `targetUid` varchar(200) DEFAULT NULL,
  `targetName` varchar(200) DEFAULT NULL,
  `targetPic` varchar(200) DEFAULT NULL,
  `targetAName` varchar(200) DEFAULT NULL,
  `targetAAbbr` varchar(200) DEFAULT NULL,
  `targetAIcon` varchar(200) DEFAULT NULL,
  `targetType` int(11) DEFAULT NULL,
  `leaderUid` varchar(200) DEFAULT NULL,
  `leaderName` varchar(200) DEFAULT NULL,
  `leaderId` int(11) DEFAULT NULL,
  `allianceId` varchar(200) DEFAULT NULL,
  `allianceName` varchar(200) DEFAULT NULL,
  `allianceAbbr` varchar(200) DEFAULT NULL,
  `allianceIcon` varchar(200) DEFAULT NULL,
  `maxSoldiers` int(11) DEFAULT NULL,
  `waitTime` bigint(20) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `worldId` int(11) DEFAULT NULL,
  `superTeam` int(11) DEFAULT NULL,
  `failBackItem` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `army_skill_info` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `skillId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `army_strengthen` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `type` int(11) NOT NULL DEFAULT 0,
  `skillbase_id` int(11) DEFAULT 0,
  `level` int(11) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `skills` varchar(255) DEFAULT NULL,
  `times` int(11) DEFAULT NULL,
  `crit` int(11) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `army_total` (
  `uid` varchar(255) NOT NULL,
  `total` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `atk_name` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `atk_time` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `avatar_storage` (
  `uid` varchar(255) NOT NULL,
  `avatarId` varchar(255) NOT NULL,
  `expirationTime` bigint(20) NOT NULL,
  `effectiveSign` int(11) NOT NULL DEFAULT 0,
  `username` varchar(255) DEFAULT NULL,
  `usetime` bigint(20) DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`avatarId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `badwords` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `words` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `barbarion_statistics` (
  `playerUid` varchar(255) NOT NULL,
  `playerName` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  `isSuccess` int(11) DEFAULT 0,
  `strongHoldLevel` int(11) DEFAULT 0,
  `actType` int(11) DEFAULT 0,
  UNIQUE KEY `uid_name_time_index` (`playerUid`,`playerName`,`time`) USING BTREE,
  KEY `playerUid_Index` (`playerUid`) USING BTREE,
  KEY `isSuccess_actType_index` (`isSuccess`,`actType`) USING BTREE,
  KEY `strongHoldLevel_index` (`strongHoldLevel`) USING BTREE,
  KEY `actType_index` (`actType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `black_land_barbarion_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `black_land_basttile_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `black_land_res_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `bottles` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `serverId` int(11) NOT NULL,
  `pic` varchar(40) DEFAULT NULL,
  `content` blob NOT NULL,
  `locked` tinyint(4) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `replyCount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `branch_link` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `serverId` int(11) NOT NULL DEFAULT 0,
  `fromUid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `fromServerId` int(11) DEFAULT NULL,
  `type` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `modifyTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`serverId`,`data`) USING BTREE,
  KEY `branch_link_from_index` (`fromUid`) USING BTREE,
  KEY `branch_link_type_index` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `branch_url` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `serverId` int(11) NOT NULL DEFAULT 0,
  `type` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `modifyTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`serverId`,`url`) USING BTREE,
  KEY `branch_url_link_index` (`url`) USING BTREE,
  KEY `branch_url_type_index` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `c3p0testtable` (
  `a` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `castle_exchange` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(40) NOT NULL,
  `buy` int(11) DEFAULT 0 COMMENT '购买的次数',
  `time` bigint(20) DEFAULT 0 COMMENT '购买的时间',
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `castle_leveling_0` (
  `uid` varchar(50) NOT NULL COMMENT '用户唯一标识',
  `level` int(11) NOT NULL COMMENT '限定等级',
  `lv_reward` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取等级达到条件奖励',
  `share_reward_0` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_1` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_2` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_3` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_4` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_5` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_6` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `pay_times_0` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_1` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_2` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_3` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_4` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_5` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  PRIMARY KEY (`uid`,`level`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `castle_leveling_1` (
  `uid` varchar(50) NOT NULL COMMENT '用户唯一标识',
  `level` int(11) NOT NULL COMMENT '限定等级',
  `lv_reward` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取等级达到条件奖励',
  `share_reward_0` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_1` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_2` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_3` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_4` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_5` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `share_reward_6` int(11) NOT NULL DEFAULT 0 COMMENT '是否领取共享条件达到条件奖励',
  `pay_times_0` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_1` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_2` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_3` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_4` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  `pay_times_5` int(11) NOT NULL DEFAULT 0 COMMENT '购买次数',
  PRIMARY KEY (`uid`,`level`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `celebrity` (
  `uid` varchar(255) NOT NULL,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `chat_report_record` (
  `uid` varchar(255) NOT NULL,
  `lastUpdateTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `time_idx` (`lastUpdateTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `chat_shield` (
  `uuid` varchar(40) NOT NULL,
  `owner` varchar(40) NOT NULL,
  `other` varchar(40) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `owner_other_index` (`owner`,`other`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `city_monster` (
  `uid` varchar(255) NOT NULL,
  `nextUpdateTime` bigint(20) DEFAULT NULL,
  `bigMonster` int(11) DEFAULT NULL,
  `smallMonster` int(11) DEFAULT NULL,
  `lastUpdateTime` bigint(20) DEFAULT NULL,
  `bigMonsterInOneDay` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `civilization_castle` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `level` int(11) DEFAULT 0,
  `pointId` int(11) DEFAULT 0,
  `def` int(11) DEFAULT 0,
  `resourceNum` double DEFAULT NULL,
  `lastOutputTime` bigint(20) DEFAULT NULL,
  `robCount` int(11) DEFAULT 0,
  `beRobNum` int(11) DEFAULT 0,
  `lastRefreshDataTime` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `buildTime` bigint(20) DEFAULT NULL,
  `lastSettleTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `civilization_castle_record` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `level` int(11) DEFAULT 0,
  `pointId` int(11) DEFAULT 0,
  `def` int(11) DEFAULT 0,
  `resourceNum` int(11) DEFAULT 0,
  `lastOutputTime` bigint(20) DEFAULT NULL,
  `robCount` int(11) DEFAULT 0,
  `beRobNum` int(11) DEFAULT 0,
  `lastRefreshDataTime` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `buildTime` bigint(20) DEFAULT NULL,
  `lastSettleTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `client_log` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `keyword` varchar(200) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`type`,`keyword`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cok_monitor_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `parameter` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `access_time` datetime DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `compensate_record` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `lostPower` bigint(20) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `rewardTime` bigint(20) DEFAULT NULL,
  `rewardStatus` int(11) DEFAULT NULL,
  `reward` varchar(255) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `time_idx` (`time`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `compensate_shield_record` (
  `uid` varchar(255) NOT NULL,
  `createTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `compensation_record` (
  `uid` varchar(255) NOT NULL,
  `count` int(11) DEFAULT 0,
  `lastCompensateTime` bigint(20) DEFAULT NULL,
  `isFirstOnFire` int(11) DEFAULT 1,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `time_index` (`lastCompensateTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `compensation_record_shield` (
  `uid` varchar(255) NOT NULL,
  `createTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_0` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_1` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_2` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_3` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_4` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_5` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_6` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_7` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_8` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_9` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `contact_fb` (
  `uid` varchar(255) NOT NULL,
  `friendUid` varchar(255) NOT NULL,
  `fbUid` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `description` blob DEFAULT NULL,
  `fbName` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`friendUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_info` (
  `uid` varchar(128) NOT NULL DEFAULT '',
  `changeServerType` varchar(128) DEFAULT NULL,
  `crossTime` bigint(20) DEFAULT 0,
  `targetServerId` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_promotion_status` (
  `srcGameId` varchar(255) NOT NULL COMMENT '推广方gameid',
  `targetGameId` varchar(255) NOT NULL COMMENT '被推广方gameid',
  `srcUid` varchar(255) NOT NULL COMMENT '推广方uid',
  `targetUid` varchar(255) NOT NULL COMMENT '被推广方uid',
  `taskid` varchar(255) NOT NULL COMMENT '任务编号',
  `taskType` int(11) NOT NULL COMMENT '任务类型',
  `startTime` bigint(20) DEFAULT NULL COMMENT '开始时间',
  `endTime` bigint(20) DEFAULT NULL COMMENT '结束时间',
  `curValue` int(11) NOT NULL DEFAULT 0 COMMENT '当前值',
  `maxValue` int(11) NOT NULL DEFAULT 0 COMMENT '最大值',
  PRIMARY KEY (`srcGameId`,`targetUid`,`taskid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_promotion_update_task` (
  `uid` varchar(255) NOT NULL COMMENT '玩家唯一id',
  `taskid` varchar(255) NOT NULL COMMENT '任务编号',
  `taskType` int(11) NOT NULL COMMENT '任务类型',
  `curValue` int(11) NOT NULL DEFAULT 0 COMMENT '当前任务数值',
  `getRewardSign` int(11) NOT NULL DEFAULT 0 COMMENT '领奖状态，0未领取，1已领取',
  `acceptTime` bigint(20) DEFAULT NULL COMMENT '接受时间',
  `finishTime` bigint(20) DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`uid`,`taskid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_throne_king_info` (
  `uuid` varchar(50) NOT NULL,
  `version` int(11) NOT NULL,
  `king_type` int(11) NOT NULL COMMENT '1 overlord  2 emperor',
  `config_type` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `pic` varchar(50) DEFAULT NULL,
  `pic_ver` int(11) NOT NULL DEFAULT 0,
  `king_server_id` int(11) NOT NULL DEFAULT 0,
  `alliance_abbr` varchar(50) DEFAULT NULL,
  `occupy_seconds` int(11) NOT NULL DEFAULT 0,
  `induction_time` bigint(20) NOT NULL DEFAULT 0,
  `throne_dead_count` int(11) NOT NULL DEFAULT 0,
  `trebuchet_dead_count` int(11) NOT NULL DEFAULT 0,
  `battle_user_count` int(11) NOT NULL DEFAULT 0,
  `battle_alliance_count` int(11) NOT NULL DEFAULT 0,
  `scout_count` int(11) NOT NULL DEFAULT 0,
  `create_time` bigint(20) DEFAULT NULL,
  `last_update_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`version`,`king_type`,`config_type`) USING BTREE,
  UNIQUE KEY `uuid` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC COMMENT='�������������Ϣ��¼';
--> statement-breakpoint
CREATE TABLE `cross_throne_occupy_record` (
  `uuid` varchar(50) NOT NULL,
  `king_info_id` varchar(50) NOT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `alliance_abbr` varchar(50) DEFAULT NULL,
  `server_id` int(11) DEFAULT NULL,
  `kingdom_name` varchar(50) DEFAULT NULL,
  `start_millis` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`,`king_info_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_throne_reward_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version` int(11) NOT NULL,
  `from_uid` varchar(40) NOT NULL,
  `target_uid` varchar(40) NOT NULL DEFAULT '-1',
  `from_server_id` int(11) NOT NULL,
  `target_server_id` int(11) NOT NULL,
  `reward_type` tinyint(4) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `record_time` bigint(20) DEFAULT NULL,
  `pic` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pic_ver` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `alliance_abbr` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `throne_type` int(11) NOT NULL DEFAULT 0,
  `overlord_type` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `crystal_cost_record` (
  `uid` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `goldType` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `originalGold` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remainGold` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`time`,`userId`,`type`) USING BTREE,
  KEY `index_type` (`userId`,`time`,`type`) USING BTREE,
  KEY `index_goldType` (`goldType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `def_time` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_0` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_1` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_2` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_3` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_4` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_5` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_6` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_7` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_8` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `deposit_record_9` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `operate` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 0,
  `num` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `withDrawTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `device_info` (
  `uid` varchar(40) NOT NULL,
  `signCode` varchar(100) DEFAULT NULL,
  `subscriberId` varchar(100) DEFAULT NULL,
  `operator_name` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `network_type` varchar(100) DEFAULT NULL,
  `os_build` varchar(200) DEFAULT NULL,
  `os_fgpt` varchar(200) DEFAULT NULL,
  `reserve1` varchar(100) DEFAULT NULL,
  `reserve2` varchar(100) DEFAULT NULL,
  `reserve3` varchar(200) DEFAULT NULL,
  `reserve4` varchar(200) DEFAULT NULL,
  `reserve5` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `device_mail_record` (
  `deviceId` varchar(40) NOT NULL,
  `record` varchar(40) NOT NULL,
  PRIMARY KEY (`deviceId`,`record`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `donate_history` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `donate` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT NULL,
  `donateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `aid_idx` (`allianceId`) USING BTREE,
  KEY `time_idx` (`donateTime`) USING BTREE,
  KEY `progress_idx` (`progress`) USING BTREE,
  KEY `donate_idx` (`donate`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `donate_history_record` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `donate` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT NULL,
  `donateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `aid_idx` (`allianceId`) USING BTREE,
  KEY `time_idx` (`donateTime`) USING BTREE,
  KEY `progress_idx` (`progress`) USING BTREE,
  KEY `donate_idx` (`donate`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_battle_fight_history` (
  `uid` varchar(50) NOT NULL,
  `teamId` varchar(50) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `VERSION` varchar(50) DEFAULT '',
  `indexId` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `id` varchar(50) NOT NULL,
  `param1` varchar(255) DEFAULT '',
  `seasonVersion` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `utvindex` (`uid`,`type`,`VERSION`) USING BTREE,
  KEY `teamIdindex` (`teamId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_battle_mail_record` (
  `season_version` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `teamId` varchar(50) NOT NULL,
  `fightServer` int(11) NOT NULL DEFAULT 0,
  `score` int(11) NOT NULL DEFAULT 0,
  `mailId` int(11) NOT NULL DEFAULT 0,
  `teamScore` int(11) NOT NULL DEFAULT 0,
  `rewards` varchar(2000) NOT NULL DEFAULT '''''',
  `recived` tinyint(4) NOT NULL DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0,
  `win` tinyint(4) NOT NULL DEFAULT 0,
  `time` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`season_version`,`version`) USING BTREE,
  KEY `state` (`state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_building_record` (
  `uuid` varchar(255) NOT NULL,
  `worldId` int(11) NOT NULL,
  `buildId` varchar(255) NOT NULL,
  `ownerUid` varchar(255) NOT NULL,
  `occupyUidsStr` varchar(255) NOT NULL,
  `lastCalcScoreTime` bigint(20) NOT NULL,
  `lastHandKnightTime` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_playoff_properties` (
  `key` varchar(100) NOT NULL,
  `value` varchar(1000) DEFAULT NULL,
  `updateTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_playoff_teaminfo` (
  `teamId` varchar(40) NOT NULL,
  `teamName` varchar(255) DEFAULT NULL,
  `leaderName` varchar(255) DEFAULT NULL,
  `kingId` int(11) NOT NULL DEFAULT 0,
  `kingName` varchar(255) DEFAULT NULL,
  `state` int(11) NOT NULL DEFAULT 0,
  `score` int(11) NOT NULL DEFAULT 0,
  `fighting` int(11) NOT NULL DEFAULT 0,
  `fightNum` int(11) NOT NULL DEFAULT 0,
  `winNum` int(11) NOT NULL DEFAULT 0,
  `curmember` int(11) NOT NULL DEFAULT 0,
  `maxmember` int(11) NOT NULL DEFAULT 0,
  `version` int(11) NOT NULL DEFAULT 0,
  `index` int(11) NOT NULL DEFAULT 0,
  `fightServerId` varchar(40) DEFAULT NULL,
  `rankNum` int(11) NOT NULL DEFAULT 0,
  `areaId` int(11) NOT NULL DEFAULT 0,
  `abbr` varchar(255) DEFAULT NULL,
  `fightState` int(11) NOT NULL DEFAULT 0,
  `serverId` int(11) NOT NULL DEFAULT 0,
  `icon` varchar(255) DEFAULT NULL,
  `groupId` int(11) NOT NULL DEFAULT 0,
  `groupIndex` int(11) NOT NULL DEFAULT 0,
  `timeIndexes` varchar(20) DEFAULT NULL,
  `enemyIds` varchar(255) DEFAULT NULL,
  `results` varchar(20) DEFAULT NULL,
  `curEnemyId` varchar(40) DEFAULT NULL,
  `finalGroupIndex` int(11) NOT NULL DEFAULT 0,
  `finalRankNum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`teamId`,`version`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_skill` (
  `uid` varchar(96) DEFAULT NULL,
  `dragonId` int(11) DEFAULT NULL,
  `skillId` varchar(60) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `actTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_talent_skill` (
  `uid` varchar(96) NOT NULL DEFAULT '',
  `dragonId` int(11) NOT NULL DEFAULT 0,
  `skillId` varchar(60) NOT NULL DEFAULT '',
  `startTime` bigint(20) DEFAULT NULL,
  `actTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `totalExp` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`dragonId`,`skillId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `dragon_tower_buff` (
  `uid` varchar(32) NOT NULL,
  `buffid` int(11) NOT NULL,
  `remainlayers` int(11) DEFAULT NULL,
  `buytime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`buffid`) USING BTREE,
  KEY `Index_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='龙塔玩家buff表';
--> statement-breakpoint
CREATE TABLE `dragon_tower_fightreport` (
  `citylevel` smallint(6) NOT NULL,
  `layer` int(11) NOT NULL,
  `uid` varchar(32) DEFAULT NULL,
  `fighttime` bigint(20) DEFAULT NULL,
  `army` text DEFAULT NULL,
  `report` text DEFAULT NULL,
  `citystar` smallint(6) DEFAULT NULL,
  `monsterid` int(11) DEFAULT NULL,
  `difficulty` smallint(6) DEFAULT NULL,
  `monsterdead` int(11) DEFAULT NULL,
  `playerdead` int(11) DEFAULT NULL,
  PRIMARY KEY (`citylevel`,`layer`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='龙塔战报表';
--> statement-breakpoint
CREATE TABLE `dragon_tower_layer` (
  `uid` varchar(32) NOT NULL,
  `layer` int(11) NOT NULL,
  `difficulty` tinyint(4) DEFAULT NULL,
  `monsters` char(36) DEFAULT NULL,
  `currentmonster` int(11) DEFAULT NULL,
  `buff` char(36) DEFAULT NULL,
  `buybuff` int(11) DEFAULT NULL,
  `awards` text CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `awardstate` tinyint(4) DEFAULT NULL,
  `layerstate` tinyint(4) DEFAULT NULL,
  `fighttime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`layer`) USING BTREE,
  KEY `Index_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='龙塔关卡表';
--> statement-breakpoint
CREATE TABLE `dragon_tower_user` (
  `uid` varchar(32) NOT NULL,
  `currentlayer` int(11) DEFAULT NULL,
  `weeklymaxlayer` int(11) DEFAULT NULL,
  `maxlayer` int(11) DEFAULT NULL,
  `weeklyrevive` smallint(6) DEFAULT NULL,
  `resettimes` smallint(6) DEFAULT NULL,
  `dailyresettime` bigint(20) DEFAULT NULL,
  `weeklyresettime` bigint(20) DEFAULT NULL,
  `dragon` varchar(36) DEFAULT NULL,
  `army` text DEFAULT NULL,
  `deadarmy` text DEFAULT NULL,
  `armyrevivenum` int(11) DEFAULT NULL,
  `armyrevive` text DEFAULT NULL,
  `armyrevivecd` bigint(20) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `sharetimes` smallint(6) DEFAULT NULL,
  `generalid` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='玩家龙塔表';
--> statement-breakpoint
CREATE TABLE `dragon_words_record` (
  `uid` varchar(255) NOT NULL,
  `castleLevel` int(11) NOT NULL,
  `loadLevel` int(11) NOT NULL,
  `buildingLevel` int(11) NOT NULL,
  `activityTitle` int(11) NOT NULL,
  `talismanDetail` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `dragon_words_record_index` (`castleLevel`,`buildingLevel`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `egg_activity` (
  `uid` varchar(40) NOT NULL,
  `curEgg` varchar(10) NOT NULL,
  `eggCd` bigint(20) DEFAULT 0,
  `exp` int(11) DEFAULT 0,
  `curExpStage` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exception_user` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `day` varchar(10) NOT NULL,
  `count` int(11) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`,`day`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(40) NOT NULL,
  `buy` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  `flush` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_activity` (
  `uid` varchar(40) NOT NULL,
  `actId` varchar(10) NOT NULL,
  `reward` blob DEFAULT NULL,
  `refresh` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_alliance_log` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`uid`,`orderId`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_condition` (
  `uid` varchar(40) NOT NULL,
  `soldierDead` bigint(20) DEFAULT 0,
  `deadFlushTime` bigint(20) DEFAULT 0,
  `payGold` int(11) DEFAULT 1,
  `goldFlushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_gift` (
  `uid` varchar(40) NOT NULL,
  `receiverId` varchar(40) NOT NULL,
  `exchangeId` varchar(20) NOT NULL,
  `sendTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`receiverId`,`exchangeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_gift_log` (
  `mailId` varchar(40) NOT NULL,
  `senderId` varchar(40) DEFAULT NULL,
  `receiverId` varchar(40) DEFAULT NULL,
  `exchangeId` varchar(20) DEFAULT NULL,
  `sendTime` bigint(20) NOT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`mailId`,`sendTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_group_type` (
  `uid` varchar(255) NOT NULL DEFAULT '' COMMENT '唯一ID',
  `group_type` int(11) NOT NULL DEFAULT 0 COMMENT '类型',
  `id` int(11) DEFAULT NULL COMMENT 'exchange静态表的id',
  `refreshtime` bigint(20) DEFAULT NULL COMMENT '刷新的时间',
  PRIMARY KEY (`uid`,`group_type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_order` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `itemId` varchar(40) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_time` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(40) NOT NULL,
  `beginTime` bigint(20) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_visible` (
  `uid` varchar(40) NOT NULL,
  `exchangeId` varchar(20) NOT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`exchangeId`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `expedition_fail_award` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `score` double DEFAULT 0,
  `rewardId` varchar(20) NOT NULL DEFAULT '',
  `rank` int(11) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `expedition_mark` (
  `serverId` int(11) NOT NULL,
  `isKickFinished` tinyint(1) NOT NULL DEFAULT 0,
  `isSendedAward` tinyint(1) NOT NULL DEFAULT 0,
  `kickFinishTime` bigint(20) NOT NULL,
  `sendAwardTime` bigint(20) NOT NULL,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `expedition_record` (
  `uuid` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  `type` int(11) NOT NULL,
  `targetServerName` varchar(255) NOT NULL,
  `targetServerId` int(11) NOT NULL,
  `kingUid` varchar(255) DEFAULT NULL,
  `kingUserName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `time_index` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fast_carry_activity` (
  `uid` varchar(40) NOT NULL,
  `type` varchar(40) NOT NULL DEFAULT '17',
  `totalPoint` int(11) NOT NULL DEFAULT 0,
  `lastEndTime` bigint(20) NOT NULL DEFAULT 0,
  `reward1` varchar(40) NOT NULL DEFAULT '-1',
  `reward2` varchar(40) NOT NULL DEFAULT '-1',
  `reward3` varchar(40) NOT NULL DEFAULT '-1',
  `reward4` varchar(40) NOT NULL DEFAULT '-1',
  `goalReward1` int(11) NOT NULL DEFAULT 0,
  `goalReward2` int(11) NOT NULL DEFAULT 0,
  `goalReward3` int(11) NOT NULL DEFAULT 0,
  `goalReward4` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`lastEndTime`) USING BTREE,
  KEY `goalReward` (`goalReward1`,`goalReward2`,`goalReward3`,`goalReward4`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fastcarryhelp` (
  `allianceId` varchar(40) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `maxcount` int(11) NOT NULL DEFAULT 0,
  `nowcount` int(11) NOT NULL DEFAULT 0,
  `helpers` varchar(2048) DEFAULT NULL,
  `updatetime` bigint(20) NOT NULL,
  `progress` int(11) DEFAULT 0,
  PRIMARY KEY (`allianceId`,`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `feed_reward` (
  `uid` varchar(255) NOT NULL,
  `feed_count` int(11) DEFAULT NULL,
  `feed_time` bigint(20) DEFAULT NULL,
  `accept_count` int(11) DEFAULT NULL,
  `accept_time` bigint(20) DEFAULT NULL,
  `feed_uuid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fight_arena_info` (
  `worldId` int(11) NOT NULL,
  `state` int(11) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`worldId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fight_arena_player_info` (
  `uid` varchar(255) DEFAULT NULL,
  `worldId` int(11) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `side` int(11) DEFAULT NULL,
  `rankScore` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fight_king_status` (
  `index` int(11) NOT NULL,
  `info` varchar(8192) DEFAULT NULL,
  PRIMARY KEY (`index`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `firstpaylog` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `productId` varchar(10) NOT NULL DEFAULT '0',
  `orderInfo` varchar(100) DEFAULT '',
  `time` bigint(20) DEFAULT NULL,
  `currency` int(11) DEFAULT 0,
  `spend` double(10,2) NOT NULL DEFAULT 0.00,
  `paid` double(10,2) DEFAULT 0.00,
  `status` int(11) DEFAULT 0,
  `payLevel` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`orderId`,`pf`) USING BTREE,
  KEY `index_time_pf` (`time`,`pf`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fiveonlinedata` (
  `timeStamp` int(11) NOT NULL DEFAULT 0,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`timeStamp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `flower_history` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '唯一ID',
  `sourceID` varchar(255) NOT NULL,
  `targetID` varchar(255) NOT NULL,
  `timeVal` bigint(20) DEFAULT NULL,
  `itemID` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`sourceID`,`targetID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `flower_info` (
  `uid` varchar(38) NOT NULL COMMENT '玩家uuid',
  `lastflowerRanking` int(11) DEFAULT NULL COMMENT '鲜花排行榜的上次排名',
  `lastOperatorFlower` bigint(20) DEFAULT NULL,
  `flowerUse` varchar(255) DEFAULT NULL COMMENT '已经使用过的道具次数',
  `lastCanvassTime` bigint(20) DEFAULT 0,
  `lastBeCanvassTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `flower_notice` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '唯一ID',
  `addTime` bigint(20) DEFAULT NULL COMMENT '记录添加的时间',
  `targetID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '鲜花的接受者',
  `sourceName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '鲜花的发起者昵称',
  `sourceID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '鲜花的发起者ID',
  `itemID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '物品ID',
  `itemCount` int(11) DEFAULT NULL COMMENT '使用物品的数量',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `flower_ranking` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '唯一ID',
  `scoreVal` int(11) DEFAULT NULL COMMENT '玩家积分',
  `flowerVal` int(11) DEFAULT NULL COMMENT '所收到的鲜花数量',
  `eggVal` int(11) DEFAULT NULL COMMENT 'eggVal',
  `hideKing` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `foreigen_sciences` (
  `uid` varchar(32) NOT NULL,
  `itemid` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `cdtime` bigint(20) DEFAULT NULL,
  `reserve` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`itemid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='贤者之塔科技表';
--> statement-breakpoint
CREATE TABLE `formation_info` (
  `uid` varchar(255) NOT NULL,
  `formation` varchar(1024) DEFAULT NULL,
  `index1` int(11) NOT NULL,
  `customName` varchar(21) DEFAULT NULL COMMENT '???????',
  `dragonFormation` varchar(300) DEFAULT NULL,
  `heroFormation` varchar(300) DEFAULT NULL,
  `angelArmy` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`uid`,`index1`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fresh_recharge_reward` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `friend_help` (
  `fromId` varchar(40) NOT NULL,
  `toId` varchar(20) NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`fromId`,`toId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `friend_mine` (
  `uid` varchar(40) NOT NULL,
  `itemId` int(11) DEFAULT NULL,
  `helpCount` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fserver_data` (
  `uid` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `function_notice` (
  `uid` varchar(255) NOT NULL,
  `noticeMapStr` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `general_challenge_layer` (
  `id` int(11) NOT NULL DEFAULT 0,
  `uid` varchar(96) NOT NULL DEFAULT '',
  `count` int(11) DEFAULT NULL,
  `buycount` int(11) DEFAULT NULL,
  `finishcount` int(11) DEFAULT NULL,
  `monsterid` int(11) DEFAULT NULL,
  `challengetime` bigint(20) DEFAULT NULL,
  `resettime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gm_expedition_match` (
  `serverId` int(11) NOT NULL,
  `targetServerId` int(11) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gold_cost_record` (
  `uid` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `goldType` int(11) DEFAULT NULL,
  `type` int(11) NOT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `originalGold` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remainGold` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`time`,`userId`,`type`) USING BTREE,
  KEY `index_type` (`userId`,`time`,`type`) USING BTREE,
  KEY `index_goldType` (`goldType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gold_eggs` (
  `uid` varchar(96) NOT NULL,
  `flushfreetimes` int(11) NOT NULL DEFAULT 0 COMMENT '免费刷新次数',
  `flushtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '盘面刷新时间',
  `flushcount` int(11) NOT NULL DEFAULT 0 COMMENT '刷新的次数',
  `statelist` varchar(1024) NOT NULL DEFAULT '' COMMENT '盘面蛋的状态',
  `freetimes` int(11) NOT NULL DEFAULT 0 COMMENT '免费砸蛋次数',
  `everydaytime` bigint(20) NOT NULL DEFAULT 0 COMMENT '每天刷新赠送次数',
  `multiple` int(11) NOT NULL DEFAULT 1 COMMENT '倍数',
  `score` bigint(20) NOT NULL DEFAULT 0 COMMENT '总的分数',
  `score_reward` varchar(512) NOT NULL DEFAULT '' COMMENT '是否已经领奖',
  `ranking` int(11) NOT NULL DEFAULT 0 COMMENT '排名',
  `createtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '本次活动激活的时间',
  `onlogintime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gold_group_buy` (
  `id` varchar(40) NOT NULL,
  `flushtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '购买时间',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '已经团购该物品到达的数量',
  `create_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '活动内激活时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gold_wish_pool` (
  `uid` varchar(255) NOT NULL,
  `times` int(11) NOT NULL,
  `costGold` int(11) DEFAULT NULL,
  `getGold` int(11) DEFAULT NULL,
  `rate` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`times`) USING BTREE,
  KEY `byUid` (`uid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_time` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_0` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_1` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_10` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_11` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_2` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_3` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_4` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_5` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_6` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_7` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_8` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2024_9` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_exchange_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(40) NOT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 1,
  `sumNum` bigint(20) NOT NULL DEFAULT 0,
  `stage` tinyint(4) NOT NULL DEFAULT 1,
  `getAward` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3073 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hero_activity` (
  `uuid` varchar(255) NOT NULL,
  `activityId` varchar(100) NOT NULL,
  `activityType` int(11) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT 0,
  `roundTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `finish` int(11) DEFAULT 0,
  `alreadyEvent` varchar(1000) DEFAULT NULL,
  `serverGroup` varchar(255) DEFAULT NULL,
  `kingdomRank` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `st_idx` (`startTime`) USING BTREE,
  KEY `et_idx` (`endTime`) USING BTREE,
  KEY `act_idx` (`activityId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hero_event` (
  `uuid` varchar(255) NOT NULL,
  `eventId` varchar(200) NOT NULL,
  `activityId` varchar(255) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `rewardType` int(11) DEFAULT NULL,
  `readyTime` bigint(20) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `lastTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `rewardStatus` int(11) DEFAULT 0,
  `serverGroup` varchar(255) DEFAULT NULL,
  `kingdomRank` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `act_idx` (`activityId`) USING BTREE,
  KEY `st_idx` (`startTime`) USING BTREE,
  KEY `et_idx` (`endTime`) USING BTREE,
  KEY `eid_idx` (`eventId`) USING BTREE,
  KEY `r_idx` (`rewardStatus`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hero_event_reward_record` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) NOT NULL DEFAULT '',
  `eventId` varchar(255) NOT NULL,
  `rank` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT 0,
  `rewardId` varchar(255) DEFAULT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`allianceId`,`eventId`) USING BTREE,
  KEY `eid_idx` (`eventId`) USING BTREE,
  KEY `time_idx` (`time`) USING BTREE,
  KEY `level_idx` (`level`) USING BTREE,
  KEY `al_idx` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hero_office` (
  `id` int(11) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `officeId` varchar(40) DEFAULT NULL,
  `position` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `lastRefreshExpTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`,`uid`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hot_buy_record` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(50) NOT NULL,
  `buyCount` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`goodsId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hot_goods_cost_record` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `priceType` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `goods_idx` (`goodsId`) USING BTREE,
  KEY `time_idx` (`buyTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hot_info_before_refresh` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `itemId` varchar(20) DEFAULT NULL,
  `priceType` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `refreshTime` bigint(20) NOT NULL DEFAULT 0,
  `gold` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`goodsId`,`price`,`refreshTime`) USING BTREE,
  KEY `time_idx` (`refreshTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hot_refresh_record` (
  `uid` varchar(255) NOT NULL,
  `count` int(11) DEFAULT 0,
  `todayTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `innercityskin` (
  `uid` varchar(255) NOT NULL,
  `style` varchar(255) DEFAULT '-1',
  `zoom` varchar(255) DEFAULT '',
  `show_type` varchar(255) DEFAULT '-1',
  `time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `invest_everyday` (
  `uid` varchar(255) NOT NULL DEFAULT '' COMMENT '唯一ID',
  `tableid` int(11) NOT NULL COMMENT '存储的当前表格id',
  `level` int(11) NOT NULL COMMENT '投资时玩家等级',
  `isreceive` varchar(128) NOT NULL DEFAULT '' COMMENT '是否领取0未领取1领取,数组',
  `beginTime` bigint(20) DEFAULT 0 COMMENT '投资的时间',
  `receiveTime` bigint(20) DEFAULT 0 COMMENT '领取的时间',
  `endactive` int(11) DEFAULT 0 COMMENT '该次分期结束',
  `promptTime` bigint(20) DEFAULT 0 COMMENT '提示领取的时间',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `invite_count` (
  `uid` varchar(40) NOT NULL,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `invitee` (
  `uid` varchar(40) NOT NULL,
  `inviterUid` varchar(40) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `inviter` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `inviteeUid` varchar(40) NOT NULL,
  `gold` bigint(20) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `inviter_index_001` (`uid`,`type`,`time`) USING BTREE,
  KEY `uid_type_inviteeUid` (`uid`,`inviteeUid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `item_count_control` (
  `itemId` varchar(50) NOT NULL,
  `count` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `total2` int(11) DEFAULT NULL,
  `lastRefreshTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_allot_tax_record` (
  `uuid` varchar(255) NOT NULL,
  `kingUid` varchar(255) DEFAULT NULL,
  `kingName` varchar(255) DEFAULT NULL,
  `toUid` varchar(255) DEFAULT NULL,
  `toUserName` varchar(255) DEFAULT NULL,
  `wood` bigint(20) DEFAULT 0,
  `food` bigint(20) DEFAULT 0,
  `iron` bigint(20) DEFAULT 0,
  `stone` bigint(20) DEFAULT 0,
  `sendTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `time_index` (`sendTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_fight_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `index` int(11) NOT NULL,
  `logTime` bigint(20) DEFAULT 0,
  `logType` varchar(128) DEFAULT '',
  `uid` varchar(128) DEFAULT '',
  `log` varchar(2048) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=46500 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_present_record` (
  `toUserId` varchar(40) NOT NULL,
  `presentId` int(11) NOT NULL,
  `presentNameId` int(11) NOT NULL,
  `sendTime` bigint(20) NOT NULL,
  `abbr` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`toUserId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_skill_event` (
  `uid` varchar(256) DEFAULT NULL,
  `skillId` varchar(128) DEFAULT NULL,
  `data` varchar(1024) DEFAULT NULL,
  `opTime` bigint(20) DEFAULT NULL,
  `params` varchar(1024) DEFAULT NULL,
  `dialogId` varchar(128) DEFAULT NULL,
  KEY `uid_index` (`uid`(255)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_skill_status` (
  `id` int(11) NOT NULL DEFAULT 0,
  `kingMsg` varchar(2048) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `curChooseSkill` varchar(128) DEFAULT NULL,
  `skillMaterial` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_tax_record` (
  `uuid` varchar(255) NOT NULL,
  `taxTime` bigint(20) DEFAULT 0,
  `type` int(11) DEFAULT 0,
  `targetServerName` varchar(255) DEFAULT NULL,
  `targetServerId` int(11) DEFAULT 0,
  `wood` bigint(20) DEFAULT 0,
  `food` bigint(20) DEFAULT 0,
  `iron` bigint(20) DEFAULT 0,
  `stone` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `time_index` (`taxTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `king_time_fight_log` (
  `uid` varchar(50) NOT NULL,
  `logtime` bigint(20) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `humanUid` varchar(255) DEFAULT NULL,
  `pointId` int(11) DEFAULT NULL,
  `data1` varchar(255) DEFAULT NULL,
  `data2` varchar(255) DEFAULT NULL,
  `data3` varchar(255) DEFAULT NULL,
  `data4` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `Index_logtime` (`logtime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_battle_team` (
  `id` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `targetId` int(11) NOT NULL,
  `targetUid` varchar(40) DEFAULT NULL,
  `targetName` varchar(255) DEFAULT NULL,
  `targetPic` varchar(40) DEFAULT NULL,
  `targetAName` varchar(40) DEFAULT NULL,
  `targetAAbbr` varchar(40) DEFAULT NULL,
  `targetAIcon` varchar(40) DEFAULT NULL,
  `targetType` int(11) DEFAULT 0,
  `leaderUid` varchar(40) NOT NULL,
  `leaderName` varchar(40) NOT NULL,
  `leaderId` int(11) DEFAULT NULL,
  `allianceId` varchar(40) NOT NULL,
  `allianceName` varchar(40) DEFAULT NULL,
  `allianceAbbr` varchar(40) DEFAULT NULL,
  `allianceIcon` varchar(40) DEFAULT NULL,
  `maxSoldiers` int(11) NOT NULL,
  `waitTime` bigint(20) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `worldId` int(11) NOT NULL DEFAULT 0,
  `failBackItem` int(11) DEFAULT 0,
  `superTeam` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_building` (
  `uuid` varchar(36) NOT NULL,
  `itemid` int(11) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `worldid` int(11) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `star` int(11) DEFAULT NULL,
  `progress` tinyint(4) DEFAULT NULL,
  `creator` varchar(32) DEFAULT NULL,
  `createtime` bigint(20) DEFAULT NULL,
  `starttime` bigint(20) DEFAULT NULL,
  `updatetime` bigint(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `skin` varchar(64) DEFAULT NULL,
  `speed` double(20,10) DEFAULT NULL,
  `maxdef` int(11) DEFAULT NULL,
  `curdef` int(11) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `occupy` int(11) DEFAULT NULL,
  `reserve` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `Index_itemid` (`itemid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='王国建筑';
--> statement-breakpoint
CREATE TABLE `kingdom_building_buff` (
  `uuid` varchar(36) NOT NULL,
  `effect` int(11) NOT NULL,
  `value` double DEFAULT NULL,
  `expiretime` bigint(20) DEFAULT NULL,
  `reserve` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`,`effect`) USING BTREE,
  KEY `Index_itemid` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='王国建筑buff';
--> statement-breakpoint
CREATE TABLE `kingdom_cemetery` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '墓地唯一编号',
  `cemeteryStat` int(11) DEFAULT 0 COMMENT '墓地状态全局标识',
  `reviveStat` int(11) DEFAULT 0 COMMENT '亡兵复活标识',
  `totalContribution` int(11) DEFAULT 0 COMMENT '贡献总次数',
  `totalDead` bigint(20) DEFAULT 0 COMMENT '亡兵总数',
  `kingBlessingTime` bigint(20) DEFAULT NULL COMMENT '国王祝福最后时间',
  `ministerBlessingTime` bigint(20) DEFAULT NULL COMMENT '大臣祝福最后时间',
  `startReviveTime` bigint(20) DEFAULT NULL COMMENT '贡献值满的时间',
  `needContributionSum` int(11) DEFAULT 0 COMMENT '需要贡献次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_cross_fight_history` (
  `serverId` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `startTime` bigint(20) NOT NULL,
  `round` int(11) NOT NULL,
  `score` bigint(20) DEFAULT 0,
  `rank` int(11) DEFAULT 0,
  PRIMARY KEY (`serverId`,`startTime`,`round`) USING BTREE,
  KEY `kingdom_startTime` (`serverId`,`startTime`) USING BTREE,
  KEY `startTime` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_info` (
  `serverId` int(11) NOT NULL,
  `wood` bigint(20) DEFAULT 0,
  `food` bigint(20) DEFAULT 0,
  `iron` bigint(20) DEFAULT 0,
  `stone` bigint(20) DEFAULT 0,
  `silver` bigint(20) DEFAULT 0,
  `victoryTowerLevel` int(11) NOT NULL DEFAULT 1,
  `expeditionUserCount` int(11) DEFAULT 0,
  `expeditionKillArmyCount` bigint(20) DEFAULT 0,
  `expeditionKillMonsterCount` int(11) DEFAULT 0,
  `expeditionCollectCount` bigint(20) DEFAULT 0,
  `isOccupyThrone` tinyint(4) DEFAULT 0,
  `throneScore` int(11) DEFAULT 0,
  `expeditionKingdomScore` int(11) DEFAULT 0,
  `kingdomMiracleLevel` int(11) DEFAULT 0,
  `ownerMiracles` text DEFAULT NULL,
  `miracleOccupyCount` int(11) DEFAULT 0,
  `isMyThroneOccupy` tinyint(4) DEFAULT 0,
  `isOccupyOtherThrone` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_position` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `positionId` varchar(40) NOT NULL DEFAULT '',
  `time` bigint(20) DEFAULT NULL,
  `chNameFlag` int(11) DEFAULT NULL,
  `preKingUid` varchar(40) DEFAULT NULL,
  `relinquishEndTime` bigint(20) DEFAULT NULL,
  `currResourceType` int(11) DEFAULT NULL,
  `chBannerFlag` int(11) DEFAULT NULL,
  `chThronePicFlag` int(11) DEFAULT NULL,
  `appointedTime` bigint(20) DEFAULT 0,
  `valid` int(11) DEFAULT 0,
  `cemeteryBlessTime` bigint(20) DEFAULT 0,
  `serverId` int(11) DEFAULT 0,
  `isSmall` int(11) NOT NULL DEFAULT 0 COMMENT '官职图标显示大小',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_position_appoint` (
  `positionId` int(11) NOT NULL DEFAULT 0,
  `appointTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`positionId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `kingdom_skill_log` (
  `uid` varchar(255) NOT NULL,
  `skillId` int(11) NOT NULL,
  `logTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`skillId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logaction` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `action` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL,
  `info` varchar(2048) NOT NULL,
  `param` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`action`,`code`) USING BTREE,
  KEY `index2` (`user`,`timeStamp`,`action`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logrecord` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `category` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `param4` int(11) DEFAULT NULL,
  `data1` varchar(255) DEFAULT NULL,
  `data2` varchar(255) DEFAULT NULL,
  `data3` varchar(255) DEFAULT NULL,
  `data4` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`category`,`type`) USING BTREE,
  KEY `index_2` (`user`,`category`,`type`,`timeStamp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logrecord_fight` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `category` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `param4` int(11) DEFAULT NULL,
  `data1` varchar(255) DEFAULT NULL,
  `data2` varchar(255) DEFAULT NULL,
  `data3` varchar(255) DEFAULT NULL,
  `data4` varchar(255) DEFAULT NULL,
  `data5` varchar(4086) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`category`,`type`) USING BTREE,
  KEY `index_2` (`user`,`category`,`type`,`timeStamp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logstat` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `param4` int(11) DEFAULT NULL,
  `param5` int(11) DEFAULT NULL,
  `data1` int(11) DEFAULT NULL,
  `data2` bigint(20) DEFAULT NULL,
  `data3` int(11) DEFAULT NULL,
  `data4` int(11) DEFAULT NULL,
  `data5` int(11) DEFAULT NULL,
  `data6` int(11) DEFAULT NULL,
  `data7` int(11) DEFAULT NULL,
  `data8` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`type`,`param1`,`param2`,`param3`) USING BTREE,
  KEY `index2` (`type`,`timeStamp`,`user`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logtemp` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `param4` int(11) DEFAULT NULL,
  `param5` int(11) DEFAULT NULL,
  `data1` int(11) DEFAULT NULL,
  `data2` int(11) DEFAULT NULL,
  `data3` int(11) DEFAULT NULL,
  `data4` int(11) DEFAULT NULL,
  `data5` int(11) DEFAULT NULL,
  `data6` int(11) DEFAULT NULL,
  `data7` int(11) DEFAULT NULL,
  `data8` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`type`,`param1`,`param2`,`param3`) USING BTREE,
  KEY `index2` (`type`,`timeStamp`,`user`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logtmp` (
  `uid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `param3` int(11) DEFAULT NULL,
  `param4` int(11) DEFAULT NULL,
  `param5` int(11) DEFAULT NULL,
  `data1` int(11) DEFAULT NULL,
  `data2` int(11) DEFAULT NULL,
  `data3` int(11) DEFAULT NULL,
  `data4` int(11) DEFAULT NULL,
  `data5` int(11) DEFAULT NULL,
  `data6` int(11) DEFAULT NULL,
  `data7` int(11) DEFAULT NULL,
  `data8` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index` (`timeStamp`,`user`,`type`,`param1`,`param2`,`param3`) USING BTREE,
  KEY `index2` (`type`,`timeStamp`,`user`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `lottery_log` (
  `uid` varchar(40) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `superMode` tinyint(4) DEFAULT NULL,
  `lotteryId` varchar(40) DEFAULT NULL,
  `lotteryInfo` varchar(200) DEFAULT NULL,
  `result` varchar(100) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `lottery_record` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `superMode` int(11) NOT NULL,
  `step` int(11) NOT NULL,
  `times1` int(11) NOT NULL,
  `times2` int(11) NOT NULL,
  `multiple` int(11) NOT NULL,
  `result` varchar(100) NOT NULL,
  `lotteryId` varchar(40) NOT NULL,
  `lotteryInfo1` varchar(200) NOT NULL,
  `lotteryInfo2` varchar(100) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  `times3` int(11) DEFAULT 0,
  `times4` int(11) DEFAULT 0,
  `boxTimes` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `luck_draw_history` (
  `gameUid` varchar(255) DEFAULT NULL,
  `roleName` varchar(40) DEFAULT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `allianceName` varchar(40) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `itemId` varchar(255) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `lucky_bag` (
  `uid` varchar(255) NOT NULL,
  `openFreetimes` int(11) DEFAULT 0,
  `flushTimes` int(11) DEFAULT 0,
  `nextOpenTime` int(11) DEFAULT 0,
  `multiple` int(11) DEFAULT 1,
  `score` int(11) DEFAULT 0,
  `scoreReward` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `lucky_day` (
  `uid` varchar(255) NOT NULL,
  `unluckyCount` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT NULL,
  `effectId` varchar(40) DEFAULT NULL,
  `luckyCount` int(11) DEFAULT NULL,
  `lucky_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail` (
  `uid` varchar(40) NOT NULL,
  `toUser` varchar(40) NOT NULL,
  `fromUser` varchar(40) DEFAULT NULL,
  `fromName` varchar(100) DEFAULT '',
  `title` varchar(255) NOT NULL DEFAULT '',
  `contents` blob NOT NULL,
  `rewardId` longtext CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `itemIdFlag` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 1,
  `rewardStatus` int(11) NOT NULL DEFAULT 0,
  `saveFlag` int(11) DEFAULT 0,
  `createTime` bigint(20) NOT NULL,
  `reply` int(11) NOT NULL DEFAULT 0,
  `translationId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_toFrom` (`toUser`,`type`,`fromUser`) USING BTREE,
  KEY `index_toUserTime` (`toUser`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_20150212` (
  `uid` varchar(40) NOT NULL,
  `toUser` varchar(40) NOT NULL,
  `fromUser` varchar(40) DEFAULT NULL,
  `fromName` varchar(100) NOT NULL,
  `title` varchar(40) NOT NULL,
  `contents` blob NOT NULL,
  `rewardId` blob DEFAULT NULL,
  `itemIdFlag` int(11) DEFAULT 0,
  `status` int(11) DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 1,
  `rewardStatus` int(11) NOT NULL DEFAULT 0,
  `saveFlag` int(11) DEFAULT 0,
  `createTime` bigint(20) NOT NULL,
  `reply` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_toFrom` (`toUser`,`type`,`fromUser`) USING BTREE,
  KEY `index_toUserTime` (`toUser`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_contents` (
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `contents` mediumblob NOT NULL,
  `toUser` varchar(40) DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `user_idx` (`toUser`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_contents_1016` (
  `id` varchar(40) NOT NULL,
  `title` varchar(40) NOT NULL,
  `contents` blob NOT NULL,
  `rewardId` blob DEFAULT NULL,
  `itemIdFlag` int(11) DEFAULT 0,
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_contents_20141030` (
  `id` varchar(40) NOT NULL,
  `title` varchar(40) NOT NULL,
  `contents` blob NOT NULL,
  `rewardId` blob DEFAULT NULL,
  `itemIdFlag` int(11) DEFAULT 0,
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_group` (
  `uid` varchar(40) NOT NULL,
  `groupType` int(11) NOT NULL DEFAULT 1,
  `groupIndex` varchar(40) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`groupType`,`groupIndex`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_group_20150212` (
  `uid` varchar(40) NOT NULL,
  `groupType` int(11) NOT NULL DEFAULT 1,
  `groupIndex` varchar(40) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`groupType`,`groupIndex`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_reward_log` (
  `uid` varchar(40) NOT NULL,
  `mailId` varchar(40) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`uid`,`mailId`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `marketing_log` (
  `uid` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL,
  `network` varchar(255) NOT NULL DEFAULT '',
  `time` bigint(20) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`,`network`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `material_control` (
  `uid` varchar(40) NOT NULL,
  `num` int(11) NOT NULL DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `material_cost_ranking` (
  `uid` varchar(40) NOT NULL,
  `contributeSum` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `material_cost_record` (
  `uid` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`time`,`userId`,`type`) USING BTREE,
  KEY `index_type` (`userId`,`time`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `pinyin` varchar(200) DEFAULT NULL,
  `path` varchar(200) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `p_id` int(11) DEFAULT NULL,
  `comments` varchar(100) DEFAULT NULL,
  `is_prod` tinyint(1) DEFAULT NULL,
  `is_log` tinyint(1) DEFAULT NULL,
  `order_num` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `methods` (
  `method_id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL COMMENT '所属路由Id',
  `method_name` varchar(50) DEFAULT NULL COMMENT '方法名称',
  `method_path` varchar(50) DEFAULT NULL COMMENT '方法标识',
  PRIMARY KEY (`method_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `military_cost_record` (
  `uid` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `param1` varchar(255) NOT NULL DEFAULT '',
  `param2` varchar(255) NOT NULL DEFAULT '',
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_user` (`time`,`userId`,`type`) USING BTREE,
  KEY `index_type` (`userId`,`time`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mod_authorize` (
  `uid` varchar(255) NOT NULL,
  `authorize` int(11) DEFAULT 1,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mod_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fromUser` varchar(255) DEFAULT NULL,
  `toUser` varchar(255) DEFAULT NULL,
  `mailType` int(11) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `from_idx` (`fromUser`) USING BTREE,
  KEY `to_idx` (`toUser`) USING BTREE,
  KEY `time_Idx` (`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `modules` (
  `module_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(50) DEFAULT NULL,
  `module_flag` varchar(50) DEFAULT NULL,
  `app_id` varchar(32) NOT NULL DEFAULT '',
  `group_name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`module_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monitor_test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monster_everyday_refresh` (
  `monster_id` varchar(255) NOT NULL DEFAULT '' COMMENT '唯一ID，静态表的id',
  `monster_num` int(11) DEFAULT NULL COMMENT '每天可以刷新的数量',
  `refreshtime` bigint(20) DEFAULT NULL COMMENT '刷新的时间',
  PRIMARY KEY (`monster_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monster_siege` (
  `allianceId` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `monsterCastleId` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0,
  `currPhase` int(11) DEFAULT 0,
  `currRoundIndex` int(11) DEFAULT 0,
  `currRoundStartTime` bigint(20) DEFAULT 0,
  `currmemberUidListInfo` varchar(4000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `memberUidListInfo` varchar(4000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `allianceKillCount` bigint(20) DEFAULT 0,
  `currMonsterInfo` varchar(4000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `monsterCastleIds` varchar(400) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `monsterPerRoundNum` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monster_siege_top_history` (
  `allianceId` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `time` bigint(20) NOT NULL,
  `allianceAbbr` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `allianceName` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `rank` int(11) NOT NULL,
  `killCount` bigint(20) DEFAULT 0,
  `siegeRound` int(11) DEFAULT 0,
  `validMemberCount` int(11) DEFAULT 0,
  `allianceCount` int(11) DEFAULT 0,
  `activityAllianceCount` int(11) DEFAULT 0,
  `activity30AllianceCount` int(11) DEFAULT 0,
  `activity40AllianceCount` int(11) DEFAULT 0,
  `activity50AllianceCount` int(11) DEFAULT 0,
  `monsterPerRoundNum` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`allianceId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monthly_card` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(40) NOT NULL,
  `accept` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  `available` int(11) DEFAULT 0,
  `buyTime` bigint(20) DEFAULT 0,
  `optionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_city_log` (
  `pointId` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `uids` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`pointId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_city_time` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_0` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_1` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_10` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_11` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_2` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_3` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_4` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_5` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_6` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_7` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_8` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_server_record_2024_9` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(40) NOT NULL DEFAULT '',
  `name` varchar(40) DEFAULT NULL,
  `src` int(11) NOT NULL,
  `dst` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `move_total` (
  `uid` varchar(255) NOT NULL,
  `total` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `neutral_server_info` (
  `serverId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `stateId` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `ownerServerId` int(11) DEFAULT 0,
  `open` tinyint(4) DEFAULT 0,
  `resType` int(11) DEFAULT 0,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_exped_history` (
  `stageId` int(11) DEFAULT 0,
  `winServerId` int(11) DEFAULT 0,
  `loseServerId` int(11) DEFAULT 0,
  `users` varchar(1500) DEFAULT '',
  `createTime` bigint(20) DEFAULT 0,
  KEY `winServerId_index` (`winServerId`) USING BTREE,
  KEY `loseServerId_index` (`loseServerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_general` (
  `id` int(11) NOT NULL DEFAULT 0,
  `uid` varchar(96) NOT NULL DEFAULT '',
  `exp` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `quality` int(11) DEFAULT NULL,
  `talentpoint` int(11) DEFAULT NULL,
  `state` smallint(6) DEFAULT NULL,
  `predatoruid` varchar(96) DEFAULT NULL,
  `relivetime` bigint(20) DEFAULT NULL,
  `buildingUuid` varchar(96) DEFAULT NULL,
  `skillInfo` varchar(6000) DEFAULT NULL,
  `createtime` bigint(20) DEFAULT NULL,
  `talent` varchar(5000) DEFAULT NULL,
  `serverid` int(11) DEFAULT NULL,
  `robtime` bigint(20) DEFAULT NULL,
  `killtime` bigint(20) DEFAULT NULL,
  `gethomttime` bigint(20) DEFAULT NULL,
  `optime` varchar(200) DEFAULT NULL,
  `refineproperty` varchar(300) DEFAULT NULL,
  `oldrefineproperty` varchar(300) DEFAULT NULL,
  `refinegold` int(11) DEFAULT NULL,
  `refinecard` int(11) DEFAULT NULL,
  `refinecount` int(11) DEFAULT NULL,
  `lockproperty` varchar(60) DEFAULT NULL,
  `refreshproperty` varchar(300) DEFAULT NULL,
  `breach` varchar(128) DEFAULT NULL,
  `star` int(11) DEFAULT 1,
  `baseSkill` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`,`uid`) USING BTREE,
  KEY `predatoruid_index` (`predatoruid`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_general_buy` (
  `uid` varchar(255) NOT NULL,
  `generalId` int(11) NOT NULL,
  `countType1` int(11) NOT NULL DEFAULT 0,
  `countType2` int(11) NOT NULL DEFAULT 0,
  `countType3` int(11) NOT NULL DEFAULT 0,
  `countType4` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`generalId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_general_skill` (
  `uid` varchar(96) NOT NULL DEFAULT '',
  `newGeneralId` int(11) NOT NULL DEFAULT 0,
  `skillId` varchar(60) NOT NULL DEFAULT '',
  `startTime` bigint(20) DEFAULT NULL,
  `actTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`newGeneralId`,`skillId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_general_status` (
  `uid` varchar(96) NOT NULL DEFAULT '',
  `newGeneralId` int(11) NOT NULL DEFAULT 0,
  `stateId` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`newGeneralId`,`stateId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_sercum_recharge` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `id` varchar(255) NOT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_user_score` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `score` double NOT NULL,
  `takeReward` varchar(500) DEFAULT NULL,
  `rankingrewardstage` varchar(300) DEFAULT '',
  `kingdomrewardstage` varchar(300) DEFAULT '',
  `stage` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `uid_stage_index` (`uid`,`stage`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `notice_cost_log` (
  `uid` varchar(40) NOT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `itemId` varchar(20) NOT NULL,
  `cost` int(11) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`itemId`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `npc_trade` (
  `uid` varchar(40) NOT NULL,
  `trade` varchar(100) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  `num` int(11) DEFAULT 0,
  `superValue` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ob_record` (
  `uid` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `allianceIds` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `begin` bigint(20) NOT NULL DEFAULT 0,
  `serverId` int(11) NOT NULL DEFAULT 0,
  `areaId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`allianceIds`) USING BTREE,
  KEY `uid` (`uid`,`serverId`,`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ob_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `worldId` int(11) NOT NULL,
  `content` blob DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`worldId`) USING BTREE,
  KEY `createTime` (`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ob_user` (
  `uid` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `worldId` int(11) DEFAULT NULL,
  `param1` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `oldmailinsert` (
  `uid` varchar(40) NOT NULL,
  `type` int(2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `parse_info` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `audio` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_action` (
  `uid` varchar(40) NOT NULL,
  `exchangeId` varchar(20) NOT NULL,
  `pf` varchar(20) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`exchangeId`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_order_count` (
  `uid` varchar(40) NOT NULL,
  `className` varchar(40) NOT NULL,
  `action` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`className`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_order_count_log` (
  `uid` varchar(40) NOT NULL,
  `className` varchar(40) NOT NULL,
  `action` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_uid_class` (`uid`,`className`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_request` (
  `uid` varchar(40) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  `optionId` int(11) DEFAULT NULL,
  `purchaseId` varchar(10) DEFAULT '',
  `productId` varchar(10) DEFAULT '',
  `status` int(11) DEFAULT 0,
  `finishTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`pf`,`time`) USING BTREE,
  KEY `index_uid_pf_purchaseId` (`uid`,`pf`,`purchaseId`) USING BTREE,
  KEY `index_uid_pf_productId` (`uid`,`pf`,`productId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_total` (
  `uid` varchar(40) NOT NULL,
  `gold` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT 1,
  `getLv` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_total_log` (
  `uid` varchar(40) NOT NULL,
  `level` int(11) NOT NULL,
  `gold` bigint(20) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`,`level`,`createTime`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paycheck` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `apidata` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`orderId`,`pf`) USING BTREE,
  KEY `index_time_status` (`time`,`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paylog` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `productId` varchar(10) NOT NULL DEFAULT '0',
  `orderInfo` varchar(200) DEFAULT NULL,
  `orderParam` blob DEFAULT NULL,
  `comments` varchar(100) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `currency` int(11) DEFAULT 0,
  `spend` double(10,2) NOT NULL DEFAULT 0.00,
  `paid` double(10,2) DEFAULT 0.00,
  `status` int(11) DEFAULT 0,
  `payLevel` int(11) NOT NULL,
  `buildingLv` int(11) DEFAULT 0,
  `receiverId` varchar(40) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `ip` varchar(20) DEFAULT '',
  `curGaid` varchar(40) DEFAULT NULL,
  `truelyIp` varchar(20) DEFAULT NULL,
  `optionId` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '可选礼包',
  PRIMARY KEY (`uid`,`orderId`,`pf`) USING BTREE,
  KEY `index_time_pf` (`time`,`pf`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paylog_back` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(40) NOT NULL,
  `productId` varchar(10) NOT NULL DEFAULT '0',
  `time` bigint(20) DEFAULT NULL,
  `currency` int(11) DEFAULT 0,
  `spend` double(10,0) NOT NULL DEFAULT 0,
  `status` int(11) DEFAULT 0,
  `payLevel` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`orderId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `personal_data` (
  `uid` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pic_upload_record` (
  `uid` varchar(255) NOT NULL,
  `picVer` int(11) DEFAULT 0,
  `updateTime` bigint(20) DEFAULT 9223372036854775807,
  `report` int(11) DEFAULT 0,
  `banCount` int(11) DEFAULT 0,
  `banTime` bigint(20) DEFAULT 0,
  `stat` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `time_idx` (`updateTime`) USING BTREE,
  KEY `report_idx` (`report`) USING BTREE,
  KEY `stat_idx` (`stat`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `platform_first_login_reward` (
  `uid` varchar(50) NOT NULL,
  `hasReward` int(11) NOT NULL DEFAULT 0,
  `pf` varchar(40) DEFAULT NULL COMMENT '领取时的平台',
  `rewardTime` bigint(20) DEFAULT NULL COMMENT '领取时间',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `play_evolutions` (
  `id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `apply_script` mediumtext DEFAULT NULL,
  `revert_script` mediumtext DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `last_problem` mediumtext DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `player` (
  `id` varchar(8) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `player_percents_save` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `footEffect` float NOT NULL DEFAULT 0,
  `rideEffect` float NOT NULL DEFAULT 0,
  `bowEffect` float NOT NULL DEFAULT 0,
  `carEffect` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `playerinfo` (
  `uid` varchar(40) NOT NULL,
  `battlesWin` int(11) DEFAULT 0,
  `battlesLose` int(11) DEFAULT 0,
  `attacksWin` int(11) DEFAULT 0,
  `attacksLose` int(11) DEFAULT 0,
  `defensesWin` int(11) DEFAULT 0,
  `detectNum` int(11) DEFAULT 0,
  `armyKill` bigint(20) DEFAULT 0,
  `armyDead` int(11) DEFAULT 0,
  `armyCure` int(11) DEFAULT 0,
  `cityDestroyed` int(11) DEFAULT 0,
  `questPower` int(11) DEFAULT 0,
  `power` bigint(20) DEFAULT 0,
  `buildingPower` bigint(20) DEFAULT 0,
  `is_reward` varchar(255) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `power_index` (`power`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `point_minifort` (
  `pointId` int(11) NOT NULL,
  `fortPointId` int(11) NOT NULL,
  PRIMARY KEY (`pointId`,`fortPointId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `post_box` (
  `uid` varchar(40) NOT NULL,
  `from` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `publicValue` int(11) DEFAULT NULL,
  `contents` blob NOT NULL,
  `seal` varchar(40) DEFAULT '',
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_from` (`from`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `post_mail` (
  `uid` varchar(40) NOT NULL,
  `boxId` varchar(40) NOT NULL,
  `toUser` varchar(40) NOT NULL,
  `fromUser` varchar(40) DEFAULT NULL,
  `fromName` varchar(100) NOT NULL,
  `contents` blob NOT NULL,
  `seal` varchar(40) DEFAULT '',
  `createTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_toUserTime` (`toUser`,`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `post_relation` (
  `uid` varchar(40) NOT NULL,
  `publicValue` varchar(600) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  `players` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pray_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) NOT NULL,
  `cost` int(11) NOT NULL DEFAULT 0,
  `resource` varchar(20) NOT NULL,
  `num` int(11) NOT NULL,
  `hit` int(11) DEFAULT 0,
  `prayTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `resource_idx` (`resource`) USING BTREE,
  KEY `time_idx` (`prayTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44571 DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `princess_task` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL,
  `num` int(11) NOT NULL DEFAULT 0,
  `sub` varchar(255) NOT NULL,
  `state` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 1,
  `time` bigint(20) DEFAULT 0,
  `completeTime` bigint(20) DEFAULT 0,
  `pop` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `princess_task_record` (
  `uid` varchar(40) NOT NULL,
  `refreshNum` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT 0,
  `completeNum` int(11) DEFAULT 0,
  `completeTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `princess_task_stat` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `taskId` int(11) NOT NULL,
  `taskType` int(11) NOT NULL,
  `acceptTime` bigint(20) NOT NULL,
  `state` int(11) NOT NULL,
  `param1` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`state`,`taskType`) USING BTREE,
  KEY `index_param` (`state`,`param1`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `promotion_log` (
  `channel` varchar(100) NOT NULL,
  `statId` varchar(100) NOT NULL,
  `exchangeId` varchar(20) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `adId` varchar(100) DEFAULT '',
  `deviceType` int(11) DEFAULT 0,
  `showTime` bigint(20) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  `deviceid` varchar(255) DEFAULT NULL,
  `accountid` varchar(50) DEFAULT NULL,
  `campaignid` varchar(50) DEFAULT NULL,
  `adgroupid` varchar(50) DEFAULT NULL,
  `creativeid` varchar(50) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`channel`,`statId`,`exchangeId`,`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `protect_total` (
  `uid` varchar(255) NOT NULL,
  `total` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `push_log` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT 0,
  `message` varchar(100) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `push_record` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `type` varchar(10) DEFAULT '0',
  `msg` blob DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `question_match` (
  `id` varchar(40) NOT NULL,
  `result` varchar(40) DEFAULT NULL,
  `startBetTime` bigint(20) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `ended` int(11) DEFAULT NULL,
  `betNum` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `queue` (
  `uuid` varchar(40) NOT NULL,
  `ownerId` varchar(40) NOT NULL,
  `qid` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `itemId` varchar(255) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  `isHelped` int(11) DEFAULT NULL,
  `para` int(11) DEFAULT 0,
  `totalTime` bigint(20) DEFAULT 0,
  `exchgType` tinyint(4) DEFAULT 0 COMMENT '以物易物活动计数类型',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `ownerId_index_001` (`ownerId`) USING BTREE,
  KEY `updateTime_index` (`updateTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `receive_heart` (
  `uid` varchar(40) NOT NULL,
  `duration` int(11) NOT NULL,
  `effecttype` varchar(2) NOT NULL,
  `senduid` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `receive_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) NOT NULL COMMENT '用户唯一标识',
  `senduid` varchar(50) NOT NULL COMMENT '发送人用户唯一标识',
  `itemId` varchar(50) NOT NULL DEFAULT '0' COMMENT '物品ID',
  `itemNum` int(11) NOT NULL DEFAULT 0 COMMENT '物品数量',
  `createTime` bigint(20) DEFAULT NULL COMMENT '赠送的时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `red_packets` (
  `uid` varchar(255) NOT NULL,
  `range` int(11) DEFAULT 0,
  `rangeId` varchar(255) DEFAULT '',
  `type` int(11) DEFAULT 0,
  `sender` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `senderName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `pic` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `picVer` int(11) DEFAULT 0,
  `total` int(11) DEFAULT 0,
  `remain` int(11) DEFAULT 0,
  `sendTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `totalPeople` int(11) DEFAULT 0,
  `curPeople` int(11) DEFAULT 0,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `state_index` (`state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `red_packets_records` (
  `uid` varchar(255) NOT NULL,
  `player` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `pic` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `picVer` int(11) DEFAULT 0,
  `value` int(11) DEFAULT 0,
  `getTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`player`) USING BTREE,
  KEY `index_player` (`player`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `redis_cfg_backup` (
  `keyFlag` varchar(128) NOT NULL COMMENT 'key',
  `info` varchar(2048) DEFAULT '0' COMMENT '内容',
  PRIMARY KEY (`keyFlag`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `refund_log` (
  `refundId` varchar(255) NOT NULL,
  `order` int(11) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `itemId` varchar(16) NOT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`refundId`,`order`) USING BTREE,
  KEY `index_time` (`time`,`userId`,`type`,`itemId`) USING BTREE,
  KEY `index_user` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `report` (
  `uid` varchar(40) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `report` mediumblob NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_time` (`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `res_area_count` (
  `areaId` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `rescue_skill_record` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `marchUuid` varchar(255) DEFAULT NULL,
  `targetUid` varchar(255) DEFAULT NULL,
  `marchType` int(11) DEFAULT NULL,
  `targetType` int(11) DEFAULT NULL,
  `attackTime` bigint(20) DEFAULT NULL,
  `returnTime` bigint(20) DEFAULT 0,
  `activate` int(11) DEFAULT 0,
  `saved` int(11) DEFAULT 0,
  `attack` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `tuid_idx` (`targetUid`) USING BTREE,
  KEY `att_time_idx` (`attackTime`) USING BTREE,
  KEY `return_time_idx` (`returnTime`) USING BTREE,
  KEY `muid_idx` (`marchUuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_107` (
  `uid` varchar(255) NOT NULL,
  `version` varchar(255) NOT NULL,
  `sid` int(11) DEFAULT 0,
  `107uid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rewardLevel` int(11) DEFAULT 0,
  `rewardStatus` int(11) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`version`) USING BTREE,
  KEY `time_idx` (`endTime`) USING BTREE,
  KEY `stat_idx` (`rewardStatus`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_item_control` (
  `uid` varchar(255) NOT NULL,
  `itemId` varchar(255) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_0` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_1` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_2` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_3` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_4` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_5` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_6` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_7` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_8` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `reward_log_9` (
  `uid` varchar(255) NOT NULL,
  `rewardid` varchar(255) NOT NULL,
  `nownum` int(11) DEFAULT 0,
  `totalnum` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`rewardid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `rob_general` (
  `uid` varchar(96) DEFAULT NULL,
  `serverid` int(11) DEFAULT NULL,
  `allianceid` varchar(96) DEFAULT NULL,
  `alliancename` varchar(255) DEFAULT NULL,
  `owneruid` varchar(96) NOT NULL DEFAULT '',
  `ownername` varchar(255) DEFAULT NULL,
  `generalid` int(11) NOT NULL DEFAULT 0,
  `robtime` bigint(20) DEFAULT NULL,
  `freetime` bigint(20) DEFAULT NULL,
  `optime` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`owneruid`,`generalid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `role_permission` (
  `role_id` int(11) NOT NULL,
  `module_permission` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `route_permission` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `method_permission` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`role_id`,`module_permission`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) DEFAULT NULL,
  `role_flag` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) DEFAULT NULL,
  `route_name` varchar(50) DEFAULT NULL,
  `route_path` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `log_tag` tinyint(1) DEFAULT 0 COMMENT '0:不记录日志；1:记录日志',
  `prt_id` int(11) DEFAULT NULL,
  `order_num` varchar(12) DEFAULT NULL,
  `pinyin` varchar(100) DEFAULT NULL,
  `isProd` tinyint(1) DEFAULT 1 COMMENT '0:不在线上系统显示该菜单;1:在线上系统显示该菜单；',
  `type` varchar(6) DEFAULT 'other' COMMENT '路径类型：menu|button|other',
  PRIMARY KEY (`route_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `saga_tower_science` (
  `uid` varchar(32) NOT NULL,
  `itemid` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `cdtime` bigint(20) DEFAULT NULL,
  `reserve` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`itemid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='贤者之塔科技表';
--> statement-breakpoint
CREATE TABLE `sampleuser` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `regTime` bigint(20) NOT NULL,
  `tag` int(11) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `tag_index` (`tag`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `score_act` (
  `uid` varchar(255) NOT NULL,
  `actId` varchar(40) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `finishFlag` int(11) DEFAULT 0,
  `rewardFlag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`,`actId`) USING BTREE,
  KEY `actId_idx` (`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `score_act_in` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) NOT NULL,
  `actId` varchar(255) NOT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`allianceId`,`actId`) USING BTREE,
  KEY `actId` (`actId`) USING BTREE,
  KEY `al_idx` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `score_act_record` (
  `uid` varchar(255) NOT NULL,
  `actId` varchar(40) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `finishFlag` int(11) DEFAULT 0,
  `rewardFlag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`,`actId`) USING BTREE,
  KEY `actid_idx` (`actId`) USING BTREE,
  KEY `rw_idx` (`rewardFlag`) USING BTREE,
  KEY `lv_idx` (`level`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_activity` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `id` int(11) NOT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `rewad` int(11) DEFAULT 0,
  `events` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_announce` (
  `serverId` varchar(255) NOT NULL,
  `randomGeneral` blob DEFAULT NULL,
  `lastMoniterPushTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_config` (
  `uid` varchar(255) NOT NULL,
  `stat` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_history_top_score` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT 0,
  `score` double DEFAULT 0,
  `rank` int(11) DEFAULT 0,
  `name` varchar(40) DEFAULT NULL,
  `allianceAbbr` varchar(40) DEFAULT NULL,
  `allianceIcon` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_info` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `activityTime` bigint(20) DEFAULT NULL,
  `activationTime` bigint(20) DEFAULT 0,
  `kaifu` bigint(20) DEFAULT 0,
  `yangfu` bigint(20) DEFAULT 0,
  `daoliangStart` bigint(20) DEFAULT 0,
  `daoliangEnd` bigint(20) DEFAULT 0,
  `shuaguaiActStart` bigint(20) DEFAULT 0,
  `lastMergeMillis` bigint(20) DEFAULT 0,
  `thronePic` varchar(40) DEFAULT NULL,
  `payTotalTime` bigint(20) DEFAULT 0,
  `crossFightServerId` int(11) DEFAULT NULL,
  `worldCount` int(11) DEFAULT 1,
  `mergeTiredRushBeginTime` bigint(20) NOT NULL DEFAULT 0,
  `resGoldAddEndTime` bigint(20) DEFAULT 0,
  `lastClearMilitaryMailSendTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_info_copy` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `activityTime` bigint(20) DEFAULT NULL,
  `activationTime` bigint(20) DEFAULT 0,
  `kaifu` bigint(20) DEFAULT 0,
  `yangfu` bigint(20) DEFAULT 0,
  `daoliangStart` bigint(20) DEFAULT 0,
  `daoliangEnd` bigint(20) DEFAULT 0,
  `shuaguaiActStart` bigint(20) DEFAULT 0,
  `lastMergeMillis` bigint(20) DEFAULT 0,
  `thronePic` varchar(40) DEFAULT NULL,
  `payTotalTime` bigint(20) DEFAULT 0,
  `crossFightServerId` int(11) DEFAULT NULL,
  `worldCount` int(11) DEFAULT 1,
  `mergeTiredRushBeginTime` bigint(20) NOT NULL DEFAULT 0,
  `resGoldAddEndTime` bigint(20) DEFAULT 0,
  `lastClearMilitaryMailSendTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_mail_record` (
  `uid` varchar(40) NOT NULL,
  `record` varchar(40) NOT NULL,
  `state` int(11) DEFAULT 0,
  KEY `index_uid` (`uid`,`record`,`state`) USING BTREE,
  KEY `index_record` (`record`,`state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_merge_task` (
  `id` varchar(40) NOT NULL,
  `src_server` varchar(255) NOT NULL DEFAULT '',
  `dst_server` varchar(255) NOT NULL DEFAULT '',
  `merge_reason` text NOT NULL,
  `apply_time` bigint(20) NOT NULL DEFAULT 0,
  `merge_time` bigint(20) NOT NULL DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '0 待审核 1 匹配 2 超时 3 不同意 4 等待合服 5 合服完成',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_push` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) DEFAULT 0,
  `mailType` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `regStartTime` bigint(20) DEFAULT NULL,
  `regEndTime` bigint(20) DEFAULT NULL,
  `lastOnlineTimeBegin` bigint(20) DEFAULT NULL,
  `lastOnlineTime` bigint(20) DEFAULT NULL,
  `levelMin` int(11) DEFAULT NULL,
  `levelMax` int(11) DEFAULT NULL,
  `title` blob DEFAULT NULL,
  `contents` mediumblob DEFAULT NULL,
  `reward` blob DEFAULT NULL,
  `updateVersion` varchar(40) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `parse` int(11) DEFAULT NULL,
  `notification` blob DEFAULT NULL,
  `reply` int(11) DEFAULT NULL,
  `likeStatus` int(11) DEFAULT NULL,
  `confirm` int(11) DEFAULT 0,
  `platform` varchar(40) DEFAULT NULL,
  `itemIdFlag` int(11) DEFAULT 0,
  `activityId` varchar(64) DEFAULT NULL,
  `countries` varchar(256) DEFAULT NULL,
  `deviceLimit` int(11) DEFAULT NULL,
  `CDKeySeries` int(11) DEFAULT NULL,
  `bind` int(11) DEFAULT 0,
  `bLvMin` int(11) DEFAULT 0,
  `bLvMax` int(11) DEFAULT 0,
  `HDflag` int(11) DEFAULT 0,
  `mbLevel` int(11) DEFAULT 0,
  `setReceiveTime` int(11) DEFAULT 0,
  `tag` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_startTime` (`startTime`) USING BTREE,
  KEY `index_stateType` (`state`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_push_20141106` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) DEFAULT 0,
  `mailType` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `regStartTime` bigint(20) DEFAULT NULL,
  `regEndTime` bigint(20) DEFAULT NULL,
  `lastOnlineTime` bigint(20) DEFAULT NULL,
  `levelMin` int(11) DEFAULT NULL,
  `levelMax` int(11) DEFAULT NULL,
  `title` blob DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `reward` blob DEFAULT NULL,
  `updateVersion` varchar(40) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `parse` int(11) DEFAULT NULL,
  `notification` varchar(128) DEFAULT NULL,
  `reply` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_startTime` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_push_config` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_startTime` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_score` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `id` int(11) NOT NULL,
  `activity` varchar(40) DEFAULT NULL,
  `readyTime` bigint(20) DEFAULT NULL,
  `beginTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `rewad` int(11) DEFAULT 0,
  `round` int(11) DEFAULT 1,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_top_score` (
  `uid` varchar(40) NOT NULL,
  `actId` varchar(40) NOT NULL,
  `round` int(11) DEFAULT 0,
  `score` int(11) DEFAULT 0,
  `rank` int(11) DEFAULT 0,
  `name` varchar(40) DEFAULT NULL,
  `allianceAbbr` varchar(40) DEFAULT NULL,
  `allianceIcon` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uid`,`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_transfer` (
  `uid` varchar(255) NOT NULL,
  `cdTime` bigint(20) DEFAULT NULL,
  `transferTime` bigint(20) DEFAULT NULL,
  `times` int(11) DEFAULT NULL,
  `beforeServers` varchar(255) DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_update` (
  `uid` varchar(255) NOT NULL,
  `idx` int(11) NOT NULL,
  `content` blob DEFAULT NULL,
  `chineseContent` blob DEFAULT NULL,
  `endTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`idx`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_update_suggestion` (
  `uid` varchar(255) NOT NULL,
  `updateId` varchar(255) NOT NULL,
  `idx` int(11) NOT NULL,
  `suggestion` blob DEFAULT NULL,
  `real_uid` varchar(255) DEFAULT NULL,
  `server` int(11) DEFAULT NULL,
  `real_name` varchar(255) DEFAULT NULL,
  `reward_status` int(11) DEFAULT 0,
  `createTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`updateId`,`idx`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_usermail` (
  `uid` varchar(40) NOT NULL,
  `toUser` varchar(40) NOT NULL,
  `sendBy` varchar(40) NOT NULL,
  `sendTime` bigint(20) NOT NULL,
  `title` varchar(40) DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `reward` blob DEFAULT NULL,
  `rewardStatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_sendTime` (`sendTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `shopping_mall` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `id` varchar(40) NOT NULL,
  `buyDaily` int(11) DEFAULT 0,
  `buyTime` bigint(20) DEFAULT 0,
  `buyTotal` int(11) DEFAULT 0,
  `flushTotalTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `sign_in` (
  `uid` varchar(255) NOT NULL,
  `day` int(11) DEFAULT 0,
  `signInTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `sign_in_feed` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `feed` varchar(40) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`type`,`feed`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `soccer_match` (
  `id` varchar(255) NOT NULL,
  `vs` varchar(100) DEFAULT NULL,
  `idx` int(11) DEFAULT NULL,
  `winner` varchar(100) DEFAULT NULL,
  `startBetTime` bigint(20) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `ended` int(11) DEFAULT NULL,
  `betNumA` bigint(20) DEFAULT NULL,
  `betNumB` bigint(20) DEFAULT NULL,
  `oddsA` float(20,2) DEFAULT NULL,
  `oddsB` float(20,2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_sbt` (`startBetTime`) USING BTREE,
  KEY `idx_st` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_adjust` (
  `uid` varchar(40) NOT NULL,
  `device` varchar(10) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `channel` varchar(50) DEFAULT NULL,
  `campain` varchar(100) DEFAULT NULL,
  `fulldata` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_query` (`device`,`country`,`channel`,`campain`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_af` (
  `uid` varchar(40) NOT NULL,
  `afuid` varchar(200) DEFAULT NULL,
  `device` varchar(10) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `channel` varchar(50) DEFAULT NULL,
  `campain` varchar(100) DEFAULT NULL,
  `fulldata` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_af` (`afuid`) USING BTREE,
  KEY `index_query` (`device`,`country`,`channel`,`campain`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_date` (
  `date` date NOT NULL,
  `dau` int(11) NOT NULL DEFAULT 0,
  `pay` double(12,2) NOT NULL DEFAULT 0.00,
  `reg` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_0` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_1` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_10` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_11` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_2` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_3` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_4` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_5` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_6` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_7` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_8` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2024_9` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login2` (
  `uid` varchar(40) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_phone` (
  `uid` varchar(255) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_phone_log` (
  `uid` varchar(40) NOT NULL,
  `phoneDevice` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `version` varchar(255) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `count` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`phoneDevice`,`model`,`version`,`width`,`height`) USING BTREE,
  KEY `idx` (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_reg` (
  `uid` varchar(40) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `time` bigint(20) NOT NULL,
  `pf` varchar(20) DEFAULT NULL,
  `pfId` varchar(200) DEFAULT NULL,
  `referrer` blob DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `ip` varchar(20) DEFAULT NULL,
  `ipcountry` varchar(10) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE,
  KEY `index_time_pf_country` (`time`,`pf`,`country`) USING BTREE,
  KEY `country_index` (`country`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_tutorial` (
  `uid` varchar(40) NOT NULL,
  `tutorial` bigint(20) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`tutorial`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_tutorial` (`tutorial`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_tutorial_analyze` (
  `uid` varchar(40) NOT NULL,
  `tutorial` bigint(20) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`tutorial`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_tutorial` (`tutorial`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_tutorial_v2` (
  `uid` varchar(40) NOT NULL,
  `tutorial` bigint(20) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  `appVersion` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`uid`,`tutorial`) USING BTREE,
  KEY `index_time` (`time`,`appVersion`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `subscription_log` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `orderId` varchar(200) NOT NULL DEFAULT '',
  `itemId` varchar(10) DEFAULT NULL,
  `originalOrderId` varchar(200) DEFAULT NULL,
  `beginTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `nextCheckTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`orderId`) USING BTREE,
  KEY `index_uid_itemId` (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `suggest_log` (
  `uuid` varchar(50) NOT NULL,
  `user` varchar(200) NOT NULL,
  `timeStamp` bigint(20) NOT NULL,
  `description` blob DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index` (`user`,`timeStamp`) USING BTREE,
  KEY `index_2` (`user`) USING BTREE,
  KEY `index_3` (`param1`,`param2`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `suggestion` (
  `uid` varchar(40) NOT NULL,
  `ownerId` varchar(40) NOT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `contents` blob NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `replyContent` blob DEFAULT NULL,
  `replyTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `ownerId` (`ownerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `suit_create_rate` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(40) NOT NULL,
  `rate` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `suit_decompose_effect` (
  `item1` varchar(100) DEFAULT NULL,
  `item2` varchar(100) DEFAULT '0',
  `item3` varchar(100) DEFAULT '0',
  `item4` varchar(100) DEFAULT '0',
  `item5` varchar(100) DEFAULT '0',
  `item6` varchar(100) DEFAULT '0',
  `owner` varchar(100) NOT NULL DEFAULT '0',
  `suitid` varchar(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (`owner`,`suitid`) USING BTREE,
  KEY `owner_suit` (`owner`,`suitid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `sumsungactivity` (
  `uid` varchar(70) NOT NULL COMMENT '玩家id',
  `deviceID` varchar(100) NOT NULL COMMENT '设备id',
  `time` bigint(20) DEFAULT NULL COMMENT '领取时间',
  PRIMARY KEY (`uid`,`deviceID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `super_army_log` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `castleLevel` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `createTime_index` (`createTime`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `switches` (
  `name` varchar(255) NOT NULL,
  `stat` int(11) DEFAULT 0,
  `appVersion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `system_data` (
  `uid` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `t_hero` (
  `id` char(36) NOT NULL,
  `uid` varchar(32) DEFAULT NULL,
  `heroid` int(11) DEFAULT NULL,
  `level` smallint(6) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `events` text DEFAULT NULL,
  `createtime` bigint(20) DEFAULT NULL,
  `state` tinyint(4) DEFAULT NULL,
  `skinID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '英雄皮肤',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `Index_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='英雄表';
--> statement-breakpoint
CREATE TABLE `t_worldboss` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bossid` int(11) DEFAULT NULL,
  `level` smallint(6) DEFAULT NULL,
  `type` tinyint(4) DEFAULT 0,
  `maxhp` int(11) DEFAULT NULL,
  `hp` int(11) DEFAULT NULL,
  `starttime` bigint(20) DEFAULT NULL,
  `endtime` bigint(20) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `lefttimes` smallint(6) DEFAULT NULL,
  `attackers` int(11) DEFAULT NULL,
  `attacktimes` int(11) DEFAULT NULL,
  `attackpower` int(11) DEFAULT NULL,
  `items` int(11) DEFAULT NULL,
  `killuser` varchar(32) DEFAULT NULL,
  `reward` tinyint(4) DEFAULT NULL,
  `firerange` int(11) DEFAULT NULL,
  `firespeed` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8456 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='世界BOSS表';
--> statement-breakpoint
CREATE TABLE `t_worldbossinfo` (
  `id` char(36) NOT NULL,
  `bossid` int(11) DEFAULT NULL,
  `level` smallint(6) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `weeklyresettime` bigint(20) DEFAULT NULL,
  `weeklytimes` smallint(6) DEFAULT NULL,
  `dailyresettime` bigint(20) DEFAULT NULL,
  `dailytimes` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC COMMENT='世界BOSS全局表';
--> statement-breakpoint
CREATE TABLE `t_worldbossrank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bossid` int(11) DEFAULT NULL,
  `bosstid` int(11) DEFAULT NULL,
  `uid` varchar(32) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `reward` tinyint(4) DEFAULT NULL,
  `lastscore` int(11) DEFAULT NULL,
  `lasttime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `Index_bossid` (`bossid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1131 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='世界BOSS排行榜表';
--> statement-breakpoint
CREATE TABLE `tavern` (
  `uid` varchar(40) NOT NULL,
  `free` int(11) NOT NULL,
  `firstFree` int(11) NOT NULL,
  `firstPay` int(11) NOT NULL,
  `freeTimes` int(11) NOT NULL,
  `payTimes` int(11) NOT NULL,
  `generals` varchar(255) DEFAULT NULL,
  `generalId1` varchar(40) DEFAULT NULL,
  `generalId2` varchar(40) DEFAULT NULL,
  `generalId3` varchar(40) DEFAULT NULL,
  `generalId4` varchar(40) DEFAULT NULL,
  `generalId5` varchar(40) DEFAULT NULL,
  `generalId6` varchar(40) DEFAULT NULL,
  `recruit1` int(11) NOT NULL,
  `recruit2` int(11) NOT NULL,
  `recruit3` int(11) NOT NULL,
  `recruit4` int(11) NOT NULL,
  `recruit5` int(11) NOT NULL,
  `recruit6` int(11) NOT NULL,
  `addFreeTime` bigint(20) NOT NULL,
  `resetResult` int(11) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `team_atk_time` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `territory_trap_log` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `allianceid` varchar(40) NOT NULL,
  `logid` int(11) NOT NULL,
  `param` varchar(100) NOT NULL,
  `createtime` bigint(20) DEFAULT 0,
  `paramname` varchar(60) DEFAULT '',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `allianceid_index` (`allianceid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `territory_user_effect` (
  `uid` varchar(255) NOT NULL,
  `pointId` int(11) NOT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `stat` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`pointId`) USING BTREE,
  KEY `alliance_idx` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `time_notice` (
  `timeType` int(11) NOT NULL COMMENT '需要记录的时间的时间类型',
  `timeVal` bigint(20) DEFAULT NULL COMMENT '时间值(比如,上次鲜花榜刷新的时间)',
  PRIMARY KEY (`timeType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `time_reward` (
  `uid` varchar(255) NOT NULL,
  `itemId` varchar(255) DEFAULT NULL,
  `rewardId` varchar(255) DEFAULT NULL,
  `lastRewardTime` bigint(20) DEFAULT NULL,
  `nextRewardTime` bigint(20) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `train` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(20) NOT NULL,
  `genUid` varchar(40) DEFAULT NULL,
  `finishTrain` bigint(20) NOT NULL,
  `endTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `translation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` blob DEFAULT NULL COMMENT '发言内容',
  `en` blob DEFAULT NULL,
  `originalLang` varchar(255) DEFAULT 'cn',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_content` (`content`(50)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `translation_record` (
  `date` varchar(255) NOT NULL,
  `month` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `words` int(11) DEFAULT NULL,
  `countryCharacters` int(11) DEFAULT 0,
  `allianceCharacters` int(11) DEFAULT 0,
  `en` int(11) DEFAULT 0,
  `zh-Hans` int(11) DEFAULT 0,
  `zh-Hant` int(11) DEFAULT 0,
  `ja` int(11) DEFAULT 0,
  `ko` int(11) DEFAULT 0,
  `ru` int(11) DEFAULT 0,
  `es` int(11) DEFAULT 0,
  `ms` int(11) DEFAULT 0,
  `fr` int(11) DEFAULT 0,
  `de` int(11) DEFAULT 0,
  `it` int(11) DEFAULT 0,
  `pt` int(11) DEFAULT 0,
  `other` int(11) DEFAULT 0,
  `fromDB` int(11) DEFAULT 0,
  `fromMS` int(11) DEFAULT 0,
  PRIMARY KEY (`date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `translationv2` (
  `id` varchar(255) NOT NULL,
  `en` blob DEFAULT NULL,
  `zh-Hans` blob DEFAULT NULL,
  `zh-Hant` blob DEFAULT NULL,
  `ja` blob DEFAULT NULL,
  `ko` blob DEFAULT NULL,
  `ru` blob DEFAULT NULL,
  `es` blob DEFAULT NULL,
  `ms` blob DEFAULT NULL,
  `fr` blob DEFAULT NULL,
  `de` blob DEFAULT NULL,
  `it` blob DEFAULT NULL,
  `pt` blob DEFAULT NULL,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_en` (`en`(50)) USING BTREE,
  KEY `index_zh-Hans` (`zh-Hans`(20)) USING BTREE,
  KEY `index_zh-Hant` (`zh-Hant`(20)) USING BTREE,
  KEY `index_ja` (`ja`(20)) USING BTREE,
  KEY `index_ko` (`ko`(20)) USING BTREE,
  KEY `index_ru` (`ru`(20)) USING BTREE,
  KEY `index_es` (`es`(20)) USING BTREE,
  KEY `index_ms` (`ms`(20)) USING BTREE,
  KEY `index_fr` (`fr`(20)) USING BTREE,
  KEY `index_de` (`de`(20)) USING BTREE,
  KEY `index_it` (`it`(20)) USING BTREE,
  KEY `index_pt` (`pt`(20)) USING BTREE,
  KEY `index_count` (`count`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `treasure_map` (
  `uuid` varchar(40) NOT NULL,
  `treasureId` varchar(40) DEFAULT NULL,
  `currentOwner` varchar(40) DEFAULT NULL,
  `originalOwner` varchar(40) DEFAULT NULL,
  `targetId` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `colour` int(11) DEFAULT NULL,
  `marchId` varchar(40) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `finishTime` bigint(20) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_o_m` (`currentOwner`,`marchId`) USING BTREE,
  KEY `index_o_t` (`currentOwner`,`targetId`) USING BTREE,
  KEY `index_o_s_c` (`currentOwner`,`state`,`colour`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `tree_award` (
  `uid` varchar(255) NOT NULL,
  `freeCount` int(11) NOT NULL,
  `awardCount` int(11) NOT NULL,
  `lastFreeTime` bigint(20) NOT NULL,
  `lastAwardTime` bigint(20) NOT NULL,
  `awardMaxCount` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `trial_field` (
  `uid` varchar(50) NOT NULL,
  `freeTrial` int(11) DEFAULT 0,
  `freeFresh` bigint(20) DEFAULT 0,
  `freeAtk` int(11) DEFAULT 0,
  `monster` varchar(50) DEFAULT '',
  `blood` int(11) DEFAULT 0,
  `screen` varchar(255) DEFAULT '',
  `buyTrial` int(11) DEFAULT 0,
  `buyAtk` int(11) DEFAULT 0,
  `chargeAtkTimes` int(11) DEFAULT 0,
  `rewardMonster` varchar(50) DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `trigger_timmer` (
  `timmer_name` varchar(200) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `last_exec_millis` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`timmer_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `trigger_var` (
  `type` int(11) NOT NULL,
  `uid` varchar(50) NOT NULL DEFAULT '''''',
  `key` varchar(200) NOT NULL,
  `value` text NOT NULL,
  `refreshtime` bigint(20) NOT NULL DEFAULT 0,
  `createTime` timestamp NOT NULL DEFAULT current_timestamp(),
  `lastUpdateTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`type`,`uid`,`key`) USING BTREE,
  KEY `type_key` (`type`,`key`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE,
  KEY `createTime` (`createTime`) USING BTREE,
  KEY `lastUpdateTime` (`lastUpdateTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='触发器变量表';
--> statement-breakpoint
CREATE TABLE `trouble_log` (
  `uid` bigint(20) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `usetime` bigint(20) DEFAULT NULL,
  `statusid` varchar(255) DEFAULT NULL,
  KEY `trouble_log_uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `turret_shooting_task` (
  `uid` varchar(255) NOT NULL,
  `turretUid` varchar(255) DEFAULT NULL,
  `marchUuid` varchar(255) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `uuid_idx` (`marchUuid`) USING BTREE,
  KEY `startTime_idx` (`startTime`) USING BTREE,
  KEY `endTime_idx` (`endTime`) USING BTREE,
  KEY `uid_idx` (`turretUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `age` bigint(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_14day_login` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `day` int(11) DEFAULT 0,
  `lastRewardTime` bigint(20) DEFAULT 0,
  `vipRewardTime` bigint(20) DEFAULT 0,
  `reward` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE,
  KEY `day_index` (`day`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_achievement` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL,
  `num` bigint(20) NOT NULL DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0,
  `completeTime` bigint(20) DEFAULT 0,
  `rewardTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_activation` (
  `uid` varchar(40) NOT NULL,
  `data` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_activity` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `actId` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_activity_new` (
  `uid` varchar(40) NOT NULL,
  `actId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `rewards` varchar(1000) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  `reserve_1` int(11) NOT NULL,
  `reserve_2` varchar(1000) NOT NULL,
  `flushTimes` int(11) DEFAULT 0,
  `flushDate` bigint(20) DEFAULT 0,
  `receiveLevels` varchar(40) DEFAULT '',
  PRIMARY KEY (`uid`,`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_alliance_task` (
  `uid` varchar(255) NOT NULL,
  `id` varchar(255) NOT NULL,
  `itemId` varchar(255) DEFAULT NULL,
  `num` bigint(20) DEFAULT 0,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE,
  KEY `id_idx` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_arena` (
  `uid` varchar(255) DEFAULT NULL,
  `rankScore` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `fightServerId` int(11) DEFAULT NULL,
  `worldId` int(11) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `totalWinCount` int(11) DEFAULT NULL,
  `totalLoseCount` int(11) DEFAULT NULL,
  `serialWinCount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_army` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `free` int(11) NOT NULL DEFAULT 0,
  `pve` int(11) NOT NULL DEFAULT 0,
  `march` int(11) NOT NULL DEFAULT 0,
  `defence` int(11) NOT NULL DEFAULT 0,
  `train` int(11) NOT NULL DEFAULT 0,
  `foodCostTime` bigint(20) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_army_back` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `free` int(11) NOT NULL DEFAULT 0,
  `pve` int(11) NOT NULL DEFAULT 0,
  `march` int(11) NOT NULL DEFAULT 0,
  `defence` int(11) NOT NULL DEFAULT 0,
  `train` int(11) NOT NULL DEFAULT 0,
  `foodCostTime` bigint(20) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_army_bak` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `free` int(11) NOT NULL DEFAULT 0,
  `pve` int(11) NOT NULL DEFAULT 0,
  `march` int(11) NOT NULL DEFAULT 0,
  `defence` int(11) NOT NULL DEFAULT 0,
  `train` int(11) NOT NULL DEFAULT 0,
  `foodCostTime` bigint(20) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_army_change` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `free` int(11) NOT NULL DEFAULT 0,
  `pve` int(11) NOT NULL DEFAULT 0,
  `march` int(11) NOT NULL DEFAULT 0,
  `defence` int(11) NOT NULL DEFAULT 0,
  `train` int(11) NOT NULL DEFAULT 0,
  `foodCostTime` bigint(20) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_army_cross` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `free` int(11) NOT NULL DEFAULT 0,
  `pve` int(11) NOT NULL DEFAULT 0,
  `march` int(11) NOT NULL DEFAULT 0,
  `defence` int(11) NOT NULL DEFAULT 0,
  `train` int(11) NOT NULL DEFAULT 0,
  `foodCostTime` bigint(20) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_assets` (
  `uid` varchar(255) NOT NULL,
  `winPoint` bigint(20) NOT NULL DEFAULT 0,
  `lastUpdateTime` bigint(20) DEFAULT 0,
  `lastprottectTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_auction` (
  `uid` varchar(255) NOT NULL,
  `gold` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_auction_goods` (
  `uid` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `gold` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`uuid`) USING BTREE,
  KEY `key_user_auction_goods_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_auction_history` (
  `uid` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `itemNum` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`uuid`) USING BTREE,
  UNIQUE KEY `unique_user_auction_history_uuid` (`uuid`) USING BTREE,
  KEY `key_user_auction_history_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_auth` (
  `uid` varchar(40) NOT NULL,
  `female` int(11) DEFAULT NULL,
  `sealId` varchar(40) DEFAULT '',
  `seal` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance` (
  `uid` varchar(50) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '当前本金',
  `income` bigint(20) NOT NULL DEFAULT 0 COMMENT '总利息',
  `usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '可用利息',
  `last_income_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后结算利息时间 毫秒',
  `last_effect_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后播放特效时间',
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_0` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_1` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_2` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_3` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_4` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_5` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_6` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_7` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_8` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_balance_history_9` (
  `uuid` varchar(50) NOT NULL COMMENT '唯一id',
  `uid` varchar(50) NOT NULL,
  `bank_type` int(11) NOT NULL DEFAULT 0 COMMENT '余额类型 0为金币',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '操作类型 0存、1取、2利息结算',
  `num` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作数量',
  `original_num` bigint(20) NOT NULL DEFAULT 0 COMMENT '原始数量',
  `curr_sum` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完后的总金额',
  `curr_charge0` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的未生效金额',
  `curr_usable_income` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作完成后的可用利息',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间 毫秒',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '标记 存款时用到(type = 0, state = 0 为未生效存款, 不计算利息; type = 0, state = 1 为有效存款, 计算利息; )',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_bank_type` (`uid`,`bank_type`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_bank` (
  `uid` varchar(40) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `deposit` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_bet` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `matchId` varchar(255) DEFAULT NULL,
  `vs` varchar(100) DEFAULT NULL,
  `resourceType` int(11) DEFAULT NULL,
  `betNum` int(11) DEFAULT NULL,
  `betSide` varchar(50) DEFAULT NULL,
  `winner` varchar(50) DEFAULT NULL,
  `ended` int(11) DEFAULT 0,
  `rewarded` int(11) DEFAULT 0,
  `odds` float(10,2) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `idx_uid` (`uid`) USING BTREE,
  KEY `idx_mid` (`matchId`) USING BTREE,
  KEY `idx_e` (`ended`) USING BTREE,
  KEY `idx_r` (`rewarded`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_bottle_info` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `throwRemainCount` int(11) NOT NULL DEFAULT 0,
  `pickRemainCount` int(11) NOT NULL DEFAULT 0,
  `myBottleNum` int(11) NOT NULL DEFAULT 0,
  `lastClearTime` bigint(20) NOT NULL DEFAULT 0,
  `pickBottlesUidsByteArray` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_branch_city_info` (
  `uid` varchar(32) NOT NULL,
  `openstate` smallint(6) NOT NULL,
  `takerewardcount` int(11) NOT NULL,
  `takerewardtime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_branch_city_reward` (
  `id` int(11) NOT NULL DEFAULT 0,
  `uid` varchar(32) NOT NULL DEFAULT '',
  `configid` int(11) NOT NULL,
  `dieawaytime` bigint(20) DEFAULT NULL,
  `rewardrefreashtime` bigint(20) DEFAULT NULL,
  KEY `uid_id_index` (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_building` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `itemId` int(11) NOT NULL,
  `pos` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `opType` int(11) DEFAULT 0,
  `putId` varchar(100) DEFAULT NULL,
  `reward` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT 0,
  `effectTime` bigint(20) DEFAULT 0,
  `star` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT 0,
  `unlockFlag` int(11) NOT NULL DEFAULT 0,
  `costUnlockTimes` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `ub_uid_index` (`uid`,`itemId`) USING BTREE,
  KEY `item_index` (`itemId`) USING BTREE,
  KEY `itemId_level_index` (`itemId`,`level`) USING BTREE,
  KEY `itemId_star_index` (`itemId`,`star`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_building_bak` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `itemId` int(11) NOT NULL,
  `pos` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `opType` int(11) DEFAULT 0,
  `putId` varchar(100) DEFAULT NULL,
  `reward` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT 0,
  `effectTime` bigint(20) DEFAULT 0,
  `star` int(11) DEFAULT 0,
  `progress` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `ub_uid_index` (`uid`,`itemId`) USING BTREE,
  KEY `item_index` (`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_building_exp` (
  `uid` varchar(255) NOT NULL,
  `historyMax` bigint(20) DEFAULT 0,
  `currentMax` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_cemetery` (
  `uid` varchar(255) NOT NULL,
  `deadSum` bigint(20) DEFAULT 0 COMMENT '个人亡兵总数',
  `deadAbilityValue` bigint(20) DEFAULT 0 COMMENT '个人亡兵战斗力',
  `contributionValue` int(11) NOT NULL DEFAULT 0 COMMENT '个人贡献数量',
  `needContributionValue` int(11) NOT NULL DEFAULT 0 COMMENT '需要贡献数量',
  `contributionStage` int(11) NOT NULL DEFAULT 0 COMMENT '个人贡献阶段',
  `useItemSum` int(11) NOT NULL DEFAULT 0 COMMENT '使用道具的数量',
  `pubDeadInfo` varchar(1500) NOT NULL COMMENT '公共复活信息',
  `priDeadInfo` varchar(1500) NOT NULL COMMENT '个人复活信息',
  `reviveAbilityValue` bigint(20) DEFAULT 0 COMMENT '已经复活的亡兵战斗力总数',
  `tempReviveInfo` varchar(1500) DEFAULT NULL COMMENT '个人墓地本次的复活信息',
  `isPriInfoEmpty` int(11) DEFAULT 0 COMMENT '个人墓地是否为空',
  `reviveSumThisTime` int(11) DEFAULT 0 COMMENT '个人墓地本次可以复活多少人',
  `freedata` varchar(1500) DEFAULT NULL,
  `revived` text DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_cemetery_history` (
  `uid` varchar(255) NOT NULL COMMENT '玩家uid',
  `name` varchar(255) NOT NULL COMMENT '玩家昵称',
  `deadSum` bigint(20) NOT NULL COMMENT '死兵总数',
  `reviveSum` bigint(20) NOT NULL COMMENT '复活总数',
  `useItemSum` int(11) NOT NULL COMMENT '使用物品总数',
  `mainBuildingLevel` int(11) NOT NULL COMMENT '城堡等级',
  `rechargeSum` int(11) NOT NULL COMMENT '充值总数',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_civilization_prestige` (
  `uid` varchar(40) NOT NULL,
  `civilizationType` int(11) NOT NULL,
  `prestigeValue` bigint(20) DEFAULT 0,
  `periodicLimitValue` int(11) DEFAULT 0,
  `updateTime` bigint(20) DEFAULT 0,
  `rewardLv` int(11) DEFAULT 0,
  `actionLimits` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`uid`,`civilizationType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_civilization_science` (
  `baseItemID` int(11) NOT NULL,
  `userID` varchar(64) NOT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`baseItemID`,`userID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_collect_record` (
  `uid` varchar(255) NOT NULL,
  `resource` int(11) DEFAULT 0,
  `killPeople` int(11) DEFAULT NULL,
  `train` int(11) DEFAULT NULL,
  `lastKillTime` bigint(20) DEFAULT NULL,
  `sockByResource` int(11) DEFAULT NULL,
  `sockByKill` int(11) DEFAULT NULL,
  `sockByTrain` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_comeback_record` (
  `uid` varchar(50) NOT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `configId` varchar(11) NOT NULL,
  `backType` int(11) NOT NULL DEFAULT 0,
  `backTime` bigint(20) NOT NULL DEFAULT 0,
  `backReward` tinyint(4) NOT NULL DEFAULT 0,
  `dailyReward` varchar(30) DEFAULT NULL,
  `payReward` varchar(100) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`configId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='召回';
--> statement-breakpoint
CREATE TABLE `user_continue_pay` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `productId` varchar(40) NOT NULL,
  `goldCount` int(11) DEFAULT 0,
  `status` int(11) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`productId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_cross_fight_history` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `startTime` bigint(20) NOT NULL,
  `round` int(11) NOT NULL,
  `score` bigint(20) DEFAULT 0,
  `rank` int(11) DEFAULT 0,
  `serverId` int(11) NOT NULL,
  `worldId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`startTime`,`round`,`worldId`) USING BTREE,
  KEY `user_startTime` (`uid`,`startTime`) USING BTREE,
  KEY `startTime` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_cross_server` (
  `uid` varchar(255) NOT NULL,
  `fromServerId` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_cross_throne` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(128) DEFAULT NULL,
  `totalKills` bigint(20) DEFAULT 0,
  `totalDeads` bigint(20) DEFAULT NULL,
  `kingdomFightIndex` int(11) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `allianceName` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `abbr` varchar(128) DEFAULT NULL,
  `kingdomName` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `deadDetail` varchar(1024) DEFAULT NULL,
  `deadDetailBak` varchar(1024) DEFAULT NULL,
  `hasCemeteryCollected` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2347 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_daily_task` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL,
  `num` int(11) NOT NULL DEFAULT 0,
  `times` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_device_bind_hide` (
  `uid` varchar(40) NOT NULL,
  `hideUid` varchar(40) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`hideUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_dragon` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `itemId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `place` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_dragon_battle` (
  `uid` varchar(40) NOT NULL,
  `freeTeleport` int(11) DEFAULT 0,
  `leaveTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_egg` (
  `uid` varchar(40) NOT NULL,
  `eggId` varchar(10) NOT NULL,
  `goods` varchar(200) NOT NULL,
  `reward` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`eggId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_equip` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `on` int(11) NOT NULL DEFAULT 0,
  `generalid` int(11) DEFAULT 0,
  `itemId` int(11) NOT NULL DEFAULT 0,
  `cost` varchar(255) DEFAULT '',
  `extraProperty` varchar(255) DEFAULT '',
  `refineProperty` varchar(255) DEFAULT '',
  `lockProperty` varchar(255) DEFAULT NULL,
  `showSign` int(11) DEFAULT 1 COMMENT 'æ˜¾ç¤ºæ ‡è¯†ï¼Œ0ä¸æ˜¾ç¤ºï¼Œ1æ˜¾ç¤º',
  `reforgeCount` int(11) DEFAULT 0,
  `strengthLevel` int(11) NOT NULL DEFAULT 0,
  `crystalCharge` int(11) NOT NULL DEFAULT 0,
  `darkCrystalCharge` int(11) NOT NULL DEFAULT 0,
  `chargeType` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_uid_on` (`uid`,`on`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_equip_bak` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `on` int(11) NOT NULL DEFAULT 0,
  `itemId` int(11) NOT NULL DEFAULT 0,
  `cost` varchar(255) DEFAULT '',
  `extraProperty` varchar(255) DEFAULT '',
  `refineProperty` varchar(255) DEFAULT '',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_uid_on` (`uid`,`on`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_exchange_cycle` (
  `uid` varchar(255) NOT NULL,
  `stage` int(11) DEFAULT 0,
  `totalstage` int(11) DEFAULT 0,
  `waittime` bigint(20) DEFAULT 0,
  `totalstage1` int(11) DEFAULT 0,
  `waittime1` bigint(20) DEFAULT 0,
  `totalstage2` int(11) DEFAULT 0,
  `waittime2` bigint(20) DEFAULT 0,
  `exchanges` varchar(200) DEFAULT NULL,
  `stage1` int(11) DEFAULT 0,
  `stage2` int(11) DEFAULT 0,
  `cdtime` bigint(20) DEFAULT -1,
  `cdtime1` bigint(20) DEFAULT -1,
  `cdtime2` bigint(20) DEFAULT -1,
  `receive_reward` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '领取阶段奖励',
  `receive_reward1` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '领取阶段奖励',
  `receive_reward2` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '领取阶段奖励',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_expedition_info` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `recieveResource` bigint(20) NOT NULL DEFAULT 0,
  `lastClearTime` bigint(20) NOT NULL DEFAULT 0,
  `isTakeAward1` tinyint(4) NOT NULL DEFAULT 0,
  `isTakeAward2` tinyint(4) NOT NULL DEFAULT 0,
  `isTakeAward3` tinyint(4) NOT NULL DEFAULT 0,
  `takeTime1` bigint(20) NOT NULL DEFAULT 0,
  `takeTime2` bigint(20) NOT NULL DEFAULT 0,
  `takeTime3` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_expedition_score` (
  `uid` varchar(255) NOT NULL,
  `score` double DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_general` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `generalId` varchar(40) NOT NULL,
  `color` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  `ability` blob DEFAULT NULL,
  `abilityIndex` int(11) DEFAULT 1,
  `plusSkillPoint` int(11) DEFAULT 0 COMMENT '通过物品增加的技能点',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_index_001` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_gift` (
  `uuid` varchar(40) NOT NULL,
  `giftId` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `allianceId` varchar(40) NOT NULL,
  `gifttype` int(11) NOT NULL,
  `valid` int(11) NOT NULL DEFAULT 1,
  `level` int(11) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `para` int(11) DEFAULT 0,
  `time` bigint(20) NOT NULL,
  `expiretime` int(11) DEFAULT NULL,
  `exp` int(11) DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_gift_vote` (
  `uid` varchar(50) NOT NULL,
  `version` int(11) NOT NULL,
  `type` int(11) NOT NULL COMMENT '1: 预览、2：投票',
  `giftId` int(11) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`version`,`type`,`giftId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='礼包投票记录';
--> statement-breakpoint
CREATE TABLE `user_glory_info` (
  `uid` varchar(40) NOT NULL,
  `strengthenCount` int(11) NOT NULL,
  `strengthenTime` bigint(20) NOT NULL,
  `expeditionVictoryTimes` int(11) NOT NULL DEFAULT -1,
  `weaknessTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_gold_group_buy` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(40) NOT NULL COMMENT '购买物品的静态表id',
  `buy_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '购买时间',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '购买物品数量',
  `discount` int(11) NOT NULL DEFAULT 0 COMMENT '折扣比例分母为100',
  `group_coupon_num` int(11) NOT NULL DEFAULT 0 COMMENT '使用团购券折数',
  `isMail` int(11) NOT NULL DEFAULT 0 COMMENT '是否发送奖励',
  PRIMARY KEY (`uid`,`id`,`buy_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_gold_wheel` (
  `uid` varchar(50) NOT NULL,
  `hide_king` int(11) NOT NULL DEFAULT 0,
  `normal_free` int(11) NOT NULL DEFAULT 0,
  `normal_total` int(11) NOT NULL DEFAULT 0,
  `normal_last_free_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次获得免费次数时间',
  `silver_usable` int(11) NOT NULL DEFAULT 0 COMMENT '可用次数',
  `silver_usable_free` int(11) NOT NULL DEFAULT 0 COMMENT '可用免费次数',
  `silver_daily` int(11) NOT NULL DEFAULT 0 COMMENT '当天开启次数',
  `silver_total` int(11) NOT NULL DEFAULT 0 COMMENT '总使用次数',
  `silver_last_add_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次次数获取时间',
  `silver_last_free_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次获得免费次数时间',
  `gold_daily` int(11) NOT NULL DEFAULT 0 COMMENT '当天开启次数',
  `gold_usable` int(11) NOT NULL DEFAULT 0 COMMENT '可用次数',
  `gold_total` int(11) NOT NULL DEFAULT 0 COMMENT '总使用次数',
  `gold_last_add_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次次数获取时间',
  `last_normal_wheel_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次普通转盘时间',
  `rewardFlags` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='黄金宝箱';
--> statement-breakpoint
CREATE TABLE `user_gold_wheel_histo` (
  `uid` varchar(50) NOT NULL,
  `normal_free` int(11) NOT NULL DEFAULT 0,
  `normal_total` int(11) NOT NULL DEFAULT 0,
  `silver_usable` int(11) NOT NULL DEFAULT 0 COMMENT '可用次数',
  `silver_usable_free` int(11) NOT NULL DEFAULT 0 COMMENT '可用免费次数',
  `silver_daily` int(11) NOT NULL DEFAULT 0 COMMENT '当天开启次数',
  `silver_total` int(11) NOT NULL DEFAULT 0 COMMENT '总使用次数',
  `silver_last_add_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次次数获取时间',
  `gold_daily` int(11) NOT NULL DEFAULT 0 COMMENT '当天开启次数',
  `gold_usable` int(11) NOT NULL DEFAULT 0 COMMENT '可用次数',
  `gold_total` int(11) NOT NULL DEFAULT 0 COMMENT '总使用次数',
  `gold_last_add_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次次数获取时间',
  `last_normal_wheel_millis` bigint(20) NOT NULL DEFAULT 0 COMMENT '最后一次普通转盘时间',
  `create_time` datetime NOT NULL,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='黄金宝箱 历史记录';
--> statement-breakpoint
CREATE TABLE `user_grant_title` (
  `uid` varchar(40) NOT NULL,
  `endtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '结束的时间',
  `targetuid` varchar(40) NOT NULL COMMENT '目标玩家',
  PRIMARY KEY (`uid`,`endtime`,`targetuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_growth_fund` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `type` int(11) NOT NULL DEFAULT 0,
  `itemId` varchar(40) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  `extra` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hero` (
  `ownerUid` varchar(40) NOT NULL DEFAULT '',
  `heroUid` varchar(40) NOT NULL,
  `heroState` int(11) NOT NULL DEFAULT 0,
  `captureTime` bigint(20) NOT NULL DEFAULT 0,
  `killTime` bigint(20) NOT NULL DEFAULT 0,
  `revivalTime` bigint(20) NOT NULL DEFAULT 0,
  `freeTime` bigint(20) NOT NULL DEFAULT 0,
  `thrashTime` bigint(20) NOT NULL DEFAULT 0,
  `thrashNum` int(11) NOT NULL DEFAULT 0,
  `captureCD` bigint(20) NOT NULL DEFAULT 0,
  `killCD` bigint(20) NOT NULL DEFAULT 0,
  `thrashCD` bigint(20) NOT NULL DEFAULT 0,
  `revivalCD` bigint(20) DEFAULT 0,
  `lastKillerUid` varchar(40) DEFAULT '',
  PRIMARY KEY (`heroUid`) USING BTREE,
  KEY `ownerUid_index` (`ownerUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_honor` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(50) NOT NULL DEFAULT '',
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hospital` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `dead` int(11) NOT NULL DEFAULT 0,
  `heal` int(11) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hot_item` (
  `uid` varchar(255) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hot_item_best` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `color` int(11) DEFAULT 0,
  `price_type` int(11) DEFAULT 0,
  `price` int(11) DEFAULT 0,
  `price_hot` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hot_item_best_v3` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `color` tinyint(4) DEFAULT NULL,
  `price_type` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `price_hot` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hot_item_v2` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `itemId` varchar(20) DEFAULT NULL,
  `priceType` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `price_hot` int(11) DEFAULT 0,
  `num` int(11) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  `para1` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`goodsId`,`price`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_hot_item_v3` (
  `uid` varchar(255) NOT NULL,
  `goodsId` varchar(20) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `priceType` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `price_hot` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  `para1` int(11) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`uid`,`goodsId`,`price`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_item` (
  `uuid` varchar(40) NOT NULL,
  `ownerId` varchar(255) NOT NULL,
  `itemId` varchar(255) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `value` int(11) DEFAULT NULL,
  `vanishTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uitem_ownerId_index` (`ownerId`,`itemId`,`value`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_item_bak` (
  `uuid` varchar(40) NOT NULL,
  `ownerId` varchar(255) NOT NULL,
  `itemId` varchar(255) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `value` int(11) DEFAULT NULL,
  `vanishTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uitem_ownerId_index` (`ownerId`,`itemId`,`value`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_item_cd` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(255) NOT NULL,
  `useTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_king_skill` (
  `uuid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `uid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `skillId` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `todayUseTimes` int(11) NOT NULL DEFAULT 0,
  `checkDay` bigint(20) DEFAULT 0,
  `hasDonatedMaterial` int(11) NOT NULL DEFAULT 0,
  `isSuccessLast` int(11) DEFAULT 1,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_knight_title` (
  `uid` varchar(255) NOT NULL,
  `activity_title` int(11) NOT NULL,
  `unlock_title` blob DEFAULT NULL,
  `contract_activity_title` int(11) NOT NULL DEFAULT -1,
  `contract_unlock_title` blob DEFAULT NULL,
  `normal_unlock_title` blob DEFAULT NULL,
  `activeshortCut` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_login_ip` (
  `uid` varchar(40) NOT NULL,
  `ip` varchar(40) NOT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`ip`) USING BTREE,
  KEY `index_uid_count` (`uid`,`count`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_lord` (
  `uid` varchar(40) NOT NULL,
  `userSign` varchar(50) DEFAULT NULL,
  `medal` varchar(50) DEFAULT NULL,
  `levelUp` int(11) DEFAULT 1,
  `firstJoinAllianceFlag` int(11) DEFAULT 1,
  `newPlayerAwardSoldierFlag` int(11) DEFAULT 0,
  `lastPayTime` bigint(20) DEFAULT 0,
  `pveLevel` int(11) DEFAULT 1,
  `firstBindAccountRewardFlag` int(11) DEFAULT NULL,
  `dailyTaskFlushTime` bigint(20) DEFAULT 0,
  `dailyTaskComplete` int(11) DEFAULT 0,
  `isHDLogin` int(11) DEFAULT 0,
  `freshRecharge` int(11) DEFAULT 0,
  `freshRechargeTotal` int(11) DEFAULT 0,
  `barbarionCount` int(11) DEFAULT 0,
  `lastClearBarbarionTime` bigint(20) DEFAULT 0,
  `newSerCumRechargeTotal` bigint(20) NOT NULL DEFAULT 0 COMMENT '新服累计充值',
  `newDailyTaskFlushTime` bigint(20) NOT NULL DEFAULT 0,
  `newDailyTaskBoxRewardId` int(11) NOT NULL DEFAULT 0,
  `newDailyTaskBoxRewardState` int(11) NOT NULL DEFAULT 0,
  `castleLevelUp` int(11) DEFAULT 0,
  `castleLevelUpStatus` int(11) DEFAULT 0,
  `remainAttackLeaderBossTime` int(11) DEFAULT 0,
  `refreshAtkLeaderBossTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_lottery` (
  `uid` varchar(40) NOT NULL,
  `lotteryId` varchar(40) NOT NULL,
  `times` int(11) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`lotteryId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_luck_draw` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL,
  `count` int(11) DEFAULT NULL,
  `upTime` bigint(20) DEFAULT NULL,
  `randTime` bigint(20) DEFAULT NULL,
  `reward` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_military` (
  `uid` varchar(255) NOT NULL,
  `score` float(11,2) DEFAULT 0.00,
  `honor` float(11,2) DEFAULT 0.00,
  `exp` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `lastLevel` int(11) DEFAULT 0,
  `lastScore` float(11,2) DEFAULT 0.00,
  `skillStr` varchar(255) DEFAULT '',
  `lastCashTime` bigint(20) NOT NULL DEFAULT 0,
  `lastResetTime` bigint(20) NOT NULL DEFAULT 0,
  `honorThisWeek` float(11,2) DEFAULT 0.00,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `military_score_index` (`score`) USING BTREE,
  KEY `military_exp_index` (`exp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_military_rank` (
  `uid` varchar(255) NOT NULL,
  `militaryScore` float(11,2) DEFAULT 0.00,
  `honor` float(11,2) DEFAULT 0.00,
  `rankingExp` int(11) NOT NULL,
  `militaryRank` int(11) NOT NULL,
  `award` varchar(500) NOT NULL DEFAULT '',
  `lastRanking` int(11) DEFAULT 0,
  `lastMilitaryScore` float(11,2) DEFAULT 0.00,
  `skill` varchar(255) DEFAULT '',
  `status` int(11) NOT NULL DEFAULT 1,
  `lastTimeSet0Tostatus` bigint(20) NOT NULL DEFAULT 0,
  `awardReceived` int(11) NOT NULL DEFAULT 1,
  `lastTimeReset` bigint(20) NOT NULL DEFAULT 0,
  `maxHonorWeekly` float(11,2) DEFAULT 0.00,
  `lastRewardTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_militaryScore` (`militaryScore`) USING BTREE,
  KEY `index_rankingExp` (`rankingExp`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_mine` (
  `uid` varchar(40) NOT NULL,
  `fId` varchar(40) NOT NULL,
  `itemId` int(11) DEFAULT 0,
  `level` int(11) DEFAULT NULL,
  `call` int(11) DEFAULT 0,
  `exp` int(11) DEFAULT NULL,
  `miner` int(11) DEFAULT 0,
  `mineTime` bigint(20) DEFAULT NULL,
  `helpInfo` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`fId`) USING BTREE,
  KEY `index_fId` (`fId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_miracle_buff_active` (
  `uid` varchar(255) NOT NULL,
  `level` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_mixed_info` (
  `uid` varchar(40) NOT NULL,
  `scoreSwitch` int(11) DEFAULT 0,
  `daliyFirstLoginTime` bigint(20) DEFAULT 0,
  `continuouslyLoginDay` int(11) DEFAULT 0,
  `activityPopup` int(11) DEFAULT 0,
  `popupTime` bigint(20) DEFAULT 0,
  `showEquip` int(11) DEFAULT 1,
  `materialBackup` int(11) DEFAULT 1,
  `taskStage` int(11) DEFAULT 0,
  `scrollEquip` int(11) DEFAULT 1,
  `colorblind` int(11) DEFAULT 0,
  `dailyTaskId` varchar(320) DEFAULT '',
  `clientRecord` varchar(4000) DEFAULT '' COMMENT 'role guide mark',
  `lastGoldCureTime` bigint(20) DEFAULT 0,
  `npcReward` int(11) DEFAULT 0,
  `npcClickTime` bigint(20) DEFAULT 0,
  `npcRewardTime` bigint(20) DEFAULT 0,
  `showMedal` int(11) DEFAULT 1,
  `appointedTime` bigint(20) DEFAULT 0,
  `hasCollected` bigint(20) DEFAULT 0,
  `refine` int(11) DEFAULT 0,
  `refineTime` bigint(20) DEFAULT 0,
  `sdReward` int(11) DEFAULT 0,
  `sdClickTime` bigint(20) DEFAULT 0,
  `sdRewardTime` bigint(20) DEFAULT 0,
  `hasSendEnterMsg` int(11) DEFAULT 0,
  `shieldCdTime` bigint(20) DEFAULT 0,
  `protectEndTime` bigint(20) DEFAULT 0,
  `protectEndSendTimes` bigint(20) DEFAULT 0,
  `skin` varchar(320) DEFAULT '',
  `archeryReward` int(11) DEFAULT 0,
  `archeryClickTime` bigint(20) DEFAULT 0,
  `archeryRewardTime` bigint(20) DEFAULT 0,
  `marchSoldierShow` int(11) DEFAULT 0,
  `waterSplashing` int(11) DEFAULT 0,
  `waterSplashingTime` bigint(20) DEFAULT 0,
  `materialCdNum` int(11) DEFAULT 0,
  `materialCdTime` bigint(20) DEFAULT 0,
  `superArmyUseTimes` int(11) DEFAULT 0,
  `superArmyCheckTime` bigint(20) DEFAULT 0,
  `callBackAccount` int(11) DEFAULT 0,
  `postMail` int(11) DEFAULT 0,
  `postMailTime` bigint(20) DEFAULT 0,
  `postReward` int(11) DEFAULT 0,
  `postRewardTime` bigint(20) DEFAULT 0,
  `followFBTime` bigint(20) DEFAULT 0,
  `lastBeDuelTime` bigint(20) DEFAULT 0,
  `lastKillMonsterTime` bigint(20) DEFAULT NULL,
  `todayHasKillMonsterCount` int(11) DEFAULT NULL,
  `historyHasKillMonsterCount` bigint(20) DEFAULT NULL,
  `shippingTradeInvest` int(11) NOT NULL DEFAULT 0 COMMENT '海运贸易投资',
  `shippingTradeInvestGold` int(11) NOT NULL DEFAULT 0 COMMENT '海运贸易投资',
  `mdata` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '字符集2的16次方-1',
  `clientSaveFlag` int(11) DEFAULT 0,
  `plunderResource` int(11) DEFAULT 0,
  `plunderTime` bigint(20) DEFAULT 0,
  `mirrorFindCount` int(11) DEFAULT NULL,
  `mirrorTime` bigint(20) DEFAULT NULL,
  `generalRefineCount` int(11) NOT NULL DEFAULT 0,
  `generalRefineTime` bigint(20) NOT NULL DEFAULT 0,
  `showBanner` bigint(20) NOT NULL DEFAULT 0,
  `newComerWishCount` int(11) DEFAULT NULL,
  `newComerWishLastTime` bigint(20) DEFAULT NULL,
  `generalFree` bigint(20) DEFAULT 0,
  `payHide` int(11) DEFAULT 0,
  `costHide` int(11) DEFAULT 0,
  `prestigeValueLimit` int(11) DEFAULT 0,
  `prestigeLastTime` bigint(20) DEFAULT 0,
  `civilizationValueLimit` int(11) DEFAULT 0,
  `civilizationLastTime` bigint(20) DEFAULT 0,
  `heroReward` int(11) DEFAULT 0,
  `heroRewardTime` bigint(20) DEFAULT 0,
  `grantTitleTimes` int(11) DEFAULT 0,
  `grantTitleTime` bigint(20) DEFAULT 0,
  `dragonSuperArmyUseTimes` int(11) DEFAULT 0,
  `expeditionSuperArmyUseTimes` int(11) DEFAULT 0,
  `neutralSuperArmyUseTimes` int(11) DEFAULT 0,
  `ancientSuperArmyUseTimes` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `protectEndTime` (`protectEndTime`) USING BTREE,
  KEY `protectEndSendTimes` (`protectEndSendTimes`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_monster_siege` (
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `failTimes` int(11) DEFAULT 0,
  `killMonsterCount` bigint(20) DEFAULT 0,
  `state` int(11) NOT NULL,
  `goalRank` int(11) DEFAULT 0,
  `failRounds` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `isfinish` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `state_index` (`state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_monster_siege_data` (
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `failTimes` int(11) DEFAULT 0,
  `killMonsterCount` bigint(20) DEFAULT 0,
  `state` int(11) NOT NULL,
  `goalRank` int(11) DEFAULT 0,
  `failRounds` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `recordTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`recordTime`) USING BTREE,
  KEY `state_index` (`state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_monster_siege_history` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `allianceAbbr` varchar(40) DEFAULT NULL,
  `allianceName` varchar(40) DEFAULT NULL,
  `rank` int(11) NOT NULL,
  `killCount` bigint(20) DEFAULT 0,
  `failRounds` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_monster_siege_top_history` (
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `time` bigint(20) NOT NULL,
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `allianceAbbr` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `allianceName` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `rank` int(11) NOT NULL,
  `killCount` bigint(20) DEFAULT 0,
  `failRounds` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_neutral` (
  `uid` varchar(40) NOT NULL,
  `serverid` int(11) DEFAULT 0,
  `collectload` int(11) DEFAULT 0,
  `collecttime` bigint(20) DEFAULT 0,
  `score` double DEFAULT 0,
  `leaveTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_new_daily_task` (
  `uid` varchar(40) NOT NULL,
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_new_recall_info` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `type` int(11) DEFAULT NULL COMMENT '0-流失玩家，1-活跃玩家',
  `initTime` bigint(20) DEFAULT NULL,
  `country` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '当时国家',
  `catsleLv` int(11) DEFAULT NULL COMMENT '当时大本等级',
  `updateTime` bigint(20) DEFAULT NULL,
  `count` int(11) DEFAULT NULL COMMENT '活跃玩家:已召回玩家数；流失玩家：领取第几天登陆奖励',
  `extra` text CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '活跃用户:流失用户完成任务额外奖励list；流失用户：召回码等',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_new_recall_task` (
  `uid` varchar(255) NOT NULL,
  `taskId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `day` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `targetNum` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`taskId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_new_resource_log` (
  `uuid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` varchar(40) NOT NULL,
  `actionType` int(11) NOT NULL,
  `sandstone` bigint(20) DEFAULT 0,
  `diamondstone` bigint(20) DEFAULT 0,
  `marble` bigint(20) DEFAULT 0,
  `granite` bigint(20) DEFAULT 0,
  `limestone` bigint(20) DEFAULT 0,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid_index` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2311 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_olympic_bet` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `questionId` varchar(40) NOT NULL,
  `resourceType` int(11) NOT NULL,
  `betNum` int(11) NOT NULL,
  `betCountry` varchar(10) NOT NULL,
  `result` varchar(10) DEFAULT NULL,
  `ended` int(11) DEFAULT NULL,
  `rewarded` int(11) DEFAULT NULL,
  `reward` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_onekey_reload` (
  `uid` varchar(40) NOT NULL,
  `generalId` varchar(40) NOT NULL COMMENT '英雄ID',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '第几套',
  `equip_list` varchar(2048) NOT NULL DEFAULT '',
  `talentPoint` int(11) NOT NULL DEFAULT 0 COMMENT '天赋点',
  `talent` varchar(5120) NOT NULL DEFAULT '',
  `dragon_stone_rhyme` varchar(40) NOT NULL DEFAULT '' COMMENT '龙韵石',
  PRIMARY KEY (`uid`,`generalId`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_onlinereward` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `online` bigint(20) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT 0,
  `use` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pay_lottery` (
  `uid` varchar(40) NOT NULL,
  `totalGold` int(11) DEFAULT NULL,
  `lastGold` int(11) DEFAULT NULL,
  `lastLuckyNum` int(11) DEFAULT NULL,
  `lastBonus` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT NULL,
  `shareTime` bigint(20) DEFAULT NULL,
  `luckyNum` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pay_lottery_log` (
  `uid` varchar(40) NOT NULL,
  `userId` varchar(40) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `activityId` varchar(40) NOT NULL,
  `spend` double(10,2) DEFAULT NULL,
  `itemId` varchar(10) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pay_reward` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(40) DEFAULT NULL,
  `buyTime` bigint(20) DEFAULT NULL,
  `refreshTime` bigint(20) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `extra` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_permission` (
  `user_id` int(11) NOT NULL,
  `module_permission` varchar(255) NOT NULL,
  `route_permission` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `method_permission` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `type` smallint(6) NOT NULL COMMENT '1.增 2.减',
  PRIMARY KEY (`user_id`,`module_permission`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pet_dragon` (
  `uuid` varchar(255) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `dragonState` tinyint(1) NOT NULL DEFAULT 0,
  `friendly` int(11) DEFAULT 0,
  `clickBubbleTimesForDay` smallint(6) DEFAULT 0,
  `clickBubbleTotalTimes` int(11) DEFAULT 0,
  `gainEggTime` bigint(20) NOT NULL DEFAULT 0,
  `clickEggTime` bigint(20) DEFAULT 0,
  `lastClickBubbleTime` bigint(20) DEFAULT 0,
  `useFlag` tinyint(1) NOT NULL DEFAULT 0,
  `friendShipDecreaseTime` bigint(20) DEFAULT 0 COMMENT 'ä¸Šä¸€æ¬¡å‹å¥½åº¦å‡å°‘çš„æ—¶é—´ï¼›0ï¼šè¡¨ç¤ºæ²¡æœ‰å‡å°‘è¿‡',
  `travelData` varchar(2000) DEFAULT NULL COMMENT '宠物龙历练数据',
  `communicateData` varchar(500) DEFAULT NULL COMMENT 'ä¸Žå® ç‰©é¾™äº¤æµæ•°æ®',
  `exp` int(11) DEFAULT 0 COMMENT '宠物龙的当前经验',
  `initFriendShipFlag` tinyint(1) DEFAULT 0 COMMENT '宠物龙友好度是否初始化满过',
  `lastUpLevelTime` bigint(20) DEFAULT 0 COMMENT '宠物龙升级时间戳',
  `lv` smallint(6) DEFAULT 1,
  `nickName` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pet_dragon_skill` (
  `uuid` varchar(32) NOT NULL,
  `uid` varchar(32) NOT NULL,
  `skillId` varchar(20) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `totalExp` int(11) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `index1` int(11) DEFAULT NULL,
  `strengthenLevel` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_picture` (
  `uid` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `uploadTime` bigint(20) DEFAULT 0,
  `auditPerson` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '',
  `state` int(11) DEFAULT 0,
  `picVer` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_pray` (
  `uid` varchar(255) NOT NULL,
  `freeFromItem` int(11) DEFAULT 0,
  `itemPrayCount` int(11) DEFAULT 0,
  `prayCount` int(11) DEFAULT 0,
  `lastPrayTime` bigint(20) DEFAULT 0,
  `wood` int(11) DEFAULT 0,
  `food` int(11) DEFAULT 0,
  `iron` int(11) DEFAULT 0,
  `silver` int(11) DEFAULT 0,
  `steel` int(11) DEFAULT 0,
  `goldwood` int(11) DEFAULT 0,
  `goldfood` int(11) DEFAULT 0,
  `goldiron` int(11) DEFAULT 0,
  `goldsilver` int(11) DEFAULT 0,
  `goldsteel` int(11) DEFAULT 0,
  `isFirstFree` int(11) DEFAULT 0,
  `isFirstPay` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `count_idx` (`prayCount`) USING BTREE,
  KEY `date_idx` (`lastPrayTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_push` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `platform` varchar(20) DEFAULT NULL,
  `userId` varchar(1000) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `channelId` varchar(40) DEFAULT NULL,
  `active` int(11) DEFAULT 1,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `userId` (`userId`(255)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_recall_task` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL COMMENT '静态表id',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '当前完成数量',
  `target_num` int(11) NOT NULL DEFAULT 0 COMMENT '目标数量',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '完成状态',
  `type_level` int(11) NOT NULL DEFAULT 0 COMMENT '类型',
  `receive` int(11) NOT NULL DEFAULT 0 COMMENT '奖励是否领取',
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_recall_task_notes` (
  `uid` varchar(40) NOT NULL,
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `receive_mode` int(11) NOT NULL DEFAULT 0 COMMENT '领取方式0未领取1部分领取',
  `refreshTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '领取奖励时间',
  `beginTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '活动玩家自身开启时间',
  `opendTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '该时间决定为召回玩家',
  `country` varchar(40) NOT NULL DEFAULT '' COMMENT '国家',
  `endTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_reg` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `appVersion` varchar(40) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_reg_copy` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `appVersion` varchar(40) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_region_recall` (
  `uid` varchar(32) NOT NULL DEFAULT '' COMMENT '唯一ID',
  `level` int(11) DEFAULT NULL COMMENT '触发时的等级',
  `ladder` int(11) DEFAULT NULL COMMENT '阶段',
  `receivedaynum` int(11) DEFAULT NULL COMMENT '已经领取天数',
  `receivetime` bigint(20) DEFAULT NULL COMMENT '最近一次领取的时间',
  `begintime` bigint(20) DEFAULT NULL COMMENT '上线触发开始的时间',
  `endtime` bigint(20) DEFAULT NULL COMMENT '结束的时间',
  `country` varchar(32) NOT NULL DEFAULT '' COMMENT '国家',
  `reward` varchar(255) NOT NULL DEFAULT '' COMMENT '奖励的reward',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_report` (
  `uid` varchar(40) NOT NULL,
  `target_uid` varchar(40) NOT NULL COMMENT '举报对象的UID',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '举报类型',
  `time` bigint(20) NOT NULL DEFAULT 0 COMMENT '举报时间',
  KEY `uid` (`uid`) USING BTREE,
  KEY `target_uid` (`target_uid`) USING BTREE,
  KEY `time` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `stone` bigint(20) NOT NULL,
  `wood` bigint(20) NOT NULL,
  `iron` bigint(20) NOT NULL,
  `food` bigint(20) NOT NULL,
  `silver` int(11) NOT NULL,
  `chip` int(11) NOT NULL,
  `diamond` int(11) NOT NULL,
  `dragon_food` int(11) NOT NULL,
  `dragon_gold` int(11) NOT NULL,
  `lastUpdateTime` bigint(20) NOT NULL,
  `woodbind` bigint(20) NOT NULL DEFAULT 0,
  `stonebind` bigint(20) NOT NULL DEFAULT 0,
  `ironbind` bigint(20) NOT NULL DEFAULT 0,
  `foodbind` bigint(20) NOT NULL DEFAULT 0,
  `sandstone` int(11) DEFAULT 0,
  `diamondstone` int(11) DEFAULT 0,
  `marble` int(11) DEFAULT 0,
  `granite` int(11) DEFAULT 0,
  `limestone` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource_bak` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `stone` int(11) NOT NULL,
  `wood` int(11) NOT NULL,
  `iron` int(11) NOT NULL,
  `food` int(11) NOT NULL,
  `silver` int(11) NOT NULL,
  `chip` int(11) NOT NULL,
  `diamond` int(11) NOT NULL,
  `dragon_food` int(11) NOT NULL,
  `dragon_gold` int(11) NOT NULL,
  `lastUpdateTime` bigint(20) NOT NULL,
  `woodbind` bigint(20) NOT NULL DEFAULT 0,
  `stonebind` bigint(20) NOT NULL DEFAULT 0,
  `ironbind` bigint(20) NOT NULL DEFAULT 0,
  `foodbind` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource_bind` (
  `uid` varchar(40) NOT NULL,
  `wood` int(11) DEFAULT NULL,
  `food` int(11) DEFAULT NULL,
  `stone` int(11) DEFAULT NULL,
  `iron` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource_copy` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `stone` int(11) NOT NULL,
  `wood` int(11) NOT NULL,
  `iron` int(11) NOT NULL,
  `food` int(11) NOT NULL,
  `silver` int(11) NOT NULL,
  `chip` int(11) NOT NULL,
  `diamond` int(11) NOT NULL,
  `dragon_food` int(11) NOT NULL,
  `dragon_gold` int(11) NOT NULL,
  `lastUpdateTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource_log` (
  `uid` varchar(40) NOT NULL,
  `day` varchar(10) NOT NULL,
  `resourceType` int(11) NOT NULL,
  `actionType` int(11) NOT NULL,
  `rewardType` int(11) NOT NULL,
  `count` bigint(20) DEFAULT 0,
  `times` int(11) DEFAULT 0,
  `updateTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`day`,`resourceType`,`actionType`,`rewardType`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_resource_record` (
  `uid` varchar(255) NOT NULL,
  `itemId` varchar(255) NOT NULL,
  `wood` bigint(20) DEFAULT NULL,
  `stone` bigint(20) DEFAULT NULL,
  `iron` bigint(20) DEFAULT NULL,
  `food` bigint(20) DEFAULT NULL,
  `wood_bind` bigint(20) DEFAULT NULL,
  `stone_bind` bigint(20) DEFAULT NULL,
  `iron_bind` bigint(20) DEFAULT NULL,
  `food_bind` bigint(20) DEFAULT NULL,
  `costItem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE,
  KEY `uid_idx` (`uid`) USING BTREE,
  KEY `item_idx` (`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_science` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `cd` bigint(20) NOT NULL DEFAULT 9223372036854775807,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE,
  KEY `Index_ownerId` (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_score` (
  `uid` varchar(40) NOT NULL,
  `actId` varchar(40) NOT NULL,
  `round` int(11) DEFAULT 1,
  `level` int(11) DEFAULT 1,
  `score` int(11) DEFAULT 0,
  `reward` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`actId`) USING BTREE,
  KEY `index_actId` (`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_score_bak` (
  `uid` varchar(40) NOT NULL,
  `actId` varchar(40) NOT NULL,
  `round` int(11) DEFAULT 1,
  `level` int(11) DEFAULT 1,
  `score` int(11) DEFAULT 0,
  `reward` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`actId`) USING BTREE,
  KEY `index_actId` (`actId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_single_pay` (
  `uid` varchar(40) NOT NULL,
  `productId` varchar(255) NOT NULL,
  `canRecNum` int(11) DEFAULT NULL,
  `hasRecNum` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`productId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_skill` (
  `uuid` varchar(40) NOT NULL,
  `ownerId` varchar(40) NOT NULL,
  `skillId` varchar(40) NOT NULL,
  `startTime` bigint(20) DEFAULT 0,
  `actTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT NULL,
  `stat` int(11) DEFAULT 0,
  `param1` int(11) DEFAULT 0,
  `param2` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `ownerId_index` (`ownerId`) USING BTREE,
  KEY `starttime_index` (`startTime`) USING BTREE,
  KEY `endtime_index` (`endTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_snowball` (
  `uid` varchar(255) NOT NULL,
  `curLevel` int(11) DEFAULT NULL,
  `lastThrowTime` bigint(20) DEFAULT NULL,
  `todayThrowCount` int(11) DEFAULT NULL,
  `lastBuyTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_sock` (
  `uid` varchar(255) NOT NULL,
  `socks` bigint(20) DEFAULT 0,
  `reward` blob DEFAULT NULL,
  `level` int(11) DEFAULT 0,
  `refreshtime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_state` (
  `uid` varchar(255) NOT NULL,
  `stateId` int(11) NOT NULL,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `endTime` bigint(20) NOT NULL,
  `type` int(11) DEFAULT 0,
  `type2` int(11) DEFAULT 0,
  `groupType` int(11) DEFAULT 0,
  `ranEffId` int(11) DEFAULT NULL,
  `ranEffValue` int(11) DEFAULT NULL,
  `property1` varchar(50) DEFAULT NULL,
  `property2` varchar(50) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`,`stateId`) USING BTREE,
  KEY `index_uid_type2` (`uid`,`type2`) USING BTREE,
  KEY `index_uid_stateId` (`uid`,`stateId`) USING BTREE,
  KEY `index_stateId` (`stateId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_story_task` (
  `uid` varchar(40) NOT NULL,
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_talent` (
  `uid` varchar(40) NOT NULL,
  `talent` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_target_task` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL COMMENT '静态表id',
  `num` int(11) NOT NULL DEFAULT 0 COMMENT '当前完成数量',
  `target_num` int(11) NOT NULL DEFAULT 0 COMMENT '目标数量',
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '完成状态',
  `type_level` int(11) NOT NULL DEFAULT 0 COMMENT '类型',
  `rewardDouble` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_target_task_notes` (
  `uid` varchar(40) NOT NULL,
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `receive_mode` int(11) NOT NULL DEFAULT 0 COMMENT '领取方式0未领取1部分领取2支付领取',
  `refreshTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '领取奖励时间',
  `beginTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '活动玩家自身开启时间',
  `opendTime` bigint(20) NOT NULL DEFAULT 0 COMMENT '活动迭代开启时间',
  `isMail` int(11) NOT NULL DEFAULT 0,
  `endTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_task` (
  `uid` varchar(40) NOT NULL,
  `id` varchar(255) NOT NULL,
  `num` int(11) NOT NULL DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0,
  `type` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uid`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_tax` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  `wood` bigint(20) NOT NULL,
  `food` bigint(20) NOT NULL,
  `iron` bigint(20) NOT NULL,
  `stone` bigint(20) NOT NULL,
  `silver` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_territory_donate_resource` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) NOT NULL,
  `stone` bigint(20) NOT NULL,
  `wood` bigint(20) NOT NULL,
  `iron` bigint(20) NOT NULL,
  `food` bigint(20) NOT NULL,
  `sandStone` bigint(20) NOT NULL,
  `diamondStone` bigint(20) NOT NULL,
  `marble` bigint(20) NOT NULL,
  `granite` bigint(20) NOT NULL,
  `limestone` bigint(20) NOT NULL,
  `lastUpdateTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_territory_resource` (
  `uid` varchar(255) NOT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `wood` bigint(20) DEFAULT 0,
  `stone` bigint(20) DEFAULT 0,
  `iron` bigint(20) DEFAULT 0,
  `food` bigint(20) DEFAULT 0,
  `silver` bigint(20) DEFAULT 0,
  `lastUpdateTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `al_idx` (`allianceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_thumbup` (
  `uid` varchar(50) NOT NULL,
  `type` int(11) NOT NULL,
  `para1` varchar(50) NOT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`type`,`para1`) USING BTREE,
  KEY `type` (`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC COMMENT='点赞';
--> statement-breakpoint
CREATE TABLE `user_timereward` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `level` int(11) DEFAULT 0,
  `times` int(11) DEFAULT 0,
  `refreshTime` bigint(20) DEFAULT 0,
  `receiveTime` bigint(20) DEFAULT 0,
  `rewardInfo` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_totem` (
  `uid` varchar(40) NOT NULL,
  `totemId` int(11) NOT NULL,
  `putTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`totemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_true_info_bind` (
  `uid` varchar(40) NOT NULL,
  `phoneNumber` varchar(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneReward` int(11) DEFAULT NULL,
  `emailReward` int(11) DEFAULT NULL,
  `trueInfo` int(11) NOT NULL,
  KEY `uid, trueInfo` (`uid`,`trueInfo`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_used_item` (
  `uid` varchar(40) NOT NULL,
  `itemId` varchar(40) NOT NULL,
  PRIMARY KEY (`uid`,`itemId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_vip` (
  `uid` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT -1,
  `loginDays` int(11) NOT NULL,
  `lastLoginTime` bigint(20) NOT NULL,
  `vipEndTime` bigint(20) NOT NULL,
  `sPoint` int(11) NOT NULL DEFAULT 0,
  `sLevel` int(11) NOT NULL DEFAULT 0,
  `vip_switch` int(11) NOT NULL DEFAULT 1,
  `shop_level` int(11) NOT NULL DEFAULT 0,
  `shop_exp` int(11) NOT NULL DEFAULT 0,
  `svip_level` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_wall` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `num` int(11) NOT NULL DEFAULT 0,
  `build` int(11) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_weakness_building` (
  `uid` varchar(40) NOT NULL,
  `armyId` varchar(20) NOT NULL,
  `weakness` int(11) NOT NULL DEFAULT 0,
  `marchWeakness` int(11) NOT NULL,
  `heal` int(11) NOT NULL DEFAULT 0,
  `finishTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`,`armyId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_world` (
  `uid` varchar(40) NOT NULL,
  `pointId` int(11) NOT NULL,
  `worldId` int(11) NOT NULL DEFAULT 0,
  `color` int(11) DEFAULT NULL,
  `monsterLock` blob DEFAULT NULL,
  `lastCityDefTime` bigint(20) NOT NULL,
  `attMonsterStamina` int(11) DEFAULT NULL,
  `lastStaminaTime` bigint(20) DEFAULT NULL,
  `lastMoveCityTime` bigint(20) DEFAULT 0,
  `srcServerPointId` int(11) DEFAULT NULL,
  `ckfConfirmAccessNextRound` int(11) DEFAULT NULL,
  `ckfNeedLeave` int(11) DEFAULT NULL,
  `ckfAccessTimes` int(11) DEFAULT 0,
  `ckfLastPlayRound` int(11) DEFAULT NULL,
  `ckfProtectTime` bigint(20) DEFAULT NULL,
  `ckfWinStreak` int(11) DEFAULT 0,
  `cdfAreaId` int(11) DEFAULT 0,
  `ckfLeaveABFServerTime` bigint(20) DEFAULT NULL,
  `ckfThroneFightFlag` int(11) DEFAULT 0,
  `resSearchCount` int(11) DEFAULT 0,
  `searchFlushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_world_pve` (
  `uid` varchar(40) NOT NULL,
  `pointId` int(11) NOT NULL,
  `attNum` int(11) NOT NULL,
  `buyNum` int(11) DEFAULT NULL,
  `monsterInfo` blob DEFAULT NULL,
  PRIMARY KEY (`uid`,`pointId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `username` (
  `uid` varchar(40) NOT NULL,
  `people` int(11) NOT NULL DEFAULT 0,
  `refreshTime` bigint(20) NOT NULL,
  `leagueTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userprofile` (
  `USN` varchar(11) DEFAULT NULL,
  `uid` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `gold` bigint(20) NOT NULL DEFAULT 0,
  `paidGold` bigint(20) DEFAULT 0,
  `csmodBalance` bigint(20) NOT NULL DEFAULT 0,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `parseRegisterId` varchar(255) DEFAULT NULL,
  `gcmRegisterId` varchar(255) DEFAULT NULL,
  `openedPos` varchar(500) DEFAULT NULL,
  `pic` varchar(40) DEFAULT NULL,
  `picVer` int(11) DEFAULT 0,
  `country` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `chNameCount` varchar(255) DEFAULT '0',
  `worldPoint` int(11) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceUuid` varchar(200) DEFAULT NULL,
  `gaid` varchar(40) DEFAULT NULL,
  `platform` varchar(40) DEFAULT NULL,
  `pf` varchar(40) DEFAULT 'csmod_games',
  `lang` varchar(40) DEFAULT NULL,
  `mt` varchar(255) DEFAULT NULL,
  `appVersion` varchar(40) DEFAULT NULL,
  `gmFlag` int(11) DEFAULT 0,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `offLineTime` bigint(20) DEFAULT 0,
  `banTime` bigint(20) DEFAULT 0,
  `banFlag` int(11) DEFAULT 0,
  `excuteBanTime` bigint(20) DEFAULT 0,
  `banType` int(11) DEFAULT 0,
  `banTimes` int(11) DEFAULT 0,
  `chatBanTime` bigint(20) DEFAULT 0,
  `banGMName` varchar(255) DEFAULT NULL,
  `noticeBanTime` bigint(20) DEFAULT 0,
  `lastOnlineTime` bigint(20) DEFAULT 0,
  `DAILY` varchar(4) NOT NULL DEFAULT 'Y',
  `gmail` varchar(255) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `crossFightSrcServerId` int(11) NOT NULL DEFAULT -1,
  `lastModGoldGetTime` bigint(20) DEFAULT 0,
  `modGoldGetTimeInterval` bigint(20) DEFAULT 0,
  `modGoldAmount` bigint(20) DEFAULT 0,
  `beTrainingModTime` bigint(20) DEFAULT 0,
  `guideStep` varchar(255) DEFAULT '',
  `payRiskFactor` int(11) DEFAULT 0,
  `phoneDevice` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `crystal` bigint(20) DEFAULT 0,
  `skillMaterial` bigint(20) DEFAULT 0,
  `kingdomContribution` int(11) NOT NULL DEFAULT 0,
  `cpCount` int(11) DEFAULT 0,
  `militaryScore` int(11) DEFAULT 0,
  `allianceBuildScore` bigint(20) DEFAULT 0,
  `backPlayer` int(11) DEFAULT 0,
  `backFlag_mc` int(11) DEFAULT 0 COMMENT 'mc 召回标记',
  `backFlag_op` int(11) DEFAULT 0 COMMENT '运营 召回标记',
  `decomposesuiteffect` varchar(100) DEFAULT '0;0;0',
  `curGaid` varchar(40) DEFAULT NULL,
  `expeditionCrossCount` int(11) DEFAULT 0,
  `expeditionCrossTime` bigint(20) DEFAULT 0,
  `expeditionFirstBloodTime` bigint(20) DEFAULT 0,
  `payTotalDollar` double(10,2) DEFAULT NULL,
  `srcServerId` int(11) NOT NULL DEFAULT -1,
  `allianceIdBack` varchar(40) DEFAULT '',
  `neutralScore` bigint(20) NOT NULL DEFAULT 0 COMMENT '中立地带积分',
  `dmmGold` bigint(20) DEFAULT 0,
  `dmmPaidGold` bigint(20) DEFAULT 0,
  `civilizationType` int(11) DEFAULT 0,
  `civilizationSorce` bigint(20) DEFAULT 0,
  `paidSpecialGold` bigint(20) DEFAULT NULL,
  `dmmPaidSpecialGold` bigint(20) DEFAULT NULL,
  `crystalGold` bigint(20) DEFAULT 0,
  `picfraId` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `name_index` (`name`) USING BTREE,
  KEY `time_level_index` (`regTime`,`level`,`lastOnlineTime`,`pf`) USING BTREE,
  KEY `allianceid_lasttime_index` (`allianceId`,`lastOnlineTime`) USING BTREE,
  KEY `lang_index` (`lang`) USING BTREE,
  KEY `deviceId` (`deviceId`) USING BTREE,
  KEY `index_crossServerId` (`crossFightSrcServerId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userprofile_active` (
  `uuid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(30) NOT NULL,
  `level` tinyint(4) DEFAULT 0,
  `build_level` tinyint(4) DEFAULT 0,
  `honour_level` tinyint(4) DEFAULT 0,
  `parse_register_id` varchar(100) DEFAULT '',
  `country` varchar(20) DEFAULT '',
  `pf` varchar(20) DEFAULT '',
  `lang` varchar(20) DEFAULT '',
  `vip_level` tinyint(4) DEFAULT 0,
  `svip_level` tinyint(4) DEFAULT 0,
  `total_pay` int(11) DEFAULT 0,
  `last_online_time` bigint(20) DEFAULT 0,
  `ban_time` bigint(20) DEFAULT 0,
  `status` tinyint(4) DEFAULT 0,
  `push_count` int(11) DEFAULT 0,
  `pay_sum` double(10,2) DEFAULT 0.00,
  `power` bigint(20) DEFAULT 0,
  `user_name` varchar(255) DEFAULT '',
  `most_ip` varchar(16) DEFAULT '',
  `app_version` varchar(40) DEFAULT '',
  `last_pay_time` bigint(20) DEFAULT NULL,
  `gmail` varchar(255) DEFAULT NULL,
  `reg_time` bigint(20) DEFAULT NULL,
  `reg_ip` varchar(20) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `exp` int(11) DEFAULT NULL,
  `offLineTime` bigint(20) DEFAULT NULL,
  `googleAccount` varchar(255) DEFAULT NULL,
  `facebookAccount` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userprofile_bak` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `gold` bigint(20) NOT NULL DEFAULT 0,
  `paidGold` bigint(20) DEFAULT 0,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `parseRegisterId` varchar(255) DEFAULT NULL,
  `gcmRegisterId` varchar(255) DEFAULT NULL,
  `openedPos` varchar(500) DEFAULT NULL,
  `pic` varchar(40) DEFAULT NULL,
  `picVer` int(11) DEFAULT 0,
  `country` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `chNameCount` varchar(255) DEFAULT '0',
  `worldPoint` int(11) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceUuid` varchar(200) DEFAULT NULL,
  `gaid` varchar(40) DEFAULT NULL,
  `platform` varchar(40) DEFAULT NULL,
  `pf` varchar(40) DEFAULT 'csmod_games',
  `lang` varchar(40) DEFAULT NULL,
  `mt` varchar(255) DEFAULT NULL,
  `appVersion` varchar(40) DEFAULT NULL,
  `gmFlag` int(11) DEFAULT 0,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `offLineTime` bigint(20) DEFAULT 0,
  `banTime` bigint(20) DEFAULT 0,
  `banType` int(11) DEFAULT 0,
  `banTimes` int(11) DEFAULT 0,
  `chatBanTime` bigint(20) DEFAULT 0,
  `banGMName` varchar(255) DEFAULT NULL,
  `noticeBanTime` bigint(20) DEFAULT 0,
  `lastOnlineTime` bigint(20) DEFAULT 0,
  `gmail` varchar(255) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `crossFightSrcServerId` int(11) NOT NULL DEFAULT -1,
  `lastModGoldGetTime` bigint(20) DEFAULT 0,
  `modGoldGetTimeInterval` bigint(20) DEFAULT 0,
  `modGoldAmount` bigint(20) DEFAULT 0,
  `beTrainingModTime` bigint(20) DEFAULT 0,
  `guideStep` varchar(255) DEFAULT '',
  `payRiskFactor` int(11) DEFAULT 0,
  `phoneDevice` varchar(40) DEFAULT NULL,
  `crystal` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `name_index` (`name`) USING BTREE,
  KEY `time_level_index` (`regTime`,`level`,`lastOnlineTime`,`pf`) USING BTREE,
  KEY `allianceid_lasttime_index` (`allianceId`,`lastOnlineTime`) USING BTREE,
  KEY `lang_index` (`lang`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userprofile_del` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `exp` int(11) NOT NULL,
  `gold` bigint(20) NOT NULL DEFAULT 0,
  `paidGold` bigint(20) DEFAULT 0,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `parseRegisterId` varchar(255) DEFAULT NULL,
  `gcmRegisterId` varchar(255) DEFAULT NULL,
  `openedPos` varchar(500) DEFAULT NULL,
  `pic` varchar(40) DEFAULT NULL,
  `picVer` int(11) DEFAULT 0,
  `country` varchar(40) NOT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `chNameCount` varchar(255) DEFAULT '0',
  `worldPoint` int(11) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceUuid` varchar(200) DEFAULT NULL,
  `gaid` varchar(40) DEFAULT NULL,
  `platform` varchar(40) DEFAULT NULL,
  `pf` varchar(40) DEFAULT 'csmod_games',
  `lang` varchar(40) DEFAULT NULL,
  `mt` varchar(255) DEFAULT NULL,
  `appVersion` varchar(40) DEFAULT NULL,
  `gmFlag` int(11) DEFAULT 0,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `offLineTime` bigint(20) DEFAULT 0,
  `banTime` bigint(20) DEFAULT 0,
  `banType` int(11) DEFAULT 0,
  `banTimes` int(11) DEFAULT 0,
  `chatBanTime` bigint(20) DEFAULT 0,
  `banGMName` varchar(255) DEFAULT NULL,
  `noticeBanTime` bigint(20) DEFAULT 0,
  `lastOnlineTime` bigint(20) DEFAULT 0,
  `gmail` varchar(255) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `crossFightSrcServerId` int(11) NOT NULL DEFAULT -1,
  `lastModGoldGetTime` bigint(20) DEFAULT 0,
  `modGoldGetTimeInterval` bigint(20) DEFAULT 0,
  `modGoldAmount` bigint(20) DEFAULT 0,
  `beTrainingModTime` bigint(20) DEFAULT 0,
  `guideStep` varchar(255) DEFAULT '',
  `payRiskFactor` int(11) DEFAULT 0,
  `phoneDevice` varchar(40) DEFAULT NULL,
  `crystal` bigint(20) DEFAULT 0,
  `skillMaterial` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `name_index` (`name`) USING BTREE,
  KEY `time_level_index` (`regTime`,`level`,`lastOnlineTime`,`pf`) USING BTREE,
  KEY `allianceid_lasttime_index` (`allianceId`,`lastOnlineTime`) USING BTREE,
  KEY `lang_index` (`lang`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `vip_box_turntable` (
  `uid` varchar(255) NOT NULL DEFAULT '' COMMENT '唯一ID',
  `vip` int(11) NOT NULL COMMENT 'vip等级',
  `itemidlist` varchar(255) NOT NULL DEFAULT '' COMMENT '今日已开出id',
  `tableid` int(11) NOT NULL COMMENT '存储的当前表格id',
  `openCount` bigint(20) NOT NULL DEFAULT 0 COMMENT '打开界面次数',
  `stepNum` int(11) NOT NULL DEFAULT 0 COMMENT '当前打开位置',
  `free` int(11) NOT NULL DEFAULT 0 COMMENT '免费次数是否已用',
  `rewardTime` bigint(20) DEFAULT 0 COMMENT '抽取的时间',
  `refreshTime` bigint(20) DEFAULT 0 COMMENT '每天上线几点刷新的',
  PRIMARY KEY (`uid`,`vip`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `wishing_tree` (
  `uid` varchar(32) NOT NULL DEFAULT '' COMMENT '唯一ID',
  `totalNum` bigint(20) DEFAULT NULL COMMENT '许愿总次数',
  `type_1` int(11) DEFAULT NULL COMMENT '爱情',
  `type_2` int(11) DEFAULT NULL COMMENT '事业',
  `type_3` int(11) DEFAULT NULL COMMENT '精神',
  `type_4` int(11) DEFAULT NULL COMMENT '游戏内',
  `type_5` int(11) DEFAULT NULL COMMENT '金钱',
  `type_6` int(11) DEFAULT NULL COMMENT '健康',
  `type_7` int(11) DEFAULT NULL COMMENT '学业',
  `type_8` int(11) DEFAULT NULL COMMENT '幻想',
  `type_9` int(11) DEFAULT NULL COMMENT '物质',
  `type_10` int(11) DEFAULT NULL COMMENT '杂',
  `refreshtime` bigint(20) DEFAULT NULL COMMENT '最后一次刷新的时间',
  `rewardtime` bigint(20) DEFAULT NULL COMMENT '领奖的时间',
  `rewardid` int(11) DEFAULT NULL COMMENT '领奖的id',
  `type_11` int(11) DEFAULT 0,
  `type_12` int(11) DEFAULT 0,
  `type_13` int(11) DEFAULT 0,
  `type_14` int(11) DEFAULT 0,
  `type_15` int(11) DEFAULT 0,
  `type_16` int(11) DEFAULT 0,
  `type_17` int(11) DEFAULT 0,
  `type_18` int(11) DEFAULT 0,
  `type_19` int(11) DEFAULT 0,
  `type_20` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_barbarion` (
  `pointId` int(11) NOT NULL,
  `configId` varchar(255) NOT NULL,
  `lastArmyMapByteArray` blob DEFAULT NULL,
  `lastAwardArmyMapByteArray` blob DEFAULT NULL,
  `lastBeAttackedTime` bigint(20) DEFAULT 0,
  `currentHP` int(11) DEFAULT 0,
  PRIMARY KEY (`pointId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_barbarion_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT '0',
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_basttile_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT '0',
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_favorite` (
  `uid` varchar(255) NOT NULL,
  `point` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `cityType` int(11) DEFAULT -1,
  `resType` int(11) DEFAULT -1,
  `name` varchar(255) DEFAULT NULL,
  `server` int(11) NOT NULL DEFAULT 0,
  `createTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`uid`,`point`,`server`) USING BTREE,
  KEY `time_idx` (`createTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_field_monster_dead` (
  `uuid` varchar(40) NOT NULL,
  `id` int(11) NOT NULL,
  `monster` varchar(40) DEFAULT NULL,
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `dead_monster_time` (`deadFinishTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_barbarion_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  `resLevel` int(11) NOT NULL DEFAULT 0,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_basttile_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  `resLevel` int(11) NOT NULL DEFAULT 0,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_field_monster_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_monster_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_resource_new_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  `resLevel` int(11) NOT NULL DEFAULT 0,
  `resCostValue` int(11) NOT NULL DEFAULT 0,
  `resInitValue` int(11) NOT NULL,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_flush_resource_tmp` (
  `id` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  `resLevel` int(11) NOT NULL DEFAULT 0,
  `resCostValue` int(11) NOT NULL DEFAULT 0,
  `resInitValue` int(11) NOT NULL,
  `flushTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_hero_record` (
  `heroUid` varchar(40) NOT NULL,
  `heroFreeTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`heroUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_march` (
  `uuid` varchar(40) NOT NULL DEFAULT '',
  `ownerUid` varchar(40) DEFAULT NULL,
  `ownerId` int(11) NOT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `ownerColor` int(11) DEFAULT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `teamId` varchar(40) DEFAULT NULL,
  `armyInfo` blob DEFAULT NULL,
  `type` int(11) NOT NULL,
  `targetId` int(11) NOT NULL,
  `targetType` int(11) DEFAULT NULL,
  `targetUid` varchar(255) DEFAULT NULL,
  `marchStartTime` bigint(20) NOT NULL,
  `marchTime` int(11) DEFAULT NULL,
  `marchArrivalTime` bigint(20) DEFAULT NULL,
  `returnStartTime` bigint(20) DEFAULT NULL,
  `arrivalTime` bigint(20) DEFAULT NULL,
  `exploreTime` bigint(20) DEFAULT NULL,
  `exploreReport` blob DEFAULT NULL,
  `collectSpd` float DEFAULT NULL,
  `changeCollectSpdTime` bigint(20) DEFAULT NULL,
  `collectedBeforeSpd` bigint(20) DEFAULT NULL,
  `resLevel` int(11) DEFAULT NULL,
  `plunderRes` varchar(2048) DEFAULT NULL,
  `retrieveRes` varchar(1024) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `extraParam` int(11) DEFAULT 0,
  `blackLandMarchTime` varchar(2048) DEFAULT NULL,
  `monsterArmyCount` int(11) DEFAULT NULL,
  `monsterLevel` int(11) DEFAULT NULL,
  `monsterInfo` varchar(4000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `territoryStartTime` bigint(20) DEFAULT NULL,
  `territoryUpdateTime` bigint(20) DEFAULT NULL,
  `territoryStat` int(11) DEFAULT 0,
  `buildingKillArmy` blob DEFAULT NULL,
  `slowDown` int(11) DEFAULT 0,
  `worldId` int(11) NOT NULL DEFAULT 0,
  `isDuelSkill` int(11) DEFAULT 0,
  `fightSide` int(11) DEFAULT 0,
  `occupyResourceEndTime` bigint(20) DEFAULT 0,
  `superTeam` int(11) DEFAULT 0,
  `honourWatchtower` int(11) DEFAULT 0 COMMENT '荣耀瞭望塔标识',
  `npcDropAdd` float(8,2) DEFAULT NULL,
  `record` int(11) DEFAULT NULL,
  `stamina` int(11) DEFAULT 0,
  `singleCureAdd` float(8,2) DEFAULT 0.00,
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `ownerId_index_001` (`ownerUid`) USING BTREE,
  KEY `targetUid_index` (`targetUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_res_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT '0',
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_res_new_dead` (
  `id` varchar(40) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT '0',
  `deadFinishTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dead_res_time` (`deadFinishTime`) USING BTREE,
  KEY `areaId_index` (`areaId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_res_record` (
  `time` bigint(20) NOT NULL,
  `id` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `areaId` int(11) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`time`,`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `world_update_gridtype_tmp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gridType` int(11) NOT NULL,
  `grid2Type` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1442402 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `worldcup_apply` (
  `allianceId` varchar(50) NOT NULL,
  `version` int(11) NOT NULL,
  `applyUid` varchar(50) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`allianceId`,`version`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `worldpoint` (
  `id` int(11) NOT NULL,
  `worldId` int(11) NOT NULL DEFAULT 0,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `areaId` int(11) NOT NULL,
  `monsterAreaId` int(11) DEFAULT NULL,
  `bornAreaId` int(11) DEFAULT NULL,
  `gridType` int(11) NOT NULL,
  `grid2Type` int(11) NOT NULL,
  `pointType` int(11) NOT NULL,
  `pointItem` varchar(255) DEFAULT NULL,
  `territoryAlliance` varchar(255) DEFAULT NULL,
  `territoryId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `relicAreaId` varchar(255) DEFAULT NULL,
  `resLevel` int(11) NOT NULL,
  `resCostValue` int(11) NOT NULL DEFAULT 0,
  `resInitValue` int(11) NOT NULL,
  `ownerId` varchar(255) DEFAULT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `allianceId` varchar(40) DEFAULT NULL,
  `cityDefValue` int(11) DEFAULT NULL,
  `startOccupyTime` bigint(20) DEFAULT 0,
  `ownerMarchUUid` varchar(40) DEFAULT NULL,
  `flushTime` bigint(20) DEFAULT 0,
  `fireTime` bigint(20) DEFAULT NULL,
  `shieldTime` bigint(20) DEFAULT 0,
  `startTime` bigint(20) DEFAULT NULL,
  `monsterInfo` blob DEFAULT NULL,
  `resourceShieldTime` bigint(20) DEFAULT 0,
  `monsterCastleState` int(11) DEFAULT 0,
  `monsterCurrHP` int(11) DEFAULT 0,
  `flushFlag` int(11) DEFAULT 0,
  `sendHeartDurationTime` bigint(20) DEFAULT 0,
  `heartType` varchar(5) DEFAULT NULL,
  `cannonFireTime` bigint(20) DEFAULT NULL,
  `trap` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `reserve` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`,`worldId`) USING BTREE,
  KEY `world_res_area_id` (`areaId`,`gridType`) USING BTREE,
  KEY `world_monster_area_id` (`monsterAreaId`,`pointType`,`gridType`,`ownerId`,`grid2Type`) USING BTREE,
  KEY `world_pointType_flushTime_index` (`pointType`,`pointItem`,`flushTime`,`gridType`,`grid2Type`) USING BTREE,
  KEY `world_xy_type_country_index` (`x`,`y`,`pointType`) USING BTREE,
  KEY `worldId_pointType_gridType_grid2Type` (`worldId`,`pointType`,`gridType`,`grid2Type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `stat_login_2026_9` (
  `uid` varchar(40) NOT NULL,
  `time` bigint(20) NOT NULL,
  `disconnect` bigint(20) DEFAULT 0,
  `ip` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `castlelevel` int(11) DEFAULT NULL,
  `payTotal` bigint(20) NOT NULL DEFAULT 0,
  `deviceId` varchar(255) DEFAULT NULL,
  `regTime` bigint(20) NOT NULL DEFAULT 0,
  `pf` varchar(20) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `trulyip` varchar(20) DEFAULT NULL,
  `linkname` varchar(40) DEFAULT NULL,
  `curpf` varchar(20) DEFAULT NULL,
  `curcountry` varchar(10) DEFAULT NULL,
  `curgaid` varchar(40) DEFAULT NULL,
  `curdeviceid` varchar(255) DEFAULT NULL,
  `appversion` varchar(40) DEFAULT NULL,
  `curip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`time`) USING BTREE,
  KEY `index_timeStamp` (`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_0` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_1` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_2` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_3` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_4` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_5` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_6` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_7` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_8` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_9` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_10` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2026_11` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_0` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_1` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_2` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_3` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_4` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_5` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_6` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_7` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_8` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_9` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_10` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `action_cost_record_2027_11` (
  `uuid` varchar(40) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `action_type` int(11) NOT NULL,
  `cost_type` varchar(255) DEFAULT NULL,
  `cost_value` varchar(255) DEFAULT NULL,
  `get_type` varchar(255) DEFAULT NULL,
  `get_value` varchar(255) DEFAULT NULL,
  `param1` varchar(255) DEFAULT NULL,
  `param2` varchar(255) DEFAULT NULL,
  `update_time` bigint(20) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_0` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_1` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_2` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_3` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_4` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_5` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_6` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_7` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_8` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_9` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_10` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2026_11` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_0` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_1` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_2` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_3` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_4` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_5` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_6` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_7` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_8` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_9` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_10` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_cost_record_2027_11` (
  `uid` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `itemId` int(11) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `param1` int(11) DEFAULT NULL,
  `param2` int(11) DEFAULT NULL,
  `original` bigint(20) NOT NULL,
  `cost` int(11) NOT NULL,
  `remain` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_type` (`type`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_time_user` (`time`,`userId`,`itemId`) USING BTREE,
  KEY `index_user_time` (`userId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
