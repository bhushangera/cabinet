# Deployment Guide

## Pre-Deployment

```bash
# 1. Verify tests pass
npm run test:full

# 2. Dry-run deployment
bash ./scripts/deploy.sh --dry-run

# 3. Verify environment
ls -la .env
```

## Deployment

### Automated (Recommended)

```bash
# Dry run (show plan)
bash ./scripts/deploy.sh --target production --dry-run

# Real deployment
bash ./scripts/deploy.sh --target production --confirm
```

### Manual Steps

```bash
ssh user@propulsive.co.in
cd /var/www/cabinet-api

# Backup
mongodump --db cabinetry --out /var/backups/mongodb/$(date +%s)

# Update code
git pull origin main
npm install

# Restart
sudo systemctl restart cabinet-api

# Verify
curl http://localhost:3000/api/v1/health
```

## Post-Deployment

```bash
# Run smoke tests
npm run test:1-3

# Monitor logs
sudo journalctl -u cabinet-api -f

# Check status
pm2 list
```

## Rollback

```bash
bash ./scripts/rollback.sh --target production
```

## Troubleshooting

**Service won't start:**
```bash
sudo journalctl -u cabinet-api -n 20 -p err
```

**MongoDB connection fails:**
```bash
npm run db:test
```

**Google API errors:**
```bash
npm run google:verify
```
