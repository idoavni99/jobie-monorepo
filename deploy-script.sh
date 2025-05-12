#!/usr/bin/env bash
git pull

pnpm i

docker compose down
docker compose up -d --build