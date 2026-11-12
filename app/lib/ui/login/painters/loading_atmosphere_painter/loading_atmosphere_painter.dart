import 'dart:math' as math;

import 'package:flutter/material.dart';

class LoadingAtmospherePainter extends CustomPainter {
  LoadingAtmospherePainter(this.animation) : super(repaint: animation);

  final Animation<double> animation;

  @override
  void paint(Canvas canvas, Size size) {
    final time = animation.value;
    final scale = math.min(size.width / 640, size.height / 960);
    final paint = Paint()..blendMode = BlendMode.plus;
    for (var i = 0; i < 48; i++) {
      final phase = (time + i * 0.61803398875) % 1;
      final opacity = math.sin(phase * math.pi) * .65;
      final center = Offset(
        ((i * .381966 + math.sin(phase * math.pi * 2 + i) * .025) % 1) *
            size.width,
        (1 - phase) * size.height,
      );
      final radius = (i % 4 == 0 ? 3.0 : 1.5) * scale;
      paint.color = const Color(0xffffce83).withValues(alpha: opacity * .18);
      canvas.drawCircle(center, radius * 3, paint);
      paint.color = const Color(0xffffe8b3).withValues(alpha: opacity);
      canvas.drawCircle(center, radius, paint);
    }

    final center = Offset(
      size.width * (.4 + .1 * math.sin(time * math.pi * 2)),
      size.height * .2,
    );
    final glow = Rect.fromCircle(
      center: center,
      radius: size.shortestSide * .45,
    );
    paint.shader = RadialGradient(
      colors: [
        const Color(0xffffe5af)
            .withValues(alpha: .025 + .02 * math.sin(time * math.pi * 2)),
        Colors.transparent,
      ],
    ).createShader(glow);
    canvas.drawOval(glow, paint);
  }

  @override
  bool shouldRepaint(LoadingAtmospherePainter oldDelegate) =>
      oldDelegate.animation != animation;
}
