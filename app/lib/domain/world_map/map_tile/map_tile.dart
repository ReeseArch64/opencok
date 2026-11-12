import 'package:flutter/services.dart';

class MapTile {
  const MapTile(
    this.image,
    this.position, {
    this.size = const Size(256, 140),
    this.level,
    this.levelOffset,
  });
  final int image;
  final Offset position;
  final Size size;
  final int? level;
  final Offset? levelOffset;
  Rect get bounds => position & size;
}
