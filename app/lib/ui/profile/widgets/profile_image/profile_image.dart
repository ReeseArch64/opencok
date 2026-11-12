import 'package:flutter/material.dart';

Widget profileImage(
  String name,
  double x,
  double y,
  double width,
  double height, {
  bool flip = false,
  BoxFit fit = BoxFit.fill,
}) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: Transform.flip(
    flipX: flip,
    child: Image.asset(
      'assets/ui/profile/$name.png',
      fit: fit,
      excludeFromSemantics: true,
      filterQuality: FilterQuality.medium,
    ),
  ),
);
