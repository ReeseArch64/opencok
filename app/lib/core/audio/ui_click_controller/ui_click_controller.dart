import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/widgets.dart';

class UiClickController {
  UiClickController({AudioPlayer? player}) : _player = player ?? AudioPlayer();

  final AudioPlayer _player;
  Future<void> _operations = Future.value();
  bool _disposed = false;
  int _revision = 0;

  Future<void> confirm() {
    final revision = ++_revision;
    return _operations = _operations.then((_) async {
      if (_disposed || revision != _revision) return;
      try {
        await _player.stop();
        if (_disposed || revision != _revision) return;
        await _player.play(AssetSource('sounds/effects/ui_confirm.ogg'));
      } catch (error) {
        debugPrint('UI confirmation sound: $error');
      }
    });
  }

  Future<void> stop() {
    ++_revision;
    return _operations = _operations
        .then((_) async {
          if (!_disposed) await _player.stop();
        })
        .catchError((Object error) {
          debugPrint('UI confirmation sound: $error');
        });
  }

  Future<void> dispose() async {
    _disposed = true;
    await _operations;
    await _player.dispose();
  }
}
