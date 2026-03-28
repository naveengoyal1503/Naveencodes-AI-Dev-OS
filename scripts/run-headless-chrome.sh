#!/usr/bin/env bash
set -euo pipefail

CHROME_BIN="${CHROME_EXECUTABLE_PATH:-/usr/bin/google-chrome}"
REMOTE_PORT="${CHROME_REMOTE_DEBUGGING_PORT:-9222}"
USER_DATA_DIR="${CHROME_USER_DATA_DIR:-/tmp/naveencodes-chrome-profile}"
EXTRA_ARGS="${CHROME_EXTRA_ARGS:-}"

mkdir -p "$USER_DATA_DIR"

ARGS=(
  "--headless=new"
  "--remote-debugging-address=127.0.0.1"
  "--remote-debugging-port=${REMOTE_PORT}"
  "--user-data-dir=${USER_DATA_DIR}"
  "--disable-gpu"
  "--disable-dev-shm-usage"
  "--no-first-run"
  "--no-default-browser-check"
)

if [[ "${CHROME_HEADLESS:-true}" != "true" ]]; then
  ARGS=(
    "--remote-debugging-address=127.0.0.1"
    "--remote-debugging-port=${REMOTE_PORT}"
    "--user-data-dir=${USER_DATA_DIR}"
  )
fi

if [[ -n "${EXTRA_ARGS}" ]]; then
  IFS=',' read -r -a EXTRA <<< "$EXTRA_ARGS"
  ARGS+=("${EXTRA[@]}")
fi

exec "$CHROME_BIN" "${ARGS[@]}"
