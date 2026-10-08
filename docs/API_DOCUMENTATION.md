# Cabinet API - Documentation

## Endpoints (7 Total)

### Authentication
- `POST /auth/login` - Get JWT token

### Google Sheets Management  
- `GET /google-sheets/auth/status` - Check authorization
- `POST /google-sheets/create` - Create new sheet
- `POST /google-sheets/sync` - Sync data to sheet
- `GET /google-sheets/projects/:projectId` - List project sheets
- `PATCH /google-sheets/:sheetId` - Update/append data
- `DELETE /google-sheets/:sheetId` - Soft delete sheet
- `GET /health` - Health check

## Authentication

All endpoints except `/auth/login` require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Quick Example

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cabinet.test","password":"DemoTest@2024"}' \
  | jq -r '.token')

# 2. Create sheet
curl -X POST http://localhost:3000/api/v1/google-sheets/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId":"PROJ-001",
    "projectName":"Kitchen A",
    "sheetName":"Cutting List",
    "columns":["Part","Qty","Dimension","Material"]
  }'

# 3. Sync data
curl -X POST http://localhost:3000/api/v1/google-sheets/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId":"PROJ-001",
    "sheetId":"1a2b3c...",
    "data":[
      {"part":"Door","quantity":2,"dimension":"600x800","material":"Plywood"}
    ]
  }'
```

## Error Handling

All errors follow RFC 7807 format:
```json
{
  "type": "https://propulsive.co.in/errors/invalid-request",
  "status": 400,
  "detail": "Missing required field: projectId"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

See [docs/TESTING.md](./TESTING.md) for complete 12-phase test suite.
