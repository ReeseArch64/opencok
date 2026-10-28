import { containsReservedNickname } from "@opencok/resources/nickname-reserved";
import type { GameServices } from "@opencok/contracts/game";
import {
    loadNicknameWordFilter,
    type NicknameForbiddenReader,
} from "@opencok/resources/nickname-words";

export async function loadNicknameServices(
    readForbidden?: NicknameForbiddenReader,
    wordsFile?: string | URL,
): Promise<
    Pick<
        GameServices,
        "nicknameBadWords" | "nicknameReservedPatterns" | "nicknameForbidden" | "filterBadWords"
    >
>
{
    const filter = await loadNicknameWordFilter(wordsFile, readForbidden);

    return {
        nicknameForbidden: (name) => containsReservedNickname(name, filter.reservedNamePatterns()),
        nicknameBadWords: (name) => filter.contains(name),
        nicknameReservedPatterns: () => filter.reservedNamePatterns(),
        filterBadWords: (text) => filter.filter(text),
    };
}
