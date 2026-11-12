// ignore_for_file: depend_on_referenced_packages

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/data/training/training_catalog/training_catalog.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';

void main() {
  test('all catalog names resolve in every supported locale', () async {
    for (final locale in AppLocalizations.supportedLocales) {
      final translations = await AppLocalizations.delegate.load(locale);
      for (final building in CastleBuildings.military) {
        expect(translations.gameName(building.nameKey), isNotEmpty);
        for (final culture in TrainingCulture.values) {
          expect(translations.cultureLabel(culture), isNotEmpty);
          expect(translations.cultureTitle(culture), isNotEmpty);
          for (final unit in TrainingCatalog.forBuilding(
            building.asset,
            culture: culture,
          )) {
            expect(translations.gameName(unit.nameKey), isNotEmpty);
          }
        }
      }
    }
  });

  test('Portuguese messages interpolate values and pluralize units', () async {
    final translations = await AppLocalizations.delegate.load(
      const Locale('pt'),
    );
    expect(translations.unitCount(1), '1 unidade');
    expect(translations.unitCount(2), '2 unidades');
    expect(translations.unitLevel('Milícia', 3), 'Milícia, nível 3');
    expect(
      translations.versionInfo('1.2.3', '4.5.6'),
      'Cliente: v1.2.3\nServidor: v4.5.6',
    );
  });

  for (final locale in [const Locale('pt', 'BR'), const Locale('fr')]) {
    testWidgets(
      'regional and unsupported locales resolve Portuguese: $locale',
      (tester) async {
        await tester.pumpWidget(
          MaterialApp(
            locale: locale,
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            supportedLocales: AppLocalizations.supportedLocales,
            home: Builder(builder: (context) => Text(context.l10n.train)),
          ),
        );
        await tester.pumpAndSettle();
        expect(find.text('Treinar'), findsOneWidget);
        expect(tester.takeException(), isNull);
      },
    );
  }
}
