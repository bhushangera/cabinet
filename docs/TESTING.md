# Testing Guide - 12 Phases

## Quick Start

```bash
npm run test:full          # All 12 phases
npm run test:1-3          # Auth & connectivity
npm run test:4-6          # Create & sync
npm run test:7-9          # Update & list
npm run test:10-12        # Error handling
```

## Test Phases

### Phases 1-3: Authentication & Connectivity
- Phase 1: Get JWT token
- Phase 2: Check Google authorization
- Phase 3: Health check (database, Google API)

### Phases 4-7: Sheet Management
- Phase 4: Create Google Sheet
- Phase 5: Sync data (3 rows)
- Phase 6: List project sheets
- Phase 7: Update/append data

### Phases 8-12: Performance & Error Handling
- Phase 8: High-volume sync (100+ rows)
- Phase 9: Token refresh
- Phase 10: Concurrent requests (5 parallel)
- Phase 11: Error responses
- Phase 12: Data persistence (database audit)

## Manual Testing

```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cabinet.test","password":"DemoTest@2024"}' \
  | jq -r '.token')

# Test health
curl -X GET http://localhost:3000/api/v1/health \
  -H "Authorization: Bearer $TOKEN"
```

## Expected Results

| Phase | Status | Notes |
|-------|--------|-------|
| 1-3 | ✅ | Auth & connectivity green |
| 4-7 | ✅ | Sheets created and synced |
| 8-12 | ✅ | Performance and errors OK |

Total runtime: ~25 seconds
