#!/bin/bash
# deploy.sh - Script simplificado para EasyPanel
# Roadmap App - EasyPanel Deploy

set -e

echo "🚀 Iniciando deploy no EasyPanel..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Build da aplicação
echo "🏗️ Construindo aplicação..."
npm run build

# Executar migrações (se necessário)
echo "📊 Executando migrações..."
npx prisma migrate deploy || echo "⚠️ Migrações falharam ou não necessárias"

echo "✅ Deploy concluído com sucesso!"
echo "🚀 Aplicação pronta para iniciar na porta ${PORT:-8080}"
