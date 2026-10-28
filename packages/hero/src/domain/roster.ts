import type { Hero } from "./hero.ts";
import { Bernard } from "./bernard.ts";
import { Jered } from "./jered.ts";
import { ThornFlower } from "./thorn-flower.ts";
import { Rufus } from "./rufus.ts";
import { Joseph } from "./joseph.ts";
import { MoYe } from "./mo-ye.ts";
import { Komatsuhime } from "./komatsuhime.ts";
import { Valkyr } from "./valkyr.ts";
import { Caroline } from "./caroline.ts";
import { SanadaYukimura } from "./sanada-yukimura.ts";
import { Olaf } from "./olaf.ts";
import { Galenus } from "./galenus.ts";
import { TheQueenOfWar } from "./the-queen-of-war.ts";
import { Yulia } from "./yulia.ts";
import { HanXin } from "./han-xin.ts";
import { Charlemagne } from "./charlemagne.ts";
import { Beowulf } from "./beowulf.ts";
import { Siegfried } from "./siegfried.ts";
import { PrinzEugen } from "./prinz-eugen.ts";
import { Harald } from "./harald.ts";
import { Lancelot } from "./lancelot.ts";
import { JoanOfArc } from "./joan-of-arc.ts";
import { ToyotomiHideyoshi } from "./toyotomi-hideyoshi.ts";
import { DateMasamune } from "./date-masamune.ts";
import { DiRenjie } from "./di-renjie.ts";
import { XiaoQiao } from "./xiao-qiao.ts";
import { TakenakaShigeharu } from "./takenaka-shigeharu.ts";
import { SaitoKichyo } from "./saito-kichyo.ts";
import { LinXiangru } from "./lin-xiangru.ts";
import { OdaIchi } from "./oda-ichi.ts";
import { Bale } from "./bale.ts";
import { ZhugeLiang } from "./zhuge-liang.ts";
import { XunYu } from "./xun-yu.ts";
import { SunWu } from "./sun-wu.ts";
import { Vitruvius } from "./vitruvius.ts";
import { Hippocrates } from "./hippocrates.ts";
import { LuSu } from "./lu-su.ts";
import { SaitoDosan } from "./saito-dosan.ts";
import { SenNoRikyu } from "./sen-no-rikyu.ts";
import { Creator } from "./creator.ts";
import { Sonya } from "./sonya.ts";
import { GoddessOfHarvest } from "./goddess-of-harvest.ts";
import { Demogorgon } from "./demogorgon.ts";
import { Priest } from "./priest.ts";
import { WastelandWarrior } from "./wasteland-warrior.ts";
import { DeathKnight } from "./death-knight.ts";
import { WindRanger } from "./wind-ranger.ts";
import { WarsongMaster } from "./warsong-master.ts";
import { Warhammer } from "./warhammer.ts";
import { Phantom } from "./phantom.ts";
import { SoulEater } from "./soul-eater.ts";
import { ChristmasElf } from "./christmas-elf.ts";
import { ArrowOfGodOfLove } from "./arrow-of-god-of-love.ts";
import { WildSwordsman } from "./wild-swordsman.ts";
import { EagleWitch } from "./eagle-witch.ts";
import { HolyShield } from "./holy-shield.ts";
import { TimeElder } from "./time-elder.ts";
import { ZhaoYun } from "./zhao-yun.ts";
import { GodOfAbundance } from "./god-of-abundance.ts";
import { CivilizationCrystalEnvoyHill } from "./civilization-crystal-envoy-hill.ts";
import { Mansur } from "./mansur.ts";
import { HarvestElf } from "./harvest-elf.ts";
import { IronMason } from "./iron-mason.ts";
import { YulinIronGuard } from "./yulin-iron-guard.ts";
import { GuardKnight } from "./guard-knight.ts";
import { VisionaryRanger } from "./visionary-ranger.ts";
import { ChariotMaster } from "./chariot-master.ts";
import { KingArthur } from "./king-arthur.ts";
import { Mulan } from "./mulan.ts";
import { Unknown1 } from "./unknown-1.ts";
import { Unknown2 } from "./unknown-2.ts";
import { LuminousShield } from "./luminous-shield.ts";
import { AmbitiousCavalry } from "./ambitious-cavalry.ts";
import { ImperialArcher } from "./imperial-archer.ts";
import { IronHand } from "./iron-hand.ts";
import { ShieldOfEmpire } from "./shield-of-empire.ts";
import { SpearOfEmpire } from "./spear-of-empire.ts";
import { TigerWarrior } from "./tiger-warrior.ts";
import { LionHeartKnight } from "./lion-heart-knight.ts";
import { Pandarus } from "./pandarus.ts";
import { ShadowDancer } from "./shadow-dancer.ts";
import { Pyrus } from "./pyrus.ts";
import { Leonidas } from "./leonidas.ts";
import { IronBloodedGuard } from "./iron-blooded-guard.ts";
import { ExpansionMasterGaudi } from "./expansion-master-gaudi.ts";
import { GemWitch } from "./gem-witch.ts";
import { Cleopatra } from "./cleopatra.ts";
import { Judith } from "./judith.ts";
import { Dio } from "./dio.ts";
import { Athena } from "./athena.ts";
import { BlackStar } from "./black-star.ts";
import { Saladin } from "./saladin.ts";
import { BaldwinTheFourth } from "./baldwin-the-fourth.ts";
import { RichardI } from "./richard-i.ts";
import { FrederickTheFirst } from "./frederick-the-first.ts";
import { Rogers } from "./rogers.ts";
import { YingYaoguang } from "./ying-yaoguang.ts";
import { Edgar } from "./edgar.ts";
import { Cassidier } from "./cassidier.ts";
import { MoTianxuan } from "./mo-tianxuan.ts";
import { Tivash } from "./tivash.ts";
import { Douby } from "./douby.ts";
import { Shea } from "./shea.ts";
import { Mizar } from "./mizar.ts";
import { NezhaVariant1 } from "./nezha-variant-1.ts";
import { NezhaVariant2 } from "./nezha-variant-2.ts";
import { NezhaVariant3 } from "./nezha-variant-3.ts";
import { NezhaVariant4 } from "./nezha-variant-4.ts";
import { NezhaVariant5 } from "./nezha-variant-5.ts";

