#!/bin/sh
set -e
# Entrypoint para EasyPanel

echo "🚀 Iniciando Roadmap App no EasyPanel..."

# Aguardar banco de dados estar disponível
echo "⏳ Aguardando conexão com banco de dados..."
max_retries=30
count=0

while ! nc -z ${DATABASE_HOST:-app_database_roadmap} ${DATABASE_PORT:-3306}; do
  count=$((count + 1))
  if [ $count -gt $max_retries ]; then
    echo "❌ Erro: Não foi possível conectar ao banco de dados após $max_retries tentativas"
    exit 1
  fi
  echo "Aguardando banco de dados... (tentativa $count/$max_retries)"
  sleep 2
done

echo "✅ Banco de dados conectado!"

# Executar migrações
echo "🗄️ Executando migrações Prisma..."
npx prisma migrate deploy

# Executar seed
echo "🌱 Executando seed..."
npm run seed || echo "Seed já executado ou falhou (normal se já existe dados)"

# Verificar diretório public
echo "📁 Verificando diretório public..."
if [ ! -d "/app/public" ] && [ ! -d "/app/dist/public" ]; then
  echo "❌ Diretório public não encontrado!"
  echo "Conteúdo de /app:"
  ls -la /app
  echo "Conteúdo de /app/dist (se existir):"
  ls -la /app/dist || true
  exit 1
fi

# Iniciar aplicação
echo "🎯 Iniciando aplicação na porta ${PORT:-8080}..."
exec node dist/src/main.js
