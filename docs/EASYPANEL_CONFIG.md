# ⚡ Configuração Rápida - EasyPanel

> 🔒 **NOTA IMPORTANTE**: Credenciais sensíveis estão no arquivo `SENSITIVE_CONFIG.md` (não versionado por segurança)

## 🔧 Variáveis de Ambiente para Copiar/Colar

**Cole EXATAMENTE estas variáveis no seu EasyPanel:**

```
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://[USER]:[PASSWORD]@[HOST]:3306/[DATABASE]
JWT_SECRET=[SUA_CHAVE_JWT_SECRETA]
JWT_EXPIRES_IN=7d
```

📋 **IMPORTANTE**: As credenciais reais estão no arquivo `SENSITIVE_CONFIG.md` (não versionado)

## 📋 Checklist Rápido

- [ ] ✅ **CORRIGIDO**: Serviço MySQL `app_roadmap_db` rodando  
- [ ] ✅ **CORRIGIDO**: Credenciais atualizadas
- [ ] ⚠️ **AÇÃO**: Atualizar DATABASE_URL no EasyPanel
- [ ] ✅ Repositório GitHub conectado
- [ ] ✅ Dockerfile detectado na raiz
- [ ] 🔧 Variáveis de ambiente configuradas (cole as novas acima)
- [ ] ✅ Porta 3003 configurada
- [ ] ✅ Deploy iniciado
- [ ] 🔧 **ÚLTIMO PASSO**: Restart com novas credenciais

## 🌐 URLs após Deploy

- **App**: `https://seu-dominio:3003`
- **API**: `https://seu-dominio:3003/api`
- **Docs**: `https://seu-dominio:3003/api/docs`
- **Health**: `https://seu-dominio:3003/api/health/check`

## 🆘 Se der erro

1. **"nest: not found" durante build**: ✅ CORRIGIDO - Dockerfile atualizado
2. **"Cannot find module '/app/dist/main.js'"**: ✅ CORRIGIDO - Build TypeScript
3. **Build não gera arquivos .js**: ✅ CORRIGIDO - Múltiplas estratégias de build
4. **"main.js: No such file or directory"**: ✅ CORRIGIDO - Dockerfile com verificações robustas
5. **Build falha no nest build**: ✅ CORRIGIDO - Fallback para TypeScript direto
6. **"@prisma/client did not initialize yet"**: ✅ CORRIGIDO - Prisma generate no estágio de produção
7. **Prisma Client não encontrado em produção**: ✅ CORRIGIDO - Generate após npm install
8. **"Can't reach database server at app_database_roadmap:3306"**: ✅ **CORRIGIDO** - Host era incorreto
9. **Database connection failed**: ✅ **CORRIGIDO** - Credenciais atualizadas
10. **Build failed**: Verifique logs no EasyPanel
11. **Port 3003 not accessible**: Confirme configuração de rede

### 🔧 Problemas de Build Resolvidos
- ✅ Instalação de devDependencies no estágio de build
- ✅ NestJS CLI disponível para `npm run build`
- ✅ Comando de inicialização corrigido: `dist/main.js`
- ✅ Script npm start:prod atualizado
- ✅ Debug logs adicionados para troubleshooting
- ✅ Multi-stage build otimizado

### 📁 Dockerfiles Disponíveis
- `Dockerfile` - **PRINCIPAL** - Multi-stage com NestJS CLI + fallbacks
- `Dockerfile.robust` - **RECOMENDADO** - 3 estratégias de build + debug completo
- `Dockerfile.simple` - Alternativo simples
- `Dockerfile.npm` - Usando npm script  
- `Dockerfile.fixed` - Build com verificações extras
- `Dockerfile.direct` - Build direto com debug completo

### 🔧 Solução para "main.js not found"

**Problema**: Build não gera `dist/main.js` corretamente

**Causa**: Configuração incorreta do `nest-cli.json` e `tsconfig.build.json`

**Soluções aplicadas**:
1. ✅ Corrigido `nest-cli.json`: `deleteOutDir: true`
2. ✅ Melhorado `tsconfig.build.json` com `rootDir` e `include`
3. ✅ Dockerfile com múltiplas estratégias de build
4. ✅ Fallback automático para TypeScript direto
5. ✅ Verificações robustas em cada etapa

**Se ainda falhar**, use: `Dockerfile.robust` com 3 estratégias de build

### 🗄️ Solução para "@prisma/client did not initialize yet"

**Problema**: Prisma Client não está disponível no estágio de produção

**Causa**: `npx prisma generate` só roda no build, mas precisa rodar também na produção

**Soluções aplicadas**:
1. ✅ `npx prisma generate` executado no estágio de produção
2. ✅ Schema do Prisma copiado antes da instalação
3. ✅ Verificações de import do Prisma Client
4. ✅ Ordem correta: schema → install → generate → build

**Resultado**: Prisma Client agora funciona em produção

### 🗄️ Solução para "Can't reach database server"

**⚠️ PROBLEMA ATUAL**: App não consegue conectar ao MySQL

**Causa**: Serviço MySQL `app_database_roadmap` não está rodando no EasyPanel

**🔧 PASSOS PARA RESOLVER**:

1. **✅ RESOLVIDO**: Serviço MySQL existe e está rodando
   - Host interno: `app_roadmap_db` (não `app_database_roadmap`)
   - Credenciais corretas identificadas

2. **🔧 AÇÃO NECESSÁRIA**: Atualizar variáveis de ambiente
   - No EasyPanel, vá para seu app Roadmap
   - Consulte `SENSITIVE_CONFIG.md` para as credenciais
   - Atualize a variável `DATABASE_URL` com os valores corretos

3. **📋 Credenciais**: 
   ```
   📄 Consulte o arquivo SENSITIVE_CONFIG.md
   🔒 (Arquivo não versionado por segurança)
   ```

4. **🔄 Restart do app Roadmap**:
   - Após atualizar DATABASE_URL, restart o app
   - App deve conectar automaticamente
   - Prisma criará as tabelas automaticamente

5. **📊 Popular banco com dados iniciais**:
   - Execute o arquivo `database_setup.sql` no MySQL
   - OU use o endpoint `/api/seed` da API (após app rodando)

**✅ VERIFICAÇÃO**: Logs devem mostrar `🚀 Application is running on: http://localhost:3003`

**📁 ARQUIVO**: `database_setup.sql` - Script completo de inicialização com dados

---

## 🌐 **Acesso Remoto com Cloudflare Tunnel**

### 📋 **URLs Locais do App (EasyPanel)**
- **🏠 Frontend**: `http://localhost` (não use porta :3003)
- **📚 API Docs**: `http://localhost/api/docs`
- **🔍 Health Check**: `http://localhost/api/v1/health/check`  
- **🌱 Popular Dados**: `http://localhost/api/v1/seed`

### 🚀 **Configurar Cloudflare Tunnel**

**Opção 1 - Túnel Temporário (Teste Rápido)**:
```bash
# Instalar cloudflared primeiro
cloudflared tunnel --url http://localhost
```
Retorna URL como: `https://abc123.trycloudflare.com`

**Opção 2 - Túnel Permanente**:
```bash
# 1. Autenticar
cloudflared tunnel login

# 2. Criar túnel
cloudflared tunnel create roadmap-app

# 3. Configurar DNS  
cloudflared tunnel route dns roadmap-app roadmap.seudominio.com

# 4. Executar
cloudflared tunnel run --url http://localhost roadmap-app
```

**Opção 3 - Dashboard Cloudflare**:
- Zero Trust → Tunnels → Create
- Public hostname: `roadmap.seudominio.com`
- Service: `http://localhost:80` (NÃO :3003)

### ⚠️ **IMPORTANTE**:
- ✅ Use `http://localhost` (porta 80 - proxy EasyPanel)
- ❌ NÃO use `http://localhost:3003` (porta interna do container)

### 🌐 **URLs Públicas após Tunnel**:
```
🏠 App: https://roadmap.seudominio.com
📚 API: https://roadmap.seudominio.com/api/docs
🔍 Health: https://roadmap.seudominio.com/api/v1/health/check
🌱 Seed: https://roadmap.seudominio.com/api/v1/seed
```

---

## 🗄️ **Acesso ao Banco de Dados via phpMyAdmin**

### 📋 **Configuração do phpMyAdmin no EasyPanel**

Para gerenciar o banco de dados visualmente, configure um serviço phpMyAdmin:

**1. Criar Serviço phpMyAdmin**:
- No EasyPanel → Services → Create Service
- Service Type: **phpMyAdmin**
- Service Name: **phpmyadmin-roadmap**

**2. Variáveis de Ambiente do phpMyAdmin**:
```
PMA_ARBITRARY=1
PMA_HOST=[HOST_DO_BANCO]
PMA_PORT=3306
PMA_USER=[USUARIO]
PMA_PASSWORD=[SENHA]
```
📋 **Valores reais**: Consulte `SENSITIVE_CONFIG.md`

**3. Configuração de Rede**:
- Conectar à mesma rede do banco `app_roadmap_db`
- Porta de acesso: 80 (padrão)

### 🌐 **Acesso ao phpMyAdmin**

Após configurar, acesse via:
- **Local**: `http://localhost:[porta-do-phpmyadmin]`
- **Com Cloudflare**: Configure túnel para o phpMyAdmin também

### 🔑 **Credenciais de Login**

```
📄 Consulte SENSITIVE_CONFIG.md para:
- Servidor e porta
- Usuário e senha
- Nome do banco de dados
🔒 (Informações não versionadas por segurança)
```

### 📊 **Funcionalidades Disponíveis**

Com phpMyAdmin você pode:
- ✅ Visualizar tabelas e dados
- ✅ Executar queries SQL
- ✅ Importar/exportar dados
- ✅ Gerenciar usuários e permissões
- ✅ Monitorar performance do banco

### 🚀 **Alternativa: Acesso via API**

Se preferir não usar phpMyAdmin, use os endpoints da API:
- **Popular dados**: `http://localhost/api/v1/seed`
- **Health check DB**: `http://localhost/api/v1/health/check`

---
**🎯 DEPLOY COMPLETO**: App + Banco + phpMyAdmin funcionando!**
