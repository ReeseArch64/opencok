import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:opencok/core/audio/background_music/background_music.dart';
import 'package:opencok/core/audio/music_track/music_track.dart';
import 'package:opencok/core/platform/platform_ui/platform_ui.dart';
import 'package:opencok/data/hud/reference_hud_data/reference_hud_data.dart';
import 'package:opencok/domain/hud/hud_action/hud_action.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/castle/screens/castle_screen/castle_screen.dart';
import 'package:opencok/ui/hud/widgets/game_hud/game_hud.dart';
import 'package:opencok/ui/profile/screens/player_profile_screen/player_profile_screen.dart';
import 'package:opencok/ui/world_map/widgets/world_map/world_map.dart';

class HudPreviewScreen extends StatefulWidget {
  const HudPreviewScreen({super.key});

  @override
  State<HudPreviewScreen> createState() => _HudPreviewScreenState();
}

class _HudPreviewScreenState extends State<HudPreviewScreen> {
  bool _worldMap = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    unawaited(
      BackgroundMusic.of(context)
          .play(_worldMap ? MusicTrack.world : MusicTrack.city),
    );
  }

  void _onAction(HudAction action) {
    if (action == HudAction.profile) {
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => const PlayerProfileScreen(data: referenceHudData),
        ),
      );
      return;
    }
    if (action == HudAction.map) {
      setState(() => _worldMap = !_worldMap);
      unawaited(
        BackgroundMusic.of(context)
            .play(_worldMap ? MusicTrack.world : MusicTrack.city),
      );
      return;
    }
    final labels = {
      HudAction.profile: context.l10n.profile,
      HudAction.experience: context.l10n.experienceShort,
      HudAction.energy: context.l10n.energy,
      HudAction.vip: context.l10n.vip,
      HudAction.wood: context.l10n.wood,
      HudAction.food: context.l10n.food,
      HudAction.iron: context.l10n.iron,
      HudAction.mithril: context.l10n.mithril,
      HudAction.power: context.l10n.power,
      HudAction.gold: context.l10n.gold,
      HudAction.daily: context.l10n.daily,
      HudAction.items: context.l10n.items,
      HudAction.mail: context.l10n.mail,
      HudAction.alliance: context.l10n.alliance,
      HudAction.chat: context.l10n.chat,
    };
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(context.l10n.visualPreview(labels[action]!)),
          duration: const Duration(seconds: 1),
        ),
      );
  }

  @override
  void initState() {
    super.initState();
    if (!usesMobileSystemUi) return;
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.manual,
      overlays: [SystemUiOverlay.bottom],
    );
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        systemNavigationBarColor: Colors.black,
        systemNavigationBarIconBrightness: Brightness.light,
        systemNavigationBarDividerColor: Colors.black,
      ),
    );
  }

  @override
  void dispose() {
    if (usesMobileSystemUi) {
      SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.black,
    body: SafeArea(
      child: ClipRect(
        child: GameHud(
          data: referenceHudData,
          onAction: _onAction,
          onWorldMap: _worldMap,
          child: _worldMap ? const WorldMap() : const CastleScreen(),
        ),
      ),
    ),
  );
}
