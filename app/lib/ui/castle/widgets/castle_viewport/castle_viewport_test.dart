import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/ui/castle/widgets/castle_viewport/castle_viewport.dart';

void main() {
  testWidgets('castle camera hides western expansion at every window size', (
    tester,
  ) async {
    final recorder = ui.PictureRecorder();
    Canvas(recorder).drawColor(Colors.green, BlendMode.src);
    final picture = recorder.endRecording();
    final image = await picture.toImage(1, 1);
    picture.dispose();
    addTearDown(image.dispose);
    addTearDown(() => tester.binding.setSurfaceSize(null));
    final environment = CastleEnvironment({
      for (final name in [
        ...CastleEnvironment.tileNames,
        'distant_mountains.png',
        'river_surface',
        'river_mask.png',
        'clouds.png',
        'autumn_tree.png',
        for (final building in CastleBuildings.military) building.asset,
      ])
        name: image,
    });
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('pt'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: MediaQuery(
          data: const MediaQueryData(disableAnimations: true),
          child: CastleViewport(environment: environment),
        ),
      ),
    );
    for (final size in [const Size(390, 844), const Size(1920, 600)]) {
      await tester.binding.setSurfaceSize(size);
      await tester.pump();
      final viewer = tester.widget<InteractiveViewer>(
        find.byType(InteractiveViewer),
      );
      final camera = viewer.transformationController!;
      void checkBounds() {
        expect(
          camera.toScene(Offset.zero).dx,
          greaterThanOrEqualTo(CastleEnvironment.playableBounds.left - 0.01),
        );
        expect(
          camera.toScene(Offset(size.width, 0)).dx,
          lessThanOrEqualTo(CastleEnvironment.playableBounds.right + 0.01),
        );
      }

      checkBounds();
      camera.value = camera.value.clone()..setTranslationRaw(0, 0, 0);
      await tester.pump();
      checkBounds();
      expect(tester.takeException(), isNull);
    }
  });
}
