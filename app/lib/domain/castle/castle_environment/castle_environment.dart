import 'dart:ui' as ui;

class CastleEnvironment {
  CastleEnvironment(this.images);

  final Map<String, ui.Image> images;
  static const assetRoot = 'assets/castle/environment/';
  static const size = ui.Size(6989, 2544);
  static const playableBounds = ui.Rect.fromLTRB(3400, 0, 6989, 2544);
  static const focus = ui.Offset(4450, 1250);

  static const columnWidths = [998.0, 999.0, 998.0, 999.0, 998.0, 999.0, 998.0];
  static const rowHeights = [509.0, 509.0, 508.0, 509.0, 509.0];

  static const tileNames = [
    'forest_edge_r01_c01.png',
    'wooded_cliffs_r01_c02.png',
    'mountain_forest_r01_c03.png',
    'waterfall_cliffs_r01_c04.png',
    'rocky_ridge_r01_c05.png',
    'fortress_dam_r01_c06.png',
    'dragon_cave_cliffs_r01_c07.png',
    'western_cliff_edge_r02_c01.png',
    'upper_grass_paths_r02_c02.png',
    'forest_paths_r02_c03.png',
    'waterfall_terrace_r02_c04.png',
    'upper_courtyard_r02_c05.png',
    'harbor_walls_r02_c06.png',
    'dragon_cave_bank_r02_c07.png',
    'western_lower_cliffs_r03_c01.png',
    'western_grass_paths_r03_c02.png',
    'western_wall_stairs_r03_c03.png',
    'garden_terrace_r03_c04.png',
    'central_courtyard_r03_c05.png',
    'lower_courtyard_r03_c06.png',
    'eastern_riverbank_r03_c07.png',
    'autumn_forest_r04_c01.png',
    'autumn_cliff_edge_r04_c02.png',
    'woodland_clearing_r04_c03.png',
    'courtyard_approach_r04_c04.png',
    'lower_terrace_wall_r04_c05.png',
    'bridge_approach_r04_c06.png',
    'eastern_grass_plateau_r04_c07.png',
    'cracked_autumn_clearing_r05_c01.png',
    'western_dirt_clearing_r05_c02.png',
    'central_dirt_clearing_r05_c03.png',
    'southern_woodland_r05_c04.png',
    'river_waterfall_r05_c05.png',
    'southern_grass_paths_r05_c06.png',
    'eastern_grass_paths_r05_c07.png',
  ];
  static String tileName(int number) => tileNames[number - 1];

  void dispose() {
    for (final image in images.values) {
      image.dispose();
    }
  }
}
