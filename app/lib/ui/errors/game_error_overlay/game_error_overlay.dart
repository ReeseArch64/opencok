import 'package:flutter/material.dart';
import 'package:opencok/ui/errors/game_error_panel/game_error_panel.dart';

class GameErrorOverlay extends StatelessWidget {
  const GameErrorOverlay({super.key, required this.panel});

  final GameErrorPanel panel;

  @override
  Widget build(BuildContext context) => Stack(
    fit: StackFit.expand,
    children: [
      const ModalBarrier(color: Color(0x66000000), dismissible: false),
      SafeArea(
        child: Material(type: MaterialType.transparency, child: panel),
      ),
    ],
  );
}
