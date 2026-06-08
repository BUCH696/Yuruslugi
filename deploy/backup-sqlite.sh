#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/yuruslugi"
BACKUP_DIR="/opt/backups/yuruslugi"
TIMESTAMP="$(date +%F-%H%M%S)"

mkdir -p "$BACKUP_DIR"
sqlite3 "$APP_DIR/storage/app.db" ".backup '$BACKUP_DIR/app-$TIMESTAMP.db'"
find "$BACKUP_DIR" -type f -name "app-*.db" -mtime +14 -delete

