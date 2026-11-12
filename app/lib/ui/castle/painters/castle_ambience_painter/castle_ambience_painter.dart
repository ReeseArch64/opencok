import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/domain/castle/castle_building/castle_building.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';

/// The scenery remains cached in separate repaint boundaries. Only these
/// transparent layers advance with time; animation never rebuilds the HUD.
class CastleAmbiencePainter extends CustomPainter {
  CastleAmbiencePainter(
    this.environment,
    this.clock,
    this.camera,
    this.viewport, {
    this.selected,
  }) : super(repaint: Listenable.merge([clock, camera]));

  final CastleEnvironment environment;
  final Animation<double> clock;
  final TransformationController camera;
  final Size viewport;
  final CastleBuilding? selected;

  @override
  void paint(Canvas canvas, Size size) {
    final visible = Rect.fromPoints(
      camera.toScene(Offset.zero),
      camera.toScene(viewport.bottomRight(Offset.zero)),
    ).inflate(160);
    final time = clock.value * 120;
    canvas.save();
    canvas.clipRect(visible);
    _waterfall(canvas, time);
    _smoke(canvas, time, const Offset(4072, 1175));
    _birds(canvas, time);
    _clouds(canvas, size, time);
    if (selected case final building?) {
      _selection(canvas, building, time);
    }
    canvas.restore();
  }

  void _waterfall(Canvas canvas, double time) {
    // Follow the exposed water to the right of the turret, never its masonry.
    canvas.save();
    canvas.clipPath(
      Path()
        ..moveTo(3430, 617)
        ..lineTo(3490, 648)
        ..lineTo(3524, 827)
        ..lineTo(3460, 863)
        ..close(),
    );
    for (var i = 0; i < 25; i++) {
      final phase = (time * 0.48 + i * 0.618) % 1;
      final x = 3432 + (i * 17 % 75).toDouble();
      final y = 590 + phase * 320;
      canvas.drawLine(
        Offset(x, y),
        Offset(x + 6, y + 42),
        Paint()
          ..color = const Color(0xffd8fbff)
              .withValues(alpha: 0.12 * math.sin(phase * math.pi))
          ..strokeWidth = 2 + (i % 3).toDouble()
          ..strokeCap = StrokeCap.round,
      );
    }
    canvas.restore();
    // Soft spray rises from the foot of the cascade.
    for (var i = 0; i < 12; i++) {
      final age = (time / 4 + i / 12) % 1;
      canvas.drawCircle(
        Offset(3470 + math.sin(i * 2.4 + age) * 28, 858 - age * 66),
        8 + age * 15,
        Paint()
          ..color = const Color(0xffd8f5fa)
              .withValues(alpha: math.sin(age * math.pi) * 0.06)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10),
      );
    }
  }

  void _smoke(Canvas canvas, double time, Offset origin) {
    for (var i = 0; i < 16; i++) {
      final age = (time / 8 + i / 16) % 1;
      final drift = math.sin(i * 2.1 + age * 2) * 12 + age * 40;
      final radius = 5 + age * 22;
      canvas.drawCircle(
        origin + Offset(drift, -age * 140),
        radius,
        Paint()
          ..color = const Color(0xffc1c4bc)
              .withValues(alpha: math.sin(age * math.pi) * 0.15)
          ..maskFilter = MaskFilter.blur(BlurStyle.normal, radius * 0.6),
      );
    }
  }

  void _birds(Canvas canvas, double time) {
    final angle = time * math.pi / 30;
    final center = Offset(
      4230 + math.cos(angle) * 700,
      1050 + math.sin(angle) * 230,
    );
    for (var i = 0; i < 5; i++) {
      final position =
          center + Offset(-i * 24.0, (i.isEven ? 1 : -1) * i * 10.0);
      final flap = math.sin(time * math.pi * 2 + i) * 5;
      canvas.drawPath(
        Path()
          ..moveTo(position.dx - 9, position.dy + flap)
          ..quadraticBezierTo(
            position.dx - 4,
            position.dy - 3,
            position.dx,
            position.dy,
          )
          ..quadraticBezierTo(
            position.dx + 4,
            position.dy - 3,
            position.dx + 9,
            position.dy + flap,
          ),
        Paint()
          ..color = const Color(0xb3303939)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2
          ..strokeCap = StrokeCap.round,
      );
    }
  }

  void _clouds(Canvas canvas, Size size, double time) {
    final cloud = environment.images['clouds.png']!;
    final offset = math.sin(time * math.pi / 60) * 180;
    canvas.drawImageRect(
      cloud,
      Rect.fromLTWH(0, 0, cloud.width.toDouble(), cloud.height.toDouble()),
      Rect.fromLTWH(offset - 180, 0, size.width + 360, 420),
      Paint()..filterQuality = FilterQuality.low,
    );
    // Very light haze crosses the courtyard independently of the camera.
    for (var i = 0; i < 3; i++) {
      final x = 3400 + ((time * 18 + i * 820) % 2460);
      final rect = Rect.fromCenter(
        center: Offset(x, 1020 + i * 290.0),
        width: 750,
        height: 180,
      );
      canvas.drawOval(
        rect,
        Paint()
          ..color = const Color(0x09fff8df)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 65),
      );
    }
  }

  void _selection(Canvas canvas, CastleBuilding building, double time) {
    final bounds = building.bounds;
    final center = bounds.bottomCenter - const Offset(0, 38);
    final width = bounds.width * 0.53;
    final height = bounds.height * 0.19;
    final pulse = (math.sin(time * math.pi) + 1) / 2;
    final path = Path()
      ..moveTo(center.dx, center.dy - height)
      ..lineTo(center.dx + width, center.dy)
      ..lineTo(center.dx, center.dy + height)
      ..lineTo(center.dx - width, center.dy)
      ..close();
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xfff8d57d)
            .withValues(alpha: 0.12 + pulse * 0.08),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xfff8d57d).withValues(alpha: 0.20 + pulse * 0.15)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 13
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = const Color(0xffffde8c)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5,
    );
    // Tint only opaque building pixels, retaining the original silhouette.
    final image = environment.images[building.asset]!;
    canvas.drawImageRect(
      image,
      Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      bounds,
      Paint()
        ..colorFilter = ColorFilter.mode(
          const Color(0xfff8d57d).withValues(alpha: 0.09 + pulse * 0.04),
          BlendMode.srcATop,
        ),
    );
  }

  @override
  bool shouldRepaint(CastleAmbiencePainter oldDelegate) =>
      oldDelegate.environment != environment ||
      oldDelegate.viewport != viewport ||
      oldDelegate.selected != selected ||
      oldDelegate.clock != clock;
}
