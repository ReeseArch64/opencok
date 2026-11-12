import 'package:flutter/material.dart';
import 'package:opencok/ui/hud/widgets/hud_label/hud_label.dart';
import 'package:opencok/ui/hud/widgets/hud_sprite/hud_sprite.dart';

Widget hudResource(String asset, String value, double x) => Positioned(
  left: x,
  top: 0,
  width: 115,
  height: 42,
  child: Stack(
    children: [
      hudSprite(asset, 6, 5, 32, 32),
      hudLabel(value, 40, 4, 75, 32, size: 20, align: TextAlign.left),
    ],
  ),
);
