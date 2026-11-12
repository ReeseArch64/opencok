import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:opencok/core/errors/game_error_handlers/game_error_handlers.dart';
import 'package:opencok/core/game_app/game_app.dart';
import 'package:opencok/core/platform/platform_ui/platform_ui.dart';
import 'package:opencok/core/startup/startup_artwork/startup_artwork.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  if (usesMobileSystemUi) {
    await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
  }
  GameErrorHandlers.install();
  runApp(const StartupArtwork(child: GameApp()));
}
