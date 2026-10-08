# Cabinet API - Google Sheets Integration

Production-ready MEAN stack API for seamless Google Sheets integration with Cabinet furniture management system.

**Status:** Production Ready  
**Version:** 1.0.0  
**Environment:** Node.js 18+, MongoDB 4.4+, Google Cloud  

## Quick Start

```bash
git clone https://github.com/bhushangera/cabinet.git
cd cabinet
npm install
cp .env.example .env
# Edit .env with actual values
npm run dev
```

## Testing

```bash
npm run test:full        # All 12 phases
npm run test:1-3         # Auth & connectivity
npm run deploy:dry       # Dry-run deployment
```

## Deployment

```bash
bash ./scripts/deploy.sh --target production --confirm
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed procedures.

## Documentation

- [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) — 7 endpoints, curl examples
- [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) — MongoDB schema, encryption
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Deployment & rollback procedures
- [TESTING.md](./docs/TESTING.md) — 12-phase test suite

## Architecture

```
Cabinet API
├── app.js                 # Express server
├── config/               # Environment & secrets
├── routes/               # 7 API endpoints
├── services/             # Business logic
├── models/               # MongoDB schemas
├── middleware/           # Auth, encryption
└── scripts/              # Deployment & testing
```

## Security

- OAuth2 + JWTs
- AES-256-CBC encryption
- No secrets in code (.env only)
- HTTPS only (production)
- Rate limiting
- Input validation

## Support

- Deployment: See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- Testing: See [TESTING.md](./docs/TESTING.md)
- API: See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- Database: See [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)

**Maintainer:** Claude  
**License:** Proprietary — Propulsive Interior Solutions
