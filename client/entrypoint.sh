#!/bin/sh
set -eu

cat >/usr/src/app/dist/config.js <<EOF
window.__APP_CONFIG__ = {
  API_URL: "${API_URL:-}",
  AUTH_DOMAIN: "${AUTH_DOMAIN:-}",
  // add more non-secret vars here
};
EOF

exec npm run preview