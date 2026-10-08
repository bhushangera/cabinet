# Database Schema - MongoDB

## GoogleSheetsConfig Collection

```javascript
{
  _id: ObjectId,
  companyId: String,              // Multi-tenant (leading index)
  projectId: String,              // Cabinet project ID
  sheetId: String,                // Google Sheets ID (unique)
  sheetName: String,              // Display name
  sheetUrl: String,               // Google Sheets URL
  
  // Encrypted credentials
  googleServiceAccount: String,   // AES-256-CBC encrypted
  accessToken: String,            // AES-256-CBC encrypted
  refreshToken: String,           // AES-256-CBC encrypted
  tokenExpiry: Date,
  
  // Configuration
  columns: [String],              // Column headers
  autoSync: Boolean,              // Default: false
  syncInterval: Number,           // Minutes
  
  // Metadata
  createdBy: String,
  createdAt: Date,
  updatedBy: String,
  updatedAt: Date,
  deletedAt: Date,                // Soft delete
  
  // Audit trail
  syncHistory: [{
    syncedAt: Date,
    rowCount: Number,
    status: String,
    error: String
  }]
}
```

## Indexes

```javascript
db.googlesheetconfigs.createIndex({ companyId: 1, projectId: 1 })
db.googlesheetconfigs.createIndex({ companyId: 1, sheetId: 1 })
db.googlesheetconfigs.createIndex({ companyId: 1, createdAt: -1 })
db.googlesheetconfigs.createIndex({ companyId: 1, deletedAt: 1 })
```

## Encryption

Fields encrypted with AES-256-CBC:
- `googleServiceAccount` — Service Account JSON
- `accessToken` — OAuth2 token
- `refreshToken` — OAuth2 refresh token

**Key:** `ENCRYPTION_KEY` (hex, 64 chars = 32 bytes)  
**IV:** `ENCRYPTION_IV` (hex, 32 chars = 16 bytes)

## Soft Delete Pattern

Queries automatically exclude soft-deleted records:
```javascript
GoogleSheetsConfig.find({ companyId, deletedAt: null })
```

## Multi-Tenancy

All queries must include `companyId`:
```javascript
// ✅ CORRECT
await GoogleSheetsConfig.findOne({
  companyId: req.user.companyId,
  projectId: 'PROJ-001'
})

// ❌ WRONG - could leak data
await GoogleSheetsConfig.findOne({ projectId: 'PROJ-001' })
```
