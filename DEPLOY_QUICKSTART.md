# 🚀 Deploy Quickstart - Roadmap App no EasyPanel

> **Guia Rápido para Deploy em Produção**

## ⚡ **Deploy em 5 Minutos**

### **1. Preparar Configurações (2 min)**
```bash
# Copiar template de configuração
cp env.production.example .env

# Editar configurações OBRIGATÓRIAS
nano .env
```

**⚠️ ALTERAR OBRIGATORIAMENTE:**
```bash
JWT_SECRET="sua-chave-jwt-forte-32-caracteres-minimo"
MYSQL_ROOT_PASSWORD="senha-root-muito-forte"
MYSQL_PASSWORD="senha-user-forte"
DATABASE_URL="mysql://roadmap_user:senha-user-forte@mysql:3306/roadmap_db"
```

### **2. Deploy Automático (3 min)**

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy.ps1
```

### **3. Verificar Deploy**
```bash
# Health check
curl http://localhost:3000/api/health

# Resposta esperada:
{"status":"ok","timestamp":"2025-01-15T..."}
```

---

## 🎯 **EasyPanel - Deploy via Interface**

### **Passo a Passo Simples:**

1. **Acessar EasyPanel** → Criar Projeto → Tipo: "Docker Compose"

2. **Upload Arquivos:**
   - `docker-compose.yml` ⭐
   - `Dockerfile` ⭐
   - `.env` ⭐
   - Todo o código fonte

3. **Configurar Variáveis:**
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://roadmap_user:senha@mysql:3306/roadmap_db
   JWT_SECRET=sua-chave-forte
   ```

4. **Clicar Deploy** → Aguardar 5-10 min

5. **Testar:** `http://seu-servidor:3000`

---

## 📋 **Arquivos Criados**

```
✅ Dockerfile              # Build otimizado
✅ docker-compose.yml      # Orquestração completa  
✅ .dockerignore          # Otimização build
✅ healthcheck.js         # Health monitoring
✅ easypanel.yml          # Config EasyPanel
✅ env.production.example # Template configurações
✅ deploy.sh/.ps1         # Scripts automáticos
✅ DEPLOY.md              # Documentação completa
```

---

## 🔧 **Comandos Essenciais**

### **Gestão Básica:**
```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f app

# Reiniciar
docker-compose restart app

# Parar tudo
docker-compose down
```

### **Banco de Dados:**
```bash
# Backup
docker-compose exec mysql mysqldump -u root -p roadmap_db > backup.sql

# Restaurar
docker-compose exec -T mysql mysql -u root -p roadmap_db < backup.sql

# Acessar MySQL
docker-compose exec mysql mysql -u root -p
```

### **Manutenção:**
```bash
# Executar migrações
docker-compose exec app npx prisma migrate deploy

# Executar seed
docker-compose exec app npm run seed

# Ver recursos
docker stats
```

---

## 🔒 **Segurança Essencial**

### **Obrigatório Alterar:**
- [ ] `JWT_SECRET` - Mínimo 32 caracteres
- [ ] Senhas MySQL - Fortes e únicas  
- [ ] `CORS_ORIGIN` - Seu domínio específico

### **Recomendado:**
- [ ] Firewall (UFW) configurado
- [ ] SSL/HTTPS em produção
- [ ] Backup automatizado
- [ ] Monitoramento ativo

---

## 🚨 **Troubleshooting Rápido**

### **Container não inicia:**
```bash
docker-compose logs app
docker-compose config
```

### **Erro de banco:**
```bash
docker-compose logs mysql
docker-compose restart mysql
sleep 60 && docker-compose restart app
```

### **Aplicação lenta:**
```bash
docker stats
docker-compose logs --tail 50 app
```

### **Reset completo:**
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## ✅ **Checklist Rápido**

### **Deploy:**
- [ ] Arquivo `.env` configurado
- [ ] Docker rodando no servidor
- [ ] Portas 3000/3306 livres
- [ ] Script deploy executado
- [ ] Health check passando

### **Teste:**
- [ ] Frontend: `http://servidor:3000`
- [ ] API: `http://servidor:3000/api/docs`
- [ ] Login: `dev@roadmap.com` / `123456`

### **Produção:**
- [ ] SSL configurado
- [ ] Backup ativo
- [ ] Monitoramento
- [ ] Firewall

---

## 📞 **Suporte**

**Problemas Comuns:**
- 📖 **Documentação Completa**: `docs/EASYPANEL_DEPLOY_GUIDE.md`
- 🔧 **Deploy Detalhado**: `DEPLOY.md`
- 📋 **Setup Dev**: `SETUP.md`

**Emergência:**
```bash
# Backup emergencial
docker-compose exec mysql mysqldump -u root -p roadmap_db > emergency_backup.sql

# Logs detalhados  
docker-compose logs --timestamps --tail 200 > debug.log
```

---

## 🎉 **Resultado Final**

✅ **Aplicação Roadmap App** rodando em produção  
✅ **MySQL** com dados persistentes  
✅ **PWA** funcionando offline  
✅ **API** com documentação Swagger  
✅ **Sistema de Gamificação** completo  

**🔗 Acesso: `http://seu-servidor:3000`**

---

**Para deploy completo e configurações avançadas, consulte: `docs/EASYPANEL_DEPLOY_GUIDE.md`**
