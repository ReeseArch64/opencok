import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/hud/reference_hud_data/reference_hud_data.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/ui/profile/screens/player_profile_screen/player_profile_screen.dart';

void main() {
  for (final size in [
    const Size(390, 844),
    const Size(844, 390),
    const Size(900, 600),
    const Size(1440, 900),
    const Size(1920, 600),
  ]) {
    testWidgets('profile adapts to $size and keeps actions accessible', (
      tester,
    ) async {
      await tester.binding.setSurfaceSize(size);
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        MaterialApp(
          locale: const Locale('pt'),
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: const PlayerProfileScreen(data: referenceHudData),
        ),
      );
      await tester.pumpAndSettle();
      final desktop = size.width >= 900;
      expect(
        find.byKey(
          ValueKey(
            desktop ? 'profile-desktop-layout' : 'profile-mobile-layout',
          ),
        ),
        findsOneWidget,
      );
      expect(
        find.bySemanticsLabel(RegExp('Espaço de equipamento vazio')),
        findsNWidgets(8),
      );
      final settings = desktop
          ? find.text('Configurações')
          : find.bySemanticsLabel('Configurações');
      await tester.ensureVisible(settings);
      await tester.tap(settings);
      await tester.pump();
      expect(find.text('Configurações · em breve'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }
}
