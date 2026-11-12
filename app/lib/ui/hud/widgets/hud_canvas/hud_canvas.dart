import 'package:flutter/material.dart';

class HudCanvas extends StatelessWidget {
  const HudCanvas({
    super.key,
    required this.width,
    required this.height,
    required this.child,
  });
  final double width;
  final double height;
  final Widget child;

  @override
  Widget build(BuildContext context) => FittedBox(
    fit: BoxFit.fill,
    alignment: Alignment.topLeft,
    child: SizedBox(width: width, height: height, child: child),
  );
}
