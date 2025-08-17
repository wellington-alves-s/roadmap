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

# Limpar diretório dist se existir
RUN rm -rf dist

# Build da aplicação usando TypeScript diretamente primeiro
RUN npx tsc -p tsconfig.build.json

# Debug: verificar se main.js foi gerado
RUN echo "=== Arquivos após tsc ===" && ls -la dist/ || echo "dist não existe ainda"

# Se main.js não existir, usar nest build
RUN if [ ! -f "dist/main.js" ]; then \
      echo "main.js não encontrado, usando nest build..."; \
      npx nest build; \
    fi

# Debug: listar arquivos finais
RUN echo "=== Arquivos finais ===" && ls -la dist/ && \
    echo "=== Verificando main.js ===" && ls -la dist/main.js

# Estágio de produção
FROM node:18-alpine AS production

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Definir diretório de trabalho
WORKDIR /app

# Instalar apenas dependências de produção no estágio final
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos buildados
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/public ./public
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Debug: verificar arquivos copiados
RUN ls -la dist/

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
