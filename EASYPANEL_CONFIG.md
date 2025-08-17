# ⚡ Configuração Rápida - EasyPanel

## 🔧 Variáveis de Ambiente para Copiar/Colar

**Cole EXATAMENTE estas variáveis no seu EasyPanel:**

```
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://mysql:469f4f45a99c2b340104@app_roadmap_db:3306/roadmap_db
JWT_SECRET=1890dc921347d0c56f5bf2f80cd7106e7780de29ade14ca634d2bd30ec89f95b034027cf4cec69888c3de00dd80c9ecf1bcaeac2d98c686c686ae01a1d3ac82f
JWT_EXPIRES_IN=7d
```

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
   - Atualize a variável `DATABASE_URL`:
   ```
   DATABASE_URL=mysql://mysql:469f4f45a99c2b340104@app_roadmap_db:3306/roadmap_db
   ```

3. **📋 Credenciais Corretas**:
   ```
   Host: app_roadmap_db
   Username: mysql  
   Password: 469f4f45a99c2b340104
   Database: roadmap_db
   Root Password: fcecff3dddcb74bfa9de
   Port: 3306
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
**🎯 ÚLTIMO PASSO**: Atualize DATABASE_URL no EasyPanel e restart o app!**
