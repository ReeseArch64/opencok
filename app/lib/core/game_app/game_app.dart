import 'package:flutter/material.dart';
import 'package:opencok/core/network/game_connection_scope/game_connection_scope.dart';
import 'package:opencok/core/audio/background_music/background_music.dart';
import 'package:opencok/core/audio/ui_click_sound/ui_click_sound.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/security/device_security_gate/device_security_gate.dart';
import 'package:opencok/ui/errors/game_error_host/game_error_host.dart';
import 'package:opencok/ui/hud/screens/hud_preview_screen/hud_preview_screen.dart';
import 'package:opencok/ui/login/screens/login_screen/login_screen.dart';

class GameApp extends StatelessWidget {
  const GameApp({super.key, this.locale});

  final Locale? locale;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OpenCoK',
      locale: locale,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xffc7a66a),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xff101822),
        useMaterial3: true,
      ),
      builder: (context, child) => UiClickSound(
        child: GameErrorHost(
          child: BackgroundMusic(
            child: DeviceSecurityGate(
              builder: (_) => const bool.fromEnvironment('HUD_PREVIEW')
                  ? child!
                  : GameConnectionScope(child: child!),
            ),
          ),
        ),
      ),
      home: const bool.fromEnvironment('HUD_PREVIEW')
          ? const HudPreviewScreen()
          : const LoginScreen(),
    );
  }
}
