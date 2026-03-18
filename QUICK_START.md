# Quick Start Production Deployment

Deployment rápido da aplicação TESE para `https://cosmo.epl.di.uminho.pt:50812` (dentro do intervalo permitido `50811-50814`).

## Passos Principais

### Servidor: Gerar Certificados SSL

Na máquina de produção:

```bash
sudo certbot certonly --standalone -d cosmo.epl.di.uminho.pt
```

Os certificados estarão em:

- `/etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem`
- `/etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem`

### Servidor: Preparar Diretório

```bash
cd /opt

# Clonar repositório
git clone <repository-url> tese
cd tese
git checkout 9-code-and-security-hardening

# Copiar certificados
mkdir -p ssl
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ssl/*
chmod 644 ssl/*

# Executar script de deployment
chmod +x deploy-production.sh
./deploy-production.sh cosmo.epl.di.uminho.pt
```

### Verificar Deployment

```bash
# Teste básico
curl -vk https://cosmo.epl.di.uminho.pt:50812

# Teste de API
curl -X GET https://cosmo.epl.di.uminho.pt:50812/api/ontology/getCocktails

# Verificar logs
docker compose logs -f
```

## Ficheiros Importantes

| Ficheiro             | Propósito                               |
| -------------------- | --------------------------------------- |
| `docker-compose.yml` | Orquestração dos serviços (app + nginx) |
| `Dockerfile`         | Build da imagem Node.js + Python        |
| `nginx.conf`         | Configuração do reverse proxy HTTPS     |
| `.env.example`       | Template de variáveis de ambiente       |
| `DEPLOYMENT.md`      | Documentação completa de deployment     |

## Variáveis de Ambiente

| Variável                 | Descrição                                | Exemplo                   |
| ------------------------ | ---------------------------------------- | ------------------------- |
| `DOMAIN`                 | Domínio da aplicação                     | `cosmo.epl.di.uminho.pt`  |
| `HOST_HTTP_PORT`         | Porta HTTP no host                       | `50811`                   |
| `HOST_HTTPS_PORT`        | Porta HTTPS no host                      | `50812`                   |
| `API_WRITE_TOKEN`        | Token de segurança para write operations | `openssl rand -base64 32` |
| `API_RATE_LIMIT`         | Limite de requisições                    | `120`                     |
| `PYTHON_EXEC_TIMEOUT_MS` | Timeout dos scripts Python               | `15000`                   |

## Monitoramento Pós-Deployment

```bash
# Logs em tempo real
docker compose logs -f tese-app
docker compose logs -f nginx

# Status dos containers
docker compose ps

# Estatísticas de recursos
docker stats

# Acesso ao shell do container
docker compose exec tese-app bash
```

## Troubleshooting Rápido

```bash
# Reiniciar serviços
docker compose restart

# Parar tudo
docker compose down

# Ver processo em execução
docker compose exec tese-app ps aux

# Verificar logs de erro
docker compose logs nginx | grep -i error
```

## Renovação de Certificados (Automático)

```bash
# Certbot renova automaticamente, depois copia para o diretório local
sudo crontab -e

# Adicionar a linha (renovação automática):
0 0 1 */2 * certbot renew --quiet && \
  cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/fullchain.pem /opt/tese/ssl/cert.pem && \
  cp /etc/letsencrypt/live/cosmo.epl.di.uminho.pt/privkey.pem /opt/tese/ssl/key.pem && \
  cd /opt/tese && docker compose exec -T nginx nginx -s reload
```

## URLs Úteis

| Endpoint                                | Método | Descrição           |
| --------------------------------------- | ------ | ------------------- |
| `/`                                     | GET    | Frontend            |
| `/api/ontology/getCocktails`            | GET    | Listar cocktails    |
| `/api/ontology/generate`                | POST   | Gerar novo cocktail |
| `/api/ontology/update`                  | POST   | Atualizar cocktail  |
| `/api/ingredientCode/getIngredientCode` | POST   | Gerar ingredient    |
| `/health`                               | GET    | Health check        |

## Características de Segurança

HTTPS obrigatório (redirect automático de HTTP)  
 Rate limiting (30 req/s por IP para APIs)  
 API key opcional para write operations  
 Timeout força para scripts Python (15s)  
 Security headers (HSTS, X-Frame-Options, etc.)  
 Gzip compression automático

Se a infraestrutura externa mapear `443 -> 50812`, podes usar `https://cosmo.epl.di.uminho.pt` sem especificar porta.

---

Para documentação completa, consulta [DEPLOYMENT.md](DEPLOYMENT.md).
