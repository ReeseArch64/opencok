import 'package:flutter/material.dart';
import 'package:opencok/core/network/game_connection_scope/game_connection_scope.dart';
import 'package:opencok/data/world_map/world_map_loader/world_map_loader.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/errors/game_error_overlay/game_error_overlay.dart';
import 'package:opencok/ui/errors/game_error_panel/game_error_panel.dart';
import 'package:opencok/ui/world_map/widgets/world_map_viewport/world_map_viewport.dart';

class WorldMap extends StatefulWidget {
  const WorldMap({super.key, this.loadScene = WorldMapLoader.load});

  final Future<WorldMapScene> Function() loadScene;

  @override
  State<WorldMap> createState() => _WorldMapState();
}

class _WorldMapState extends State<WorldMap> {
  late Future<WorldMapScene> _loading;
  WorldMapScene? _scene;

  @override
  void initState() {
    super.initState();
    _loading = _load();
  }

  Future<WorldMapScene> _load() async {
    final scene = await widget.loadScene();
    if (mounted) {
      _scene = scene;
    } else {
      scene.dispose();
    }
    return scene;
  }

  @override
  void dispose() {
    _scene?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ColoredBox(
    color: const Color(0xff174f58),
    child: FutureBuilder<WorldMapScene>(
      future: _loading,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return GameErrorOverlay(
            panel: GameErrorPanel(
              message: context.l10n.mapLoadError,
              onPrimary: () => setState(() {
                _loading = _load();
              }),
            ),
          );
        }
        if (!snapshot.hasData) {
          return Center(child: CircularProgressIndicator());
        }
        return WorldMapViewport(
          scene: snapshot.requireData,
          connection: GameConnectionScope.maybeOf(context),
        );
      },
    ),
  );
}
