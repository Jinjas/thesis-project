#!/bin/bash

# Production Deployment Script for TESE Application
# Usage: ./deploy-production.sh [domain] [api-token] [http-port] [https-port]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DOMAIN="${1:-cosmo.epl.di.uminho.pt}"
API_TOKEN="${2:-}"
HOST_HTTP_PORT="${3:-50811}"
HOST_HTTPS_PORT="${4:-50812}"

echo -e "${GREEN}=== TESE Production Deployment ===${NC}"
echo "Domain: $DOMAIN"
echo "HTTP Port: $HOST_HTTP_PORT"
echo "HTTPS Port: $HOST_HTTPS_PORT"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose first.${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git not found. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites installed${NC}"
echo ""

# Generate API token if not provided
if [ -z "$API_TOKEN" ]; then
    echo -e "${YELLOW}Generating secure API token...${NC}"
    API_TOKEN=$(openssl rand -base64 32)
    echo -e "${GREEN}✓ Generated token: $API_TOKEN${NC}"
fi

echo ""

# Create .env file
echo -e "${YELLOW}Creating .env file...${NC}"
cat > .env << EOF
DOMAIN=$DOMAIN
HOST_HTTP_PORT=$HOST_HTTP_PORT
HOST_HTTPS_PORT=$HOST_HTTPS_PORT
API_WRITE_TOKEN=$API_TOKEN
API_RATE_LIMIT=120
API_RATE_WINDOW_MS=60000
PYTHON_EXEC_TIMEOUT_MS=15000
PYTHON_MAX_STDOUT_BYTES=2000000
NODE_ENV=production
EOF
echo -e "${GREEN}✓ .env file created${NC}"
echo ""

# Create SSL directory
echo -e "${YELLOW}Setting up SSL directory...${NC}"
mkdir -p ssl
chmod 755 ssl

# Check if Let's Encrypt certificates exist
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo -e "${YELLOW}Found Let's Encrypt certificates, copying...${NC}"
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ./ssl/cert.pem
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ./ssl/key.pem
    sudo chown $USER:$USER ssl/*
    chmod 644 ssl/*
    echo -e "${GREEN}✓ Certificates copied${NC}"
else
    echo -e "${YELLOW}⚠ Let's Encrypt certificates not found at /etc/letsencrypt/live/$DOMAIN${NC}"
    echo -e "${YELLOW}  Please run: sudo certbot certonly --standalone -d $DOMAIN${NC}"
    echo -e "${YELLOW}  Then copy certificates to ./ssl/cert.pem and ./ssl/key.pem${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# Validate docker-compose config
echo -e "${YELLOW}Validating docker-compose configuration...${NC}"
docker compose config > /dev/null
echo -e "${GREEN}✓ Configuration valid${NC}"
echo ""

# Build images
echo -e "${YELLOW}Building Docker images (this may take 10-15 minutes)...${NC}"
docker compose build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Services started${NC}"
echo ""

# Wait for app to be ready
echo -e "${YELLOW}Waiting for application to be ready...${NC}"
for i in {1..30}; do
    if curl -s -k "https://localhost:${HOST_HTTPS_PORT}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Application is ready${NC}"
        break
    fi
    echo "  ⏳ Attempt $i/30..."
    sleep 2
done

echo ""

# Display status
echo -e "${YELLOW}Services status:${NC}"
docker compose ps
echo ""

# Display access information
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "Application URL: https://$DOMAIN:$HOST_HTTPS_PORT"
echo "API Token: $API_TOKEN"
echo ""
echo "Commands:"
echo "  View logs:       docker compose logs -f"
echo "  Stop services:   docker compose down"
echo "  Restart services: docker compose restart"
echo "  View status:     docker compose ps"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify HTTPS: curl -vk https://$DOMAIN:$HOST_HTTPS_PORT"
echo "2. Test API: curl -X GET https://$DOMAIN:$HOST_HTTPS_PORT/api/ontology/getCocktails"
echo "3. Set up certificate renewal (Let's Encrypt)"
echo "4. If an external reverse proxy maps 443 to this host port, you can use https://$DOMAIN without :$HOST_HTTPS_PORT"
echo ""
echo "See DEPLOYMENT.md for detailed documentation."
