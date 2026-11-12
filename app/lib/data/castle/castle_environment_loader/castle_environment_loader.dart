import 'dart:ui' as ui;

import 'package:flutter/services.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';

class CastleEnvironmentLoader {
  static Future<CastleEnvironment> load({AssetBundle? bundle}) async {
    final images = <String, ui.Image>{};
    try {
      for (final name in [
        for (var i = 1; i <= 35; i++) CastleEnvironment.tileName(i),
        'distant_mountains.png',
        'river_texture.png',
        'river_mask.png',
        'clouds.png',
        'autumn_tree.png',
      ]) {
        final data = await (bundle ?? rootBundle).load(
          '${CastleEnvironment.assetRoot}$name',
        );
        final codec = await ui.instantiateImageCodec(
          data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
        );
        try {
          images[name] = (await codec.getNextFrame()).image;
        } finally {
          codec.dispose();
        }
      }
      for (final building in CastleBuildings.military) {
        final data = await (bundle ?? rootBundle).load(
          '${CastleBuildings.assetRoot}${building.asset}',
        );
        final codec = await ui.instantiateImageCodec(
          data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes),
        );
        try {
          images[building.asset] = (await codec.getNextFrame()).image;
        } finally {
          codec.dispose();
        }
      }
      final recorder = ui.PictureRecorder();
      ui.Canvas(recorder).drawImageRect(
        images['river_texture.png']!,
        const ui.Rect.fromLTWH(295, 64, 190, 75),
        const ui.Rect.fromLTWH(0, 0, 190, 75),
        ui.Paint(),
      );
      final picture = recorder.endRecording();
      try {
        images['river_surface'] = await picture.toImage(190, 75);
      } finally {
        picture.dispose();
      }
      return CastleEnvironment(images);
    } catch (_) {
      for (final image in images.values) {
        image.dispose();
      }
      rethrow;
    }
  }
}
