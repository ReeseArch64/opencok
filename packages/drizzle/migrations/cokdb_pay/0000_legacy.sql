-- Generated schema-only baseline. Original ROW_FORMAT=COMPACT becomes DYNAMIC, as in the legacy importer.
SET NAMES utf8mb4;
--> statement-breakpoint
CREATE TABLE `download` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `app_icon` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `link` text DEFAULT NULL,
  `version` varchar(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `exchange` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` varchar(255) NOT NULL DEFAULT '11001',
  `paidGold` bigint(20) NOT NULL DEFAULT 0,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `ItemId` longtext DEFAULT NULL,
  `monthly_card` int(11) NOT NULL DEFAULT 2,
  `status` varchar(255) DEFAULT NULL,
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `pack_type` varchar(255) NOT NULL DEFAULT '1',
  `discount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods` (
  `id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `type2` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `goods_name` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
--> statement-breakpoint
CREATE TABLE `logs_packages` (
  `usn` int(11) DEFAULT NULL,
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `packid` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `originalpoints` varchar(50) DEFAULT NULL,
  `points` varchar(50) DEFAULT NULL,
  `time` datetime DEFAULT '0000-00-00 00:00:00',
  `serverid` int(11) DEFAULT 0,
  `db` varchar(10) DEFAULT NULL,
  `ip` varchar(40) DEFAULT NULL,
  `browser` varchar(40) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logs_password` (
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `old_password` varchar(50) DEFAULT NULL,
  `new_password` varchar(50) DEFAULT NULL,
  `time` datetime DEFAULT '0000-00-00 00:00:00',
  `serverid` int(11) DEFAULT 0,
  `ip` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `logs_points` (
  `usn` int(11) DEFAULT NULL,
  `Transaction_ID` varchar(255) DEFAULT NULL,
  `points` varchar(50) DEFAULT NULL,
  `old_points` varchar(50) DEFAULT NULL,
  `new_points` varchar(50) DEFAULT NULL,
  `time` datetime DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `uid` varchar(255) NOT NULL DEFAULT '0',
  `serverId` varchar(255) DEFAULT NULL,
  `orderId` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `ItemId` longtext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `ItemName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `gold` varchar(255) DEFAULT NULL,
  `item_number` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `item_price` varchar(10) DEFAULT '',
  `item_price_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `paid_amount` varchar(10) DEFAULT NULL,
  `paid_amount_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `txn_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `payment_status` varchar(25) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `package` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `usd` int(11) NOT NULL DEFAULT 0,
  `itemId` longtext DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 100.00,
  `status` varchar(255) DEFAULT NULL,
  `images` varbinary(255) NOT NULL DEFAULT '57067_ad1_new',
  `currency` varchar(255) NOT NULL DEFAULT 'USD',
  `monthly_card` varchar(255) NOT NULL DEFAULT '1',
  `gold_pack_only` varchar(255) NOT NULL DEFAULT '0',
  `festival_item` varchar(255) DEFAULT NULL,
  `pack_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `packs` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(255) NOT NULL DEFAULT 'NRAGON MOD SHOP',
  `contents` longtext DEFAULT NULL,
  `images` varchar(255) NOT NULL DEFAULT 'novia',
  `gold` int(11) DEFAULT 0,
  `price` int(11) DEFAULT 1000,
  `items` longtext DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `pack_type` varchar(255) NOT NULL DEFAULT 'gold',
  `status` int(11) NOT NULL DEFAULT 0,
  `popup_image` varchar(255) NOT NULL DEFAULT 'novia',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `payfive` (
  `date` varchar(40) NOT NULL,
  `pf` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  `paysum` float(20,2) DEFAULT NULL,
  `paytimes` int(11) DEFAULT NULL,
  PRIMARY KEY (`date`,`pf`,`country`) USING BTREE,
  KEY `index` (`country`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `uid` varchar(11) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `item_number` varchar(50) NOT NULL,
  `txn_id` varchar(50) NOT NULL,
  `payment_gross` float(10,2) NOT NULL,
  `currency_code` varchar(5) NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  PRIMARY KEY (`payment_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `payments_api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentId` varchar(255) NOT NULL DEFAULT '',
  `orderId` varchar(255) DEFAULT NULL,
  `productId` varchar(255) DEFAULT NULL,
  `gameUid` varchar(255) NOT NULL DEFAULT '',
  `payerId` varchar(255) NOT NULL DEFAULT '',
  `successTimestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `paypal_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `pack_type` varchar(255) DEFAULT NULL,
  `item_number` varchar(50) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `item_price` float(10,2) DEFAULT NULL,
  `item_price_currency` varchar(10) DEFAULT NULL,
  `payer_id` varchar(50) DEFAULT NULL,
  `payer_name` varchar(50) DEFAULT NULL,
  `payer_email` varchar(50) DEFAULT NULL,
  `payer_country` varchar(20) DEFAULT NULL,
  `merchant_id` varchar(255) DEFAULT NULL,
  `merchant_email` varchar(50) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `paid_amount` float(10,2) NOT NULL,
  `paid_amount_currency` varchar(10) NOT NULL,
  `payment_source` varchar(50) DEFAULT NULL,
  `payment_status` varchar(25) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `payrecord` (
  `uid` varchar(40) NOT NULL,
  `orderId` varchar(200) NOT NULL,
  `method` varchar(20) NOT NULL,
  `request` blob DEFAULT NULL,
  `postParam` blob DEFAULT NULL,
  `result` blob DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `lastCheckTime` int(11) DEFAULT NULL,
  `checkTimes` int(11) DEFAULT 0,
  `checkHistory` blob DEFAULT NULL,
  `checkResult` int(11) DEFAULT 0,
  PRIMARY KEY (`uid`,`orderId`,`method`) USING BTREE,
  KEY `index` (`time`,`method`,`checkResult`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `points_packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT 'Land of WaR Shop',
  `price` varchar(255) DEFAULT NULL,
  `shop_type` varchar(255) NOT NULL DEFAULT 'inapp',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `products_web` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `orderId` varchar(255) DEFAULT NULL,
  `ItemId` varchar(255) DEFAULT NULL,
  `ItemName` varchar(255) DEFAULT NULL,
  `item_number` varchar(50) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `item_price` float(10,2) DEFAULT NULL,
  `item_price_currency` varchar(10) DEFAULT NULL,
  `payer_id` varchar(50) DEFAULT NULL,
  `payer_name` varchar(50) DEFAULT NULL,
  `payer_email` varchar(50) DEFAULT NULL,
  `payer_country` varchar(20) DEFAULT NULL,
  `merchant_id` varchar(255) DEFAULT NULL,
  `merchant_email` varchar(50) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `paid_amount` float(10,2) NOT NULL,
  `paid_amount_currency` varchar(10) NOT NULL,
  `payment_source` varchar(50) DEFAULT NULL,
  `payment_status` varchar(25) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `users` (
  `usn` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` varchar(40) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `usd` int(11) NOT NULL DEFAULT 0,
  `name` varchar(15) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `totalpaid` int(11) DEFAULT 0,
  `lastbuytime` datetime DEFAULT '0000-00-00 00:00:00',
  `server` int(11) DEFAULT 0,
  `db` varchar(8) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `deviceid` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `banned` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`usn`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1216 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
--> statement-breakpoint
CREATE TABLE `video` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `video_key` longtext NOT NULL,
  `status` varchar(255) DEFAULT '0',
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;
