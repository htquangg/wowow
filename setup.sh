#!/bin/bash

set -e

docker-compose --env-file .env.docker -f ./deployments/docker-compose.dev.yml down --volumes

docker-compose --env-file .env.docker -f ./deployments/docker-compose.dev.yml up -d

yarn

docker restart wow-rpc-server
