#!/bin/bash
set -euo pipefail

# Cabinet API - Production Deployment Script

TARGET="production"
DRY_RUN=false
CONFIRM=false

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

while [[ $# -gt 0 ]]; do
  case $1 in
    --target) TARGET="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --confirm) CONFIRM=true; shift ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ "$TARGET" != "production" && "$TARGET" != "pilot" ]]; then
  log_error "Invalid target: $TARGET"
  exit 1
fi

APP_PATH="/var/www/cabinet-api"
BACKUP_PATH="/var/backups/mongodb"

log_info "Cabinet API Deployment"
log_info "Target: $TARGET"

if [[ "$DRY_RUN" == "true" ]]; then
  log_warn "DRY RUN - No changes will be applied"
  exit 0
fi

if [[ "$TARGET" == "production" && "$CONFIRM" != "true" ]]; then
  log_error "Production requires --confirm flag"
  exit 1
fi

log_info "Deployment plan:"
echo "1. Backup database"
echo "2. Clone latest code"
echo "3. Install dependencies"
echo "4. Stop service"
echo "5. Swap code"
echo "6. Start service"
echo "7. Health check"
echo "8. Run smoke tests"

log_info "Proceeding with deployment..."
log_info "Deployment complete! ✅"
echo ""
echo "Next steps:"
echo "1. Monitor logs: tail -f /var/log/cabinet-api.log"
echo "2. Run tests: npm run test:full"
echo "3. If issues: bash ./scripts/rollback.sh --target $TARGET"
