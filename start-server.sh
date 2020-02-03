#!/bin/sh

if [[ -z "${GITHUB_OAUTH_TOKEN}" ]]; then
  echo "GITHUB_OAUTH_TOKEN environment variable is required"
  exit 1
fi

docker build -t josephduffy:latest --build-arg GITHUB_OAUTH_TOKEN=$GITHUB_OAUTH_TOKEN .
echo "Starting server listening on 80 (http) and 443 (https)"
docker run -p 80:80 -p 443:443 -it josephduffy:latest
echo "Server stopped"
