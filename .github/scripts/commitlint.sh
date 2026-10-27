#!/usr/bin/env bash
set -euo pipefail

range_base=""

if [[ -n "${BASE_SHA:-}" ]] && git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null; then
  if git merge-base --is-ancestor "$BASE_SHA" HEAD; then
    range_base="$BASE_SHA"
  elif [[ "${EVENT_NAME:-}" == "pull_request" ]]; then
    range_base="$(git merge-base "$BASE_SHA" HEAD)"
  fi
fi

if [[ -z "$range_base" ]]; then
  range_base="$(git merge-base "refs/remotes/origin/${DEFAULT_BRANCH}" HEAD)"
fi

if [[ "$range_base" == "$(git rev-parse HEAD)" ]]; then
  git show --quiet --format=%B HEAD | bunx commitlint --verbose
else
  bunx commitlint --from="$range_base" --to=HEAD --verbose
fi
