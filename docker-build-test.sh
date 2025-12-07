#!/bin/bash
# 🐳 Script para testar o build Docker localmente
# Execute: chmod +x docker-build-test.sh && ./docker-build-test.sh

echo "🚀 Testando build Docker do Roadmap App..."

# Build da imagem
echo "📦 Fazendo build da imagem..."
docker build -t roadmap-app:test .

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    echo "🧪 Para testar localmente, execute:"
    echo "docker run -p 3003:3003 -e DATABASE_URL='mysql://root:@host.docker.internal:3306/roadmap_db' -e JWT_SECRET='test-secret' roadmap-app:test"
    
    echo ""
    echo "🌐 Após executar, acesse:"
    echo "- Aplicação: http://localhost:3003"
    echo "- API Docs: http://localhost:3003/api/docs"
    echo "- Health: http://localhost:3003/api/health/check"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi
