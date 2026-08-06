#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"

echo "Masuk ke folder backend: $BACKEND_DIR"
cd "$BACKEND_DIR"

if [ ! -f package.json ]; then
  echo "Membuat file package.json secara otomatis"
  npm init -y
fi

echo "Menginstal Express.js"
npm install express

echo "Menginstal nodemon khusus untuk development"
npm install --save-dev nodemon

echo "Menginstal library SQLite untuk Node.js"
npm install better-sqlite3

echo "Menginstal middleware CORS"
npm install cors