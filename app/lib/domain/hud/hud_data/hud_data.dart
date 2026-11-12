import 'package:flutter/foundation.dart';

@immutable
class HudData {
  const HudData({
    required this.level,
    required this.experience,
    required this.energy,
    required this.vip,
    required this.wood,
    required this.food,
    required this.iron,
    required this.mithril,
    required this.power,
    required this.gold,
    this.dailyCount = 0,
    this.mailCount = 0,
    this.portrait,
    this.chat = '',
    this.chatVip = '',
  });

  final int level, dailyCount, mailCount;
  final double experience, energy;
  final String? portrait;
  final String vip, wood, food, iron, mithril, power, gold, chat, chatVip;
}
