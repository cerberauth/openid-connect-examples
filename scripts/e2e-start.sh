#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="$REPO_ROOT/docker-compose.e2e.yml"

if [ $# -eq 0 ]; then
  trap 'echo "==> Tearing down..."; docker compose -f "$COMPOSE_FILE" down' EXIT

  echo "==> Starting all apps via docker-compose..."
  docker compose -f "$COMPOSE_FILE" up --build -d

  for port in 4001 4002 4003 4004 4005 4006; do
    echo "==> Waiting for app on port $port..."
    timeout 120 sh -c "until curl -sf http://localhost:$port > /dev/null; do sleep 2; done"
    echo "    port $port ready."
  done

  echo "==> All apps ready. Running Playwright tests..."
  cd "$REPO_ROOT/e2e"
  npm ci
  npx playwright install chromium
  npx playwright test
  exit $?
fi

APP="${1:?app name required (angular-spa|react-spa|vue-spa|nextjs-app|hono-app|tanstack-start-app)}"
PORT="${2:?port required}"
OIDC_ISSUER="${3:-}"
OIDC_CLIENT_ID="${4:-}"
OIDC_CLIENT_SECRET="${5:-}"

case "$APP" in
  angular-spa)
    REDIRECT_URI="http://localhost:$PORT/index.html"
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT/index.html"
    STUBIDP_PORT=8481
    PUBLIC_CLIENT=true
    ;;
  react-spa)
    REDIRECT_URI="http://localhost:$PORT"
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT"
    STUBIDP_PORT=8482
    PUBLIC_CLIENT=true
    ;;
  vue-spa)
    REDIRECT_URI="http://localhost:$PORT"
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT"
    STUBIDP_PORT=8483
    PUBLIC_CLIENT=true
    ;;
  nextjs-app)
    REDIRECT_URI="http://localhost:$PORT/api/auth/callback/testid"
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT"
    STUBIDP_PORT=8484
    PUBLIC_CLIENT=false
    ;;
  hono-app)
    REDIRECT_URI="http://localhost:$PORT/auth/callback"
    # hono-app builds this with `new URL(...)`, which normalizes a bare
    # origin to have a trailing slash, so StubIdP must be registered with
    # that exact form.
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT/"
    STUBIDP_PORT=8485
    PUBLIC_CLIENT=false
    ;;
  tanstack-start-app)
    REDIRECT_URI="http://localhost:$PORT"
    POST_LOGOUT_REDIRECT_URI="http://localhost:$PORT"
    STUBIDP_PORT=8486
    PUBLIC_CLIENT=true
    ;;
  *)
    echo "Unknown app: $APP" >&2
    exit 1
    ;;
esac

if [ -z "$OIDC_CLIENT_ID" ]; then
  OIDC_CLIENT_ID="e2e-test-client"
  OIDC_ISSUER="http://localhost:$STUBIDP_PORT"

  if [ "$PUBLIC_CLIENT" = "true" ]; then
    OIDC_CLIENT_SECRET=""
  else
    OIDC_CLIENT_SECRET="e2e-test-secret"
  fi

  echo "==> Starting StubIdP for $APP on port $STUBIDP_PORT..."
  # stubidp's port is configured via STUBIDP_PORT (there is no --port flag)
  docker run -d \
    --name "stubidp-$APP" \
    --network host \
    -e STUBIDP_PORT="$STUBIDP_PORT" \
    -e STUBIDP_CLIENT_ID="$OIDC_CLIENT_ID" \
    -e STUBIDP_CLIENT_SECRET="$OIDC_CLIENT_SECRET" \
    -e STUBIDP_REDIRECT_URI="$REDIRECT_URI" \
    -e STUBIDP_POST_LOGOUT_REDIRECT_URI="$POST_LOGOUT_REDIRECT_URI" \
    -e STUBIDP_PUBLIC_CLIENT="$PUBLIC_CLIENT" \
    -e STUBIDP_SKIP_PROMPT="true" \
    -e STUBIDP_DEFAULT_USER='{"sub":"e2e-test-user","email":"e2e-test-user@example.com"}' \
    node:jod-alpine \
    sh -c "npx --yes @cerberauth/stubidp"

  trap 'echo "==> Stopping StubIdP..."; docker stop "stubidp-$APP" && docker rm "stubidp-$APP"' EXIT

  echo "==> Waiting for StubIdP on port $STUBIDP_PORT..."
  timeout 120 sh -c "until curl -sf http://localhost:$STUBIDP_PORT/.well-known/openid-configuration > /dev/null; do sleep 2; done"
  echo "    StubIdP ready."
fi

echo "==> Building $APP..."
case "$APP" in
  angular-spa)
    docker build \
      --build-arg NG_CONFIGURATION=e2e \
      -t e2e-app \
      "$REPO_ROOT/examples/$APP"
    ;;
  react-spa|vue-spa)
    docker build \
      --build-arg VITE_OIDC_ISSUER="$OIDC_ISSUER" \
      --build-arg VITE_OIDC_CLIENT_ID="$OIDC_CLIENT_ID" \
      -t e2e-app \
      "$REPO_ROOT/examples/$APP"
    ;;
  tanstack-start-app)
    # TanStack Start's SPA-mode build prerenders the shell by having a local
    # server fetch itself over loopback. BuildKit sandboxes RUN network by
    # default, which refuses that loopback connection, so this build needs
    # full host network access.
    docker build \
      --network host \
      --build-arg VITE_OIDC_ISSUER="$OIDC_ISSUER" \
      --build-arg VITE_OIDC_CLIENT_ID="$OIDC_CLIENT_ID" \
      -t e2e-app \
      "$REPO_ROOT/examples/$APP"
    ;;
  nextjs-app)
    docker build -t e2e-app "$REPO_ROOT/examples/$APP"
    ;;
  hono-app)
    docker build -f "$REPO_ROOT/examples/$APP/Dockerfile.e2e" -t e2e-app "$REPO_ROOT/examples/$APP"
    ;;
esac

echo "==> Starting $APP on port $PORT..."
case "$APP" in
  angular-spa|react-spa|vue-spa|tanstack-start-app)
    docker run -d \
      --name e2e-app-container \
      -p "$PORT:80" \
      e2e-app
    ;;
  nextjs-app)
    docker run -d \
      --name e2e-app-container \
      --network host \
      -e PORT="$PORT" \
      -e AUTH_ISSUER="$OIDC_ISSUER" \
      -e AUTH_CLIENT_ID="$OIDC_CLIENT_ID" \
      -e AUTH_CLIENT_SECRET="$OIDC_CLIENT_SECRET" \
      -e AUTH_SECRET=e2e-nextauth-secret-32-chars!!! \
      -e AUTH_TRUST_HOST=true \
      -e AUTH_URL="http://localhost:$PORT" \
      e2e-app
    ;;
  hono-app)
    docker run -d \
      --name e2e-app-container \
      --network host \
      -e PORT="$PORT" \
      -e AUTH_ISSUER="$OIDC_ISSUER" \
      -e AUTH_CLIENT_ID="$OIDC_CLIENT_ID" \
      -e AUTH_CLIENT_SECRET="$OIDC_CLIENT_SECRET" \
      -e AUTH_REDIRECT_URI="$REDIRECT_URI" \
      -e AUTH_POST_LOGOUT_REDIRECT_URI="$POST_LOGOUT_REDIRECT_URI" \
      e2e-app
    ;;
esac

echo "==> Waiting for $APP to be ready on port $PORT..."
timeout 60 sh -c "until curl -sf http://localhost:$PORT > /dev/null; do sleep 2; done"
echo "==> $APP ready."
