import type { GameServices } from "@opencok/contracts/game";
import {
  loadNicknameWordFilter,
  type NicknameForbiddenReader,
} from "@opencok/resources/nickname-words";

export async function loadNicknameServices(
  resources: string,
  readForbidden?: NicknameForbiddenReader,
): Promise<Pick<GameServices, "nicknameBadWords" | "nicknameReservedPatterns" | "filterBadWords">> {
  const filter = await loadNicknameWordFilter(resources, readForbidden);
  return {
    nicknameBadWords: (name) => filter.contains(name),
    nicknameReservedPatterns: () => filter.reservedNamePatterns(),
    filterBadWords: (text) => filter.filter(text),
  };
}
