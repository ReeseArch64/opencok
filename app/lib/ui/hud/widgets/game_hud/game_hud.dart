import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_action/hud_action.dart';
import 'package:opencok/domain/hud/hud_data/hud_data.dart';
import 'package:opencok/ui/hud/widgets/hud_bottom_bar/hud_bottom_bar.dart';
import 'package:opencok/ui/hud/widgets/hud_canvas/hud_canvas.dart';
import 'package:opencok/ui/hud/widgets/hud_top_bar/hud_top_bar.dart';

class GameHud extends StatelessWidget {
  const GameHud({
    super.key,
    required this.data,
    required this.onAction,
    this.child = const SizedBox.expand(),
    this.onWorldMap = false,
  });

  final HudData data;
  final ValueChanged<HudAction> onAction;
  final Widget child;
  final bool onWorldMap;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final scale = math.min(
        constraints.maxWidth / 640,
        math.min(1.0, constraints.maxHeight / 852),
      );
      final canvasWidth = constraints.maxWidth / scale;
      return Stack(
        children: [
          Positioned.fill(child: child),
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 124 * scale,
            child: HudCanvas(
              width: canvasWidth,
              height: 124,
              child: HudTopBar(
                width: canvasWidth,
                data: data,
                onAction: onAction,
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            height: 156 * scale,
            child: HudCanvas(
              width: canvasWidth,
              height: 156,
              child: HudBottomBar(
                width: canvasWidth,
                data: data,
                onAction: onAction,
                onWorldMap: onWorldMap,
              ),
            ),
          ),
        ],
      );
    },
  );
}
