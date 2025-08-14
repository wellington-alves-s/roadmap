# 🚀 Guia de Deploy - Roadmap App

## 📋 **Pré-requisitos**

### **No Servidor/EasyPanel:**
- Docker 20.10+
- Docker Compose 2.0+
- Porta 3000 disponível (ou configurar outra)
- Porta 3306 disponível para MySQL (ou usar MySQL externo)

### **Recursos Mínimos:**
- **RAM**: 2GB (recomendado 4GB)
- **CPU**: 2 cores (recomendado 4 cores)  
- **Disco**: 10GB livres (recomendado 20GB)

## 🔧 **Configuração Inicial**

### **1. Preparar Arquivos de Configuração**
```bash
# Copiar exemplo de configuração
cp env.production.example .env

# Editar configurações (IMPORTANTE!)
nano .env
```

### **2. Configurações Obrigatórias no .env**
```bash
# Database - Altere as senhas!
DATABASE_URL="mysql://roadmap_user:SUA_SENHA_AQUI@mysql:3306/roadmap_db"
MYSQL_ROOT_PASSWORD="SUA_SENHA_ROOT_AQUI"
MYSQL_PASSWORD="SUA_SENHA_USER_AQUI"

# Security - Gere uma chave forte!
JWT_SECRET="sua-chave-jwt-muito-forte-e-longa-aqui-minimo-32-caracteres"

# Domain (se usar domínio)
CORS_ORIGIN="https://seu-dominio.com"
```

## 🚀 **Deploy Automático**

### **Opção 1: Script Automático (Recomendado)**
```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### **Opção 2: Deploy Manual**
```bash
# 1. Parar containers existentes
docker-compose down

# 2. Build da aplicação
docker-compose build --no-cache

# 3. Iniciar serviços
docker-compose up -d

# 4. Executar migrações
docker-compose exec app npx prisma migrate deploy

# 5. Executar seed
docker-compose exec app npm run seed
```

## 🎯 **Deploy no EasyPanel**

### **1. Via Interface EasyPanel**
1. **Criar Novo Projeto**
   - Nome: `roadmap-app`
   - Tipo: `Docker Compose`

2. **Upload de Arquivos**
   - Fazer upload de todos os arquivos do projeto
   - Especialmente: `docker-compose.yml`, `Dockerfile`, `.env`

3. **Configurar Variáveis de Ambiente**
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://roadmap_user:senha@mysql:3306/roadmap_db
   JWT_SECRET=sua-chave-jwt-forte
   ```

4. **Deploy**
   - Clicar em "Deploy"
   - Aguardar build e inicialização

### **2. Via CLI do EasyPanel** (se disponível)
```bash
# Login no EasyPanel
easypanel login

# Deploy do projeto
easypanel deploy --project roadmap-app --compose docker-compose.yml
```

### **3. Via Git (se configurado)**
```bash
# Configurar repository
git remote add easypanel <url-do-repositorio-easypanel>

# Push para deploy
git push easypanel main
```

## 🔍 **Verificação do Deploy**

### **1. Health Check**
```bash
# Verificar se aplicação está respondendo
curl http://localhost:3000/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"2025-01-..."}
```

### **2. Verificar Containers**
```bash
# Status dos containers
docker-compose ps

# Logs da aplicação
docker-compose logs -f app

# Logs do MySQL
docker-compose logs -f mysql
```

### **3. Testar Aplicação**
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **Login de Teste**:
  - Email: `dev@roadmap.com`
  - Senha: `123456`

## 🛠️ **Comandos Úteis**

### **Gerenciamento de Containers**
```bash
# Parar todos os serviços
docker-compose down

# Iniciar serviços
docker-compose up -d

# Reiniciar apenas a aplicação
docker-compose restart app

# Ver logs em tempo real
docker-compose logs -f

# Acessar container da aplicação
docker-compose exec app sh
```

### **Banco de Dados**
```bash
# Acessar MySQL
docker-compose exec mysql mysql -u root -p roadmap_db

# Backup do banco
docker-compose exec mysql mysqldump -u root -p roadmap_db > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u root -p roadmap_db < backup.sql

# Reset completo do banco
docker-compose exec app npx prisma migrate reset
```

### **Aplicação**
```bash
# Executar seed
docker-compose exec app npm run seed

# Executar migrações
docker-compose exec app npx prisma migrate deploy

# Ver logs da aplicação
docker-compose logs -f app

# Restart da aplicação
docker-compose restart app
```

## 🔒 **Segurança**

### **1. Configurações Essenciais**
- ✅ Alterar todas as senhas padrão
- ✅ Usar JWT_SECRET forte (mínimo 32 caracteres)
- ✅ Configurar CORS_ORIGIN para seu domínio
- ✅ Usar HTTPS em produção

### **2. Firewall (Recomendado)**
```bash
# Abrir apenas portas necessárias
ufw allow 3000/tcp  # Aplicação
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
```

### **3. SSL/HTTPS**
Para produção, configure um proxy reverso (nginx) com SSL:
- Let's Encrypt para certificados gratuitos
- Configurar redirecionamento HTTP → HTTPS

## 🔧 **Troubleshooting**

### **Problemas Comuns**

1. **Container não inicia**
   ```bash
   # Ver logs detalhados
   docker-compose logs app
   
   # Verificar configurações
   docker-compose config
   ```

2. **Erro de conexão com banco**
   ```bash
   # Verificar se MySQL está rodando
   docker-compose ps mysql
   
   # Testar conexão
   docker-compose exec app npx prisma db pull
   ```

3. **Porta em uso**
   ```bash
   # Verificar processo usando porta 3000
   netstat -tulpn | grep 3000
   
   # Alterar porta no docker-compose.yml
   ports:
     - "3001:3000"  # Usar porta 3001 externa
   ```

4. **Problemas de memória**
   ```bash
   # Verificar uso de recursos
   docker stats
   
   # Limitar memória do container
   deploy:
     resources:
       limits:
         memory: 1G
   ```

## 📊 **Monitoramento**

### **Health Checks**
- Aplicação: `http://localhost:3000/api/health`
- Banco: `docker-compose exec mysql mysqladmin ping`

### **Logs**
```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do sistema
journalctl -u docker.service

# Logs de acesso/erro (se configurado)
tail -f /app/logs/access.log
```

### **Métricas**
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h

# Memória do sistema
free -h
```

---

## ✅ **Checklist de Deploy**

- [ ] Configurar arquivo `.env` com senhas seguras
- [ ] Verificar pré-requisitos (Docker, portas)
- [ ] Executar deploy (`./deploy.sh`)
- [ ] Verificar health check
- [ ] Testar login na aplicação
- [ ] Configurar backup do banco de dados
- [ ] Configurar SSL/HTTPS (produção)
- [ ] Configurar monitoramento
- [ ] Documentar credenciais seguras

**🎉 Sua aplicação Roadmap App estará rodando em produção!**
