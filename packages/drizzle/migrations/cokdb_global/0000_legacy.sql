-- Generated schema-only baseline. Original ROW_FORMAT=COMPACT becomes DYNAMIC, as in the legacy importer.
SET NAMES utf8mb4;
--> statement-breakpoint
CREATE TABLE `account_device_mapping` (
  `gameUid` varchar(100) NOT NULL,
  `deviceId` varchar(200) NOT NULL,
  `type` int(11) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`gameUid`,`deviceId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `account_new` (
  `gameUid` varchar(100) NOT NULL DEFAULT '',
  `server` varchar(40) NOT NULL,
  `uuid` varchar(100) NOT NULL,
  `deviceId` varchar(200) DEFAULT NULL,
  `gaid` varchar(40) DEFAULT NULL,
  `country` varchar(40) DEFAULT NULL,
  `emailAccount` varchar(200) DEFAULT NULL,
  `googleAccount` varchar(200) DEFAULT NULL,
  `googleAccountName` varchar(200) DEFAULT NULL,
  `facebookAccount` varchar(200) DEFAULT NULL,
  `facebookAccountName` varchar(200) DEFAULT NULL,
  `pf` varchar(20) DEFAULT NULL,
  `pfId` varchar(40) DEFAULT NULL,
  `gameUserName` varchar(200) DEFAULT NULL,
  `gameUserLevel` int(11) NOT NULL,
  `lastTime` bigint(20) NOT NULL,
  `emailConfirm` int(11) DEFAULT 0,
  `passmd5` varchar(40) DEFAULT '',
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `account_new_oldbigone` (
  `gameUid` varchar(100) NOT NULL,
  `server` varchar(40) NOT NULL,
  `uuid` varchar(100) NOT NULL,
  `deviceId` varchar(200) DEFAULT NULL,
  `gaid` varchar(40) DEFAULT NULL,
  `country` varchar(40) DEFAULT NULL,
  `emailAccount` varchar(200) DEFAULT NULL,
  `googleAccount` varchar(200) DEFAULT NULL,
  `googleAccountName` varchar(200) DEFAULT NULL,
  `facebookAccount` varchar(200) DEFAULT NULL,
  `facebookAccountName` varchar(200) DEFAULT NULL,
  `pf` varchar(20) DEFAULT NULL,
  `pfId` varchar(40) DEFAULT NULL,
  `gameUserName` varchar(200) DEFAULT NULL,
  `gameUserLevel` int(11) NOT NULL,
  `lastTime` bigint(20) NOT NULL,
  `emailConfirm` int(11) DEFAULT 0,
  `passmd5` varchar(40) DEFAULT NULL,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`) USING BTREE,
  KEY `google_lasttime_index` (`googleAccount`,`lastTime`) USING BTREE,
  KEY `facebook_lasttime_index` (`facebookAccount`,`lastTime`) USING BTREE,
  KEY `deviceId_lasttime_index` (`deviceId`,`lastTime`) USING BTREE,
  KEY `email_lasttime_index` (`emailAccount`,`lastTime`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`pf`,`pfId`,`lastTime`) USING BTREE,
  KEY `server_id_index` (`server`) USING BTREE,
  KEY `username_index` (`gameUserName`) USING BTREE,
  KEY `gaid_index` (`gaid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activation` (
  `code` varchar(40) NOT NULL,
  `series` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  `user` varchar(40) DEFAULT NULL,
  `useTime` bigint(20) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  `timeId` int(11) DEFAULT 0,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`code`) USING BTREE,
  KEY `index_user` (`user`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activation_bak` (
  `code` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `series` int(11) DEFAULT NULL,
  `user` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activation_config` (
  `seriesId` int(11) NOT NULL,
  `title` blob DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `reward` blob DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `proUser` varchar(40) DEFAULT NULL,
  `type` int(11) DEFAULT 0,
  `count` int(11) DEFAULT 0,
  `beginTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `regStart` bigint(20) DEFAULT 0,
  `regEnd` bigint(20) DEFAULT 0,
  `country` varchar(256) DEFAULT '',
  `bLvMin` int(11) DEFAULT 0,
  `bLvMax` int(11) DEFAULT 0,
  `uLvMin` int(11) DEFAULT 0,
  `uLvMax` int(11) DEFAULT 0,
  `powerMin` bigint(20) DEFAULT 0,
  `powerMax` bigint(20) DEFAULT 0,
  `payGold` int(11) DEFAULT 0,
  `deviceLimit` int(11) DEFAULT 0,
  PRIMARY KEY (`seriesId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `activation_device_record` (
  `code` varchar(40) NOT NULL,
  `deviceId` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`code`,`deviceId`) USING BTREE
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
CREATE TABLE `adcost` (
  `date` date NOT NULL,
  `googleplay` double(12,2) DEFAULT NULL,
  `facebook` double(12,2) DEFAULT NULL,
  `cn` double(12,2) DEFAULT NULL,
  `kr` double(12,2) DEFAULT NULL,
  `jp` double(12,2) DEFAULT NULL,
  `th` double(12,2) DEFAULT NULL,
  `ru` double(12,2) DEFAULT NULL,
  `tw` double(12,2) DEFAULT NULL,
  PRIMARY KEY (`date`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `addata` (
  `device` varchar(100) NOT NULL DEFAULT '',
  `time` bigint(20) DEFAULT 0,
  `tracker` varchar(200) DEFAULT NULL,
  `country` varchar(10) DEFAULT NULL,
  `data` blob DEFAULT NULL,
  PRIMARY KEY (`device`) USING BTREE,
  KEY `index_time_tracker_country` (`time`,`tracker`,`country`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `admin_audit_log` (
  `serial_id` int(11) NOT NULL AUTO_INCREMENT,
  `adminname` varchar(50) NOT NULL,
  `target_uid` varchar(50) NOT NULL DEFAULT '',
  `target_server` varchar(8) DEFAULT NULL,
  `action_type` tinyint(4) NOT NULL,
  `action_detail` varchar(2000) NOT NULL DEFAULT '',
  `ip` varchar(24) NOT NULL DEFAULT '0',
  `create_time` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`serial_id`) USING BTREE,
  KEY `tuid` (`target_uid`) USING BTREE,
  KEY `uname` (`adminname`) USING BTREE,
  KEY `atype` (`action_type`) USING BTREE,
  KEY `ctime` (`create_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `adreward` (
  `device` varchar(100) NOT NULL DEFAULT '',
  `time` bigint(20) NOT NULL DEFAULT 0,
  `reward` varchar(200) DEFAULT NULL,
  `user` varchar(40) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  `sendTime` bigint(20) DEFAULT NULL,
  `tryTimes` int(11) DEFAULT 0,
  PRIMARY KEY (`device`,`time`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_state_tryTime` (`state`,`tryTimes`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `alliance` (
  `allianceId` varchar(100) NOT NULL,
  `alliancename` varchar(255) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  PRIMARY KEY (`allianceId`) USING BTREE,
  KEY `alliancename_index` (`alliancename`) USING BTREE,
  KEY `name_idx` (`alliancename`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `auction` (
  `uuid` varchar(255) NOT NULL DEFAULT '',
  `groupId` int(11) NOT NULL,
  `cfgId` varchar(30) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `num` int(11) NOT NULL,
  `color` int(11) NOT NULL,
  `endTime` bigint(20) NOT NULL,
  `zoneId` int(11) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `add` int(11) NOT NULL,
  `decision` int(11) NOT NULL,
  `end` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `auction_activity` (
  `id` int(11) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL,
  `endTime` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `auction_history` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `uuid` varchar(255) NOT NULL DEFAULT '',
  `groupId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `itemId` varchar(20) NOT NULL,
  `itemNum` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`uid`,`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `auction_server_group` (
  `id` int(11) NOT NULL,
  `zoneIdStr` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ban_move_set` (
  `country` varchar(256) DEFAULT NULL,
  `pf` varchar(255) DEFAULT NULL,
  `serverPf` varchar(255) DEFAULT NULL,
  `sid` varchar(255) DEFAULT NULL,
  `val` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `ban_record` (
  `uuid` varchar(40) NOT NULL,
  `serverId` int(11) NOT NULL,
  `uid` varchar(40) NOT NULL DEFAULT '',
  `time` bigint(20) DEFAULT 0,
  `operator` varchar(40) DEFAULT NULL,
  `reason` varchar(250) DEFAULT NULL,
  `opDate` varchar(20) DEFAULT '',
  PRIMARY KEY (`uuid`) USING BTREE,
  KEY `index_uid` (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `bantime_reason` (
  `serverId` varchar(40) NOT NULL DEFAULT '',
  `uid` varchar(200) NOT NULL DEFAULT '',
  `operator` varchar(40) DEFAULT NULL,
  `reason` varchar(250) DEFAULT NULL,
  `opeDate` varchar(20) DEFAULT '',
  `status` int(11) DEFAULT 0,
  PRIMARY KEY (`serverId`,`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `banwordrecord` (
  `uid` varchar(255) NOT NULL DEFAULT '',
  `server` int(11) NOT NULL,
  `banTimes` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`server`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `charge_activity` (
  `uuid` varchar(255) NOT NULL DEFAULT '',
  `exchangeId` varchar(255) DEFAULT NULL,
  `startTime` bigint(20) DEFAULT NULL,
  `rewardTime` bigint(20) DEFAULT NULL,
  `buyEndTime` bigint(20) DEFAULT NULL,
  `buyCount` int(11) DEFAULT NULL,
  `maxBuyCount` int(11) DEFAULT NULL,
  `rewardStatus` int(11) DEFAULT NULL,
  `round` int(11) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cn_regpay` (
  `date` int(11) NOT NULL,
  `pf` varchar(40) NOT NULL DEFAULT '',
  `dau` int(11) NOT NULL DEFAULT 0,
  `reg` int(11) DEFAULT 0,
  `payucnt` int(11) DEFAULT 0,
  `paysum` int(11) DEFAULT 0,
  PRIMARY KEY (`date`,`pf`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cn_regpay_accumulative` (
  `date` int(11) NOT NULL,
  `pf` varchar(40) NOT NULL DEFAULT '',
  `reg` int(11) DEFAULT 0,
  `payucnt` int(11) DEFAULT 0,
  `paysum` int(11) DEFAULT 0,
  PRIMARY KEY (`date`,`pf`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_throne_king_info` (
  `uuid` varchar(50) NOT NULL,
  `version` int(11) NOT NULL DEFAULT 0,
  `king_type` int(11) NOT NULL DEFAULT 0 COMMENT '1 overlord  2 emperor',
  `config_type` int(11) NOT NULL DEFAULT 0,
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
  PRIMARY KEY (`config_type`,`king_type`,`version`) USING BTREE,
  UNIQUE KEY `uuid` (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `cross_throne_occupy_record` (
  `uuid` varchar(50) NOT NULL DEFAULT '',
  `king_info_id` varchar(50) NOT NULL DEFAULT '',
  `uid` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `alliance_abbr` varchar(50) DEFAULT NULL,
  `server_id` int(11) DEFAULT NULL,
  `kingdom_name` varchar(50) DEFAULT NULL,
  `start_millis` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`king_info_id`,`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
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
  `pic` varchar(50) DEFAULT NULL,
  `pic_ver` int(11) NOT NULL DEFAULT 0,
  `name` varchar(50) DEFAULT NULL,
  `alliance_abbr` varchar(50) DEFAULT NULL,
  `throne_type` int(11) NOT NULL DEFAULT 0,
  `overlord_type` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange` (
  `orderId` varchar(200) NOT NULL,
  `pf` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(255) NOT NULL DEFAULT '',
  `uid` varchar(255) NOT NULL DEFAULT '',
  `productId` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange_top` (
  `serverId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fb_bind` (
  `fbid` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`fbid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fb_friend` (
  `fid` bigint(20) NOT NULL,
  `tid` bigint(20) NOT NULL,
  `tserver` int(11) DEFAULT NULL,
  `tuid` varchar(40) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`fid`,`tid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fb_invite` (
  `fid` bigint(20) NOT NULL,
  `tid` bigint(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`fid`,`tid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `fight_arena_info` (
  `worldId` int(11) NOT NULL,
  `state` int(11) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`worldId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
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
CREATE TABLE `gashrequest` (
  `tradeid` bigint(20) NOT NULL,
  `method` varchar(20) DEFAULT NULL,
  `orderinfo` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `trans` blob DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  PRIMARY KEY (`tradeid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gashsuccess` (
  `tradeid` bigint(20) NOT NULL,
  `finishTime` bigint(20) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `confirm` int(11) DEFAULT 0,
  PRIMARY KEY (`tradeid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `global_paylog` (
  `sid` int(11) NOT NULL,
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `productId` varchar(10) NOT NULL DEFAULT '0',
  `orderInfo` varchar(200) DEFAULT NULL,
  `orderParam` blob DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `currency` int(11) DEFAULT 0,
  `spend` double(10,2) NOT NULL DEFAULT 0.00,
  `paid` double(10,2) DEFAULT 0.00,
  `status` int(11) DEFAULT 0,
  `payLevel` int(11) NOT NULL,
  `buildingLv` int(11) DEFAULT NULL,
  `receiverId` varchar(40) DEFAULT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `ip` varchar(20) DEFAULT '',
  PRIMARY KEY (`sid`,`uid`,`orderId`,`pf`) USING BTREE,
  KEY `ipAndTime` (`ip`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `gold_group` (
  `itemId` int(11) NOT NULL DEFAULT 0,
  `num` bigint(20) NOT NULL DEFAULT 0,
  `startTime` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`itemId`,`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `hero_kingdom_activity` (
  `uuid` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) DEFAULT NULL,
  `delay` varchar(255) DEFAULT NULL,
  `power` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9000003 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logging_event` (
  `timestmp` bigint(20) NOT NULL,
  `formatted_message` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `logger_name` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `level_string` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `thread_name` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `reference_flag` smallint(6) DEFAULT NULL,
  `arg0` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `arg1` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `arg2` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `arg3` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `caller_filename` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `caller_class` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `caller_method` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `caller_line` char(4) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `event_id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`event_id`) USING BTREE,
  KEY `format_msg_idx` (`formatted_message`(100)) USING BTREE,
  KEY `arg_index` (`arg0`,`arg1`,`arg2`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logging_event_exception` (
  `event_id` bigint(20) NOT NULL,
  `i` smallint(6) NOT NULL,
  `trace_line` varchar(1024) NOT NULL,
  PRIMARY KEY (`event_id`,`i`) USING BTREE,
  KEY `trace_line_idx` (`trace_line`(255)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logging_event_property` (
  `event_id` bigint(20) NOT NULL,
  `mapped_key` varchar(254) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `mapped_value` text CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`event_id`,`mapped_key`) USING BTREE,
  CONSTRAINT `logging_event_property_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `logging_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logging_event_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) DEFAULT 0,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mail_gift_log` (
  `uid` varchar(40) NOT NULL,
  `fromUid` varchar(40) DEFAULT NULL,
  `fromName` varchar(200) DEFAULT NULL,
  `toUid` varchar(40) DEFAULT NULL,
  `toName` varchar(200) DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `rewards` varchar(1000) DEFAULT NULL,
  `isOpened` tinyint(4) DEFAULT NULL,
  `isRewarded` tinyint(4) DEFAULT NULL,
  `isThanks` tinyint(4) DEFAULT NULL,
  `sendTime` bigint(20) NOT NULL DEFAULT 0,
  `receiveTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`,`sendTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mod_info` (
  `uid` varchar(100) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `lang` varchar(40) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `server` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `mod_info_fk_01` (`server`) USING BTREE,
  KEY `lang_index` (`lang`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `monitor_test` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
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
CREATE TABLE `move_server_record_2024_12` (
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
CREATE TABLE `mycardrequest` (
  `factradeseq` varchar(40) NOT NULL,
  `authcode` varchar(200) NOT NULL,
  `method` varchar(20) DEFAULT NULL,
  `methodparam` varchar(10) DEFAULT NULL,
  `tradeseq` varchar(200) DEFAULT NULL,
  `orderInfo` varchar(300) NOT NULL,
  `amount` int(11) NOT NULL,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`factradeseq`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `mycardsuccess` (
  `tradeseq` varchar(200) NOT NULL,
  `mycardid` varchar(200) NOT NULL,
  `time` bigint(20) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `fulldata` blob NOT NULL,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`tradeseq`) USING BTREE,
  KEY `index_time` (`time`) USING BTREE,
  KEY `index_mycardid` (`mycardid`) USING BTREE
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
  `awardTime` bigint(20) DEFAULT NULL,
  `isKickFinish` int(11) DEFAULT NULL,
  `resTypeList` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`serverId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_expedition` (
  `uuid` varchar(40) NOT NULL,
  `state` int(11) DEFAULT 0,
  `startTime` bigint(20) DEFAULT 0,
  `endTime` bigint(20) DEFAULT 0,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `new_recall_relation` (
  `activeUid` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `outer_mail` (
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
  `addr` blob DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE,
  KEY `index_startTime` (`startTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_lottery` (
  `uid` varchar(255) DEFAULT NULL,
  `remainGold` int(11) DEFAULT NULL,
  `startTime` int(11) DEFAULT NULL,
  `endTime` int(11) DEFAULT NULL,
  `count` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `pay_switch` (
  `Id` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `time` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paylog_tmp` (
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
  `buildingLv` int(11) DEFAULT 0,
  KEY `index_time_pf` (`uid`,`orderId`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paylog_tmp_2` (
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
  `buildingLv` int(11) DEFAULT 0,
  `receiverId` varchar(40) DEFAULT NULL,
  KEY `index_time_pf` (`time`,`pf`) USING BTREE,
  KEY `index_orderid` (`uid`,`orderId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `push_137` (
  `id` tinyint(1) NOT NULL,
  `time` smallint(6) DEFAULT 0,
  `title` blob DEFAULT NULL,
  `contents` blob DEFAULT NULL,
  `reward` blob DEFAULT NULL,
  `notification` blob DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `repeat_name` (
  `gameUid` varchar(255) NOT NULL,
  `gameUserName` varchar(255) NOT NULL,
  `server` varchar(40) DEFAULT NULL,
  `minServer` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`gameUid`) USING BTREE,
  KEY `server_index` (`server`) USING BTREE,
  KEY `name_index` (`gameUserName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `risk_setting` (
  `id` varchar(40) NOT NULL,
  `k1` int(11) DEFAULT NULL,
  `k2` int(11) DEFAULT NULL,
  `k3` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `s10_us1000` (
  `uid` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_info` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `cross_fight_server_id` int(11) DEFAULT NULL,
  `fightRoomSize` int(11) DEFAULT NULL,
  `beginTime` bigint(20) DEFAULT NULL,
  `endTime` bigint(20) DEFAULT NULL,
  `open_time_info` longblob DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_king_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `kingName` varchar(255) DEFAULT NULL,
  `kingAllianceName` varchar(255) DEFAULT NULL,
  `kingAllianceAbbr` varchar(255) DEFAULT NULL,
  `kingAllianceIcon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_list` (
  `id` int(11) NOT NULL DEFAULT 0,
  `port` int(11) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `zone` varchar(8) DEFAULT NULL,
  `ip` varchar(128) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_ip` (`ip`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_merge_task` (
  `id` varchar(40) NOT NULL,
  `src_server` varchar(255) NOT NULL DEFAULT '',
  `dst_server` varchar(255) NOT NULL DEFAULT '',
  `merge_reason` text NOT NULL,
  `apply_time` bigint(20) NOT NULL DEFAULT 0,
  `merge_time` bigint(20) NOT NULL DEFAULT 0,
  `state` int(11) NOT NULL DEFAULT 0 COMMENT '0 Ã¥Â¾â€¦Ã¥Â®Â¡Ã¦Â Â¸ 1 Ã¥Å’Â¹Ã©â€¦Â 2 Ã¨Â¶â€¦Ã¦â€”Â¶ 3 Ã¤Â¸ÂÃ¥ÂÅ’Ã¦â€žÂ 4 Ã§Â­â€°Ã¥Â¾â€¦Ã¥ÂË†Ã¦Å“Â 5 Ã¥ÂË†Ã¦Å“ÂÃ¥Â®Å’Ã¦Ë†Â',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `server_push_auxiliary` (
  `uid` varchar(40) NOT NULL,
  `serverStr` blob DEFAULT NULL,
  `sqlStr` mediumblob DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `operationTime` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `sign_in_feed` (
  `uid` varchar(255) NOT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `feed` varchar(40) NOT NULL,
  `time` bigint(20) DEFAULT 0,
  PRIMARY KEY (`feed`,`type`,`uid`) USING BTREE,
  KEY `index_uid_time` (`uid`,`time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `specialreward` (
  `gameuid` varchar(100) NOT NULL DEFAULT '',
  `type` varchar(40) NOT NULL DEFAULT '',
  `state` int(11) DEFAULT 0,
  `sendTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`gameuid`,`type`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_logging_events` (
  `email` varchar(40) NOT NULL DEFAULT '',
  `event_id` int(11) NOT NULL,
  `receiveTime` bigint(20) DEFAULT 0,
  `completeTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`email`,`event_id`) USING BTREE,
  KEY `ULE_EVENTID_INDEX_01` (`event_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `user_tasks` (
  `email` varchar(40) NOT NULL DEFAULT '',
  `event_id` bigint(20) NOT NULL,
  `type` int(11) NOT NULL,
  `receiveTime` bigint(20) DEFAULT 0,
  `completeTime` bigint(20) DEFAULT 0,
  PRIMARY KEY (`email`,`event_id`) USING BTREE,
  KEY `event_id` (`event_id`) USING BTREE,
  CONSTRAINT `user_tasks_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `logging_event` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userbindmapping` (
  `gameUid` varchar(100) NOT NULL,
  `mappingType` varchar(20) NOT NULL DEFAULT '',
  `mappingValue` varchar(200) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`,`mappingType`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`mappingType`,`mappingValue`,`lastTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userbindmapping_oldbigone` (
  `gameUid` varchar(100) NOT NULL,
  `mappingType` varchar(20) NOT NULL DEFAULT '',
  `mappingValue` varchar(200) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`,`mappingType`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`mappingType`,`mappingValue`,`lastTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userbindmappingreverse` (
  `gameUid` varchar(100) NOT NULL,
  `mappingType` varchar(20) NOT NULL DEFAULT '',
  `mappingValue` varchar(200) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`,`mappingType`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`mappingType`,`mappingValue`,`lastTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `userbindmappingreverse_oldbigone` (
  `gameUid` varchar(100) NOT NULL,
  `mappingType` varchar(20) NOT NULL DEFAULT '',
  `mappingValue` varchar(200) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`,`mappingType`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`mappingType`,`mappingValue`,`lastTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `usermapping` (
  `gameUid` varchar(100) NOT NULL,
  `mappingType` varchar(20) NOT NULL DEFAULT '',
  `mappingValue` varchar(200) DEFAULT NULL,
  `lastTime` bigint(20) DEFAULT 0,
  `active` int(11) DEFAULT 0,
  PRIMARY KEY (`gameUid`,`mappingType`) USING BTREE,
  KEY `pf_pi_lasttime_index` (`mappingType`,`mappingValue`,`lastTime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `worldcup_team` (
  `version` varchar(255) DEFAULT NULL,
  `allianceId` varchar(255) DEFAULT NULL,
  `allianceName` varchar(255) DEFAULT NULL,
  `fighting` varchar(255) DEFAULT NULL,
  `leaderUid` varchar(255) DEFAULT NULL,
  `leaderName` varchar(255) DEFAULT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `abbr` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `serverId` varchar(255) DEFAULT NULL,
  `regionId` varchar(255) DEFAULT NULL,
  `score` varchar(255) DEFAULT NULL,
  `lastTimeIndex` varchar(255) DEFAULT NULL,
  `timeIndex` varchar(255) DEFAULT NULL,
  `chooseTimes` varchar(255) DEFAULT NULL,
  `thumbUps` varchar(255) DEFAULT NULL,
  `areaId` varchar(255) DEFAULT NULL,
  `fightServerId` varchar(255) DEFAULT NULL,
  `fightersJson` longtext DEFAULT NULL,
  `rankNum` varchar(255) DEFAULT NULL,
  `winCount` varchar(255) DEFAULT NULL,
  `battleCount` varchar(255) DEFAULT NULL,
  `groupId` varchar(255) DEFAULT NULL,
  `groupIndex` varchar(255) DEFAULT NULL,
  `enemyId` varchar(255) DEFAULT NULL,
  `areaEnemys` varchar(255) DEFAULT NULL,
  `areaResults` varchar(255) DEFAULT NULL,
  `finalResult` varchar(255) DEFAULT NULL,
  `camp` varchar(255) DEFAULT NULL,
  `groupChampion` varchar(255) DEFAULT NULL,
  `fightTurns` varchar(255) DEFAULT NULL,
  `announcement` varchar(255) DEFAULT NULL,
  `lastAnnounceMillis` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
