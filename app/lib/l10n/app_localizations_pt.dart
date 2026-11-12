// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Portuguese (`pt`).
class AppLocalizationsPt extends AppLocalizations {
  AppLocalizationsPt([String locale = 'pt']) : super(locale);

  @override
  String get close => 'Fechar';

  @override
  String get retry => 'Tente novamente';

  @override
  String get ok => 'OK';

  @override
  String get daily => 'Diariamente';

  @override
  String get items => 'Itens';

  @override
  String get mail => 'Correio';

  @override
  String get alliance => 'Aliança';

  @override
  String get chat => 'Conversa';

  @override
  String get city => 'Cidade';

  @override
  String get map => 'Mapa';

  @override
  String get profile => 'Perfil';

  @override
  String get experienceShort => 'XP';

  @override
  String get experience => 'Experiência';

  @override
  String get energy => 'Energia';

  @override
  String get vip => 'VIP';

  @override
  String get wood => 'Madeira';

  @override
  String get food => 'Comida';

  @override
  String get iron => 'Ferro';

  @override
  String get mithril => 'Mithril';

  @override
  String get power => 'Poder';

  @override
  String get gold => 'Ouro';

  @override
  String get backToGame => 'Voltar ao jogo';

  @override
  String get rename => 'Alterar nome';

  @override
  String get ranking => 'Classificação';

  @override
  String get achievements => 'Conquistas';

  @override
  String get information => 'Informações';

  @override
  String get reset => 'Redefinir';

  @override
  String get skills => 'Talentos';

  @override
  String get settings => 'Configurações';

  @override
  String get castleInterior => 'Interior do castelo';

  @override
  String get castleLoadError =>
      'Não foi possível carregar o interior do castelo.';

  @override
  String get mapLoadError => 'Não foi possível carregar o mapa.';

  @override
  String get closeSelection => 'Fechar seleção';

  @override
  String get trainTroops => 'Treinar tropas';

  @override
  String get backToCastle => 'Voltar ao castelo';

  @override
  String get unitInformation => 'Informações da unidade';

  @override
  String get combatRelation => 'Relação de combate das unidades';

  @override
  String get combatRelationButton => 'Relação de combate\ndas unidades';

  @override
  String get combatRelationDescription =>
      'As vantagens de combate dependem das regras do reino.';

  @override
  String get attack => 'Ataque';

  @override
  String get defense => 'Defesa';

  @override
  String get health => 'HP';

  @override
  String get trainNow => 'Treine Agora!';

  @override
  String get train => 'Treinar';

  @override
  String get trainingUnavailable => 'Treinamento indisponível';

  @override
  String get trainingUnavailableDescription =>
      'O reino ainda não está conectado. Nenhuma unidade foi treinada e nenhum recurso foi gasto.';

  @override
  String get decreaseQuantity => 'Diminuir quantidade';

  @override
  String get increaseQuantity => 'Aumentar quantidade';

  @override
  String get trainingBonusHint =>
      'Use itens de bônus para aumentar o valor do treino!';

  @override
  String get trainingBonus => 'Bônus de treinamento';

  @override
  String get trainingBonusDescription =>
      'Os itens de bônus estarão disponíveis quando o inventário estiver conectado.';

  @override
  String get securityCompromised =>
      'O jogo não pode ser aberto em dispositivos com root ou jailbreak.';

  @override
  String get securityPrivileged =>
      'Abra o jogo com uma conta comum, sem privilégios de root ou administrador.';

  @override
  String get securityDeveloperMode =>
      'Desative as opções do desenvolvedor para abrir o jogo.';

  @override
  String get securityDebugger => 'Desconecte o depurador para abrir o jogo.';

  @override
  String get securityMobileBrowser =>
      'O jogo não está disponível pelo navegador em dispositivos móveis. Use o aplicativo.';

  @override
  String get securityVerificationFailed =>
      'Não foi possível verificar a segurança do dispositivo. Tente novamente.';

  @override
  String get verifyAgain => 'Verificar novamente';

  @override
  String get castleInstructions =>
      'Interior do castelo. Arraste para explorar, amplie com dois dedos e toque em uma construção para selecionar.';

  @override
  String visualPreview(String label) {
    return '$label · prévia visual';
  }

  @override
  String comingSoon(String label) {
    return '$label · em breve';
  }

  @override
  String addResource(String label) {
    return 'Adicionar $label';
  }

  @override
  String resourceValue(String label, String value) {
    return '$label: $value';
  }

  @override
  String profileLevel(int level) {
    return 'Perfil, nível $level';
  }

  @override
  String emptyEquipmentSlot(int slot) {
    return 'Espaço de equipamento vazio $slot';
  }

  @override
  String unitLevel(String name, int level) {
    return '$name, nível $level';
  }

  @override
  String unitDetails(String name, int level, int attack, int defense, int hp) {
    return '$name · nível $level\nAtaque: $attack\nDefesa: $defense\nHP: $hp';
  }

