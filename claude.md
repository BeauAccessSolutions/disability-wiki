---
title: claude
description: 
published: false
date: 2026-06-05T17:40:37.744Z
tags: 
editor: markdown
dateCreated: 2026-01-11T19:38:31.694Z
---

# Disability Wiki - Technical Documentation

## Project Overview

This repository contains the infrastructure and content for **disabilitywiki.org**, a comprehensive Wiki.js-powered knowledge base for disability rights, resources, and support information.

**Live Site**: https://disabilitywiki.org
**Repository**: https://github.com/Beaudoin0zach/disability-wiki
**Current Version**: Wiki.js 2.5.310

---

## Server Information

### Production Server
- **Provider**: DigitalOcean
- **OS**: Ubuntu 22.04.5 LTS (Jammy Jellyfish)
- **RAM**: 2GB
- **Storage**: 25GB SSD
- **Nginx**: 1.18.0 (reverse proxy with TLS)
- **Cloudflare**: DNS and CDN

> **Note**: Server IP and SSH credentials are stored securely outside this repository. See your password manager or infrastructure documentation for access details.

### Security Status

| Feature | Status |
|---------|--------|
| TLS/HTTPS | Active (Let's Encrypt) |
| HTTP to HTTPS redirect | Active |
| HSTS | Active (1 year) |
| Security headers | Active |
| Rate limiting | Active (10r/s general, 1r/s login) |
| Automated backups | Active (daily at 3 AM UTC) |
| Credentials | Environment variables |

---

## Wiki.js Deployment

### Live Production Setup

**Location**: `/opt/wiki/`
**Version**: Wiki.js 2.5.310
**Database**: PostgreSQL 13
**Reverse Proxy**: Nginx with Let's Encrypt TLS

#### Production File Structure
```
/opt/wiki/
├── docker-compose.yml    # Container configuration
├── .env                  # Credentials (not in repo)
├── backup.sh             # Automated backup script
├── restore.sh            # Database restore script
└── backups/
    ├── daily/            # 7 days retention
    ├── weekly/           # 4 weeks retention
    └── monthly/          # 3 months retention
```

#### Container Names
- **Wiki App**: `wiki_wiki_1`
- **Database**: `wiki_db_1`
- **Network**: `wiki_default`

> **Security Note**: Production credentials are stored in `/opt/wiki/.env` and never committed to the repository.

### Local Development Setup

**Location**: Project root directory
**Version**: Wiki.js 2.5.310
**Database**: PostgreSQL 15
**Port Mapping**: 8080:3000 (localhost:8080)

#### Setup Instructions

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with secure credentials:
   ```bash
   # Generate a strong password
   openssl rand -base64 32
   ```

3. Start the containers:
   ```bash
   export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
   docker compose up -d
   ```

4. Access locally at http://localhost:8080

#### Container Names
- **Wiki App**: `wiki-app`
- **Database**: `wiki-db`
- **Network**: `disability-wiki_default`

#### Management Commands
```bash
# View logs
docker compose logs -f wiki

# Stop containers
docker compose down

# Restart
docker compose restart
```

---

## Automated Backups

### Backup Schedule

| Type | Frequency | Retention | Time |
|------|-----------|-----------|------|
| Daily | Every day | 7 backups | 3:00 AM UTC |
| Weekly | Sundays | 4 backups | 3:00 AM UTC |
| Monthly | 1st of month | 3 backups | 3:00 AM UTC |

### Backup Commands

```bash
# Run manual backup
ssh user@your-server "/opt/wiki/backup.sh"

# View backup logs
ssh user@your-server "tail -50 /var/log/wiki-backup.log"

# List available backups
ssh user@your-server "ls -lh /opt/wiki/backups/daily/"
```

### Restore from Backup

```bash
# SSH into server
ssh user@your-server

# Run interactive restore
/opt/wiki/restore.sh

# Or specify backup file directly
/opt/wiki/restore.sh /opt/wiki/backups/daily/wiki-20260111_195218.sql.gz
```

The restore script will:
1. Show available backups
2. Confirm before proceeding
3. Stop Wiki.js
4. Restore the database
5. Restart Wiki.js

---

## TLS/HTTPS Configuration

### Current Production Setup

TLS is configured via Nginx reverse proxy with Let's Encrypt certificates.

**Certificate Details**:
- **Domains**: disabilitywiki.org, www.disabilitywiki.org
- **Auto-renewal**: Enabled via certbot timer
- **Config location**: `/etc/nginx/sites-available/disabilitywiki.org`

### Security Headers (Active)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting (Active)

- **General requests**: 10 requests/second (burst 20)
- **Login/Admin paths**: 1 request/second (burst 5)

---

## Deployment Commands

### Update Local Wiki.js

```bash
cd /path/to/disability-wiki

# Edit docker-compose.yml to update version number
# Change: image: requarks/wiki:2.5.XXX

# Apply update
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
docker compose down
docker compose pull wiki
docker compose up -d
docker compose logs -f wiki
```

### Update Live Wiki.js

```bash
# SSH into server
ssh user@your-server

# Navigate to Wiki.js directory
cd /opt/wiki

# Backup current configuration
cp docker-compose.yml docker-compose.yml.backup-$(date +%Y%m%d)

# Edit docker-compose.yml to update version
# Change: image: requarks/wiki:2.5.XXX

# Apply update
docker-compose down
docker-compose pull wiki
docker-compose up -d
docker-compose logs -f wiki
```

### Rotate Database Password

```bash
# SSH into server
ssh user@your-server
cd /opt/wiki

# Generate new password
NEW_PASS=$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)
echo "New password: $NEW_PASS"

# Update .env file
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$NEW_PASS/" .env
sed -i "s/DB_PASS=.*/DB_PASS=$NEW_PASS/" .env

# Update PostgreSQL password
source .env
docker exec wiki_db_1 psql -U wiki -d wiki -c "ALTER USER wiki WITH PASSWORD '$DB_PASS';"

# Restart Wiki.js
docker-compose down && docker-compose up -d
```

---

## Repository Structure

```
disability-wiki/
├── .claude/                      # Claude Code configuration
├── .git/                         # Git repository
├── .github/                      # GitHub workflows
├── disability-wiki/              # Wiki.js markdown exports (254 files)
│   ├── benefits/
│   ├── rights/
│   ├── housing/
│   ├── employment/
│   ├── education/
│   ├── conditions/
│   └── ...                      # Additional categories
├── docs/                         # Project documentation
├── scripts/                      # Python utilities
│   ├── generate_descriptions.py # SEO meta description generator
│   └── validate_wiki_links.py   # Internal link validator
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── README.md                     # Project README
├── SECURITY.md                   # Security hardening guide
├── claude.md                     # This file
└── docker-compose.yml            # Local Wiki.js configuration

TOTAL FILES: 254 markdown files in disability-wiki/
```

### Content Organization

The `disability-wiki/` directory contains 254 markdown files exported from Wiki.js:

**Main Categories**:
- **Benefits** (SSDI, SSI, Medicaid, Medicare, VA benefits)
- **Rights** (ADA, IDEA, Section 504, Fair Housing)
- **Housing** (Accessible housing, modifications, support)
- **Employment** (Workplace accommodations, rights, resources)
- **Education** (K-12, college, IEPs, 504 plans)
- **Healthcare** (Conditions, treatments, resources)
- **Crisis** (Emergency resources, hotlines)
- **Legal** (Disability law, advocacy)
- **Technology** (Assistive tech, accessibility)
- **Transportation** (Accessible transit, paratransit)

---

## Utility Scripts

### 1. Meta Description Generator

**Location**: `scripts/generate_descriptions.py`

Automatically generates SEO-friendly meta descriptions (155-160 characters) for all markdown files missing descriptions.

```bash
python3 scripts/generate_descriptions.py
```

### 2. Internal Link Validator

**Location**: `scripts/validate_wiki_links.py`

Validates all internal Wiki.js links across markdown files.

```bash
python3 scripts/validate_wiki_links.py
```

### 3. Wiki.js Installer

**Location**: `install_wikijs.sh`

Automated installation script for local Wiki.js development.

```bash
chmod +x install_wikijs.sh
./install_wikijs.sh
```

---

## Maintenance Tasks

### Daily (Automated)
- Database backup at 3 AM UTC
- Backup verification and rotation

### Weekly
- [ ] Check Wiki.js logs for errors
- [ ] Monitor disk usage on server
- [ ] Verify site accessibility
- [ ] Review backup logs

### Monthly
- [ ] Check for Wiki.js updates: https://github.com/Requarks/wiki/releases
- [ ] Run link validator
- [ ] Review server resource usage
- [ ] Test backup restore process

### Quarterly
- [ ] Rotate database password
- [ ] Review and update documentation
- [ ] Security audit
- [ ] SSL certificate check (auto-renewed but verify)

---

## Common Operations

### Check Wiki.js Status (Live)
```bash
ssh user@your-server "cd /opt/wiki && docker-compose ps"
```

### Restart Wiki.js (Live)
```bash
ssh user@your-server "cd /opt/wiki && docker-compose restart wiki"
```

### View Wiki.js Logs (Live)
```bash
ssh user@your-server "cd /opt/wiki && docker-compose logs -f wiki"
```

### Check Nginx Status
```bash
ssh user@your-server "systemctl status nginx && nginx -t"
```

### Check SSL Certificate
```bash
ssh user@your-server "certbot certificates"
```

### Export Content from Wiki.js
1. Log into Wiki.js admin panel
2. Navigate to Administration > Storage
3. Configure Git storage target
4. Sync content to export markdown files

### Add New Content
1. Log into Wiki.js (local or production)
2. Click "Create New Page"
3. Select page category and path
4. Write content using markdown editor
5. Add metadata (title, description, tags)
6. Publish

---

## Docker Notes

### Local (Mac) Docker Setup
- **Docker Desktop**: `/Applications/Docker.app`
- **CLI Path**: `/Applications/Docker.app/Contents/Resources/bin/docker`
- **Add to PATH**: `export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"`

### Server Docker Version
- **Server**: Docker Compose v1.29.2 (uses `docker-compose` with hyphen)
- **Local**: Docker Compose v2.x (uses `docker compose` with space)

---

## Troubleshooting

### Docker Not Found (Mac)
```bash
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
```

### Database Connection Failed
```bash
docker compose logs db
docker compose restart db
```

### Wiki.js Won't Start
```bash
docker compose logs wiki
docker compose down
docker compose up -d
```

### Port Already in Use
```bash
lsof -i :8080
kill -9 <PID>
```

### SSL Certificate Issues
```bash
ssh user@your-server "certbot renew --dry-run"
```

### Nginx Configuration Error
```bash
ssh user@your-server "nginx -t && systemctl reload nginx"
```

---

## Security

See [SECURITY.md](./SECURITY.md) for:
- Credential management procedures
- TLS/HTTPS configuration details
- Rate limiting configuration
- Backup verification procedures
- Incident response procedures

---

## Resources

### Wiki.js Documentation
- **Official Docs**: https://docs.requarks.io/
- **GitHub**: https://github.com/Requarks/wiki
- **Docker Hub**: https://hub.docker.com/r/requarks/wiki

### DigitalOcean
- **Control Panel**: https://cloud.digitalocean.com/
- **Documentation**: https://docs.digitalocean.com/

### Repository
- **GitHub**: https://github.com/Beaudoin0zach/disability-wiki
- **Issues**: https://github.com/Beaudoin0zach/disability-wiki/issues

---

## Contact & Support

**Repository Owner**: Zach Beaudoin
**GitHub**: @Beaudoin0zach

---

*Last Updated: January 11, 2026*
*Wiki.js Version: 2.5.310*
