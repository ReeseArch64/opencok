import 'package:flutter/material.dart';
import 'package:opencok/ui/profile/actions/show_profile_preview/show_profile_preview.dart';
import 'package:opencok/ui/profile/painters/profile_button_rim_painter/profile_button_rim_painter.dart';

Widget profileRoundAction(
  BuildContext context,
  String icon,
  String label,
  double x,
  double y,
  double size,
) => Positioned(
  left: x,
  top: y,
  width: size,
  height: size,
  child: Semantics(
    button: true,
    label: label,
    child: GestureDetector(
      onTap: () => showProfilePreview(context, label),
      child: Stack(
        children: [
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: const [Color(0xff33313a), Color(0xff151923)],
                ),
              ),
            ),
          ),
          Positioned.fill(
            child: CustomPaint(painter: const ProfileButtonRimPainter()),
          ),
          Positioned.fill(
            child: Padding(
              padding: EdgeInsets.all(size * .20),
              child: ColorFiltered(
                colorFilter: const ColorFilter.matrix([
                  .27,
                  .54,
                  .10,
                  0,
                  25,
                  .26,
                  .52,
                  .10,
                  0,
                  24,
                  .23,
                  .46,
                  .09,
                  0,
                  19,
                  0,
                  0,
                  0,
                  1,
                  0,
                ]),
                child: Image.asset(
                  'assets/ui/profile/$icon.png',
                  fit: BoxFit.contain,
                  excludeFromSemantics: true,
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  ),
);
