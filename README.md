---
title: README
description: 
published: false
date: 2026-06-05T17:40:43.343Z
tags: 
editor: markdown
dateCreated: 2026-01-11T19:37:34.040Z
---

# Disability Wiki

A comprehensive, community-driven knowledge base for disability rights, resources, and support information powered by Wiki.js.

**Live Site**: https://disabilitywiki.org
**Version**: Wiki.js 2.5.310
**Repository**: https://github.com/Beaudoin0zach/disability-wiki

---

## Overview

This repository contains the infrastructure, content, and utilities for **disabilitywiki.org** - a Wiki.js-powered knowledge base covering:

- **Disability Rights** (ADA, IDEA, Section 504, Fair Housing Act)
- **Benefits & Programs** (SSDI, SSI, Medicaid, Medicare, VA benefits)
- **Housing Resources** (Accessible housing, modifications, support programs)
- **Employment Rights** (Workplace accommodations, anti-discrimination laws)
- **Education** (K-12 rights, IEPs, 504 plans, college accessibility)
- **Healthcare** (Conditions, treatments, medical resources)
- **Legal Resources** (Disability law, advocacy, self-advocacy)
- **Assistive Technology** (Tools, software, accessibility features)
- **Transportation** (Accessible transit, paratransit services)

**Total Content**: 254 markdown pages organized across 10+ categories

---

## Quick Start

### Access the Live Wiki

