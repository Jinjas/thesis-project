# Production Architecture

Arquitetura de deployment para `https://cosmo.epl.di.uminho.pt:50812` (intervalo permitido `50811-50814`).

## Estrutura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Client                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                      HTTPS (Host Port 50812)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      Nginx Reverse Proxy                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ✓ SSL/TLS Termination                                │   │
│  │ ✓ HTTP → HTTPS Redirect                              │   │
│  │ ✓ Rate Limiting (30-100 req/s per IP)                │   │
│  │ ✓ Security Headers                                   │   │
│  │ ✓ Gzip Compression                                   │   │
│  │ ✓ Load Balancing (future multi-instance)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                    Internal Network                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                      HTTP (Port 3000)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  Next.js Application Container               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Backend Routes                                        │   │
│  │ ├─ /api/ontology/*                                   │   │
│  │ ├─ /api/ingredientCode/*                             │   │
│  │ └─ /api/* (with validation & rate limiting)          │   │
│  │                                                       │   │
│  │ Frontend Routes                                       │   │
│  │ ├─ / (home)                                          │   │
│  │ ├─ /cocktails                                        │   │
│  │ └─ /ingredients                                      │   │
│  │                                                       │   │
│  │ Python Process Manager (runPythonJson.ts)            │   │
│  │ ├─ Timeout enforcement (15s)                         │   │
│  │ ├─ Output size limits (2MB)                          │   │
│  │ └─ Error handling & logging                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Dependencies: Node.js 20, Python 3, Graphviz               │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Persistent Storage (Docker Volumes)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ cocktail_data/     - Cocktail ontology files         │   │
│  │ ingredient_data/   - Ingredient ontology files       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de uma Requisição

```
1. Client Request (HTTPS)
   └─> https://cosmo.epl.di.uminho.pt:50812/api/ontology/generate

2. Nginx (Host Port 50812)
   ├─> TLS Termination
   ├─> Rate limit check
   ├─> Security headers validation
   └─> Forward to Next.js (Port 3000)

3. Next.js Route Handler
   ├─> Parse JSON body
   ├─> Validate inputs (names, types, sizes)
   ├─> Check API authentication (if required)
   ├─> Rate limit check (application level)
   └─> Call Python service wrapper

4. Python Service Wrapper (runPythonJson.ts)
   ├─> Spawn Python process
   ├─> Set timeout (15s)
   ├─> Monitor stdout size (2MB limit)
   ├─> Kill process if timeout/size exceeded
   └─> Parse JSON response

5. Python Script
   ├─> Sanitize filenames (path traversal prevention)
   ├─> Process ontology
   ├─> Generate SVG with Graphviz
   ├─> Write to volume storage
   └─> Return JSON result

6. Response Flow
   ├─> Response JSON marshalled
   ├─> Gzip compression applied
   ├─> Security headers added
   ├─> Sent through Nginx
   └─> Received by client (HTTPS)
```

## Segurança em Camadas

```
Layer 1: Network (TLS/SSL)
├─> HTTPS enforced
├─> Certificate validation
└─> Modern ciphers (TLSv1.2+)

Layer 2: Reverse Proxy (Nginx)
├─> Rate limiting
├─> Security headers (HSTS, X-Frame-Options, CSP-like)
├─> Request size limits
└─> IP-based blocking (future)

Layer 3: Application (Next.js)
├─> Input validation (regex patterns, type checks)
├─> Output size limits (200KB-120KB max)
├─> Optional API key enforcement
├─> Rate limiting (sliding window per IP)
└─> Logging & monitoring

Layer 4: Python Execution
├─> Filename sanitization (allowlist regex)
├─> Process timeout (15s)
├─> Memory limits (via Docker constraints)
└─> Sandboxing via container
```

## Ciclo de Vida do Container

```
┌─────────────────────────────────────────────┐
│  docker compose up -d                       │
└────────────┬────────────────────────────────┘
             │
   ┌─────────▼────────────┐
   │ Building Images      │
   │ ├─ nodejs:20         │
   │ ├─ python:3          │
   │ ├─ graphviz          │
   │ └─ nginx:alpine      │
   └─────────┬────────────┘
             │
   ┌─────────▼────────────┐
   │ Creating Volumes     │
   │ ├─ cocktail_data     │
   │ └─ ingredient_data   │
   └─────────┬────────────┘
             │
   ┌─────────▼────────────┐
   │ Starting Network     │
   │ (tese-network)       │
   └─────────┬────────────┘
             │
   ┌─────────▼────────────────────────────┐
   │ Running Containers (healthcheck)     │
   │ ├─ tese-app (listening :3000)        │
   │ └─ nginx (listening :50811, :50812)  │
   └─────────┬─────────────────────────────┘
             │
        Ready for traffic
```

## Configuração de Recursos

| Recurso        | Limite    | Descrição                      |
| -------------- | --------- | ------------------------------ |
| CPU            | Auto      | Sem limite, usa CPU disponível |
| Memória        | Auto      | A um máximo dinâmico do host   |
| Storage        | 20MB POST | Tamanho máximo de requisição   |
| Conexões       | 1024      | Worker connections no Nginx    |
| Gzip           | ON        | Compressão automática          |
| Timeout App    | 30s       | Proxy timeout (Nginx)          |
| Timeout Python | 15s       | Script execution timeout       |
| Max Output     | 2MB       | Python stdout size limit       |

## Escalabilidade Futura

### Horizontal Scaling (múltiplas instâncias)

```yaml
# Múltiplos containers da app
services:
  tese-app-1:
    # ... config ...
  tese-app-2:
    # ... config ...
  nginx: upstream tese_app {
    server tese-app-1:3000;
    server tese-app-2:3000;
    }
```

### Redis para Rate Limiting Distribuído

```python
# Atual: In-memory (single instance)
# Futuro: Redis (distributed)
import redis
client = redis.Redis(host='redis', port=6379)
client.incr(f"rate:{ip}:{endpoint}")
```

### Database para Persistência

```sql
-- Armazenar metadados de ontologias
CREATE TABLE ontologies (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  owner_id UUID
);
```

## Monitoramento & Observabilidade

```
┌─────────────────────────────────────────┐
│ Prometheus (metrics collection)         │
├─────────────────────────────────────────┤
│ ✓ Nginx stats                           │
│ ✓ Node.js process metrics               │
│ ✓ Python execution times                │
│ ✓ Request latencies                     │
│ ✓ Error rates                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Grafana (visualization)                 │
├─────────────────────────────────────────┤
│ ✓ Real-time dashboards                  │
│ ✓ Historical trends                     │
│ ✓ Alerting                              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Container Logs                          │
├─────────────────────────────────────────┤
│ ✓ docker compose logs -f                │
│ ✓ ELK stack (future)                    │
│ ✓ Structured JSON logging               │
└─────────────────────────────────────────┘
```

## Plano de Continuidade

```
Backup Strategy:
├─ Automated daily snapshots of volumes
├─ Git backups of configuration
└─ External storage (S3/Backup service)

Disaster Recovery:
├─ RTO: Restart docker compose (~2 minutes)
├─ RPO: Data loss < 1 day
└─ documented runbooks

High Availability:
├─ Future: Multiple regions
├─ Future: Floating IP
├─ Future: Auto-failover
└─ Current: Simple restart policy
```

---

**Last Updated:** 2026-03-18  
**Architecture Version:** 1.0  
**Next Review:** 2026-06-18
