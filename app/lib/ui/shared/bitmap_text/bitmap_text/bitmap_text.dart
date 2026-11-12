import 'package:flutter/material.dart';
import 'package:opencok/data/fonts/bitmap_font/bitmap_font.dart';
import 'package:opencok/ui/shared/bitmap_text/bitmap_text_painter/bitmap_text_painter.dart';

class BitmapText extends StatelessWidget {
  const BitmapText(
    this.text, {
    super.key,
    required this.fontSize,
    this.color = const Color(0xfffeffff),
  });
  final String text;
  final double fontSize;
  final Color color;
  static final Future<BitmapFont> _font = BitmapFont.load();

  @override
  Widget build(BuildContext context) => FutureBuilder<BitmapFont>(
    future: _font,
    builder: (context, snapshot) {
      final font = snapshot.data;
      if (font == null) return const SizedBox.shrink();
      return CustomPaint(
        size: Size(font.width(text) * fontSize / 30, 35 * fontSize / 30),
        painter: BitmapTextPainter(text, font, fontSize, color),
      );
    },
  );
}