Visit https://disabilitywiki.org to browse the full knowledge base.

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Beaudoin0zach/disability-wiki.git
   cd disability-wiki
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your own secure credentials
   ```

3. Start Wiki.js with Docker:
   ```bash
   export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
   docker compose up -d
   ```

4. Access locally at http://localhost:8080

5. Management commands:
   ```bash
   # View logs
   docker compose logs -f wiki

   # Stop containers
   docker compose down
   ```

**Requirements**: Docker Desktop installed

---

## Repository Structure

```
disability-wiki/
├── disability-wiki/          # 254 markdown content files
│   ├── benefits/             # Benefits and programs (SSDI, SSI, etc.)
│   ├── rights/               # Legal rights and protections
│   ├── housing/              # Housing resources and support
│   ├── employment/           # Employment rights and accommodations
│   ├── education/            # Educational resources and rights
│   ├── healthcare/           # Health conditions and treatments
│   ├── legal/                # Legal resources and advocacy
│   ├── technology/           # Assistive technology
│   └── transportation/       # Transportation resources
├── scripts/                  # Python utility scripts
│   ├── generate_descriptions.py
│   └── validate_wiki_links.py
├── docs/                     # Project documentation
├── .env.example              # Environment variable template
├── docker-compose.yml        # Local Wiki.js configuration
├── claude.md                 # Complete technical documentation
├── SECURITY.md               # Security hardening guide
└── README.md                 # This file
```

---

## Key Files

| File | Purpose |
|------|---------|
| `claude.md` | Complete technical documentation |
| `.env.example` | Environment variable template |
| `docker-compose.yml` | Local Wiki.js Docker configuration |
| `SECURITY.md` | Security hardening guidelines |
| `scripts/generate_descriptions.py` | Generates SEO meta descriptions |
| `scripts/validate_wiki_links.py` | Validates internal links |

---

## Documentation

See [claude.md](./claude.md) for complete technical documentation including:
- Wiki.js deployment configuration
- Docker setup and container management
- Update and maintenance procedures
- Database backup and restore instructions
- Troubleshooting guide

See [SECURITY.md](./SECURITY.md) for:
- Production hardening guidelines
- TLS/HTTPS setup
- Credential management

---

## Utility Scripts

### Generate Meta Descriptions

Automatically creates SEO-optimized descriptions for content pages:

```bash
python3 scripts/generate_descriptions.py
```

### Validate Internal Links

Checks all internal Wiki.js links for broken references:

```bash
python3 scripts/validate_wiki_links.py
```

---

## Content Management

### Adding New Pages

1. Log into Wiki.js (local or production)
2. Click "Create New Page"
3. Select category and page path
4. Write content using markdown editor
5. Add metadata (title, description, tags)
6. Publish

### Content Standards

All pages should include:
- Clear, concise title
- SEO meta description (155-160 characters)
- Relevant tags for discoverability
- Proper categorization
- Links to related resources
- Source citations where applicable

---

## Security

The production deployment includes:

- **TLS/HTTPS** with Let's Encrypt (auto-renewal)
- **Security headers** (HSTS, X-Frame-Options, CSP)
- **Rate limiting** (10r/s general, 1r/s login)
- **Automated backups** (daily, weekly, monthly retention)
- **Environment variables** for all credentials

See [SECURITY.md](./SECURITY.md) for complete security documentation.

---

## Maintenance

### Automated (Daily)
- Database backups at 3 AM UTC
- Backup verification and rotation

### Weekly
- Check Wiki.js logs for errors
- Monitor server disk usage
- Verify site accessibility

### Monthly
- Check for Wiki.js updates
- Run link validator
- Test backup restore process

### Quarterly
- Rotate database password
- Security audit
- Update documentation

---

## Technology Stack

- **Wiki.js** 2.5.310 - Knowledge base platform
- **PostgreSQL** 13/15 - Database
- **Docker** - Containerization
- **DigitalOcean** - Cloud hosting
- **Ubuntu** 22.04 LTS - Server OS

---

## Development

### Requirements

- Docker Desktop
- Python 3.x (for utility scripts)
- Git

### Local Development Workflow

1. Start local Wiki.js: `docker compose up -d`
2. Make changes through web interface: http://localhost:8080
3. Export content to markdown files
4. Run validation: `python3 scripts/validate_wiki_links.py`
5. Generate descriptions: `python3 scripts/generate_descriptions.py`
6. Commit changes to git

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

### Port Already in Use

```bash
lsof -i :8080
kill -9 <PID>
```

See [claude.md](./claude.md) for complete troubleshooting guide.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run validation scripts
5. Submit a pull request

---

## License

Two licenses, because this repo is two things:

| | License | Covers |
|---|---|---|
| **Content** | [CC BY-SA 4.0](LICENSE-CONTENT) | the wiki pages — `benefits/`, `rights/`, `crisis/`, `es/`, … |
| **Code** | [MIT](LICENSE) | `site/`, `app/`, `scripts/`, workflows, config |

**Please reuse the content.** Copy it, reprint it, translate it, adapt it, use it
commercially. Two conditions: credit us, and license your adaptation under the same
terms so it stays open. [`/reuse`](https://disabilitywiki.org/reuse) explains it in
plain language ([en español](https://disabilitywiki.org/es/reuse)).

**If you only need the facts, share-alike doesn't apply to you.** Phone numbers, hours,
income limits and deadlines aren't copyrightable — take them into anything, under any
terms. ShareAlike binds someone copying the *writing*.

If you reprint crisis information, **date your copy and re-check it before each print
run** — a stale hotline number that looks current is worse than none.

Contributions are accepted under the same terms (inbound = outbound), which is also
what guarantees this content can never be closed, paywalled, or made proprietary — by a
future maintainer or by the current one. See [`CONTRIBUTING.md`](CONTRIBUTING.md) and
[`docs/contribution-model.md`](docs/contribution-model.md).

**A license is not a disclaimer.** Content is provided for educational and
informational purposes and is not legal, medical, or financial advice. Please verify
all legal information with qualified professionals.

---

## Contact

**Repository Owner**: Zach Beaudoin
**GitHub**: [@Beaudoin0zach](https://github.com/Beaudoin0zach)

---

## Resources

- **Wiki.js Documentation**: https://docs.requarks.io/
- **Wiki.js GitHub**: https://github.com/Requarks/wiki
- **ADA.gov**: https://www.ada.gov/
- **SSA Disability**: https://www.ssa.gov/disability/

---

*Last Updated: January 11, 2026*
