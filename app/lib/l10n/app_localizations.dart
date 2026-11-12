import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_pt.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[Locale('pt')];

  /// No description provided for @close.
  ///
  /// In pt, this message translates to:
  /// **'Fechar'**
  String get close;

  /// No description provided for @retry.
  ///
  /// In pt, this message translates to:
  /// **'Tente novamente'**
  String get retry;

  /// No description provided for @ok.
  ///
  /// In pt, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @daily.
  ///
  /// In pt, this message translates to:
  /// **'Diariamente'**
  String get daily;

  /// No description provided for @items.
  ///
  /// In pt, this message translates to:
  /// **'Itens'**
  String get items;

  /// No description provided for @mail.
  ///
  /// In pt, this message translates to:
  /// **'Correio'**
  String get mail;

  /// No description provided for @alliance.
  ///
  /// In pt, this message translates to:
  /// **'Aliança'**
  String get alliance;

  /// No description provided for @chat.
  ///
  /// In pt, this message translates to:
  /// **'Conversa'**
  String get chat;

  /// No description provided for @city.
  ///
  /// In pt, this message translates to:
  /// **'Cidade'**
  String get city;

  /// No description provided for @map.
  ///
  /// In pt, this message translates to:
  /// **'Mapa'**
  String get map;

  /// No description provided for @profile.
  ///
  /// In pt, this message translates to:
  /// **'Perfil'**
  String get profile;

  /// No description provided for @experienceShort.
  ///
  /// In pt, this message translates to:
  /// **'XP'**
  String get experienceShort;

  /// No description provided for @experience.
  ///
  /// In pt, this message translates to:
  /// **'Experiência'**
  String get experience;

  /// No description provided for @energy.
  ///
  /// In pt, this message translates to:
  /// **'Energia'**
  String get energy;

  /// No description provided for @vip.
  ///
  /// In pt, this message translates to:
  /// **'VIP'**
  String get vip;

  /// No description provided for @wood.
  ///
  /// In pt, this message translates to:
  /// **'Madeira'**
  String get wood;

  /// No description provided for @food.
  ///
  /// In pt, this message translates to:
  /// **'Comida'**
  String get food;

  /// No description provided for @iron.
  ///
  /// In pt, this message translates to:
  /// **'Ferro'**
  String get iron;

  /// No description provided for @mithril.
  ///
  /// In pt, this message translates to:
  /// **'Mithril'**
  String get mithril;

  /// No description provided for @power.
  ///
  /// In pt, this message translates to:
  /// **'Poder'**
  String get power;

  /// No description provided for @gold.
  ///
  /// In pt, this message translates to:
  /// **'Ouro'**
  String get gold;

  /// No description provided for @backToGame.
  ///
  /// In pt, this message translates to:
  /// **'Voltar ao jogo'**
  String get backToGame;

  /// No description provided for @rename.
  ///
  /// In pt, this message translates to:
  /// **'Alterar nome'**
  String get rename;

  /// No description provided for @ranking.
  ///
  /// In pt, this message translates to:
  /// **'Classificação'**
  String get ranking;

  /// No description provided for @achievements.
  ///
  /// In pt, this message translates to:
  /// **'Conquistas'**
  String get achievements;

  /// No description provided for @information.
  ///
  /// In pt, this message translates to:
  /// **'Informações'**
  String get information;

  /// No description provided for @reset.
  ///
  /// In pt, this message translates to:
  /// **'Redefinir'**
  String get reset;

  /// No description provided for @skills.
  ///
  /// In pt, this message translates to:
  /// **'Talentos'**
  String get skills;

  /// No description provided for @settings.
  ///
  /// In pt, this message translates to:
  /// **'Configurações'**
  String get settings;

  /// No description provided for @castleInterior.
  ///
  /// In pt, this message translates to:
  /// **'Interior do castelo'**
  String get castleInterior;

  /// No description provided for @castleLoadError.
  ///
  /// In pt, this message translates to:
  /// **'Não foi possível carregar o interior do castelo.'**
  String get castleLoadError;

  /// No description provided for @mapLoadError.
  ///
  /// In pt, this message translates to:
  /// **'Não foi possível carregar o mapa.'**
  String get mapLoadError;

  /// No description provided for @closeSelection.
  ///
  /// In pt, this message translates to:
  /// **'Fechar seleção'**
  String get closeSelection;

  /// No description provided for @trainTroops.
  ///
  /// In pt, this message translates to:
  /// **'Treinar tropas'**
  String get trainTroops;

  /// No description provided for @backToCastle.
  ///
  /// In pt, this message translates to:
  /// **'Voltar ao castelo'**
  String get backToCastle;

  /// No description provided for @unitInformation.
  ///
  /// In pt, this message translates to:
  /// **'Informações da unidade'**
  String get unitInformation;

  /// No description provided for @combatRelation.
  ///
  /// In pt, this message translates to:
  /// **'Relação de combate das unidades'**
  String get combatRelation;

  /// No description provided for @combatRelationButton.
  ///
  /// In pt, this message translates to:
  /// **'Relação de combate\ndas unidades'**
  String get combatRelationButton;

  /// No description provided for @combatRelationDescription.
  ///
  /// In pt, this message translates to:
  /// **'As vantagens de combate dependem das regras do reino.'**
  String get combatRelationDescription;

  /// No description provided for @attack.
  ///
  /// In pt, this message translates to:
  /// **'Ataque'**
  String get attack;

  /// No description provided for @defense.
  ///
  /// In pt, this message translates to:
  /// **'Defesa'**
  String get defense;

  /// No description provided for @health.
  ///
  /// In pt, this message translates to:
  /// **'HP'**
  String get health;

  /// No description provided for @trainNow.
  ///
  /// In pt, this message translates to:
  /// **'Treine Agora!'**
  String get trainNow;

  /// No description provided for @train.
  ///
  /// In pt, this message translates to:
  /// **'Treinar'**
  String get train;

  /// No description provided for @trainingUnavailable.
  ///
  /// In pt, this message translates to:
  /// **'Treinamento indisponível'**
  String get trainingUnavailable;

  /// No description provided for @trainingUnavailableDescription.
  ///
  /// In pt, this message translates to:
  /// **'O reino ainda não está conectado. Nenhuma unidade foi treinada e nenhum recurso foi gasto.'**
  String get trainingUnavailableDescription;

  /// No description provided for @decreaseQuantity.
  ///
  /// In pt, this message translates to:
  /// **'Diminuir quantidade'**
  String get decreaseQuantity;

  /// No description provided for @increaseQuantity.
  ///
  /// In pt, this message translates to:
  /// **'Aumentar quantidade'**
  String get increaseQuantity;

  /// No description provided for @trainingBonusHint.
  ///
  /// In pt, this message translates to:
  /// **'Use itens de bônus para aumentar o valor do treino!'**
  String get trainingBonusHint;

  /// No description provided for @trainingBonus.
  ///
  /// In pt, this message translates to:
  /// **'Bônus de treinamento'**
  String get trainingBonus;

  /// No description provided for @trainingBonusDescription.
  ///
  /// In pt, this message translates to:
  /// **'Os itens de bônus estarão disponíveis quando o inventário estiver conectado.'**
  String get trainingBonusDescription;

  /// No description provided for @securityCompromised.
  ///
  /// In pt, this message translates to:
  /// **'O jogo não pode ser aberto em dispositivos com root ou jailbreak.'**
  String get securityCompromised;

  /// No description provided for @securityPrivileged.
  ///
  /// In pt, this message translates to:
  /// **'Abra o jogo com uma conta comum, sem privilégios de root ou administrador.'**
  String get securityPrivileged;

  /// No description provided for @securityDeveloperMode.
  ///
  /// In pt, this message translates to:
  /// **'Desative as opções do desenvolvedor para abrir o jogo.'**
  String get securityDeveloperMode;

  /// No description provided for @securityDebugger.
  ///
  /// In pt, this message translates to:
  /// **'Desconecte o depurador para abrir o jogo.'**
  String get securityDebugger;

  /// No description provided for @securityMobileBrowser.
  ///
  /// In pt, this message translates to:
  /// **'O jogo não está disponível pelo navegador em dispositivos móveis. Use o aplicativo.'**
  String get securityMobileBrowser;

  /// No description provided for @securityVerificationFailed.
  ///
  /// In pt, this message translates to:
  /// **'Não foi possível verificar a segurança do dispositivo. Tente novamente.'**
  String get securityVerificationFailed;

  /// No description provided for @verifyAgain.
  ///
  /// In pt, this message translates to:
  /// **'Verificar novamente'**
  String get verifyAgain;

  /// No description provided for @castleInstructions.
  ///
  /// In pt, this message translates to:
  /// **'Interior do castelo. Arraste para explorar, amplie com dois dedos e toque em uma construção para selecionar.'**
  String get castleInstructions;

  /// No description provided for @visualPreview.
  ///
  /// In pt, this message translates to:
  /// **'{label} · prévia visual'**
  String visualPreview(String label);

  /// No description provided for @comingSoon.
  ///
  /// In pt, this message translates to:
  /// **'{label} · em breve'**
  String comingSoon(String label);

  /// No description provided for @addResource.
  ///
  /// In pt, this message translates to:
  /// **'Adicionar {label}'**
  String addResource(String label);

  /// No description provided for @resourceValue.
  ///
  /// In pt, this message translates to:
  /// **'{label}: {value}'**
  String resourceValue(String label, String value);

  /// No description provided for @profileLevel.
  ///
  /// In pt, this message translates to:
  /// **'Perfil, nível {level}'**
  String profileLevel(int level);

  /// No description provided for @emptyEquipmentSlot.
  ///
  /// In pt, this message translates to:
  /// **'Espaço de equipamento vazio {slot}'**
  String emptyEquipmentSlot(int slot);

  /// No description provided for @unitLevel.
  ///
  /// In pt, this message translates to:
  /// **'{name}, nível {level}'**
  String unitLevel(String name, int level);

  /// No description provided for @unitDetails.
  ///
  /// In pt, this message translates to:
  /// **'{name} · nível {level}\nAtaque: {attack}\nDefesa: {defense}\nHP: {hp}'**
  String unitDetails(String name, int level, int attack, int defense, int hp);

  /// No description provided for @ownedUnits.
  ///
  /// In pt, this message translates to:
  /// **'Possui: {count}'**
  String ownedUnits(String count);

  /// No description provided for @unitCount.
  ///
  /// In pt, this message translates to:
  /// **'{count, plural, one{1 unidade} other{{count} unidades}}'**
  String unitCount(int count);

  /// No description provided for @trainingCapacity.
  ///
  /// In pt, this message translates to:
  /// **'Capacidade de treinamento: {capacity}'**
  String trainingCapacity(int capacity);

  /// No description provided for @versionInfo.
  ///
  /// In pt, this message translates to:
  /// **'Cliente: v{client}\nServidor: v{server}'**
  String versionInfo(String client, String server);

  /// No description provided for @trainingHeading.
  ///
  /// In pt, this message translates to:
  /// **'{culture} · {building}'**
  String trainingHeading(String culture, String building);

  /// No description provided for @unitStandardInfantry1.
  ///
  /// In pt, this message translates to:
  /// **'Milícia'**
  String get unitStandardInfantry1;

  /// No description provided for @unitStandardInfantry2.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria'**
  String get unitStandardInfantry2;

  /// No description provided for @unitStandardInfantry3.
  ///
  /// In pt, this message translates to:
  /// **'Lanceiro'**
  String get unitStandardInfantry3;

  /// No description provided for @unitStandardInfantry4.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria IV'**
  String get unitStandardInfantry4;

  /// No description provided for @unitStandardInfantry5.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria V'**
  String get unitStandardInfantry5;

  /// No description provided for @unitStandardInfantry6.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria VI'**
  String get unitStandardInfantry6;

  /// No description provided for @unitStandardInfantry7.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria VII'**
  String get unitStandardInfantry7;

  /// No description provided for @unitStandardInfantry8.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria VIII'**
  String get unitStandardInfantry8;

  /// No description provided for @unitStandardInfantry9.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria IX'**
  String get unitStandardInfantry9;

  /// No description provided for @unitStandardInfantry10.
  ///
  /// In pt, this message translates to:
  /// **'Infantaria X'**
  String get unitStandardInfantry10;

  /// No description provided for @unitStandardCavalry1.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro'**
  String get unitStandardCavalry1;

  /// No description provided for @unitStandardCavalry2.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria leve'**
  String get unitStandardCavalry2;

  /// No description provided for @unitStandardCavalry3.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria pesada'**
  String get unitStandardCavalry3;

  /// No description provided for @unitStandardCavalry4.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria IV'**
  String get unitStandardCavalry4;

  /// No description provided for @unitStandardCavalry5.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria V'**
  String get unitStandardCavalry5;

  /// No description provided for @unitStandardCavalry6.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria VI'**
  String get unitStandardCavalry6;

  /// No description provided for @unitStandardCavalry7.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria VII'**
  String get unitStandardCavalry7;

  /// No description provided for @unitStandardCavalry8.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria VIII'**
  String get unitStandardCavalry8;

  /// No description provided for @unitStandardCavalry9.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria IX'**
  String get unitStandardCavalry9;

  /// No description provided for @unitStandardCavalry10.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria X'**
  String get unitStandardCavalry10;

  /// No description provided for @unitStandardArcher1.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro'**
  String get unitStandardArcher1;

  /// No description provided for @unitStandardArcher2.
  ///
  /// In pt, this message translates to:
  /// **'Besteiro'**
  String get unitStandardArcher2;

  /// No description provided for @unitStandardArcher3.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro longo'**
  String get unitStandardArcher3;

  /// No description provided for @unitStandardArcher4.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro IV'**
  String get unitStandardArcher4;

  /// No description provided for @unitStandardArcher5.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro V'**
  String get unitStandardArcher5;

  /// No description provided for @unitStandardArcher6.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro VI'**
  String get unitStandardArcher6;

  /// No description provided for @unitStandardArcher7.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro VII'**
  String get unitStandardArcher7;

  /// No description provided for @unitStandardArcher8.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro VIII'**
  String get unitStandardArcher8;

  /// No description provided for @unitStandardArcher9.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro IX'**
  String get unitStandardArcher9;

  /// No description provided for @unitStandardArcher10.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro X'**
  String get unitStandardArcher10;

  /// No description provided for @unitStandardSiege1.
  ///
  /// In pt, this message translates to:
  /// **'Aríete'**
  String get unitStandardSiege1;

  /// No description provided for @unitStandardSiege2.
  ///
  /// In pt, this message translates to:
  /// **'Catapulta'**
  String get unitStandardSiege2;

  /// No description provided for @unitStandardSiege3.
  ///
  /// In pt, this message translates to:
  /// **'Torre de cerco'**
  String get unitStandardSiege3;

  /// No description provided for @unitStandardSiege4.
  ///
  /// In pt, this message translates to:
  /// **'Cerco IV'**
  String get unitStandardSiege4;

  /// No description provided for @unitStandardSiege5.
  ///
  /// In pt, this message translates to:
  /// **'Cerco V'**
  String get unitStandardSiege5;

  /// No description provided for @unitStandardSiege6.
  ///
  /// In pt, this message translates to:
  /// **'Cerco VI'**
  String get unitStandardSiege6;

  /// No description provided for @unitStandardSiege7.
  ///
  /// In pt, this message translates to:
  /// **'Cerco VII'**
  String get unitStandardSiege7;

  /// No description provided for @unitStandardSiege8.
  ///
  /// In pt, this message translates to:
  /// **'Cerco VIII'**
  String get unitStandardSiege8;

  /// No description provided for @unitStandardSiege9.
  ///
  /// In pt, this message translates to:
  /// **'Cerco IX'**
  String get unitStandardSiege9;

  /// No description provided for @unitStandardSiege10.
  ///
  /// In pt, this message translates to:
  /// **'Cerco X'**
  String get unitStandardSiege10;

  /// No description provided for @unitSlaughterCavalry.
  ///
  /// In pt, this message translates to:
  /// **'Cavalaria de Abate'**
  String get unitSlaughterCavalry;

  /// No description provided for @unitRangerKnight.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Guarda'**
  String get unitRangerKnight;

  /// No description provided for @unitEliteInfantry1.
  ///
  /// In pt, this message translates to:
  /// **'Guardiões do Firmamento'**
  String get unitEliteInfantry1;

  /// No description provided for @unitEliteInfantry2.
  ///
  /// In pt, this message translates to:
  /// **'Carrasco Quebrador de Juramentos'**
  String get unitEliteInfantry2;

  /// No description provided for @unitEliteInfantry3.
  ///
  /// In pt, this message translates to:
  /// **'Guarda Perfuragelo'**
  String get unitEliteInfantry3;

  /// No description provided for @unitEliteInfantry4.
  ///
  /// In pt, this message translates to:
  /// **'Defensor da Couraça de Gelo'**
  String get unitEliteInfantry4;

  /// No description provided for @unitEliteInfantry5.
  ///
  /// In pt, this message translates to:
  /// **'Porta-Escudo de Aço Gélido'**
  String get unitEliteInfantry5;

  /// No description provided for @unitEliteInfantry6.
  ///
  /// In pt, this message translates to:
  /// **'Lanceiro de Aço Gélido'**
  String get unitEliteInfantry6;

  /// No description provided for @unitEliteInfantry7.
  ///
  /// In pt, this message translates to:
  /// **'Guardião de Gélido'**
  String get unitEliteInfantry7;

  /// No description provided for @unitEliteInfantry8.
  ///
  /// In pt, this message translates to:
  /// **'Sentinela Asa Gélida'**
  String get unitEliteInfantry8;

  /// No description provided for @unitEliteCavalry1.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro do Pesadelo'**
  String get unitEliteCavalry1;

  /// No description provided for @unitEliteCavalry2.
  ///
  /// In pt, this message translates to:
  /// **'Guarda Brilhante'**
  String get unitEliteCavalry2;

  /// No description provided for @unitEliteCavalry3.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Espectral Lobo de Gelo'**
  String get unitEliteCavalry3;

  /// No description provided for @unitEliteCavalry4.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Quebra-Alces'**
  String get unitEliteCavalry4;

  /// No description provided for @unitEliteCavalry5.
  ///
  /// In pt, this message translates to:
  /// **'Touro de Guerra Estampedeiro'**
  String get unitEliteCavalry5;

  /// No description provided for @unitEliteCavalry6.
  ///
  /// In pt, this message translates to:
  /// **'Yeti Lançador'**
  String get unitEliteCavalry6;

  /// No description provided for @unitEliteCavalry7.
  ///
  /// In pt, this message translates to:
  /// **'Vanguarda Grifo'**
  String get unitEliteCavalry7;

  /// No description provided for @unitEliteCavalry8.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Dentes-de-Sabre'**
  String get unitEliteCavalry8;

  /// No description provided for @unitEliteArcher1.
  ///
  /// In pt, this message translates to:
  /// **'Caçador da Justiça'**
  String get unitEliteArcher1;

  /// No description provided for @unitEliteArcher2.
  ///
  /// In pt, this message translates to:
  /// **'Caçador de Corvo Negro'**
  String get unitEliteArcher2;

  /// No description provided for @unitEliteArcher3.
  ///
  /// In pt, this message translates to:
  /// **'Atirador Blackraven'**
  String get unitEliteArcher3;

  /// No description provided for @unitEliteArcher4.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Morto-Vivo Enxertado'**
  String get unitEliteArcher4;

  /// No description provided for @unitEliteArcher5.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Morto-vivo Olho do Vazio'**
  String get unitEliteArcher5;

  /// No description provided for @unitEliteArcher6.
  ///
  /// In pt, this message translates to:
  /// **'Atirador de Elite Corvoréu'**
  String get unitEliteArcher6;

  /// No description provided for @unitEliteArcher7.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Morto-Vivo Frenético'**
  String get unitEliteArcher7;

  /// No description provided for @unitEliteArcher8.
  ///
  /// In pt, this message translates to:
  /// **'Ceifador de Setas Bloodraven'**
  String get unitEliteArcher8;

  /// No description provided for @unitEliteSiege1.
  ///
  /// In pt, this message translates to:
  /// **'Punidor Divino'**
  String get unitEliteSiege1;

  /// No description provided for @unitEliteSiege2.
  ///
  /// In pt, this message translates to:
  /// **'Abissal Bruto'**
  String get unitEliteSiege2;

  /// No description provided for @unitEliteSiege3.
  ///
  /// In pt, this message translates to:
  /// **'Esmagador Chifre de Ferro'**
  String get unitEliteSiege3;

  /// No description provided for @unitEliteSiege4.
  ///
  /// In pt, this message translates to:
  /// **'Golem Arcano'**
  String get unitEliteSiege4;

  /// No description provided for @unitEliteSiege5.
  ///
  /// In pt, this message translates to:
  /// **'Titã do Fluxo do Vazio'**
  String get unitEliteSiege5;

  /// No description provided for @unitEliteSiege6.
  ///
  /// In pt, this message translates to:
  /// **'Aniquilador Golpe-Partido'**
  String get unitEliteSiege6;

  /// No description provided for @unitEliteSiege7.
  ///
  /// In pt, this message translates to:
  /// **'Arquimago Abandonado'**
  String get unitEliteSiege7;

  /// No description provided for @unitEliteSiege8.
  ///
  /// In pt, this message translates to:
  /// **'Devastador Costas de Canhão'**
  String get unitEliteSiege8;

  /// No description provided for @unitHighArcher11.
  ///
  /// In pt, this message translates to:
  /// **'Besteiro Furioso'**
  String get unitHighArcher11;

  /// No description provided for @unitHighArcher12.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Shura'**
  String get unitHighArcher12;

  /// No description provided for @unitHighCavalry12.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Pégasos'**
  String get unitHighCavalry12;

  /// No description provided for @unitHighSiege11.
  ///
  /// In pt, this message translates to:
  /// **'Artilharia Destemida'**
  String get unitHighSiege11;

  /// No description provided for @unitHighSiege12.
  ///
  /// In pt, this message translates to:
  /// **'Asas de Fênix'**
  String get unitHighSiege12;

  /// No description provided for @unitHighInfantry11.
  ///
  /// In pt, this message translates to:
  /// **'Lanceiro Voulge'**
  String get unitHighInfantry11;

  /// No description provided for @unitHighInfantry12.
  ///
  /// In pt, this message translates to:
  /// **'Guerreiro Selvagem'**
  String get unitHighInfantry12;

  /// No description provided for @buildingSiegeWorkshop.
  ///
  /// In pt, this message translates to:
  /// **'Fábrica de Armas de Cerco'**
  String get buildingSiegeWorkshop;

  /// No description provided for @buildingStable.
  ///
  /// In pt, this message translates to:
  /// **'Estábulo'**
  String get buildingStable;

  /// No description provided for @buildingArcheryRange.
  ///
  /// In pt, this message translates to:
  /// **'Campo de Alcance'**
  String get buildingArcheryRange;

  /// No description provided for @buildingBarracks.
  ///
  /// In pt, this message translates to:
  /// **'Quartel'**
  String get buildingBarracks;

  /// No description provided for @cultureSimple.
  ///
  /// In pt, this message translates to:
  /// **'Simples'**
  String get cultureSimple;

  /// No description provided for @cultureSimpleTitle.
  ///
  /// In pt, this message translates to:
  /// **'Unidades básicas'**
  String get cultureSimpleTitle;

  /// No description provided for @cultureViking.
  ///
  /// In pt, this message translates to:
  /// **'Vikings'**
  String get cultureViking;

  /// No description provided for @cultureVikingTitle.
  ///
  /// In pt, this message translates to:
  /// **'Unidades vikings'**
  String get cultureVikingTitle;

  /// No description provided for @cultureJapanese.
  ///
  /// In pt, this message translates to:
  /// **'Japonesas'**
  String get cultureJapanese;

  /// No description provided for @cultureJapaneseTitle.
  ///
  /// In pt, this message translates to:
  /// **'Unidades japonesas'**
  String get cultureJapaneseTitle;

  /// No description provided for @cultureChinese.
  ///
  /// In pt, this message translates to:
  /// **'Chinesas'**
  String get cultureChinese;

  /// No description provided for @cultureChineseTitle.
  ///
  /// In pt, this message translates to:
  /// **'Unidades chinesas'**
  String get cultureChineseTitle;

  /// No description provided for @culturePersian.
  ///
  /// In pt, this message translates to:
  /// **'Persas'**
  String get culturePersian;

  /// No description provided for @culturePersianTitle.
  ///
  /// In pt, this message translates to:
  /// **'Unidades persas'**
  String get culturePersianTitle;

  /// No description provided for @cultureElite.
  ///
  /// In pt, this message translates to:
  /// **'Especiais'**
  String get cultureElite;

  /// No description provided for @cultureEliteTitle.
  ///
  /// In pt, this message translates to:
  /// **'Tropas especiais'**
  String get cultureEliteTitle;

  /// No description provided for @errorMessage.
  ///
  /// In pt, this message translates to:
  /// **'{error, select, unexpected{Ocorreu um erro inesperado. Feche esta mensagem e tente novamente.} music{Não foi possível reproduzir a música do jogo.} other{Ocorreu um erro inesperado. Feche esta mensagem e tente novamente.}}'**
  String errorMessage(String error);

  /// No description provided for @unitVikingInfantry.
  ///
  /// In pt, this message translates to:
  /// **'Guerreiro Viking'**
  String get unitVikingInfantry;

  /// No description provided for @unitVikingCavalry.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Viking'**
  String get unitVikingCavalry;

  /// No description provided for @unitVikingArcher.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Viking'**
  String get unitVikingArcher;

  /// No description provided for @unitVikingSiege.
  ///
  /// In pt, this message translates to:
  /// **'Cerco Viking'**
  String get unitVikingSiege;

  /// No description provided for @unitJapaneseInfantry.
  ///
  /// In pt, this message translates to:
  /// **'Samurai'**
  String get unitJapaneseInfantry;

  /// No description provided for @unitJapaneseCavalry.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Japonês'**
  String get unitJapaneseCavalry;

  /// No description provided for @unitJapaneseArcher.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Japonês'**
  String get unitJapaneseArcher;

  /// No description provided for @unitJapaneseSiege.
  ///
  /// In pt, this message translates to:
  /// **'Cerco Japonês'**
  String get unitJapaneseSiege;

  /// No description provided for @unitChineseInfantry.
  ///
  /// In pt, this message translates to:
  /// **'Guerreiro Chinês'**
  String get unitChineseInfantry;

  /// No description provided for @unitChineseCavalry.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Chinês'**
  String get unitChineseCavalry;

  /// No description provided for @unitChineseArcher.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Chinês'**
  String get unitChineseArcher;

  /// No description provided for @unitChineseSiege.
  ///
  /// In pt, this message translates to:
  /// **'Cerco Chinês'**
  String get unitChineseSiege;

  /// No description provided for @unitPersianInfantry.
  ///
  /// In pt, this message translates to:
  /// **'Guerreiro Persa'**
  String get unitPersianInfantry;

  /// No description provided for @unitPersianCavalry.
  ///
  /// In pt, this message translates to:
  /// **'Cavaleiro Persa'**
  String get unitPersianCavalry;

  /// No description provided for @unitPersianArcher.
  ///
  /// In pt, this message translates to:
  /// **'Arqueiro Persa'**
  String get unitPersianArcher;

  /// No description provided for @unitPersianSiege.
  ///
  /// In pt, this message translates to:
  /// **'Cerco Persa'**
  String get unitPersianSiege;

  /// No description provided for @loading.
  ///
  /// In pt, this message translates to:
  /// **'Carregando'**
  String get loading;

  /// No description provided for @connectingToServer.
  ///
  /// In pt, this message translates to:
  /// **'Conectando ao servidor…'**
  String get connectingToServer;

  /// No description provided for @reconnectingToServer.
  ///
  /// In pt, this message translates to:
  /// **'Conexão perdida. Reconectando…'**
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
  // Lookup logic when only language code is specified.
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