  @override
  String ownedUnits(String count) {
    return 'Possui: $count';
  }

  @override
  String unitCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count unidades',
      one: '1 unidade',
    );
    return '$_temp0';
  }

  @override
  String trainingCapacity(int capacity) {
    return 'Capacidade de treinamento: $capacity';
  }

  @override
  String versionInfo(String client, String server) {
    return 'Cliente: v$client\nServidor: v$server';
  }

  @override
  String trainingHeading(String culture, String building) {
    return '$culture · $building';
  }

  @override
  String get unitStandardInfantry1 => 'Milícia';

  @override
  String get unitStandardInfantry2 => 'Infantaria';

  @override
  String get unitStandardInfantry3 => 'Lanceiro';

  @override
  String get unitStandardInfantry4 => 'Infantaria IV';

  @override
  String get unitStandardInfantry5 => 'Infantaria V';

  @override
  String get unitStandardInfantry6 => 'Infantaria VI';

  @override
  String get unitStandardInfantry7 => 'Infantaria VII';

  @override
  String get unitStandardInfantry8 => 'Infantaria VIII';

  @override
  String get unitStandardInfantry9 => 'Infantaria IX';

  @override
  String get unitStandardInfantry10 => 'Infantaria X';

  @override
  String get unitStandardCavalry1 => 'Cavaleiro';

  @override
  String get unitStandardCavalry2 => 'Cavalaria leve';

  @override
  String get unitStandardCavalry3 => 'Cavalaria pesada';

  @override
  String get unitStandardCavalry4 => 'Cavalaria IV';

  @override
  String get unitStandardCavalry5 => 'Cavalaria V';

  @override
  String get unitStandardCavalry6 => 'Cavalaria VI';

  @override
  String get unitStandardCavalry7 => 'Cavalaria VII';

  @override
  String get unitStandardCavalry8 => 'Cavalaria VIII';

  @override
  String get unitStandardCavalry9 => 'Cavalaria IX';

  @override
  String get unitStandardCavalry10 => 'Cavalaria X';

  @override
  String get unitStandardArcher1 => 'Arqueiro';

  @override
  String get unitStandardArcher2 => 'Besteiro';

  @override
  String get unitStandardArcher3 => 'Arqueiro longo';

  @override
  String get unitStandardArcher4 => 'Arqueiro IV';

  @override
  String get unitStandardArcher5 => 'Arqueiro V';

  @override
  String get unitStandardArcher6 => 'Arqueiro VI';

  @override
  String get unitStandardArcher7 => 'Arqueiro VII';

  @override
  String get unitStandardArcher8 => 'Arqueiro VIII';

  @override
  String get unitStandardArcher9 => 'Arqueiro IX';

  @override
  String get unitStandardArcher10 => 'Arqueiro X';

  @override
  String get unitStandardSiege1 => 'Aríete';

  @override
  String get unitStandardSiege2 => 'Catapulta';

  @override
  String get unitStandardSiege3 => 'Torre de cerco';

  @override
  String get unitStandardSiege4 => 'Cerco IV';

  @override
  String get unitStandardSiege5 => 'Cerco V';

  @override
  String get unitStandardSiege6 => 'Cerco VI';

  @override
  String get unitStandardSiege7 => 'Cerco VII';

  @override
  String get unitStandardSiege8 => 'Cerco VIII';

  @override
  String get unitStandardSiege9 => 'Cerco IX';

  @override
  String get unitStandardSiege10 => 'Cerco X';

  @override
  String get unitSlaughterCavalry => 'Cavalaria de Abate';

  @override
  String get unitRangerKnight => 'Cavaleiro Guarda';

  @override
  String get unitEliteInfantry1 => 'Guardiões do Firmamento';

  @override
  String get unitEliteInfantry2 => 'Carrasco Quebrador de Juramentos';

  @override
  String get unitEliteInfantry3 => 'Guarda Perfuragelo';

  @override
  String get unitEliteInfantry4 => 'Defensor da Couraça de Gelo';

  @override
  String get unitEliteInfantry5 => 'Porta-Escudo de Aço Gélido';

  @override
  String get unitEliteInfantry6 => 'Lanceiro de Aço Gélido';

  @override
  String get unitEliteInfantry7 => 'Guardião de Gélido';

  @override
  String get unitEliteInfantry8 => 'Sentinela Asa Gélida';

  @override
  String get unitEliteCavalry1 => 'Cavaleiro do Pesadelo';

  @override
  String get unitEliteCavalry2 => 'Guarda Brilhante';

  @override
  String get unitEliteCavalry3 => 'Cavaleiro Espectral Lobo de Gelo';

  @override
  String get unitEliteCavalry4 => 'Cavaleiro Quebra-Alces';

  @override
  String get unitEliteCavalry5 => 'Touro de Guerra Estampedeiro';

  @override
  String get unitEliteCavalry6 => 'Yeti Lançador';

  @override
  String get unitEliteCavalry7 => 'Vanguarda Grifo';

  @override
  String get unitEliteCavalry8 => 'Cavaleiro Dentes-de-Sabre';

  @override
  String get unitEliteArcher1 => 'Caçador da Justiça';

  @override
  String get unitEliteArcher2 => 'Caçador de Corvo Negro';

  @override
  String get unitEliteArcher3 => 'Atirador Blackraven';

  @override
  String get unitEliteArcher4 => 'Arqueiro Morto-Vivo Enxertado';

  @override
  String get unitEliteArcher5 => 'Arqueiro Morto-vivo Olho do Vazio';

  @override
  String get unitEliteArcher6 => 'Atirador de Elite Corvoréu';

  @override
  String get unitEliteArcher7 => 'Arqueiro Morto-Vivo Frenético';

  @override
  String get unitEliteArcher8 => 'Ceifador de Setas Bloodraven';

  @override
  String get unitEliteSiege1 => 'Punidor Divino';

  @override
  String get unitEliteSiege2 => 'Abissal Bruto';

  @override
  String get unitEliteSiege3 => 'Esmagador Chifre de Ferro';

  @override
  String get unitEliteSiege4 => 'Golem Arcano';

  @override
  String get unitEliteSiege5 => 'Titã do Fluxo do Vazio';

  @override
  String get unitEliteSiege6 => 'Aniquilador Golpe-Partido';

  @override
  String get unitEliteSiege7 => 'Arquimago Abandonado';

  @override
  String get unitEliteSiege8 => 'Devastador Costas de Canhão';

  @override
  String get unitHighArcher11 => 'Besteiro Furioso';

  @override
  String get unitHighArcher12 => 'Arqueiro Shura';

  @override
  String get unitHighCavalry12 => 'Cavaleiro Pégasos';

  @override
  String get unitHighSiege11 => 'Artilharia Destemida';

  @override
  String get unitHighSiege12 => 'Asas de Fênix';

  @override
  String get unitHighInfantry11 => 'Lanceiro Voulge';

  @override
  String get unitHighInfantry12 => 'Guerreiro Selvagem';

  @override
  String get buildingSiegeWorkshop => 'Fábrica de Armas de Cerco';

  @override
  String get buildingStable => 'Estábulo';

  @override
  String get buildingArcheryRange => 'Campo de Alcance';

  @override
  String get buildingBarracks => 'Quartel';

  @override
  String get cultureSimple => 'Simples';

  @override
  String get cultureSimpleTitle => 'Unidades básicas';

  @override
  String get cultureViking => 'Vikings';

  @override
  String get cultureVikingTitle => 'Unidades vikings';

  @override
  String get cultureJapanese => 'Japonesas';

  @override
  String get cultureJapaneseTitle => 'Unidades japonesas';

  @override
  String get cultureChinese => 'Chinesas';

  @override
  String get cultureChineseTitle => 'Unidades chinesas';

  @override
  String get culturePersian => 'Persas';

  @override
  String get culturePersianTitle => 'Unidades persas';

  @override
  String get cultureElite => 'Especiais';

  @override
  String get cultureEliteTitle => 'Tropas especiais';

  @override
  String errorMessage(String error) {
    String _temp0 = intl.Intl.selectLogic(error, {
      'unexpected':
          'Ocorreu um erro inesperado. Feche esta mensagem e tente novamente.',
      'music': 'Não foi possível reproduzir a música do jogo.',
      'other':
          'Ocorreu um erro inesperado. Feche esta mensagem e tente novamente.',
    });
    return '$_temp0';
  }

  @override
  String get unitVikingInfantry => 'Guerreiro Viking';

  @override
  String get unitVikingCavalry => 'Cavaleiro Viking';

  @override
  String get unitVikingArcher => 'Arqueiro Viking';

  @override
  String get unitVikingSiege => 'Cerco Viking';

  @override
  String get unitJapaneseInfantry => 'Samurai';

  @override
  String get unitJapaneseCavalry => 'Cavaleiro Japonês';

  @override
  String get unitJapaneseArcher => 'Arqueiro Japonês';

  @override
  String get unitJapaneseSiege => 'Cerco Japonês';

  @override
  String get unitChineseInfantry => 'Guerreiro Chinês';

  @override
  String get unitChineseCavalry => 'Cavaleiro Chinês';

  @override
  String get unitChineseArcher => 'Arqueiro Chinês';

  @override
  String get unitChineseSiege => 'Cerco Chinês';

  @override
  String get unitPersianInfantry => 'Guerreiro Persa';

  @override
  String get unitPersianCavalry => 'Cavaleiro Persa';

  @override
  String get unitPersianArcher => 'Arqueiro Persa';

  @override
  String get unitPersianSiege => 'Cerco Persa';

  @override
  String get loading => 'Carregando';

  @override
  String get connectingToServer => 'Conectando ao servidor…';

  @override
  String get reconnectingToServer => 'Conexão perdida. Reconectando…';
}
