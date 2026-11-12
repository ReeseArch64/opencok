import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_pt.dart';

abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  static const List<Locale> supportedLocales = <Locale>[Locale('pt')];

  String get close;

  String get retry;

  String get ok;

  String get daily;

  String get items;

  String get mail;

  String get alliance;

  String get chat;

  String get city;

  String get map;

  String get profile;

  String get experienceShort;

  String get experience;

  String get energy;

  String get vip;

  String get wood;

  String get food;

  String get iron;

  String get mithril;

  String get power;

  String get gold;

  String get backToGame;

  String get rename;

  String get ranking;

  String get achievements;

  String get information;

  String get reset;

  String get skills;

  String get settings;

  String get castleInterior;

  String get castleLoadError;

  String get mapLoadError;

  String get closeSelection;

  String get trainTroops;

  String get backToCastle;

  String get unitInformation;

  String get combatRelation;

  String get combatRelationButton;

  String get combatRelationDescription;

  String get attack;

  String get defense;

  String get health;

  String get trainNow;

  String get train;

  String get trainingUnavailable;

  String get trainingUnavailableDescription;

  String get decreaseQuantity;

  String get increaseQuantity;

  String get trainingBonusHint;

  String get trainingBonus;

  String get trainingBonusDescription;

  String get securityCompromised;

  String get securityPrivileged;

  String get securityDeveloperMode;

  String get securityDebugger;

  String get securityMobileBrowser;

  String get securityVerificationFailed;

  String get verifyAgain;

  String get castleInstructions;

  String visualPreview(String label);

  String comingSoon(String label);

  String addResource(String label);

  String resourceValue(String label, String value);

  String profileLevel(int level);

  String emptyEquipmentSlot(int slot);

  String unitLevel(String name, int level);

  String unitDetails(String name, int level, int attack, int defense, int hp);

  String ownedUnits(String count);

  String unitCount(int count);

  String trainingCapacity(int capacity);

  String versionInfo(String client, String server);

  String trainingHeading(String culture, String building);

  String get unitStandardInfantry1;

  String get unitStandardInfantry2;

  String get unitStandardInfantry3;

  String get unitStandardInfantry4;

  String get unitStandardInfantry5;

  String get unitStandardInfantry6;

  String get unitStandardInfantry7;

  String get unitStandardInfantry8;

  String get unitStandardInfantry9;

  String get unitStandardInfantry10;

  String get unitStandardCavalry1;

  String get unitStandardCavalry2;

  String get unitStandardCavalry3;

  String get unitStandardCavalry4;

  String get unitStandardCavalry5;

  String get unitStandardCavalry6;

  String get unitStandardCavalry7;

  String get unitStandardCavalry8;

  String get unitStandardCavalry9;

  String get unitStandardCavalry10;

  String get unitStandardArcher1;

  String get unitStandardArcher2;

  String get unitStandardArcher3;

  String get unitStandardArcher4;

  String get unitStandardArcher5;

  String get unitStandardArcher6;

  String get unitStandardArcher7;

  String get unitStandardArcher8;

  String get unitStandardArcher9;

  String get unitStandardArcher10;

  String get unitStandardSiege1;

  String get unitStandardSiege2;

  String get unitStandardSiege3;

  String get unitStandardSiege4;

  String get unitStandardSiege5;

  String get unitStandardSiege6;

  String get unitStandardSiege7;

  String get unitStandardSiege8;

  String get unitStandardSiege9;

  String get unitStandardSiege10;

  String get unitSlaughterCavalry;

  String get unitRangerKnight;

  String get unitEliteInfantry1;

  String get unitEliteInfantry2;

  String get unitEliteInfantry3;

  String get unitEliteInfantry4;

  String get unitEliteInfantry5;

  String get unitEliteInfantry6;

  String get unitEliteInfantry7;

  String get unitEliteInfantry8;

  String get unitEliteCavalry1;

  String get unitEliteCavalry2;

  String get unitEliteCavalry3;

  String get unitEliteCavalry4;

  String get unitEliteCavalry5;

  String get unitEliteCavalry6;

  String get unitEliteCavalry7;

  String get unitEliteCavalry8;

  String get unitEliteArcher1;

  String get unitEliteArcher2;

  String get unitEliteArcher3;

  String get unitEliteArcher4;

  String get unitEliteArcher5;

  String get unitEliteArcher6;

  String get unitEliteArcher7;

  String get unitEliteArcher8;

  String get unitEliteSiege1;

  String get unitEliteSiege2;

  String get unitEliteSiege3;

  String get unitEliteSiege4;

  String get unitEliteSiege5;

  String get unitEliteSiege6;

  String get unitEliteSiege7;

  String get unitEliteSiege8;

  String get unitHighArcher11;

  String get unitHighArcher12;

  String get unitHighCavalry12;

  String get unitHighSiege11;

  String get unitHighSiege12;

  String get unitHighInfantry11;

  String get unitHighInfantry12;

  String get buildingSiegeWorkshop;

  String get buildingStable;

  String get buildingArcheryRange;

  String get buildingBarracks;

  String get cultureSimple;

  String get cultureSimpleTitle;

  String get cultureViking;

  String get cultureVikingTitle;

  String get cultureJapanese;

  String get cultureJapaneseTitle;

  String get cultureChinese;

  String get cultureChineseTitle;

  String get culturePersian;

  String get culturePersianTitle;

  String get cultureElite;

  String get cultureEliteTitle;

  String errorMessage(String error);

  String get unitVikingInfantry;

  String get unitVikingCavalry;

  String get unitVikingArcher;

  String get unitVikingSiege;

  String get unitJapaneseInfantry;

  String get unitJapaneseCavalry;

  String get unitJapaneseArcher;

  String get unitJapaneseSiege;

  String get unitChineseInfantry;

  String get unitChineseCavalry;

  String get unitChineseArcher;

  String get unitChineseSiege;

  String get unitPersianInfantry;

  String get unitPersianCavalry;

  String get unitPersianArcher;

  String get unitPersianSiege;

  String get loading;

  String get connectingToServer;

  String get reconnectingToServer;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['pt'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  switch (locale.languageCode) {
    case 'pt':
      return AppLocalizationsPt();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
