import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/widgets.dart';
import 'package:opencok/core/audio/ui_click_controller/ui_click_controller.dart';

class UiClickSound extends StatefulWidget {
  const UiClickSound({
    super.key,
    required this.child,
    this.createController = UiClickController.new,
  });

  final Widget child;
  final UiClickController Function() createController;

  @override
  State<UiClickSound> createState() => _UiClickSoundState();
}

class _UiClickSoundState extends State<UiClickSound>
    with WidgetsBindingObserver {
  late final UiClickController _controller;
  final _pointers = <int, (Offset, Duration)>{};

  @override
  void initState() {
    super.initState();
    _controller = widget.createController();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed ||
        state == AppLifecycleState.inactive) {
      return;
    }
    _pointers.clear();
    unawaited(_controller.stop());
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    unawaited(_controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Listener(
    behavior: HitTestBehavior.translucent,
    onPointerDown: (event) {
      if (event.buttons == kPrimaryButton) {
        _pointers[event.pointer] = (event.position, event.timeStamp);
      }
    },
    onPointerMove: (event) {
      final start = _pointers[event.pointer];
      if (start != null && (event.position - start.$1).distance > kTouchSlop) {
        _pointers.remove(event.pointer);
      }
    },
    onPointerCancel: (event) => _pointers.remove(event.pointer),
    onPointerUp: (event) {
      final start = _pointers.remove(event.pointer);
      if (start != null &&
          (event.position - start.$1).distance <= kTouchSlop &&
          event.timeStamp - start.$2 < const Duration(milliseconds: 500)) {
        unawaited(_controller.confirm());
      }
    },
    child: widget.child,
  );
}
