#!/bin/sh
set -eu

: "${MAPLE_LOCAL_INGEST_KEY:?MAPLE_LOCAL_INGEST_KEY is required}"

case "$MAPLE_LOCAL_INGEST_KEY" in
    *[!A-Za-z0-9_./+=-]*)
        echo "MAPLE_LOCAL_INGEST_KEY must contain token-safe characters" >&2
        exit 1
        ;;
esac

umask 077
sed "s|__MAPLE_LOCAL_INGEST_KEY__|$MAPLE_LOCAL_INGEST_KEY|g" \
    /etc/traefik/traefik.dev.yml > /tmp/traefik.yml

if [ "${1:-}" = traefik ]; then
    shift
fi

exec traefik --configFile=/tmp/traefik.yml "$@"
