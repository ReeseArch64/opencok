import 'package:flutter/material.dart';
import 'package:opencok/ui/hud/widgets/hud_label/hud_label.dart';

Widget hudBadge(int count, double x, double y) => Positioned(
  left: x,
  top: y,
  width: 38,
  height: 38,
  child: Stack(
    children: [
      Positioned.fill(
        child: Image.asset('assets/ui/hud/badges/notification_badge.png'),
      ),
      hudLabel(count > 99 ? '99+' : '$count', 0, 0, 38, 38, size: 22),
    ],
  ),
);
