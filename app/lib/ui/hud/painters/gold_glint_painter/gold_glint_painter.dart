import 'dart:math' as math;

import 'package:flutter/material.dart';

class GoldGlintPainter extends CustomPainter {
  GoldGlintPainter(this.animation) : super(repaint: animation);
  final Animation<double> animation;

  @override
  void paint(Canvas canvas, Size size) {
    final progress = (animation.value * 4.6 - 1.0) / 2.0;
    if (progress <= 0 || progress >= 1) return;
    final opacity = math.min(1.0, math.min(progress, 1 - progress) * 8);
    final angle = (55 - 190 * progress) * math.pi / 180;
    final center = Offset(49 + 23 * math.cos(angle), 28 + 26 * math.sin(angle));
    canvas.save();
    canvas.scale(size.width / 78, size.height / 58);
    final paint = Paint();
    paint.shader = RadialGradient(
      colors: [
        Colors.white.withValues(alpha: opacity),
        const Color(0xfffff69a).withValues(alpha: opacity * 0.7),
        const Color(0xffffd500).withValues(alpha: opacity * 0.3),
        const Color(0xffffd500).withValues(alpha: 0),
      ],
      stops: const [0, 0.12, 0.35, 1],
    ).createShader(Rect.fromCircle(center: center, radius: 11));
    canvas.drawCircle(center, 11, paint);
    paint.shader = null;
    paint.color = const Color(0xfffff4ad).withValues(alpha: opacity * 0.5);
    final star = Path()
      ..moveTo(center.dx - 12, center.dy)
      ..lineTo(center.dx - 1, center.dy - 1.2)
      ..lineTo(center.dx, center.dy - 6)
      ..lineTo(center.dx + 1, center.dy - 1.2)
      ..lineTo(center.dx + 12, center.dy)
      ..lineTo(center.dx + 1, center.dy + 1.2)
      ..lineTo(center.dx, center.dy + 6)
      ..lineTo(center.dx - 1, center.dy + 1.2)
      ..close();
    canvas.drawPath(star, paint);
    paint.color = Colors.white.withValues(alpha: opacity);
    canvas.drawOval(
      Rect.fromCenter(center: center, width: 3, height: 2),
      paint,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(GoldGlintPainter oldDelegate) =>
      animation != oldDelegate.animation;
}
