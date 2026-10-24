import type { GameServices } from "@opencok/contracts/game";
import { loadNicknameWordFilter } from "@opencok/resources/nickname-words";

export async function loadNicknameServices(
  resources: string,
): Promise<Pick<GameServices, "nicknameBadWords">> {
  const filter = await loadNicknameWordFilter(resources);
  return { nicknameBadWords: (name) => filter.contains(name) };
}
