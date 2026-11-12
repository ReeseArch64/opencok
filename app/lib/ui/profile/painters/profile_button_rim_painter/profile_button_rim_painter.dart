import 'package:flutter/material.dart';

class ProfileButtonRimPainter extends CustomPainter {
  const ProfileButtonRimPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.width * .46;
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.2
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          Color(0xffe0d5ad),
          Color(0xff847a62),
          Color(0xffc2b18a),
          Color(0xff665c47),
        ],
      ).createShader(Offset.zero & size);
    canvas.drawCircle(center, radius, paint);
    final tabs = Path();
    for (final direction in [-1.0, 1.0]) {
      final x = center.dx + direction * radius;
      tabs.moveTo(x - direction * 3, center.dy - 10);
      tabs.lineTo(x + direction * 5, center.dy + 1);
      tabs.lineTo(x - direction * 4, center.dy + 4);
      tabs.lineTo(x - direction * 5, center.dy + 13);
    }
    canvas.drawPath(tabs, paint..strokeWidth = 2);
  }

  @override
  bool shouldRepaint(ProfileButtonRimPainter oldDelegate) => false;
}
