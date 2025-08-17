# Dockerfile para Roadmap App - EasyPanel Deploy
# Baseado em Node.js 18 Alpine para máxima eficiência

# Estágio de build
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY yarn.lock* ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar TODAS as dependências (incluindo devDependencies para o build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Limpar diretório dist completamente
RUN rm -rf dist

# Build usando NestJS CLI diretamente (mais confiável)
RUN echo "=== Iniciando build com nest cli ===" && \
    npx nest build && \
    echo "=== Build concluído ===" && \
    ls -la dist/

# Verificar se main.js foi gerado corretamente
RUN if [ ! -f "dist/main.js" ]; then \
      echo "❌ ERRO: main.js não foi gerado!"; \
      echo "=== Conteúdo do diretório dist: ==="; \
      find dist -type f -name "*.js" | head -10; \
      echo "=== Tentando build com tsc diretamente ==="; \
      npx tsc -p tsconfig.build.json --outDir dist; \
      echo "=== Arquivos após tsc: ==="; \
      find dist -name "main.js" -o -name "*.js" | head -5; \
      exit 1; \
    else \
      echo "✅ main.js encontrado com sucesso"; \
      ls -la dist/main.js; \
    fi

# Estágio de produção
FROM node:18-alpine AS production

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e schema do Prisma primeiro
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Instalar dependências de produção E gerar o Prisma Client
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force

# Copiar arquivos buildados
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/public ./public

# Debug: verificar arquivos copiados e Prisma Client
RUN echo "=== Verificando arquivos copiados ===" && \
    ls -la dist/ && \
    echo "=== Verificando Prisma Client ===" && \
    ls -la node_modules/.prisma/client/ || echo "Prisma client não encontrado" && \
    echo "=== Testando import do Prisma ===" && \
    node -e "try { require('@prisma/client'); console.log('✅ Prisma Client OK'); } catch(e) { console.log('❌ Prisma Client ERRO:', e.message); }"

# Configurar usuário
USER nestjs

# Expor porta
EXPOSE 3003

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3003/api/health/check', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
CMD ["dumb-init", "node", "dist/main.js"]
