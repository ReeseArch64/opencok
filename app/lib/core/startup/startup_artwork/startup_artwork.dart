import 'package:flutter/material.dart';

class StartupArtwork extends StatefulWidget {
  const StartupArtwork({super.key, required this.child});

  final Widget child;

  @override
  State<StartupArtwork> createState() => _StartupArtworkState();
}

class _StartupArtworkState extends State<StartupArtwork> {
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    final binding = WidgetsBinding.instance;
    binding.deferFirstFrame();
    Future.wait([
      precacheImage(const AssetImage('assets/ui/login/game_logo.png'), context),
      precacheImage(
        const AssetImage('assets/ui/login/loading_artwork.webp'),
        context,
      ),
    ]).whenComplete(binding.allowFirstFrame);
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
