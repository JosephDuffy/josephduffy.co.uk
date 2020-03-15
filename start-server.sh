#!/bin/sh

if [[ -z "${GITHUB_ACCESS_TOKEN}" ]]; then
  echo "GITHUB_ACCESS_TOKEN environment variable is required"
  exit 1
fi

docker build -t josephduffy:latest --build-arg GITHUB_ACCESS_TOKEN .
echo "Starting server listening on port 80 (http)"
docker run -p 80:80 -it josephduffy:latest
echo "Server stopped"