export const heroRoster: readonly Hero[] = [
    new Bernard(),
    new Jered(),
    new ThornFlower(),
    new Rufus(),
    new Joseph(),
    new MoYe(),
    new Komatsuhime(),
    new Valkyr(),
    new Caroline(),
    new SanadaYukimura(),
    new Olaf(),
    new Galenus(),
    new TheQueenOfWar(),
    new Yulia(),
    new HanXin(),
    new Charlemagne(),
    new Beowulf(),
    new Siegfried(),
    new PrinzEugen(),
    new Harald(),
    new Lancelot(),
    new JoanOfArc(),
    new ToyotomiHideyoshi(),
    new DateMasamune(),
    new DiRenjie(),
    new XiaoQiao(),
    new TakenakaShigeharu(),
    new SaitoKichyo(),
    new LinXiangru(),
    new OdaIchi(),
    new Bale(),
    new ZhugeLiang(),
    new XunYu(),
    new SunWu(),
    new Vitruvius(),
    new Hippocrates(),
    new LuSu(),
    new SaitoDosan(),
    new SenNoRikyu(),
    new Creator(),
    new Sonya(),
    new GoddessOfHarvest(),
    new Demogorgon(),
    new Priest(),
    new WastelandWarrior(),
    new DeathKnight(),
    new WindRanger(),
    new WarsongMaster(),
    new Warhammer(),
    new Phantom(),
    new SoulEater(),
    new ChristmasElf(),
    new ArrowOfGodOfLove(),
    new WildSwordsman(),
    new EagleWitch(),
    new HolyShield(),
    new TimeElder(),
    new ZhaoYun(),
    new GodOfAbundance(),
    new CivilizationCrystalEnvoyHill(),
    new Mansur(),
    new HarvestElf(),
    new IronMason(),
    new YulinIronGuard(),
    new GuardKnight(),
    new VisionaryRanger(),
    new ChariotMaster(),
    new KingArthur(),
    new Mulan(),
    new Unknown1(),
    new Unknown2(),
    new LuminousShield(),
    new AmbitiousCavalry(),
    new ImperialArcher(),
    new IronHand(),
    new ShieldOfEmpire(),
    new SpearOfEmpire(),
    new TigerWarrior(),
    new LionHeartKnight(),
    new Pandarus(),
    new ShadowDancer(),
    new Pyrus(),
    new Leonidas(),
    new IronBloodedGuard(),
    new ExpansionMasterGaudi(),
    new GemWitch(),
    new Cleopatra(),
    new Judith(),
    new Dio(),
    new Athena(),
    new BlackStar(),
    new Saladin(),
    new BaldwinTheFourth(),
    new RichardI(),
    new FrederickTheFirst(),
    new Rogers(),
    new YingYaoguang(),
    new Edgar(),
    new Cassidier(),
    new MoTianxuan(),
    new Tivash(),
    new Douby(),
    new Shea(),
    new Mizar(),
    new NezhaVariant1(),
    new NezhaVariant2(),
    new NezhaVariant3(),
    new NezhaVariant4(),
    new NezhaVariant5(),
];
