// ignore_for_file: depend_on_referenced_packages

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';

void main() {
  test('resource unlocks use the combat tier of the underlying model', () {
    const unit = TrainingUnit('infantry', 2, 'Elite', sourceTier: 8);
    expect(unit.combatTier, 8);
    expect(unit.attack, 94);
    expect(unit.ironCost, 32);
    expect(unit.mithrilCost, 16);
    const basic = TrainingUnit('infantry', 1, 'Milícia');
    expect(basic.ironCost, 0);
    expect(basic.mithrilCost, 0);
  });

  test('culture bonuses affect strength and training costs', () {
    const unit = TrainingUnit(
      'cavalry',
      1,
      'Cavaleiro',
      culture: TrainingCulture.viking,
    );
    expect(unit.attack, 49);
    expect(unit.foodCost, 57);
    expect(unit.secondsPerUnit, 4);
  });

  test('portrait fallback preserves dedicated Persian and elite portraits', () {
    const viking = TrainingUnit(
      'infantry',
      1,
      'Viking',
      culture: TrainingCulture.viking,
    );
    const persian = TrainingUnit(
      'infantry',
      1,
      'Persa',
      culture: TrainingCulture.persian,
    );
    const elite = TrainingUnit(
      'infantry',
      1,
      'Elite',
      culture: TrainingCulture.elite,
      assetName: 'special_guard',
    );
    expect(viking.portrait, viking.body);
    expect(persian.portrait, endsWith('_portrait.png'));
    expect(elite.portrait, 'assets/ui/training/special_guard_portrait.png');
  });
}
