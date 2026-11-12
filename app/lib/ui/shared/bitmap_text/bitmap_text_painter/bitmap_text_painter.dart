import 'package:flutter/material.dart';
import 'package:opencok/data/fonts/bitmap_font/bitmap_font.dart';

class BitmapTextPainter extends CustomPainter {
  BitmapTextPainter(this.text, this.font, this.fontSize, this.color);
  final String text;
  final BitmapFont font;
  final Color color;
  final double fontSize;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(fontSize / 30);
    final paint = Paint()
      ..filterQuality = FilterQuality.medium
      ..colorFilter = ColorFilter.mode(color, BlendMode.srcIn);
    var x = 0.0;
    for (final rune in text.runes) {
      final g = font.glyphs[rune];
      if (g == null) continue;
      canvas.drawImageRect(
        font.image,
        Rect.fromLTWH(
          g['x']!.toDouble(),
          g['y']!.toDouble(),
          g['width']!.toDouble(),
          g['height']!.toDouble(),
        ),
        Rect.fromLTWH(
          x + g['xoffset']!,
          g['yoffset']!.toDouble(),
          g['width']!.toDouble(),
          g['height']!.toDouble(),
        ),
        paint,
      );
      x += g['xadvance']!;
    }
  }

  @override
  bool shouldRepaint(BitmapTextPainter oldDelegate) =>
      oldDelegate.text != text ||
      oldDelegate.font != font ||
      oldDelegate.fontSize != fontSize ||
      oldDelegate.color != color;
}
