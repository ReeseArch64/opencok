#!/bin/sh
set -eu

mc alias set local http://minio:9000 opencok opencok-secret >/dev/null
mc mb --ignore-existing local/opencok-cdn >/dev/null
mc mb --ignore-existing local/opencok-uploads >/dev/null
mc anonymous set none local/opencok-uploads >/dev/null
cat > /tmp/cdn-public-read.json <<'JSON'
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::opencok-cdn/cok.eleximg.com/*","arn:aws:s3:::opencok-cdn/asset.cok.chat/*"]}]}
JSON
mc anonymous set-json /tmp/cdn-public-read.json local/opencok-cdn >/dev/null
mc mirror --overwrite --quiet /source/cok.eleximg.com/ local/opencok-cdn/cok.eleximg.com/ >/dev/null
mc mirror --overwrite --quiet /source/asset.cok.chat/ local/opencok-cdn/asset.cok.chat/ >/dev/null
printf '%s\n' 'CDN host trees synchronized; uploads and source archives are not public'
