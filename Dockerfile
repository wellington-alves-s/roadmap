# Dockerfile - Roadmap App
# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build da aplicação
FROM node:18-alpine AS builder

# Instalar dependências do sistema para build
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Stage 2: Imagem de produção
FROM node:18-alpine AS production

# Instalar dependências do sistema necessárias
RUN apk add --no-cache dumb-init netcat-openbsd

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm install -g ts-node typescript && npm cache clean --force

# Copiar build da aplicação do stage anterior
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/public ./public
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/healthcheck.js ./healthcheck.js
COPY --chown=nestjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh

# Verificar se os arquivos foram copiados corretamente e mostrar conteúdo
RUN echo "=== Conteúdo do diretório /app ===" && \
    ls -la /app && \
    echo "=== Conteúdo do diretório /app/public ===" && \
    ls -la /app/public && \
    echo "=== Conteúdo do diretório /app/dist ===" && \
    ls -la /app/dist && \
    echo "=== Conteúdo do diretório /app/scripts ===" && \
    ls -la /app/scripts

# Dar permissão de execução para o entrypoint
RUN chmod +x ./docker-entrypoint.sh

# Definir usuário não-root
USER nestjs

# Expor porta da aplicação
EXPOSE 8080

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8080

# Health check disabled for now
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node /app/healthcheck.js

# Comando para iniciar a aplicação
CMD ["dumb-init", "./docker-entrypoint.sh"]
