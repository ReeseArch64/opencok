import 'dart:math' as math;

import 'package:flutter/material.dart';

class LoadingBarShimmerPainter extends CustomPainter {
  const LoadingBarShimmerPainter({required this.progress, required this.phase});

  final double progress;
  final double phase;

  @override
  void paint(Canvas canvas, Size size) {
    final filledWidth = size.width * progress;
    if (filledWidth <= 0) return;
    canvas.save();
    canvas.clipRect(Rect.fromLTWH(0, 0, filledWidth, size.height));
    final center = (size.width + 120) * phase - 60;
    final beam = Rect.fromLTWH(center - 40, 0, 80, size.height);
    canvas.drawRect(
      beam,
      Paint()
        ..blendMode = BlendMode.plus
        ..shader = const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.transparent, Color(0xb3fff6c6), Colors.transparent],
        ).createShader(beam),
    );
    final pulse = 0.5 + 0.3 * math.sin(phase * math.pi * 2);
    canvas.drawCircle(
      Offset(filledWidth, size.height / 2),
      size.height * 0.75,
      Paint()
        ..color = const Color(0xffffe4a1).withValues(alpha: pulse)
        ..blendMode = BlendMode.plus
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, size.height / 3),
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(LoadingBarShimmerPainter oldDelegate) =>
      oldDelegate.progress != progress || oldDelegate.phase != phase;
}
