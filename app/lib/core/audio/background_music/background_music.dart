import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:opencok/core/audio/music_controller/music_controller.dart';
import 'package:opencok/core/audio/music_scope/music_scope.dart';

class BackgroundMusic extends StatefulWidget {
  const BackgroundMusic({
    super.key,
    required this.child,
    this.createController = MusicController.new,
  });

  final Widget child;
  final MusicController Function() createController;

  static MusicController of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<MusicScope>()!.controller;

  @override
  State<BackgroundMusic> createState() => _BackgroundMusicState();
}

class _BackgroundMusicState extends State<BackgroundMusic>
    with WidgetsBindingObserver {
  late final MusicController _controller;

  @override
  void initState() {
    super.initState();
    _controller = widget.createController();
    WidgetsBinding.instance.addObserver(this);
    final lifecycle = WidgetsBinding.instance.lifecycleState;
    unawaited(_controller.setActive(lifecycle == null || _isActive(lifecycle)));
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    unawaited(_controller.setActive(_isActive(state)));
  }

  bool _isActive(AppLifecycleState state) =>
      state == AppLifecycleState.resumed || state == AppLifecycleState.inactive;

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    unawaited(_controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => MusicScope(
    controller: _controller,
    child: Listener(
      behavior: HitTestBehavior.translucent,
      onPointerDown: (_) => unawaited(_controller.retry()),
      child: widget.child,
    ),
  );
}
