import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_action/hud_action.dart';

Widget hudActionArea(
  ValueChanged<HudAction> onAction,
  HudAction action,
  String label,
  double x,
  double y,
  double width,
  double height,
) => Positioned(
  left: x,
  top: y,
  width: width,
  height: height,
  child: Semantics(
    button: true,
    label: label,
    child: GestureDetector(
      key: ValueKey(action),
      behavior: HitTestBehavior.opaque,
      onTap: () => onAction(action),
      child: const SizedBox.expand(),
    ),
  ),
);
