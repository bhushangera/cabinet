#!/bin/bash
set -euo pipefail

TARGET="production"
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

while [[ $# -gt 0 ]]; do
  case $1 in
    --target) TARGET="$2"; shift 2 ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
  esac
done

APP_PATH="/var/www/cabinet-api"

log_info "Cabinet API Rollback"
log_info "Target: $TARGET"
log_info "Stopping service..."
pm2 stop cabinet-api 2>/dev/null || true

log_info "Restoring from backup..."
if [[ -d "$APP_PATH.backup" ]]; then
  rm -rf "$APP_PATH"
  mv "$APP_PATH.backup" "$APP_PATH"
  log_info "Backup restored"
else
  log_error "No backup found at $APP_PATH.backup"
  exit 1
fi

log_info "Restarting service..."
cd "$APP_PATH"
pm2 start ecosystem.config.js --name cabinet-api 2>/dev/null || true
sleep 2

log_info "Health check..."
curl -s http://localhost:3000/api/v1/health | grep -q healthy && \
  log_info "✅ Rollback complete" || log_error "Health check failed"

exit 0
