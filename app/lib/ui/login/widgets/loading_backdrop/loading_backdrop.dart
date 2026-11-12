import 'package:flutter/material.dart';
import 'package:opencok/ui/login/widgets/loading_atmosphere/loading_atmosphere.dart';

class LoadingBackdrop extends StatelessWidget {
  const LoadingBackdrop({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) => Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/ui/login/loading_artwork.webp',
            fit: BoxFit.cover,
            alignment: constraints.maxWidth >= constraints.maxHeight
                ? Alignment.center
                : const Alignment(0.15, -1),
            filterQuality: FilterQuality.high,
            excludeFromSemantics: true,
            gaplessPlayback: true,
          ),
          const LoadingAtmosphere(),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: [0.45, 1],
                colors: [Colors.transparent, Color(0xb3000000)],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
