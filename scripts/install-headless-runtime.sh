#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="${ROOT_DIR}/.runtime"
CHROME_DIR="${RUNTIME_DIR}/chrome"
CHROME_ZIP="${RUNTIME_DIR}/chrome-linux64.zip"
JSON_URL="https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"

mkdir -p "${RUNTIME_DIR}"

if ! command -v wget >/dev/null 2>&1; then
  echo "wget is required"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required"
  exit 1
fi

TMP_JSON="${RUNTIME_DIR}/chrome-downloads.json"
wget -q -O "${TMP_JSON}" "${JSON_URL}"
export TMP_JSON

DOWNLOAD_URL="$(python3 - <<'PY'
import json, os
with open(os.environ["TMP_JSON"], "r", encoding="utf-8") as fh:
    data = json.load(fh)
downloads = data["channels"]["Stable"]["downloads"]["chrome"]
match = next(item["url"] for item in downloads if item["platform"] == "linux64")
print(match)
PY
)"
export CHROME_ZIP CHROME_DIR

echo "Downloading Chrome for Testing..."
wget -q -O "${CHROME_ZIP}" "${DOWNLOAD_URL}"
rm -rf "${CHROME_DIR}"
mkdir -p "${CHROME_DIR}"

python3 - <<'PY'
import os, zipfile
zip_path = os.environ["CHROME_ZIP"]
target = os.environ["CHROME_DIR"]
with zipfile.ZipFile(zip_path, "r") as archive:
    archive.extractall(target)
PY

CHROME_BIN="$(find "${CHROME_DIR}" -type f -path '*chrome-linux64/chrome' | head -n 1)"
chmod +x "${CHROME_BIN}"

echo "Chrome installed at: ${CHROME_BIN}"
echo "Set CHROME_EXECUTABLE_PATH=${CHROME_BIN}"
