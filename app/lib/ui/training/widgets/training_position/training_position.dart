import 'package:flutter/material.dart';

Widget trainingPosition(double x, double y, double w, double h, Widget child) =>
    Positioned(left: x, top: y, width: w, height: h, child: child);
