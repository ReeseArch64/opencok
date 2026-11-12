import 'dart:async';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/widgets.dart';
import 'package:opencok/core/audio/music_track/music_track.dart';
import 'package:opencok/core/errors/game_error_notice/game_error_notice.dart';
import 'package:opencok/core/errors/game_errors/game_errors.dart';

class MusicController {
  MusicController({AudioPlayer? player}) : _player = player ?? AudioPlayer();

  final AudioPlayer _player;
  Future<void> _operations = Future.value();
  MusicTrack? _track;
  MusicTrack? _playingTrack;
  bool _active = true;
  bool _disposed = false;
  bool _failureReported = false;
  int _revision = 0;

  Future<void> play(MusicTrack track) {
    _track = track;
    return _sync();
  }

  Future<void> setActive(bool active) {
    _active = active;
    return _sync();
  }

  Future<void> retry() => _sync();

  Future<void> _sync() {
    final revision = ++_revision;
    return _operations = _operations.then((_) async {
      if (_disposed || revision != _revision) return;
      try {
        if (!_active) {
          if (_player.state == PlayerState.playing) await _player.pause();
          return;
        }
        final track = _track;
        if (track == null) return;
        if (_playingTrack != track) {
          await _player.stop();
          _playingTrack = null;
          await _player.setReleaseMode(ReleaseMode.loop);
          await _player.play(
            AssetSource('sounds/background/${track.name}.mp3'),
          );
          _playingTrack = track;
        } else if (_player.state != PlayerState.playing) {
          await _player.resume();
        }
        _failureReported = false;
      } catch (error) {
        _playingTrack = null;
        debugPrint('Background music: $error');
        if (_failureReported) return;
        _failureReported = true;
        GameErrors.instance.report(
          GameErrorNotice.localized(
            'music',
            key: 'background-music',
            onRetry: () async {
              if (!_disposed) {
                _failureReported = false;
                await retry();
              }
            },
          ),
        );
      }
    });
  }

  Future<void> dispose() async {
    _disposed = true;
    await _operations;
    await _player.dispose();
  }
}
