# Production Deployment Script for TESE Application (PowerShell)
# Usage: .\deploy-production.ps1 -Domain "cosmo.epl.di.uminho.pt" -ApiToken "your-token" -HostHttpPort 50811 -HostHttpsPort 50812

param(
    [string]$Domain = "cosmo.epl.di.uminho.pt",
    [string]$ApiToken = "",
    [int]$HostHttpPort = 50811,
    [int]$HostHttpsPort = 50812
)

$ErrorActionPreference = "Stop"

# Colors
function Green { Write-Host $args -ForegroundColor Green }
function Yellow { Write-Host $args -ForegroundColor Yellow }
function Red { Write-Host $args -ForegroundColor Red }

Green "=== TESE Production Deployment ==="
Write-Host "Domain: $Domain"
Write-Host "HTTP Port: $HostHttpPort"
Write-Host "HTTPS Port: $HostHttpsPort"
Write-Host ""

# Check prerequisites
Yellow "Checking prerequisites..."

$dockerFound = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
$composeFound = $null -ne (Get-Command docker-compose -ErrorAction SilentlyContinue)
$gitFound = $null -ne (Get-Command git -ErrorAction SilentlyContinue)

if (-not $dockerFound) {
    Red "❌ Docker not found. Please install Docker Desktop first."
    exit 1
}

if (-not $composeFound) {
    Red "❌ Docker Compose not found. Please install Docker Desktop first."
    exit 1
}

if (-not $gitFound) {
    Red "❌ Git not found. Please install Git first."
    exit 1
}

Green "✓ All prerequisites installed"
Write-Host ""

# Generate API token if not provided
if ([string]::IsNullOrEmpty($ApiToken)) {
    Yellow "Generating secure API token..."
    # Using .NET for random generation
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
    $rng.GetBytes($bytes)
    $ApiToken = [System.Convert]::ToBase64String($bytes)
    Green "✓ Generated token: $ApiToken"
}

Write-Host ""

# Create .env file
Yellow "Creating .env file..."
$envContent = @"
DOMAIN=$Domain
HOST_HTTP_PORT=$HostHttpPort
HOST_HTTPS_PORT=$HostHttpsPort
API_WRITE_TOKEN=$ApiToken
API_RATE_LIMIT=120
API_RATE_WINDOW_MS=60000
PYTHON_EXEC_TIMEOUT_MS=15000
PYTHON_MAX_STDOUT_BYTES=2000000
NODE_ENV=production
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Green "✓ .env file created"
Write-Host ""

# Create SSL directory
Yellow "Setting up SSL directory..."
if (-not (Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" -Force | Out-Null
}
Green "✓ SSL directory created"
Write-Host ""

Yellow "⚠ Please ensure SSL certificates are in ssl/ directory:"
Yellow "  - ssl/cert.pem (certificate + chain)"
Yellow "  - ssl/key.pem (private key)"
Write-Host ""

# Validate docker-compose config
Yellow "Validating docker-compose configuration..."
& docker compose config > $null
Green "✓ Configuration valid"
Write-Host ""

# Build images
Yellow "Building Docker images (this may take 10-15 minutes)..."
& docker compose build
Green "✓ Build complete"
Write-Host ""

# Start services
Yellow "Starting services..."
& docker compose up -d
Green "✓ Services started"
Write-Host ""

# Wait for app to be ready
Yellow "Waiting for application to be ready..."
$maxAttempts = 30
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "https://localhost:$HostHttpsPort/health" -UseBasicParsing -SkipCertificateCheck -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Green "✓ Application is ready"
            break
        }
    }
    catch {
        # Continue
    }
    
    Write-Host "  ⏳ Attempt $i/$maxAttempts..."
    Start-Sleep -Seconds 2
}

Write-Host ""

# Display status
Yellow "Services status:"
& docker compose ps
Write-Host ""

# Display access information
Green "=== Deployment Complete ==="
Write-Host ""
Write-Host "Application URL: https://$Domain`:$HostHttpsPort"
Write-Host "API Token: $ApiToken"
Write-Host ""
Write-Host "Commands:"
Write-Host "  View logs:       docker compose logs -f"
Write-Host "  Stop services:   docker compose down"
Write-Host "  Restart services: docker compose restart"
Write-Host "  View status:     docker compose ps"
Write-Host ""
Yellow "Next steps:"
Write-Host "1. Copy SSL certificates to ssl/ directory"
Write-Host "2. Verify: curl -vk https://$Domain`:$HostHttpsPort"
Write-Host "3. If an external reverse proxy maps 443 to this host port, use https://$Domain without :$HostHttpsPort"
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed documentation."
