import 'dart:ui';

import 'package:opencok/domain/castle/castle_building/castle_building.dart';

class CastleBuildings {
  static const assetRoot = 'assets/castle/buildings/';

  // Back to front so the foreground buildings cover those behind them.
  static const military = [
    CastleBuilding(
      'buildingSiegeWorkshop',
      'siege_workshop.png',
      Rect.fromLTWH(3928, 1100, 345, 310),
    ),
    CastleBuilding(
      'buildingStable',
      'stable.png',
      Rect.fromLTWH(4204, 1325, 342.5, 265),
    ),
    CastleBuilding(
      'buildingArcheryRange',
      'archery_range.png',
      Rect.fromLTWH(3674, 1345, 352.5, 290),
    ),
    CastleBuilding(
      'buildingBarracks',
      'barracks.png',
      Rect.fromLTWH(3974, 1444, 351.25, 276.25),
    ),
  ];
}
