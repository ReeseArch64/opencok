import 'dart:math' as math;

import 'package:flutter/material.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.black,
    body: Center(
      child: Image.asset(
        'assets/ui/login/game_logo.png',
        width: math.min(192, MediaQuery.sizeOf(context).width * 0.7),
        semanticLabel: 'OpenCoK',
        filterQuality: FilterQuality.high,
      ),
    ),
  );
}
