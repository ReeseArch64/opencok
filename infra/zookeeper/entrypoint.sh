#!/usr/bin/env bash
set -euo pipefail

# The pinned image chowns /conf at startup. Keep the mounted input read-only,
# copying it to the image's writable config directory before its normal entrypoint.
cp /run/opencok-zoo.cfg /conf/zoo.cfg
exec /docker-entrypoint.sh zkServer.sh start-foreground
