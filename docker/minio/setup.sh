#!/bin/sh
set -eu

attempt=0
until mc alias set local http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1 \
    && mc ready local >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ]; then
        echo "MinIO did not become available within 60 attempts" >&2
        exit 1
    fi
    sleep 1
done

test -d /source/cok.eleximg.com
test -d /source/asset.cok.chat

mc mb --ignore-existing local/opencok-cdn >/dev/null
mc mb --ignore-existing local/opencok-uploads >/dev/null
mc anonymous set none local/opencok-uploads >/dev/null
mc anonymous set-json /configuration/cdn-policy.json local/opencok-cdn >/dev/null
mc mirror --overwrite --quiet /source/cok.eleximg.com/ local/opencok-cdn/cok.eleximg.com/ >/dev/null
mc mirror --overwrite --quiet /source/asset.cok.chat/ local/opencok-cdn/asset.cok.chat/ >/dev/null

echo "Prepared CDN prefixes and private upload bucket"
