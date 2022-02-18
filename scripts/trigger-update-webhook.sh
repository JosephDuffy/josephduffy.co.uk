#!/bin/bash
#
# A script that simulates a minimal package update webhook that GitHub would trigger.
# These hooks were not available on per-repo basis when using ghcr.io but only on an
# organisation level, which this repo is not a part of. When added to repos this was
# no linger used, but the webhooks have since stopped firing.

PACKAGE="$1"
SECRET="$2"
URL="$3"
DATA="{\"registry_package\":{\"name\":\"$PACKAGE\"}}"
DIGEST=$(echo -n "$DATA" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)
curl -X POST -H "Content-Type: application/json" -H "X-Hub-Signature-256: sha256=$DIGEST" --data "$DATA" "$URL"
