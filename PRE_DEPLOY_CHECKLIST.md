# ✅ Checklist Pré-Deploy - Roadmap App

> **Verificação completa antes de sincronizar com GitHub e fazer deploy no EasyPanel**

## 🔒 **SEGURANÇA - CRÍTICO**

### **Arquivos com Credenciais**
- [x] ✅ `easypanel-env-vars.txt` adicionado ao `.gitignore`
- [x] ✅ Arquivo de exemplo `easypanel-env-vars.example.txt` criado
- [ ] ⚠️ **AÇÃO**: Verificar se `easypanel-env-vars.txt` já foi commitado (se sim, remover do histórico)
- [ ] ⚠️ **AÇÃO**: Verificar se há outros arquivos com credenciais no repositório

### **Arquivos que NÃO devem ser commitados:**
- ✅ `.env` e variações (já no .gitignore)
- ✅ `easypanel-env-vars.txt` (adicionado ao .gitignore)
- ✅ `docs/SENSITIVE_CONFIG.md` (já no .gitignore)
- ✅ `node_modules/` (já no .gitignore)
- ✅ `dist/` (já no .gitignore)

### **Documentação com Credenciais**
- [ ] ⚠️ **VERIFICAR**: `docs/EASYPANEL_ENV_SETUP.md` contém credenciais reais (linha 12, 13)
- [ ] ⚠️ **AÇÃO**: Remover credenciais reais da documentação ou substituir por placeholders

## 📋 **ESTRUTURA DO PROJETO**

### **Arquivos Essenciais**
- [x] ✅ `package.json` - Configurado
- [x] ✅ `Dockerfile` - Configurado e testado
- [x] ✅ `tsconfig.json` - Configurado
- [x] ✅ `prisma/schema.prisma` - Schema válido
- [x] ✅ `.gitignore` - Atualizado com arquivos sensíveis
- [x] ✅ `README.md` - Documentação completa
- [x] ✅ `src/main.ts` - Validação de variáveis de ambiente implementada
- [x] ✅ `src/prisma/prisma.service.ts` - Tratamento de erros melhorado

### **Documentação**
- [x] ✅ `docs/EASYPANEL_DEPLOY.md` - Guia de deploy
- [x] ✅ `docs/EASYPANEL_ENV_SETUP.md` - Configuração de variáveis
- [x] ✅ `docs/EASYPANEL_MISSING_ENV_VARS.md` - Troubleshooting
- [x] ✅ `docs/EASYPANEL_DATABASE_CONNECTION_FIX.md` - Fix de conexão
- [x] ✅ `docs/SETUP.md` - Setup local

## 🔧 **CÓDIGO E QUALIDADE**

### **Linting e Erros**
- [x] ✅ Sem erros de lint (`npm run lint`)
- [x] ✅ TypeScript compila sem erros
- [x] ✅ Validação de variáveis de ambiente implementada

### **Funcionalidades Críticas**
- [x] ✅ Autenticação JWT funcionando
- [x] ✅ Conexão com banco de dados (Prisma)
- [x] ✅ Sistema de gamificação completo
- [x] ✅ API RESTful documentada (Swagger)
- [x] ✅ Health checks implementados

## 🐳 **DOCKER E DEPLOY**

### **Dockerfile**
- [x] ✅ Multi-stage build configurado
- [x] ✅ Prisma Client gerado corretamente
- [x] ✅ Build TypeScript funcionando
- [x] ✅ Health check configurado
- [x] ✅ Usuário não-root para segurança

### **Variáveis de Ambiente**
- [x] ✅ Validação no startup implementada
- [x] ✅ Mensagens de erro claras
- [x] ✅ Documentação completa

## 📦 **GITHUB - PRONTO PARA COMMIT**

### **Antes de Fazer Commit**
- [ ] ⚠️ **VERIFICAR**: `git status` - verificar arquivos que serão commitados
- [ ] ⚠️ **CONFIRMAR**: Nenhum arquivo com credenciais será commitado
- [ ] ⚠️ **CONFIRMAR**: `easypanel-env-vars.txt` NÃO está no staging
- [ ] ⚠️ **CONFIRMAR**: `.env` e variações NÃO estão no staging

### **Comandos Úteis**
```bash
# Verificar arquivos que serão commitados
git status

# Verificar se arquivo sensível está sendo rastreado
git ls-files | grep -E "(easypanel-env-vars\.txt|\.env)"

# Se encontrar, remover do tracking (mas manter localmente)
git rm --cached easypanel-env-vars.txt
```

## 🚀 **EASYPANEL - PRONTO PARA DEPLOY**

### **Configuração do Serviço**
- [ ] ⚠️ **AÇÃO**: Criar serviço MySQL (se não existir)
- [ ] ⚠️ **AÇÃO**: Criar serviço da Aplicação
- [ ] ⚠️ **AÇÃO**: Conectar repositório GitHub
- [ ] ⚠️ **AÇÃO**: Configurar Dockerfile (raiz do projeto)

### **Variáveis de Ambiente no EasyPanel**
- [ ] ⚠️ **AÇÃO**: Adicionar `DATABASE_URL` (usar credenciais do seu ambiente)
- [ ] ⚠️ **AÇÃO**: Adicionar `JWT_SECRET` (gerar nova chave ou usar a do arquivo)
- [ ] ⚠️ **AÇÃO**: Adicionar `NODE_ENV=production`
- [ ] ⚠️ **AÇÃO**: Adicionar `PORT=3003`
- [ ] ⚠️ **AÇÃO**: Adicionar `JWT_EXPIRES_IN=7d` (opcional)

### **Valores das Variáveis (do seu ambiente)**
```
DATABASE_URL=mysql://mysql:ea7af4e53743e2802fb0@dev_roadmap_db:3306/db_roadmap
JWT_SECRET=Ue9vN#p$3@rGz^XqW8mT!cDfL1bKsZjV7aBcDeFgHiJkLmNoPqRsTuVwXyZ
NODE_ENV=production
PORT=3003
JWT_EXPIRES_IN=7d
```

### **Banco de Dados**
- [ ] ⚠️ **VERIFICAR**: Banco `db_roadmap` existe no MySQL
- [ ] ⚠️ **AÇÃO**: Executar migrações se necessário
- [ ] ⚠️ **AÇÃO**: Popular banco com seed (via endpoint `/api/seed`)

## ✅ **VERIFICAÇÃO FINAL**

### **Após Deploy**
- [ ] ⚠️ **VERIFICAR**: Logs mostram "Application is running"
- [ ] ⚠️ **VERIFICAR**: Health check responde (`/api/health/check`)
- [ ] ⚠️ **VERIFICAR**: Swagger acessível (`/api/docs`)
- [ ] ⚠️ **VERIFICAR**: Frontend carrega corretamente
- [ ] ⚠️ **VERIFICAR**: Login funciona

## 🆘 **PROBLEMAS COMUNS**

### **Se encontrar credenciais no código:**
1. Remover do arquivo
2. Adicionar ao `.gitignore`
3. Se já foi commitado, usar `git rm --cached` e fazer novo commit
4. Se já foi pushado, considerar rotacionar as credenciais

### **Se o deploy falhar:**
1. Verificar logs do EasyPanel
2. Verificar variáveis de ambiente
3. Verificar se o banco está acessível
4. Consultar documentação em `docs/EASYPANEL_MISSING_ENV_VARS.md`

---

**📅 Última atualização:** Janeiro 2025  
**🔧 Status:** Checklist de Verificação  
**📋 Próximos passos:** Revisar itens marcados com ⚠️ antes de fazer commit

