# 🚀 Deploy Completo no EasyPanel - Roadmap App

> **Guia Definitivo para Deploy da Aplicação Roadmap App no EasyPanel com Docker**

## 📋 **Índice**

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Arquivos de Deploy](#arquivos-de-deploy)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Deploy no EasyPanel](#deploy-no-easypanel)
6. [Verificação e Testes](#verificação-e-testes)
7. [Gestão e Manutenção](#gestão-e-manutenção)
8. [Segurança](#segurança)
9. [Troubleshooting](#troubleshooting)
10. [Otimizações](#otimizações)

---

## 🎯 **Visão Geral**

### **O que é o Deploy**
Este guia demonstra como fazer o deploy completo da aplicação **Roadmap App** no **EasyPanel**, uma plataforma de gerenciamento Docker que simplifica a implantação de aplicações containerizadas.

### **Arquitetura do Deploy**
```
┌─────────────────────────────────────────┐
│             EasyPanel Server            │
├─────────────────────────────────────────┤
│  ┌───────────────┐  ┌─────────────────┐ │
│  │   Roadmap     │  │     MySQL       │ │
│  │     App       │◄─┤   Database      │ │
│  │  (NestJS)     │  │    (8.0)        │ │
│  │   Port 3000   │  │   Port 3306     │ │
│  └───────────────┘  └─────────────────┘ │
│  ┌───────────────┐  ┌─────────────────┐ │
│  │    Redis      │  │    Volumes      │ │
│  │   (Cache)     │  │  (Persistent)   │ │
│  │   Port 6379   │  │   Data Storage  │ │
│  └───────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

### **Componentes Implantados**
- **Aplicação NestJS** - Backend API + Frontend PWA
- **MySQL 8.0** - Banco de dados principal
- **Redis 7** - Cache e sessões (opcional)
- **Volumes Docker** - Persistência de dados
- **Health Checks** - Monitoramento automático

---

## 📋 **Pré-requisitos**

### **🖥️ Servidor/EasyPanel**
| Requisito | Mínimo | Recomendado | Descrição |
|-----------|--------|-------------|-----------|
| **Docker** | 20.10+ | 24.0+ | Engine de containerização |
| **Docker Compose** | 2.0+ | 2.20+ | Orquestração de containers |
| **RAM** | 2GB | 4GB | Memória disponível |
| **CPU** | 2 cores | 4 cores | Processamento |
| **Disco** | 10GB | 20GB | Espaço em disco |
| **Rede** | Portas 3000, 3306 | Portas livres | Conectividade |

### **🌐 Conectividade**
```bash
# Portas necessárias
3000/tcp  # Aplicação web
3306/tcp  # MySQL (interno)
6379/tcp  # Redis (interno)
80/tcp    # HTTP (proxy)
443/tcp   # HTTPS (proxy)
```

### **🔧 Ferramentas Locais**
- Git (para versionamento)
- Editor de texto (VS Code recomendado)
- Cliente SSH (para acesso ao servidor)
- Navegador web (para interface EasyPanel)

---

## 📦 **Arquivos de Deploy**

### **📂 Estrutura dos Arquivos Criados**
```
roadmap-app/
├── 🐳 Dockerfile                    # Build da aplicação
├── 🐙 docker-compose.yml           # Orquestração completa
├── 🚫 .dockerignore                # Otimização do build
├── ❤️  healthcheck.js               # Script de health check
├── ⚙️  easypanel.yml               # Config específica EasyPanel
├── 🔧 env.production.example       # Template de configurações
├── 🚀 deploy.sh                    # Script deploy Linux/Mac
├── 🪟 deploy.ps1                   # Script deploy Windows
└── 📖 DEPLOY.md                    # Documentação detalhada
```

### **🔍 Detalhamento dos Arquivos**

#### **1. Dockerfile**
```dockerfile
# Multi-stage build otimizado
FROM node:18-alpine AS builder
# ... build da aplicação

FROM node:18-alpine AS production
# ... imagem final otimizada
```

**Características:**
- ✅ **Multi-stage build** - Imagem final menor
- ✅ **Usuário não-root** - Segurança melhorada
- ✅ **Health check** integrado
- ✅ **Otimizações Alpine** - Tamanho reduzido

#### **2. docker-compose.yml**
```yaml
services:
  app:          # Aplicação NestJS
  mysql:        # Banco de dados
  redis:        # Cache (opcional)
volumes:        # Persistência
networks:       # Comunicação interna
```

**Recursos Incluídos:**
- ✅ **Dependências** ordenadas
- ✅ **Health checks** automáticos
- ✅ **Volumes persistentes**
- ✅ **Rede isolada**
- ✅ **Restart policies**

#### **3. Configurações de Ambiente**
```bash
# env.production.example
DATABASE_URL="mysql://user:pass@mysql:3306/db"
JWT_SECRET="chave-forte-aqui"
NODE_ENV="production"
```

---

## ⚙️ **Configuração do Ambiente**

### **🔐 Passo 1: Configurar Variáveis de Ambiente**

#### **Criar arquivo .env**
```bash
# Copiar template
cp env.production.example .env

# Editar configurações
nano .env  # Linux/Mac
notepad .env  # Windows
```

#### **Configurações Obrigatórias**
```bash
# 🗄️ Database Configuration
DATABASE_URL="mysql://roadmap_user:SUA_SENHA_FORTE_AQUI@mysql:3306/roadmap_db"
MYSQL_ROOT_PASSWORD="ROOT_SENHA_MUITO_FORTE_AQUI"
MYSQL_PASSWORD="USER_SENHA_FORTE_AQUI"

# 🔒 Security Configuration  
JWT_SECRET="sua-chave-jwt-de-pelo-menos-32-caracteres-muito-segura"
JWT_EXPIRES_IN="7d"

# 🌐 Application Configuration
NODE_ENV="production"
PORT="3000"
CORS_ORIGIN="https://seu-dominio.com"

# ⚡ Performance Configuration
CACHE_TTL="60000"
CACHE_MAX="100"
THROTTLE_TTL="60000"
THROTTLE_LIMIT="100"
```

#### **🔑 Gerando Senhas Seguras**
```bash
# Linux/Mac - Gerar senha aleatória
openssl rand -base64 32

# Windows PowerShell - Gerar senha
Add-Type -AssemblyName System.Web
[System.Web.Security.Membership]::GeneratePassword(32, 8)

# Online (alternativa)
# https://passwordsgenerator.net/
```

### **🛡️ Passo 2: Validar Configurações**

#### **Checklist de Segurança**
- [ ] **JWT_SECRET**: Mínimo 32 caracteres, caracteres especiais
- [ ] **Senhas MySQL**: Diferentes, fortes, sem caracteres especiais
- [ ] **CORS_ORIGIN**: Domínio específico (não usar "*")
- [ ] **NODE_ENV**: Definido como "production"
- [ ] **Portas**: Verificar disponibilidade (3000, 3306)

#### **Script de Validação**
```bash
# Verificar se .env existe e tem configurações básicas
if [ -f .env ]; then
    echo "✅ Arquivo .env encontrado"
    
    # Verificar JWT_SECRET
    JWT_LENGTH=$(grep "JWT_SECRET" .env | cut -d'=' -f2 | tr -d '"' | wc -c)
    if [ $JWT_LENGTH -gt 32 ]; then
        echo "✅ JWT_SECRET tem tamanho adequado"
    else
        echo "❌ JWT_SECRET muito curto (mínimo 32 caracteres)"
    fi
else
    echo "❌ Arquivo .env não encontrado"
fi
```

---

## 🚀 **Deploy no EasyPanel**

### **📋 Método 1: Interface Web EasyPanel (Recomendado)**

#### **1.1. Preparar Projeto**
1. **Acessar EasyPanel**
   - URL: `https://seu-easypanel.com`
   - Login com credenciais administrativas

2. **Criar Novo Projeto**
   ```
   Nome: roadmap-app
   Tipo: Docker Compose
   Repositório: [opcional]
   ```

3. **Configurar Projeto**
   - **Nome**: `roadmap-app`
   - **Descrição**: `Sistema de Gamificação de Aprendizado`
   - **Categoria**: `Web Application`

#### **1.2. Upload de Arquivos**
```
Arquivos Essenciais para Upload:
├── docker-compose.yml     # ⭐ OBRIGATÓRIO
├── Dockerfile            # ⭐ OBRIGATÓRIO  
├── .env                  # ⭐ OBRIGATÓRIO
├── package.json          # ⭐ OBRIGATÓRIO
├── /src/**               # Código fonte
├── /public/**            # Frontend
├── /prisma/**            # Schema BD
└── healthcheck.js        # Health check
```

#### **1.3. Configurar Variáveis de Ambiente**
No painel EasyPanel, adicionar:
```
NODE_ENV=production
DATABASE_URL=mysql://roadmap_user:senha@mysql:3306/roadmap_db
JWT_SECRET=sua-chave-jwt-muito-forte
MYSQL_ROOT_PASSWORD=senha-root-forte
MYSQL_PASSWORD=senha-user-forte
PORT=3000
CORS_ORIGIN=https://seu-dominio.com
```

#### **1.4. Configurar Rede e Portas**
```yaml
# Configuração de Rede no EasyPanel
Ports:
  - 3000:3000 (HTTP)
  - 3306:3306 (MySQL - interno)

Network:
  - Mode: bridge
  - Internal: roadmap-network
```

#### **1.5. Executar Deploy**
1. **Clicar "Deploy"** no painel
2. **Aguardar Build** (5-10 minutos)
3. **Verificar Logs** em tempo real
4. **Confirmar Health Check** ativo

### **📱 Método 2: Deploy via Script Automático**

#### **2.1. Linux/Mac**
```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

#### **2.2. Windows PowerShell**
```powershell
# Permitir execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Executar deploy
.\deploy.ps1
```

#### **2.3. Deploy Manual**
```bash
# 1. Verificar Docker
docker --version
docker-compose --version

# 2. Parar containers existentes
docker-compose down --remove-orphans

# 3. Build da aplicação
docker-compose build --no-cache --pull

# 4. Iniciar serviços
docker-compose up -d

# 5. Aguardar inicialização
sleep 30

# 6. Verificar status
docker-compose ps

# 7. Executar migrações
docker-compose exec app npx prisma migrate deploy

# 8. Executar seed
docker-compose exec app npm run seed

# 9. Verificar health
curl http://localhost:3000/api/health
```

### **🌐 Método 3: Deploy via Git (Se Configurado)**

#### **3.1. Configurar Git Remote**
```bash
# Adicionar remote do EasyPanel
git remote add easypanel https://git.easypanel.com/seu-usuario/roadmap-app.git

# Verificar remotes
git remote -v
```

#### **3.2. Deploy via Push**
```bash
# Commit todas as mudanças
git add .
git commit -m "🚀 Deploy para produção"

# Push para EasyPanel
git push easypanel main

# Acompanhar logs no painel
```

---

## ✅ **Verificação e Testes**

### **🔍 Health Checks Automáticos**

#### **1. Verificar Status dos Containers**
```bash
# Status geral
docker-compose ps

# Saída esperada:
#     Name                   Command               State           Ports
# roadmap-app      node dist/main                 Up      0.0.0.0:3000->3000/tcp
# roadmap-mysql    docker-entrypoint.sh mysqld    Up      0.0.0.0:3306->3306/tcp
# roadmap-redis    docker-entrypoint.sh redis     Up      0.0.0.0:6379->6379/tcp
```

#### **2. Health Check da Aplicação**
```bash
# Teste local
curl -f http://localhost:3000/api/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}

# Teste remoto
curl -f http://seu-servidor:3000/api/health
```

#### **3. Verificar Banco de Dados**
```bash
# Testar conexão MySQL
docker-compose exec mysql mysqladmin ping -h localhost

# Resposta esperada:
# mysqld is alive

# Verificar banco de dados
docker-compose exec mysql mysql -u roadmap_user -p -e "SHOW DATABASES;"
```

#### **4. Verificar Logs**
```bash
# Logs da aplicação (tempo real)
docker-compose logs -f app

# Logs do MySQL
docker-compose logs -f mysql

# Logs de todos os serviços
docker-compose logs -f

# Logs com timestamp
docker-compose logs -f --timestamps
```

### **🌐 Testes Funcionais**

#### **1. Acesso ao Frontend**
```
URL: http://seu-servidor:3000
✅ Página de login carrega
✅ Interface responsiva
✅ PWA funcional
```

#### **2. Acesso à API**
```
URL: http://seu-servidor:3000/api/docs
✅ Swagger UI carrega
✅ Endpoints listados
✅ Autenticação funcionando
```

#### **3. Login de Teste**
```
Email: dev@roadmap.com
Senha: 123456
✅ Login realizado com sucesso
✅ Dashboard carrega
✅ Dados exibidos corretamente
```

#### **4. Funcionalidades Core**
```bash
# Testar endpoints principais
curl -X GET http://localhost:3000/api/levels
curl -X GET http://localhost:3000/api/topics
curl -X GET http://localhost:3000/api/achievements

# Testar autenticação
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@roadmap.com","password":"123456"}'
```

### **📊 Monitoramento de Performance**

#### **1. Recursos do Sistema**
```bash
# Uso de recursos por container
docker stats

# Saída similar a:
CONTAINER      CPU %    MEM USAGE / LIMIT     MEM %    NET I/O           BLOCK I/O
roadmap-app    2.5%     150MiB / 2GiB         7.5%     1.2kB / 2.1kB     4.2MB / 0B
roadmap-mysql  1.8%     400MiB / 2GiB         20%      2.1kB / 1.2kB     15MB / 8MB
```

#### **2. Espaço em Disco**
```bash
# Espaço usado pelos volumes
docker system df

# Limpeza se necessário
docker system prune -f
```

#### **3. Performance da Aplicação**
```bash
# Tempo de resposta
time curl http://localhost:3000/api/health

# Teste de carga simples
for i in {1..10}; do curl http://localhost:3000/api/health; done
```

---

## 🛠️ **Gestão e Manutenção**

### **🔄 Operações Básicas**

#### **1. Controle de Containers**
```bash
# Parar todos os serviços
docker-compose down

# Iniciar serviços
docker-compose up -d

# Reiniciar apenas a aplicação
docker-compose restart app

# Reiniciar apenas MySQL
docker-compose restart mysql

# Ver status
docker-compose ps
```

#### **2. Gestão de Logs**
```bash
# Ver logs específicos
docker-compose logs app
docker-compose logs mysql

# Logs com filtro de tempo
docker-compose logs --since 2h app

# Logs seguindo em tempo real
docker-compose logs -f app

# Limitar número de linhas
docker-compose logs --tail 100 app
```

#### **3. Acesso aos Containers**
```bash
# Acessar shell da aplicação
docker-compose exec app sh

# Acessar MySQL
docker-compose exec mysql mysql -u root -p

# Executar comandos específicos
docker-compose exec app npm run seed
docker-compose exec app npx prisma migrate status
```

### **💾 Backup e Restore**

#### **1. Backup do Banco de Dados**
```bash
# Backup completo
docker-compose exec mysql mysqldump -u root -p roadmap_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (script)
#!/bin/bash
BACKUP_DIR="/backup/roadmap"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
docker-compose exec mysql mysqldump -u root -p roadmap_db > $BACKUP_DIR/roadmap_$DATE.sql
echo "Backup criado: roadmap_$DATE.sql"
```

#### **2. Restore do Banco**
```bash
# Restore de backup
docker-compose exec -T mysql mysql -u root -p roadmap_db < backup_20250115_103000.sql

# Verificar restore
docker-compose exec mysql mysql -u root -p -e "USE roadmap_db; SHOW TABLES;"
```

#### **3. Backup de Volumes**
```bash
# Backup de todos os volumes
docker run --rm -v roadmap-app_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_data_backup.tar.gz /data

# Restore de volumes
docker run --rm -v roadmap-app_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql_data_backup.tar.gz -C /
```

### **🔄 Atualizações**

#### **1. Atualizar Aplicação**
```bash
# 1. Backup atual
./backup.sh

# 2. Parar aplicação
docker-compose stop app

# 3. Build nova versão
docker-compose build --no-cache app

# 4. Iniciar nova versão
docker-compose up -d app

# 5. Verificar health
curl http://localhost:3000/api/health
```

#### **2. Atualizar Dependências**
```bash
# Rebuild completo
docker-compose down
docker-compose build --no-cache --pull
docker-compose up -d

# Executar migrações (se houver)
docker-compose exec app npx prisma migrate deploy
```

#### **3. Rollback**
```bash
# Em caso de problemas, voltar para versão anterior
docker-compose down
docker image ls  # Ver imagens disponíveis
docker tag roadmap-app:backup roadmap-app:latest
docker-compose up -d
```

---

## 🔒 **Segurança**

### **🛡️ Configurações de Segurança Essenciais**

#### **1. Senhas e Chaves**
```bash
# ✅ Verificar força das senhas
# JWT_SECRET: mínimo 32 caracteres
# MySQL passwords: mínimo 16 caracteres
# Sem caracteres especiais problemáticos: @#$%^&*

# ❌ Nunca usar senhas padrão
JWT_SECRET="change-me"           # RUIM
JWT_SECRET="minha-super-chave-jwt-muito-forte-com-32-chars-min"  # BOM
```

#### **2. Configuração de CORS**
```javascript
// src/main.ts - Configuração restritiva
app.enableCors({
  origin: ["https://seu-dominio.com"],  // Específico
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

#### **3. Rate Limiting**
```typescript
// Configuração no .env
THROTTLE_TTL=60000    # 1 minuto
THROTTLE_LIMIT=100    # 100 requests por minuto
```

#### **4. Headers de Segurança**
```nginx
# Se usar proxy reverso (nginx)
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### **🔥 Firewall e Rede**

#### **1. Configuração UFW (Ubuntu)**
```bash
# Bloquear tudo por padrão
ufw default deny incoming
ufw default allow outgoing

# Permitir apenas necessário
ufw allow ssh
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw allow 3000/tcp    # App (temporário)

# Ativar firewall
ufw enable

# Verificar status
ufw status verbose
```

#### **2. Rede Docker Isolada**
```yaml
# docker-compose.yml - Rede privada
networks:
  roadmap-network:
    driver: bridge
    internal: true  # Isolar da internet externa
```

#### **3. Portas Internas vs Externas**
```yaml
services:
  app:
    ports:
      - "3000:3000"    # Exposta externamente
  mysql:
    ports:
      - "127.0.0.1:3306:3306"  # Apenas localhost
    # OU não expor porta alguma (apenas interna)
```

### **🔐 SSL/HTTPS (Produção)**

#### **1. Certificado Let's Encrypt**
```bash
# Instalar certbot
apt update && apt install certbot

# Obter certificado
certbot certonly --standalone -d seu-dominio.com

# Renovação automática
echo "0 3 * * * /usr/bin/certbot renew --quiet" | crontab -
```

#### **2. Proxy Reverso Nginx**
```nginx
# /etc/nginx/sites-available/roadmap
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### **📊 Monitoramento de Segurança**

#### **1. Logs de Segurança**
```bash
# Monitorar logs de acesso
docker-compose logs app | grep -E "(401|403|429)"

# Alertas de tentativas suspeitas
docker-compose logs app | grep -E "(brute|attack|injection)"
```

#### **2. Health Check de Segurança**
```bash
# Verificar configurações
docker-compose exec app node -e "console.log(process.env.JWT_SECRET.length)"

# Teste de endpoints sensíveis
curl -X GET http://localhost:3000/api/admin  # Deve retornar 401
```

---

## 🔧 **Troubleshooting**

### **❌ Problemas Comuns e Soluções**

#### **1. Container não Inicia**

**Sintomas:**
```bash
# Container para imediatamente
docker-compose ps
# STATUS: Exited (1) ou Exited (0)
```

**Diagnóstico:**
```bash
# Ver logs detalhados
docker-compose logs app

# Verificar configurações
docker-compose config

# Testar build
docker-compose build app
```

**Soluções:**
```bash
# Problema: Variáveis de ambiente
# Verificar se .env existe e está correto
ls -la .env
cat .env | grep -E "(JWT_SECRET|DATABASE_URL)"

# Problema: Porta em uso
# Verificar o que está usando a porta
netstat -tulpn | grep 3000
# OU no Windows:
netstat -an | findstr :3000

# Solução: Usar porta diferente
# No docker-compose.yml:
ports:
  - "3001:3000"  # Externa:Interna
```

#### **2. Erro de Conexão com Banco**

**Sintomas:**
```
Error: Can't reach database server at `mysql`:`3306`
```

**Diagnóstico:**
```bash
# Verificar se MySQL está rodando
docker-compose ps mysql

# Testar conexão interna
docker-compose exec app ping mysql

# Verificar logs do MySQL
docker-compose logs mysql
```

**Soluções:**
```bash
# Aguardar MySQL inicializar completamente
sleep 60
docker-compose restart app

# Verificar URL do banco
echo $DATABASE_URL

# Resetar completamente
docker-compose down -v  # CUIDADO: Remove dados
docker-compose up -d
```

#### **3. Aplicação Lenta ou Não Responde**

**Sintomas:**
```bash
# Timeout nos health checks
curl: (28) Operation timed out after 30000 milliseconds
```

**Diagnóstico:**
```bash
# Verificar recursos
docker stats

# Verificar logs
docker-compose logs --tail 50 app

# Testar endpoints específicos
time curl http://localhost:3000/api/health
```

**Soluções:**
```bash
# Aumentar recursos
# No docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 2G
      cpus: "2.0"

# Otimizar aplicação
# Adicionar variáveis de ambiente:
NODE_OPTIONS="--max-old-space-size=2048"
```

#### **4. Build Falha**

**Sintomas:**
```
ERROR: failed to solve: process "/bin/sh -c npm install" did not complete successfully
```

**Diagnóstico:**
```bash
# Build com verbose
docker-compose build --progress=plain --no-cache app

# Verificar Dockerfile
cat Dockerfile | head -20
```

**Soluções:**
```bash
# Problema: Cache corrompido
docker system prune -f
docker-compose build --no-cache

# Problema: Dependências
# Verificar package.json
cat package.json | jq .dependencies

# Problema: Rede
# Build com network host
docker build --network=host -t roadmap-app .
```

### **🚨 Recuperação de Emergência**

#### **1. Reset Completo**
```bash
#!/bin/bash
echo "⚠️ RESET COMPLETO - DADOS SERÃO PERDIDOS"
read -p "Tem certeza? (digite 'SIM'): " confirm

if [ "$confirm" = "SIM" ]; then
    echo "Parando containers..."
    docker-compose down -v
    
    echo "Removendo imagens..."
    docker rmi $(docker images roadmap-app -q) || true
    
    echo "Limpando sistema..."
    docker system prune -f
    
    echo "Rebuild completo..."
    docker-compose build --no-cache
    
    echo "Iniciando serviços..."
    docker-compose up -d
    
    echo "✅ Reset concluído"
else
    echo "❌ Operação cancelada"
fi
```

#### **2. Backup de Emergência**
```bash
#!/bin/bash
echo "🚨 BACKUP DE EMERGÊNCIA"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do banco
docker-compose exec mysql mysqldump -u root -p roadmap_db > emergency_backup_$DATE.sql

# Backup de volumes
docker run --rm -v roadmap-app_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/emergency_volumes_$DATE.tar.gz /data

# Backup de configurações
tar czf emergency_config_$DATE.tar.gz .env docker-compose.yml Dockerfile

echo "✅ Backups criados:"
ls -la emergency_*_$DATE.*
```

#### **3. Restauração**
```bash
#!/bin/bash
echo "🔄 RESTAURAÇÃO DE EMERGÊNCIA"

# Listar backups disponíveis
ls -la emergency_*.sql

read -p "Digite o nome do backup SQL: " backup_file

if [ -f "$backup_file" ]; then
    echo "Restaurando banco..."
    docker-compose exec -T mysql mysql -u root -p roadmap_db < "$backup_file"
    
    echo "Reiniciando aplicação..."
    docker-compose restart app
    
    echo "✅ Restauração concluída"
else
    echo "❌ Arquivo não encontrado"
fi
```

---

## ⚡ **Otimizações**

### **🚀 Performance**

#### **1. Otimizações do Docker**
```yaml
# docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2.0"
        reservations:
          memory: 1G
          cpus: "1.0"
    healthcheck:
      interval: 30s      # Reduzido de 10s
      timeout: 10s
      retries: 3
      start_period: 60s  # Mais tempo para inicializar
```

#### **2. Configurações Node.js**
```bash
# Variáveis de ambiente para otimização
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=2048"
UV_THREADPOOL_SIZE=4
```

#### **3. Cache Redis**
```yaml
# Adicionar Redis para cache de sessões
redis:
  image: redis:7-alpine
  restart: unless-stopped
  volumes:
    - redis_data:/data
  sysctls:
    - net.core.somaxconn=65535
  deploy:
    resources:
      limits:
        memory: 512M
```

#### **4. MySQL Otimizado**
```yaml
mysql:
  command: >
    --default-authentication-plugin=mysql_native_password
    --innodb-buffer-pool-size=1G
    --innodb-log-file-size=256M
    --max-connections=100
    --query-cache-size=64M
```

### **📊 Monitoramento Avançado**

#### **1. Prometheus + Grafana**
```yaml
# Adicionar ao docker-compose.yml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

#### **2. Health Check Avançado**
```javascript
// healthcheck-advanced.js
const http = require('http');
const { execSync } = require('child_process');

const checks = [
  {
    name: 'HTTP',
    check: () => new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/health',
        timeout: 5000
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Timeout')));
      req.end();
    })
  },
  {
    name: 'Database',
    check: () => {
      try {
        execSync('npx prisma db pull', { timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Memory',
    check: () => {
      const memUsage = process.memoryUsage();
      return memUsage.heapUsed < 1024 * 1024 * 1024; // < 1GB
    }
  }
];

async function runHealthChecks() {
  const results = {};
  
  for (const check of checks) {
    try {
      results[check.name] = await check.check();
    } catch (error) {
      results[check.name] = false;
    }
  }
  
  const allHealthy = Object.values(results).every(Boolean);
  
  console.log('Health Check Results:', results);
  process.exit(allHealthy ? 0 : 1);
}

runHealthChecks();
```

### **🔄 CI/CD Pipeline**

#### **1. GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to EasyPanel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/roadmap-app
            git pull origin main
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
            sleep 30
            curl -f http://localhost:3000/api/health
```

#### **2. Deploy Automático com Webhook**
```bash
#!/bin/bash
# webhook-deploy.sh
echo "🚀 Deploy automático iniciado"

cd /path/to/roadmap-app

# Backup antes do deploy
./backup.sh

# Pull das mudanças
git pull origin main

# Deploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Verificar deploy
sleep 60
if curl -f http://localhost:3000/api/health; then
    echo "✅ Deploy concluído com sucesso"
    # Notificar sucesso (Slack, Discord, etc.)
else
    echo "❌ Deploy falhou, executando rollback"
    # Rollback automático
    docker-compose down
    git reset --hard HEAD~1
    docker-compose up -d
fi
```

### **💾 Backup Automatizado**

#### **1. Script de Backup Diário**
```bash
#!/bin/bash
# daily-backup.sh

BACKUP_DIR="/backups/roadmap-app"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=30

# Criar diretório
mkdir -p $BACKUP_DIR/$DATE

# Backup do banco
docker-compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD roadmap_db | gzip > $BACKUP_DIR/$DATE/database.sql.gz

# Backup dos volumes
docker run --rm -v roadmap-app_mysql_data:/data -v $BACKUP_DIR/$DATE:/backup alpine tar czf /backup/volumes.tar.gz /data

# Backup das configurações
tar czf $BACKUP_DIR/$DATE/config.tar.gz .env docker-compose.yml

# Remover backups antigos
find $BACKUP_DIR -type d -mtime +$RETENTION_DAYS -exec rm -rf {} +

echo "✅ Backup diário concluído: $BACKUP_DIR/$DATE"
```

#### **2. Crontab para Automação**
```bash
# Adicionar ao crontab
crontab -e

# Backup diário às 2h da manhã
0 2 * * * /path/to/roadmap-app/daily-backup.sh

# Health check a cada 5 minutos
*/5 * * * * curl -f http://localhost:3000/api/health || /path/to/roadmap-app/restart.sh

# Limpeza semanal do Docker
0 3 * * 0 docker system prune -f
```

---

## 📖 **Recursos Adicionais**

### **🔗 Links Úteis**
- [EasyPanel Documentation](https://easypanel.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

### **📚 Documentação Relacionada**
- `DEPLOY.md` - Guia geral de deploy
- `README.md` - Visão geral do projeto
- `SETUP.md` - Configuração de desenvolvimento
- `IMPLEMENTATION_SUMMARY.md` - Resumo técnico

### **🆘 Suporte**
- **Issues**: Documentar problemas encontrados
- **Logs**: Sempre incluir logs relevantes
- **Configuração**: Compartilhar configurações (sem senhas)
- **Versões**: Informar versões do Docker, EasyPanel, etc.

---

## ✅ **Checklist Final de Deploy**

### **📋 Pré-Deploy**
- [ ] Servidor com Docker instalado
- [ ] EasyPanel configurado e acessível
- [ ] Portas 3000 e 3306 disponíveis
- [ ] Arquivo `.env` configurado com senhas seguras
- [ ] Backup do ambiente atual (se existir)

### **🚀 Durante o Deploy**
- [ ] Upload de todos os arquivos necessários
- [ ] Configuração das variáveis de ambiente
- [ ] Build da aplicação executado com sucesso
- [ ] Containers iniciados corretamente
- [ ] Health checks passando

### **✅ Pós-Deploy**
- [ ] Acesso ao frontend funcionando
- [ ] Login de teste realizado com sucesso
- [ ] API Docs acessível
- [ ] Banco de dados populado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] SSL/HTTPS configurado (produção)
- [ ] Firewall configurado

### **📊 Validação Final**
- [ ] Performance dentro do esperado
- [ ] Logs sem erros críticos
- [ ] Todas as funcionalidades testadas
- [ ] Documentação atualizada
- [ ] Equipe treinada para manutenção

---

## 🎉 **Conclusão**

Este guia fornece uma base sólida para deploy da aplicação **Roadmap App** no **EasyPanel**. A aplicação estará:

✅ **Rodando em produção** com alta disponibilidade  
✅ **Monitorada** com health checks automáticos  
✅ **Segura** com configurações otimizadas  
✅ **Escalável** para crescimento futuro  
✅ **Mantível** com scripts de automação  

**🔗 Aplicação disponível em: `http://seu-servidor:3000`**  
**📚 API Docs em: `http://seu-servidor:3000/api/docs`**

Para suporte adicional, consulte a documentação específica ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o Roadmap App - Sistema de Gamificação de Aprendizado**
