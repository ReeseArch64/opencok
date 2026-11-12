import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:opencok/core/errors/game_error_notice/game_error_notice.dart';

class GameErrors extends ChangeNotifier {
  static final instance = GameErrors();
  final _pending = Queue<GameErrorNotice>();
  bool _scheduled = false;

  GameErrorNotice? get current => _pending.firstOrNull;

  void report(GameErrorNotice notice) {
    if (_pending.any(
      (item) =>
          (item.key ?? item.messageKey ?? item.message) ==
          (notice.key ?? notice.messageKey ?? notice.message),
    )) {
      return;
    }
    _pending.add(notice);
    _changed();
  }

  void dismiss() {
    if (_pending.isEmpty) return;
    _pending.removeFirst();
    _changed();
  }

  void _changed() {
    if (_scheduled) return;
    _scheduled = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scheduled = false;
      notifyListeners();
    });
    WidgetsBinding.instance.ensureVisualUpdate();
  }
}
