import 'dart:async';

import 'package:flutter/material.dart';
import 'package:opencok/data/training/training_catalog/training_catalog.dart';
import 'package:opencok/domain/castle/castle_building/castle_building.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_culture_selector/training_culture_selector.dart';
import 'package:opencok/ui/training/widgets/training_header/training_header.dart';
import 'package:opencok/ui/training/widgets/training_layout/training_layout.dart';
import 'package:opencok/ui/training/widgets/training_panel/training_panel.dart';
import 'package:opencok/ui/training/widgets/training_unit_preview/training_unit_preview.dart';

class TrainingScreen extends StatefulWidget {
  const TrainingScreen({super.key, required this.building});
  final CastleBuilding building;

  @override
  State<TrainingScreen> createState() => _TrainingScreenState();
}

class _TrainingScreenState extends State<TrainingScreen> {
  TrainingCulture _culture = TrainingCulture.simple;
  final _selectedByCulture = <TrainingCulture, int>{};
  final _carousels = {
    for (final culture in TrainingCatalog.availableCultures)
      culture: PageController(viewportFraction: 0.25),
  };
  PageController get _carousel => _carousels[_culture]!;
  final _previewKey = GlobalKey();
  int _groupRequest = 0;
  double _horizontalDrag = 0;

  Future<void> _selectGroup(int index) async {
    final culture = TrainingCatalog.availableCultures[index];
    final request = ++_groupRequest;
    if (culture == _culture) return;
    final units = TrainingCatalog.forBuilding(
      widget.building.asset,
      culture: culture,
    );
    final selectedIndex = (_selectedByCulture[culture] ?? 0).clamp(
      0,
      units.length - 1,
    );
    final selected = units[selectedIndex];
    await Future.wait([
      precacheImage(AssetImage(selected.body), context),
      precacheImage(AssetImage(selected.portrait), context),
    ]);
    if (!mounted || request != _groupRequest) return;
    _selectedByCulture[_culture] = _selectedIndex;
    setState(() {
      _culture = culture;
      _units = units;
      _selectedIndex = selectedIndex;
      _selected = selected;
    });
    _preloadUnits(units);
  }

  void _onHorizontalDragEnd(DragEndDetails details) {
    final velocity = details.primaryVelocity ?? 0;
    if (_horizontalDrag.abs() < 40 && velocity.abs() < 250) return;
    final direction = velocity.abs() >= 250 ? velocity : _horizontalDrag;
    final index =
        (TrainingCatalog.availableCultures.indexOf(_culture) +
                (direction < 0 ? 1 : -1))
            .clamp(0, TrainingCatalog.availableCultures.length - 1);
    unawaited(_selectGroup(index));
  }

  static const _previewCapacity = 1000;
  late List<TrainingUnit> _units = TrainingCatalog.forBuilding(
    widget.building.asset,
  );
  late TrainingUnit _selected = _units.first;
  final _quantity = TextEditingController(text: '1000');
  int _count = _previewCapacity;
  int _selectedIndex = 0;

  bool _imagesPreloaded = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_imagesPreloaded) return;
    _imagesPreloaded = true;
    _preloadUnits(_units);
  }

  void _preloadUnits(List<TrainingUnit> units) {
    for (final unit in units) {
      unawaited(precacheImage(AssetImage(unit.body), context));
      unawaited(precacheImage(AssetImage(unit.portrait), context));
    }
  }

  bool _onScrollEnd(ScrollEndNotification notification) {
    if (notification.depth != 0 || !_carousel.hasClients) return false;
    final index = (_carousel.page ?? 0).round().clamp(0, _units.length - 1);
    if (index != _selectedIndex) {
      setState(() {
        _selectedIndex = index;
        _selected = _units[index];
      });
    }
    return false;
  }

  @override
  void dispose() {
    _quantity.dispose();
    for (final controller in _carousels.values) {
      controller.dispose();
    }
    super.dispose();
  }

  void _setCount(int value) => setState(() {
    _count = value.clamp(1, _previewCapacity);
    _quantity.text = '$_count';
  });

  void _showInfo(String title, String message) => showDialog<void>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: Text(message),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text(context.l10n.close),
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) => TrainingLayout(
    header: const TrainingHeader(),
    previewBuilder: (height) => TrainingUnitPreview(
      key: _previewKey,
      heroHeight: height,
      selected: _selected,
      selectedIndex: _selectedIndex,
      units: _units,
      culture: _culture,
      carousel: _carousel,
      onScrollEnd: _onScrollEnd,
      onDragStart: () => _horizontalDrag = 0,
      onDragUpdate: (delta) => _horizontalDrag += delta,
      onDragEnd: _onHorizontalDragEnd,
      onInfo: _showInfo,
    ),
    cultures: TrainingCultureSelector(
      selectedCulture: _culture,
      onSelected: _selectGroup,
    ),
    panel: TrainingPanel(
      selected: _selected,
      count: _count,
      culture: _culture,
      quantity: _quantity,
      onCountChanged: _setCount,
      capacity: _previewCapacity,
      building: widget.building,
      onInfo: _showInfo,
    ),
  );
}
