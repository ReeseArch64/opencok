import 'package:flutter/widgets.dart';
import 'package:opencok/core/audio/music_controller/music_controller.dart';

class MusicScope extends InheritedWidget {
  const MusicScope({super.key, required this.controller, required super.child});

  final MusicController controller;

  @override
  bool updateShouldNotify(MusicScope oldWidget) =>
      controller != oldWidget.controller;
}
