import 'package:flutter/material.dart';

Widget hudSprite(
  String asset,
  double x,
  double y,
  double width,
  double height, {
  bool flip = false,
}) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: Transform.flip(
    flipX: flip,
    child: Image.asset(
      'assets/ui/hud/$asset',
      fit: BoxFit.fill,
      excludeFromSemantics: true,
      filterQuality: FilterQuality.medium,
    ),
  ),
);
