import 'package:flutter/material.dart';

Widget profileText(
  String text,
  double x,
  double y,
  double width,
  double height,
  double size,
) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: Center(
    child: Text(
      text,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      textScaler: TextScaler.noScaling,
      style: TextStyle(
        fontFamily: 'Cooljazz',
        fontSize: size,
        color: const Color(0xffeee9dc),
      ),
    ),
  ),
);
