import type { CityBootstrapResult } from "@opencok/contracts/city-bootstrap";
import type { Row } from "@opencok/contracts/rows";
import type { Fields } from "@opencok/messages/sfs";

export interface CityBootstrapContributions
{
    playerInfo: Fields;
    businessMan?: Fields;
    expeditionActivity?: Fields;
    normalRecharge?: CityBootstrapResult;
    comeback?: CityBootstrapResult;
    prayer?: CityBootstrapResult;
    recallTasks?: CityBootstrapResult;
    regionalRecall?: CityBootstrapResult;
    hearts?: CityBootstrapResult;
    gifts?: CityBootstrapResult;
    treasureMaps?: CityBootstrapResult;
    equipment?: CityBootstrapResult;
    dragons?: CityBootstrapResult;
    dragonTower?: CityBootstrapResult;
    vipBox?: CityBootstrapResult;
    luckyDay?: CityBootstrapResult;
    recharge?: CityBootstrapResult;
    totems?: CityBootstrapResult;
    branchCity?: CityBootstrapResult;
    lottery?: CityBootstrapResult;
    civilization?: CityBootstrapResult;
    alliance?: CityBootstrapResult;
    effects?: CityBootstrapResult;
    quest?: CityBootstrapResult;
    generals?: CityBootstrapResult;
}

export interface CityBootstrapPresentation
{
    kingdomId: number;
    features(profile: Row): Fields;
    hasReconnect(): boolean;
}
