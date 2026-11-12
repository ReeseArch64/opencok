// Unit tests live beside their source; flutter_test stays a dev dependency.
// ignore_for_file: depend_on_referenced_packages

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/ui/training/screens/training_screen/training_screen.dart';

void main() {
  for (final size in [
    const Size(320, 568),
    const Size(390, 844),
    const Size(844, 390),
    const Size(800, 1280),
    const Size(1024, 600),
    const Size(1440, 900),
  ]) {
    testWidgets('training controls remain accessible at $size', (tester) async {
      await tester.binding.setSurfaceSize(size);
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        MaterialApp(
          locale: const Locale('pt'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: TrainingScreen(building: CastleBuildings.military.last),
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      expect(
        find.byKey(
          ValueKey(
            size.width >= 900
                ? 'training-desktop-layout'
                : 'training-mobile-layout',
          ),
        ),
        findsOneWidget,
      );
      final quantity = find.byKey(const ValueKey('training-quantity'));
      await tester.ensureVisible(quantity);
      await tester.enterText(quantity, '42');
      await tester.pumpAndSettle();
      expect(tester.widget<TextField>(quantity).controller!.text, '42');
      final train = find.text('Treinar');
      await tester.ensureVisible(train);
      await tester.tap(train);
      await tester.pumpAndSettle();
      expect(find.text('Treinamento indisponível'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }

  testWidgets('resizing and keyboard keep training quantity', (tester) async {
    await tester.binding.setSurfaceSize(const Size(1440, 900));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('pt'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: TrainingScreen(building: CastleBuildings.military.last),
      ),
    );
    await tester.pumpAndSettle();
    final quantity = find.byKey(const ValueKey('training-quantity'));
    await tester.enterText(quantity, '123');
    await tester.binding.setSurfaceSize(const Size(390, 844));
    tester.view.viewInsets = const FakeViewPadding(bottom: 300);
    addTearDown(tester.view.resetViewInsets);
    await tester.pumpAndSettle();
    await tester.ensureVisible(quantity);
    expect(tester.widget<TextField>(quantity).controller!.text, '123');
    expect(tester.takeException(), isNull);
  });

  testWidgets('future cultures stay hidden after swiping the unit preview', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('pt'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: TrainingScreen(building: CastleBuildings.military.last),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Simples'), findsOneWidget);
    for (final delta in [const Offset(-300, 0), const Offset(300, 0)]) {
      await tester.drag(find.byKey(const ValueKey('unit-portrait-0')), delta);
      await tester.pumpAndSettle();
      expect(find.text('Simples'), findsOneWidget);
      for (final label in [
        'Vikings',
        'Japonesas',
        'Chinesas',
        'Persas',
        'Especiais',
      ]) {
        expect(find.text(label), findsNothing);
      }
      expect(tester.takeException(), isNull);
    }
  });
}
