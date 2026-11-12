import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';

class CastleEnvironmentPainter extends CustomPainter {
  CastleEnvironmentPainter(
    this.environment,
    this.camera,
    this.viewport, {
    this.backdrop = false,
  }) : super(repaint: camera);

  final bool backdrop;

  final CastleEnvironment environment;
  final TransformationController camera;
  final Size viewport;
  final _paint = Paint()..filterQuality = FilterQuality.low;

  void _image(Canvas canvas, String name, Rect destination, {Rect? source}) {
    final image = environment.images[name]!;
    canvas.drawImageRect(
      image,
      source ??
          Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      destination,
      _paint,
    );
  }

  @override
  void paint(Canvas canvas, Size size) {
    final visible = Rect.fromPoints(
      camera.toScene(Offset.zero),
      camera.toScene(viewport.bottomRight(Offset.zero)),
    ).inflate(2);
    canvas.save();
    canvas.clipRect(visible);
    if (backdrop) {
      canvas.drawRect(
        Offset.zero & size,
        Paint()
          ..shader = ui.Gradient.linear(
            Offset.zero,
            Offset(0, size.height),
            const [Color(0xffacc5d0), Color(0xff527c96)],
          ),
      );

      final backdropScale = size.height / 500;
      for (var i = 0; i < 2; i++) {
        canvas.save();
        canvas.translate(2700 - 900 * backdropScale, 0);
        if (i.isOdd) {
          canvas.translate(1800 * backdropScale, 0);
          canvas.scale(-1, 1);
        }
        _image(
          canvas,
          'distant_mountains.png',
          Rect.fromLTWH(0, 0, 900 * backdropScale, size.height),
          source: const Rect.fromLTWH(0, 0, 900, 500),
        );
        canvas.restore();
      }

      canvas.restore();
      return;
    }

    for (final rect in const [
      Rect.fromLTWH(1370, 370, 360, 240),
      Rect.fromLTWH(1650, 470, 430, 240),
    ]) {
      _image(
        canvas,
        CastleEnvironment.tileName(35),
        rect,
        source: const Rect.fromLTWH(120, 20, 450, 240),
      );
    }
    for (final rect in const [
      Rect.fromLTWH(1200, 1500, 700, 560),
      Rect.fromLTWH(2600, 1120, 720, 630),
    ]) {
      _image(
        canvas,
        CastleEnvironment.tileName(34),
        rect,
        source: const Rect.fromLTWH(500, 10, 450, 400),
      );
    }

    var y = 0.0;
    var number = 1;
    for (final height in CastleEnvironment.rowHeights) {
      var x = 0.0;
      for (final width in CastleEnvironment.columnWidths) {
        final rect = Rect.fromLTWH(x, y, width, height);
        if (rect.overlaps(visible)) {
          _image(canvas, CastleEnvironment.tileName(number), rect);
        }
        x += width;
        number++;
      }
      y += height;
    }

    const treeBounds = Rect.fromLTWH(2520, 990, 860, 860);
    if (treeBounds.overlaps(visible)) {
      _image(canvas, 'autumn_tree.png', treeBounds);
    }

    for (final building in CastleBuildings.military) {
      if (building.bounds.overlaps(visible)) {
        _image(canvas, building.asset, building.bounds);
      }
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(CastleEnvironmentPainter oldDelegate) =>
      oldDelegate.environment != environment ||
      oldDelegate.viewport != viewport ||
      oldDelegate.backdrop != backdrop;
}
