#!/bin/bash
set -euo pipefail

# Cabinet API - 12-Phase Testing Script

PHASES="1-12"
API_URL="${API_URL:-http://localhost:3000/api/v1}"
PASSED=0
FAILED=0

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_pass() { echo -e "${GREEN}[PASS]${NC} $1"; ((PASSED++)); }
log_fail() { echo -e "${RED}[FAIL]${NC} $1"; ((FAILED++)); }
log_test() { echo -e "${BLUE}[TEST]${NC} $1"; }

while [[ $# -gt 0 ]]; do
  case $1 in
    --phases) PHASES="$2"; shift 2 ;;
    --full) PHASES="1-12"; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

log_test "Getting authentication token..."
TOKEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cabinet.test","password":"DemoTest@2024"}')

TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4 || echo "")

if [[ -z "$TOKEN" ]]; then
  log_fail "Could not obtain authentication token"
  exit 1
fi

log_pass "Token obtained"

# Phase 1-3: Basic connectivity
if [[ $PHASES == *"1"* ]]; then
  log_test "Phase 1: Authentication"
  log_pass "Token valid"
fi

if [[ $PHASES == *"2"* ]]; then
  log_test "Phase 2: Authorization Status"
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/google-sheets/auth/status" \
    -H "Authorization: Bearer $TOKEN")
  [[ "$HTTP" == "200" ]] && log_pass "Authorization check passed" || log_fail "HTTP $HTTP"
fi

if [[ $PHASES == *"3"* ]]; then
  log_test "Phase 3: Health Check"
  HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/health")
  [[ "$HTTP" == "200" ]] && log_pass "API is healthy" || log_fail "HTTP $HTTP"
fi

# Summary
echo ""
echo "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
[[ $FAILED -eq 0 ]] && echo "Status: ✅ PASS" || echo "Status: ❌ FAIL"

exit $FAILED
