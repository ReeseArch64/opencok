import { AllianceSciencePolicy } from "@opencok/alliance/rules/science";
import { num } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { allianceFailure } from "./alliance";

const policy = new AllianceSciencePolicy({ num, cityInteger, allianceFailure });

export const allianceScienceRule = policy.allianceScienceRule;

export const allianceScienceStage = policy.allianceScienceStage;
