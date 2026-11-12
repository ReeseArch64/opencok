import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:opencok/core/errors/game_error_notice/game_error_notice.dart';
import 'package:opencok/core/errors/game_errors/game_errors.dart';

class GameErrorHandlers {
  static void reportUnexpected(Object error) => GameErrors.instance.report(
    GameErrorNotice.localized('unexpected', key: 'unexpected'),
  );

  static void install() {
    final previousFlutterHandler = FlutterError.onError;
    FlutterError.onError = (details) {
      previousFlutterHandler?.call(details);
      reportUnexpected(details.exception);
    };
    final previousPlatformHandler = PlatformDispatcher.instance.onError;
    PlatformDispatcher.instance.onError = (error, stack) {
      if (previousPlatformHandler?.call(error, stack) != true) {
        FlutterError.presentError(
          FlutterErrorDetails(exception: error, stack: stack),
        );
      }
      reportUnexpected(error);
      return true;
    };
  }
}
