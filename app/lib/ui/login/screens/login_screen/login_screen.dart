import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/core/network/game_connection_scope/game_connection_scope.dart';
import 'package:opencok/core/audio/background_music/background_music.dart';
import 'package:opencok/core/audio/music_track/music_track.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/hud/screens/hud_preview_screen/hud_preview_screen.dart';
import 'package:opencok/ui/login/widgets/loading_backdrop/loading_backdrop.dart';
import 'package:opencok/ui/login/widgets/login_loading_bar/login_loading_bar.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, this.checkingDevice = false});

  final bool checkingDevice;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _loaded = false;
  bool _entering = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    unawaited(BackgroundMusic.of(context).play(MusicTrack.loading));
  }

  @override
  Widget build(BuildContext context) {
    final connection = widget.checkingDevice
        ? null
        : GameConnectionScope.of(context);
    if (!widget.checkingDevice && _loaded && connection!.online && !_entering) {
      _entering = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        if (!GameConnectionScope.of(context).online) {
          setState(() => _entering = false);
          return;
        }
        Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(builder: (_) => const HudPreviewScreen()),
        );
      });
    }
    return Scaffold(
      backgroundColor: const Color(0xff101822),
      body: Stack(
        fit: StackFit.expand,
        children: [
          const LoadingBackdrop(),
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final landscape = constraints.maxWidth > constraints.maxHeight;
                return Align(
                  alignment: Alignment.bottomCenter,
                  child: SizedBox(
                    width: landscape
                        ? math.min(480, constraints.maxWidth * 0.45)
                        : 440,
                    child: SingleChildScrollView(
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          minHeight: constraints.maxHeight,
                        ),
                        child: SizedBox(
                          width: constraints.maxWidth,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              const SizedBox(height: 48),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 32,
                                ),
                                child: Image.asset(
                                  'assets/ui/login/game_logo.png',
                                  width: math.min(
                                    444,
                                    constraints.maxWidth * 0.7,
                                  ),
                                  semanticLabel: 'OpenCoK',
                                  filterQuality: FilterQuality.high,
                                ),
                              ),
                              const SizedBox(height: 24),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 32,
                                ),
                                child: LoginLoadingBar(
                                  onCompleted: widget.checkingDevice
                                      ? null
                                      : () => setState(() => _loaded = true),
                                ),
                              ),
                              const SizedBox(height: 24),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  context.l10n.versionInfo('1.0.0', '1.0.0'),
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    height: 1.5,
                    shadows: [Shadow(blurRadius: 4, color: Colors.black)],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
