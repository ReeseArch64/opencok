// ignore_for_file: depend_on_referenced_packages

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/ui/login/widgets/loading_backdrop/loading_backdrop.dart';

void main() {
  for (final size in [const Size(390, 844), const Size(1440, 900)]) {
    testWidgets('loading artwork fills $size without stretching', (
      tester,
    ) async {
      await tester.binding.setSurfaceSize(size);
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        const MaterialApp(
          home: MediaQuery(
            data: MediaQueryData(disableAnimations: true),
            child: LoadingBackdrop(),
          ),
        ),
      );
      await tester.pumpAndSettle();
      final image = tester.widget<Image>(find.byType(Image));
      expect(
        (image.image as AssetImage).assetName,
        'assets/ui/login/loading_artwork.webp',
      );
      expect(image.fit, BoxFit.cover);
      expect(tester.getSize(find.byType(LoadingBackdrop)), size);
      expect(tester.takeException(), isNull);
    });
  }
}
