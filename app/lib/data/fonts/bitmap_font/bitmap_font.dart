import 'dart:ui' as ui;

import 'package:flutter/services.dart';

class BitmapFont {
  BitmapFont(this.image, this.glyphs);
  final ui.Image image;
  final Map<int, Map<String, int>> glyphs;

  static Future<BitmapFont> load() async {
    final description = await rootBundle.loadString(
      'assets/fonts/bitmap/iskoola_pota.fnt',
    );
    final bytes = await rootBundle.load('assets/fonts/bitmap/iskoola_pota.png');
    final codec = await ui.instantiateImageCodec(
      bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes),
    );
    final frame = await codec.getNextFrame();
    codec.dispose();
    final glyphs = <int, Map<String, int>>{};
    for (final line in description.split('\n')) {
      if (!line.startsWith('char ')) continue;
      final values = <String, int>{
        for (final match in RegExp(r'(\w+)=(-?\d+)').allMatches(line))
          match[1]!: int.parse(match[2]!),
      };
      glyphs[values['id']!] = values;
    }
    return BitmapFont(frame.image, glyphs);
  }

  double width(String text) => text.runes.fold(
    0.0,
    (width, rune) => width + (glyphs[rune]?['xadvance'] ?? 0),
  );
}
