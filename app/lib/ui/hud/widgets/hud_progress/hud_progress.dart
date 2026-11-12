import 'package:flutter/material.dart';

Widget hudProgress(double y, double fraction, String asset) => Positioned(
  left: 5.2,
  top: y,
  width: 81,
  height: 10,
  child: Stack(
    children: [
      Positioned.fill(
        child: Image.asset(
          'assets/ui/hud/profile/progress_bar_background.png',
          fit: BoxFit.fill,
        ),
      ),
      ClipRect(
        child: Align(
          alignment: Alignment.centerLeft,
          widthFactor: fraction.clamp(0, 1),
          child: Image.asset(
            'assets/ui/hud/$asset',
            width: 81,
            height: 10,
            fit: BoxFit.fill,
          ),
        ),
      ),
    ],
  ),
);
