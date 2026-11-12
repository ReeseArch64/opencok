import 'package:flutter/material.dart';
import 'package:opencok/ui/shared/bitmap_text/bitmap_text/bitmap_text.dart';

Widget hudLabel(
  String value,
  double x,
  double y,
  double width,
  double height, {
  double size = 20,
  Color color = const Color(0xfffeffff),
  TextAlign align = TextAlign.center,
  bool serif = false,
}) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: ExcludeSemantics(
    child: Align(
      alignment: align == TextAlign.left
          ? Alignment.centerLeft
          : Alignment.center,
      child: serif
          ? BitmapText(value, fontSize: size, color: color)
          : Text(
              value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textScaler: TextScaler.noScaling,
              textAlign: align,
              style: TextStyle(
                fontFamily: 'Cooljazz',
                fontFamilyFallback: const ['serif'],
                fontSize: size,
                height: 1,
                color: color,
                shadows: const [
                  Shadow(
                    color: Colors.black,
                    offset: Offset(1, 1),
                    blurRadius: 1.5,
                  ),
                ],
              ),
            ),
    ),
  ),
);
