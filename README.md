# Tese App

Web application for creating and editing OntoDL ontologies in the cocktails and ingredients domain, with SVG visualization generated from the ontology.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Python scripts for OntoDL processing
- Graphviz for SVG generation

## Prerequisites

- Node.js 20+
- Python 3.10+
- Graphviz installed at system level (`dot` available in PATH)

## Local setup

```bash
npm install
python -m venv .venv
```

### Windows (PowerShell)

```bash
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### macOS/Linux

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Security hardening included

- API payload validation (names, types, ontology/code max size)
- In-memory API rate limiting
- Optional write API key enforcement through `API_WRITE_TOKEN`
- Python process timeout/output limits through env vars
- Safer Python file writes with filename sanitization

## Docker

Build and run with Docker Compose:

```bash
docker compose up --build
```

The service is available on `http://localhost:50811` (HTTP) and `https://localhost:50812` (HTTPS).

### Local Development

For local development with port 50811:

```bash
$env:PORT=50811
npm run dev
```

### Production Deployment

For deploying to a remote server with HTTPS support, see [DEPLOYMENT.md](DEPLOYMENT.md).

The production setup includes:

- Nginx reverse proxy with SSL/TLS
- Rate limiting at proxy level
- Security headers (HSTS, X-Frame-Options, etc.)
- Automatic HTTP to HTTPS redirect
- Support for Let's Encrypt certificates

Example production URL with constrained ports: `https://cosmo.epl.di.uminho.pt:50812`

**Quick start on remote server:**

```bash
# Clone and setup
git clone <repo> && cd <repo>

# Configure environment
cp .env.example .env
# Edit .env with your domain and API token
# Keep host ports inside your allowed range (default 50811/50812)

# Create SSL directory and copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem ./ssl/cert.pem
cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem ./ssl/key.pem

# Deploy
docker compose build
docker compose up -d

# Verify
curl -vk https://cosmo.epl.di.uminho.pt:50812
```

If your infrastructure maps external `443` to your host `50812`, then the app can still be accessed as `https://cosmo.epl.di.uminho.pt` without explicitly writing the port.

Configured environment variables in `docker-compose.yml`:

- `API_WRITE_TOKEN`
- `API_RATE_LIMIT`
- `API_RATE_WINDOW_MS`
- `PYTHON_EXEC_TIMEOUT_MS`
- `PYTHON_MAX_STDOUT_BYTES`
- `DOMAIN`
- `HOST_HTTP_PORT`
- `HOST_HTTPS_PORT`

Persistent data is mounted to Docker volumes:

- `/app/src/python/cocktail/data`
- `/app/src/python/ingredient/data`

## Production build without Docker

```bash
npm run build
npm run start
```

## Makefile (server workflow)

For a simple server workflow (pull, rebuild, relaunch), use the provided Makefile:

```bash
make update
```

Useful targets:

- `make pull`
- `make build`
- `make restart`
- `make logs`
- `make status`
- `make test`
- `make backup`
- `make backup-list`
- `make restore FILE=backups/tese-data-YYYYMMDD-HHMMSS.tar.gz`

To run on a different allowed port:

```bash
make update HOST_PORT=50812
```

Recommended safety routine on the external machine:

```bash
make backup
make backup-list
```

Then copy the newest file in `backups/` to another machine/storage (for example with `scp`) so you are protected even if the server disk fails.
