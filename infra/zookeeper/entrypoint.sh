#!/usr/bin/env bash
set -euo pipefail

cp /run/opencok-zoo.cfg /conf/zoo.cfg
exec /docker-entrypoint.sh zkServer.sh start-foreground
