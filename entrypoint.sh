#!/bin/bash

set -e

if [[ -z "$TACKLE_HUB_URL" ]]; then
  echo "You must provide TACKLE_HUB_URL environment variable" 1>&2
  exit 1
fi

if [[ -z "$PATHFINDER_URL" ]]; then
  echo "You must provide PATHFINDER_URL environment variable" 1>&2
  exit 1
fi

if [[ -z "$KEYCLOAK_REALM" ]]; then
  echo "You must provide SSO_REALM environment variable" 1>&2
  exit 1
fi

if [[ -z "$KEYCLOAK_CLIENT_ID" ]]; then
  echo "You must provide SSO_CLIENT_ID environment variable" 1>&2
  exit 1
fi

if [[ $AUTH_REQUIRED == "true" ]]; then
  if [[ -z "$KEYCLOAK_SERVER_URL" ]]; then
    echo "You must provide KEYCLOAK_SERVER_URL environment variable" 1>&2
    exit 1
  fi
fi
cd pkg/server
exec node index.js
