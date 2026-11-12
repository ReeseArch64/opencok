import 'package:flutter/material.dart';

Widget trainingText(
  String value, {
  double size = 20,
  Color color = Colors.white,
}) => Text(
  value,
  maxLines: value.contains('\n') ? 2 : 1,
  overflow: TextOverflow.ellipsis,
  textAlign: TextAlign.center,
  style: TextStyle(
    fontFamily: 'Cooljazz',
    fontSize: size,
    height: 1.1,
    color: color,
  ),
);
