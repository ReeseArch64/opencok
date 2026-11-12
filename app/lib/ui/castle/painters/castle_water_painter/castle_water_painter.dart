import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';

class CastleWaterPainter extends CustomPainter {
  CastleWaterPainter(this.environment, this.clock, this.camera, this.viewport)
    : super(repaint: Listenable.merge([clock, camera]));

  final CastleEnvironment environment;
  final Animation<double> clock;
  final TransformationController camera;
  final Size viewport;

  @override
  void paint(Canvas canvas, Size size) {
    final visible = Rect.fromPoints(
      camera.toScene(Offset.zero),
      camera.toScene(viewport.bottomRight(Offset.zero)),
    );
    final seconds = clock.value * 120;
    final transform = Matrix4.diagonal3Values(4, 4, 1)
      ..setTranslationRaw(seconds * (1520 / 120), seconds * 5, 0);
    canvas.saveLayer(visible, Paint());
    canvas.drawRect(
      visible,
      Paint()
        ..filterQuality = FilterQuality.low
        ..shader = ui.ImageShader(
          environment.images['river_surface']!,
          TileMode.mirror,
          TileMode.mirror,
          transform.storage,
        ),
    );
    final mask = environment.images['river_mask.png']!;
    canvas.drawImageRect(
      mask,
      Rect.fromLTWH(0, 0, mask.width.toDouble(), mask.height.toDouble()),
      Offset.zero & size,
      Paint()
        ..filterQuality = FilterQuality.low
        ..blendMode = BlendMode.dstIn,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(CastleWaterPainter oldDelegate) =>
      oldDelegate.environment != environment ||
      oldDelegate.viewport != viewport ||
      oldDelegate.clock != clock;
}
