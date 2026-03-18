# Production Deployment Guide

Deploy da aplicação TESE numa máquina externa com HTTPS via `cosmo.epl.di.uminho.pt`.

Nota: este setup assume que só podes abrir portas no intervalo `50811-50814`.

## Pré-requisitos

Na máquina de produção:

- Docker (v20.10+): https://docs.docker.com/get-docker/
- Docker Compose (v2.0+): https://docs.docker.com/compose/install/
- Git (para clonar o repositório)
- Certificados SSL/TLS para o domínio `cosmo.epl.di.uminho.pt`

## Certificados SSL/TLS

### Opção 1: Let's Encrypt (Recomendado - Gratuito)

Gerar certificados com Certbot:

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Gerar certificados (escolhe cosmo.epl.di.uminho.pt)
sudo certbot certonly --standalone -d cosmo.epl.di.uminho.pt

# Certificados estarão em: /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/
# fullchain.pem = cert.pem
# privkey.pem = key.pem
```

### Opção 2: Certificado Existente

Se já tens certificados, coloca em:

```
ssl/cert.pem     (certificado + chain)
ssl/key.pem      (chave privada)
```

### Renovação Automática (Let's Encrypt)

```bash
# Cria cronjob para renovar automaticamente a cada 2 meses
sudo crontab -e

# Adiciona a linha:
0 0 1 */2 * certbot renew --quiet && cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem /path/to/ssl/cert.pem && cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem /path/to/ssl/key.pem
```

## Deploy com Docker Compose

### 1. Clonar repositório

```bash
cd /opt
git clone <repository-url> tese
cd tese
git checkout 9-code-and-security-hardening
```

### 2. Configurar variáveis de ambiente

```bash
# Copiar template
cp .env.example .env

# Editar .env
nano .env

# Valores importantes:
# DOMAIN=cosmo.epl.di.uminho.pt
# HOST_HTTP_PORT=50811
# HOST_HTTPS_PORT=50812
# API_WRITE_TOKEN=<gerar com: openssl rand -base64 32>
```

### 3. Criar diretório SSL e copiar certificados

```bash
# Criar diretório
mkdir -p ssl
chmod 755 ssl

# Copiar certificados Let's Encrypt para o diretório local
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ssl/*
chmod 644 ssl/*
```

### 4. Validar docker-compose.yml

```bash
docker compose config
```

### 5. Build e Deploy

```bash
# Build da imagem Docker (primeira vez - pode levar 10-15 minutos)
docker compose build

# Iniciar serviços (em background)
docker compose up -d

# Verificar status
docker compose ps
docker compose logs -f tese-app

# Verificar nginx
docker compose logs -f nginx

# Parar serviços
docker compose down

# Parar e remover volumes
docker compose down -v
```

## Validação

### 1. Testar HTTPS

```bash
# Deve retornar status 200 com certificado válido
curl -vk https://cosmo.epl.di.uminho.pt:50812

# Verificar certificado
openssl s_client -connect cosmo.epl.di.uminho.pt:50812
```

### 2. Testar API

```bash
# GET (sem autenticação)
curl -X GET https://cosmo.epl.di.uminho.pt:50812/api/ontology/getCocktails

# POST (com autenticação)
curl -X POST https://cosmo.epl.di.uminho.pt:50812/api/ontology/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-token" \
  -d '{"cocktailName":"Test","ingredientType":"Library"}'
```

### 3. Health Check

```bash
# Deve retornar 200 OK
curl -vk https://cosmo.epl.di.uminho.pt:50812/health
```

Se existir um reverse proxy externo que faça mapeamento de `443 -> 50812`, podes continuar a usar `https://cosmo.epl.di.uminho.pt` sem sufixo de porta.

## 📊 Monitoramento

### Ver logs em tempo real

```bash
# Logs da aplicação
docker compose logs -f tese-app

# Logs do nginx
docker compose logs -f nginx

# Todos os logs
docker compose logs -f
```

### Estatísticas de recursos

```bash
# CPU, memória, I/O
docker stats
```

### Verificar processos

```bash
# Listar containers em execução
docker compose ps

# Inspecionar container
docker compose exec tese-app ps aux
```

## Troubleshooting

### Erro: "Cannot connect to Docker daemon"

```bash
# Verificar se Docker está a correr
sudo systemctl status docker

# Iniciar Docker
sudo systemctl start docker

# Adicionar user ao grupo docker (sem sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Erro: "Port 50812 already in use"

```bash
# Ver o que está a usar a porta
sudo lsof -i :50812

# Parar processo ou mudar porta em docker-compose.yml
```

### Aplicação lenta ou travada

```bash
# Verificar limites de recursos do container
docker compose exec tese-app free -m
docker compose exec tese-app df -h

# Ver timeouts do Python
grep PYTHON_EXEC_TIMEOUT .env
```

### SSL/TLS Certificate Expired

```bash
# Renovar com Certbot
sudo certbot renew

# Copiar novos certificados
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem ./ssl/key.pem

# Recarregar nginx
docker compose exec nginx nginx -s reload
```

## Segurança em Produção

### 1. Variáveis de Ambiente

```bash
# NUNCA commitar .env com valores reais
echo ".env" >> .gitignore

# Usar .env.example como template
git add .env.example
```

### 2. Firewall

```bash
# Permitir apenas portas no intervalo autorizado
sudo ufw allow 50811/tcp
sudo ufw allow 50812/tcp
sudo ufw enable
```

### 3. API Token

```bash
# Gerar token seguro
openssl rand -base64 32

# Usar APENAS para operações de escrita
# GET requests não precisam de token
```

### 4. Backups

```bash
# Backup dos dados do container
docker compose exec tese-app tar czf - /app/src/python/*/data | \
  gzip > backup-$(date +%Y%m%d-%H%M%S).tar.gz

# Restaurar backup
tar xzf backup-*.tar.gz -C /
```

## Performance

### Rate Limiting (Nginx)

- Geral: 100 req/s por IP
- API: 30 req/s por IP
- Customizável em `nginx.conf`

### Timeouts

- Aplicação: 15s (Python scripts)
- Nginx connect: 30s
- Nginx read: 30s
- Nginx send: 30s

Ajustáveis em `.env` e `nginx.conf`

### Compression

- Gzip ativado (reduz ~70% tamanho)
- Tipos: HTML, CSS, JS, JSON, SVG, Fonts

## Support

Para problemas:

1. Verificar logs: `docker compose logs -f`
2. Verificar status: `docker compose ps`
3. Testar conectividade: `curl -vk https://cosmo.epl.di.uminho.pt:50812`
4. Verificar espaço em disco: `df -h`

---

**Deployment Date:** 2026-03-18  
**Application:** TESE v0.1.0  
**Stack:** Node.js 20 + Next.js 16 + Python 3 + Nginx + Docker
