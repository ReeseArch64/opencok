import 'package:flutter/material.dart';

Widget profileActionArea(
  String label,
  double x,
  double y,
  double width,
  double height,
  VoidCallback onTap,
) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: Semantics(
    button: true,
    label: label,
    child: GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: const SizedBox.expand(),
    ),
  ),
);
