import { describe, expect, test } from "bun:test";
import { matchesItem } from "../src/lib/search.mjs";
import { statusLabel } from "../src/lib/catalog.mjs";

function troop(overrides = {}) {
  return {
    name: "Cavaleiro Pégasos",
    group: "Cavalaria",
    tier: 12,
    status: "soon",
    reference: "107111",
    ...overrides,
  };
}

describe("catalog search", () => {
  test("matchesItem_emptyFilters_includesItem", () => {
    expect(matchesItem(troop())).toBe(true);
  });
  test("matchesItem_accentAndCaseDifferences_findsName", () => {
    expect(matchesItem(troop(), { query: "  PEGASOS " })).toBe(true);
  });
  test("matchesItem_termsAcrossFields_matchesAllTerms", () => {
    expect(matchesItem(troop(), { query: "pegasos cavalaria T12" })).toBe(true);
  });
  test("matchesItem_unknownTerm_excludesItem", () => {
    expect(matchesItem(troop(), { query: "pegasos inexistente" })).toBe(false);
  });
  test("matchesItem_identifierQuery_findsCode", () => {
    expect(matchesItem(troop(), { query: "107111" })).toBe(true);
  });
  test("matchesItem_combinedMatchingFilters_includesItem", () => {
    expect(
      matchesItem(troop(), { query: "Pégasos", group: "Cavalaria", tier: "12", status: "soon" }),
    ).toBe(true);
  });
  test("matchesItem_wrongFamily_excludesItem", () => {
    expect(matchesItem(troop(), { group: "Infantaria" })).toBe(false);
  });
  test("matchesItem_wrongTier_excludesItem", () => {
    expect(matchesItem(troop(), { tier: "18" })).toBe(false);
  });
  test("matchesItem_unreleasedItem_excludesAvailableFilter", () => {
    expect(matchesItem(troop(), { status: "available" })).toBe(false);
  });
  test("matchesItem_availableItem_includesAvailableFilter", () => {
    expect(matchesItem(troop({ status: "available" }), { status: "available" })).toBe(true);
  });
  test("matchesItem_itemWithoutTier_excludesTierFilter", () => {
    expect(matchesItem(troop({ tier: undefined }), { tier: "12" })).toBe(false);
  });
  test("statusLabel_unconfirmedStatus_showsComingSoon", () => {
    expect(statusLabel(undefined)).toBe("Em breve");
    expect(statusLabel("soon")).toBe("Em breve");
  });
  test("statusLabel_confirmedAvailability_showsAvailable", () => {
    expect(statusLabel("available")).toBe("Disponível");
  });
});
