# deploy.ps1 - Script de Deploy para Windows PowerShell
# Roadmap App - Deploy Automation

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy do Roadmap App..." -ForegroundColor Green

# Verificar se Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Error "❌ Docker não está rodando. Inicie o Docker Desktop e tente novamente."
    exit 1
}

# Função para log colorido
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Green
}

function Write-Warn {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Warn "Arquivo .env não encontrado!"
    Write-Host "Criando .env a partir do exemplo..."
    Copy-Item "env.production.example" ".env"
    Write-Host "✅ Arquivo .env criado. EDITE AS CONFIGURAÇÕES antes de continuar!" -ForegroundColor Yellow
    Write-Host "⚠️  Especialmente: DATABASE_URL, JWT_SECRET, senhas do MySQL" -ForegroundColor Yellow
    Read-Host "Pressione Enter quando terminar de editar o .env"
}

Write-Log "Parando containers existentes..."
docker-compose down --remove-orphans

Write-Log "Construindo nova imagem..."
docker-compose build --no-cache

Write-Log "Iniciando serviços..."
docker-compose up -d

Write-Log "Aguardando serviços ficarem prontos..."
Start-Sleep 30

Write-Log "Verificando status dos containers..."
docker-compose ps

Write-Log "Executando migrações do banco..."
docker-compose exec app npx prisma migrate deploy

Write-Log "Executando seed do banco..."
docker-compose exec app npm run seed

Write-Log "Verificando health check..."
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Log "✅ Aplicação está rodando e saudável!"
            break
        }
    } catch {
        Write-Warn "Tentativa $i/10 - Aguardando aplicação ficar pronta..."
        Start-Sleep 5
    }
}

Write-Log "🎉 Deploy concluído com sucesso!"
Write-Host ""
Write-Host "🔗 Aplicação disponível em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host "👤 Usuário de teste:" -ForegroundColor Cyan
Write-Host "   Email: dev@roadmap.com"
Write-Host "   Senha: 123456"
Write-Host ""
Write-Host "📋 Comandos úteis:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f app    # Ver logs da aplicação"
Write-Host "   docker-compose logs -f mysql  # Ver logs do MySQL"
Write-Host "   docker-compose down           # Parar todos os serviços"
Write-Host "   docker-compose up -d          # Reiniciar serviços"
