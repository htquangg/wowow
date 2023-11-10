#!/bin/bash

set -e

docker-compose --env-file .env.docker -f ./deployments/docker-compose.dev.yml down --volumes

docker-compose --env-file .env.docker -f ./deployments/docker-compose.dev.yml up -d

npm run -g live-server

yarn

docker restart wow-rpc-server wow-http-server
