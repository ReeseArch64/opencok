import type { AllianceMembershipCatalog } from "./membership-catalog";
import type { AllianceScienceCatalog } from "./science-catalog";
import type { AllianceGiftCatalog } from "./gift-catalog";

export type AllianceContextCatalog =
    & AllianceMembershipCatalog
    & AllianceScienceCatalog
    & AllianceGiftCatalog;
