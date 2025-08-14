#!/bin/bash
# deploy.sh - Script de Deploy para EasyPanel
# Roadmap App - Deploy Automation

set -e

echo "🚀 Iniciando deploy do Roadmap App..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    warn "Arquivo .env não encontrado!"
    echo "Criando .env a partir do exemplo..."
    cp env.production.example .env
    echo "✅ Arquivo .env criado. EDITE AS CONFIGURAÇÕES antes de continuar!"
    echo "⚠️  Especialmente: DATABASE_URL, JWT_SECRET, senhas do MySQL"
    read -p "Pressione Enter quando terminar de editar o .env..."
fi

# Verificar se as variáveis essenciais estão definidas
source .env
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-in-production-must-be-very-long-and-secure" ]; then
    error "JWT_SECRET não está configurado corretamente!"
    exit 1
fi

log "Parando containers existentes..."
docker-compose down --remove-orphans || true

log "Construindo nova imagem..."
docker-compose build --no-cache

log "Iniciando serviços..."
docker-compose up -d

log "Aguardando serviços ficarem prontos..."
sleep 30

log "Verificando status dos containers..."
docker-compose ps

log "Executando migrações do banco..."
docker-compose exec app npx prisma migrate deploy

log "Executando seed do banco..."
docker-compose exec app npm run seed

log "Verificando health check..."
for i in {1..10}; do
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log "✅ Aplicação está rodando e saudável!"
        break
    else
        warn "Tentativa $i/10 - Aguardando aplicação ficar pronta..."
        sleep 5
    fi
done

log "🎉 Deploy concluído com sucesso!"
echo ""
echo "🔗 Aplicação disponível em: http://localhost:3000"
echo "📚 API Docs: http://localhost:3000/api/docs"
echo "👤 Usuário de teste:"
echo "   Email: dev@roadmap.com"
echo "   Senha: 123456"
echo ""
echo "📋 Comandos úteis:"
echo "   docker-compose logs -f app    # Ver logs da aplicação"
echo "   docker-compose logs -f mysql  # Ver logs do MySQL"
echo "   docker-compose down           # Parar todos os serviços"
echo "   docker-compose up -d          # Reiniciar serviços"
