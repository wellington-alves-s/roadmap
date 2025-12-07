# 🚀 Deploy do Roadmap App no EasyPanel

> 🔒 **NOTA IMPORTANTE**: Credenciais sensíveis estão no arquivo `SENSITIVE_CONFIG.md` (não versionado por segurança)

## 📋 Pré-requisitos Concluídos ✅

- ✅ Serviço MySQL criado no EasyPanel
- ✅ Banco de dados importado
- ✅ Dockerfile configurado
- ✅ Projeto no GitHub

## 🔧 Configuração do Serviço de Aplicação

### 1. **Criar Novo Serviço** 
- Tipo: **Aplicação**
- Fonte: **GitHub**
- Repositório: Seu repositório do Roadmap App

### 2. **Configurações Docker**
```dockerfile
# O Dockerfile já está configurado na raiz do projeto
# Porta interna: 3003
# Comando: Automático (definido no Dockerfile)
```

### 3. **Variáveis de Ambiente Configuradas** ✅

Configure no painel do EasyPanel EXATAMENTE estas variáveis:

```env
# Aplicação
PORT=3003
NODE_ENV=production

# Banco de Dados MySQL
DATABASE_URL=mysql://[USER]:[PASSWORD]@[HOST]:3306/[DATABASE]

# Segurança JWT
JWT_SECRET=[SUA_CHAVE_JWT_SECRETA_AQUI]
JWT_EXPIRES_IN=7d
```

### 4. **Configurações de Rede**
- **Porta do Container**: 3003
- **Porta Externa**: 3003 (ou conforme preferir)
- **Protocolo**: HTTP

### 5. **Configurações de Resource**
**Mínimo Recomendado:**
- **CPU**: 0.5 vCPU
- **Memória**: 512MB
- **Storage**: 1GB

**Recomendado para Produção:**
- **CPU**: 1 vCPU
- **Memória**: 1GB
- **Storage**: 2GB

## 🗄️ Configuração do Banco de Dados ✅

### Configuração do MySQL
```
📄 Consulte SENSITIVE_CONFIG.md para:
- Usuário e senha
- Host interno
- Nome do banco
🔒 (Credenciais não versionadas por segurança)
```

### Verificar Conectividade
O EasyPanel deve permitir conexão entre os serviços. Certifique-se de que:
- O serviço MySQL está rodando
- As credenciais estão corretas
- O nome do banco existe

## 🚀 Processo de Deploy

### 1. **Configurar Repositório**
- URL: `sua-url-do-github.git`
- Branch: `main` (ou sua branch principal)
- Caminho de Build: `/` (raiz do projeto)

### 2. **Build Automático**
O Dockerfile fará automaticamente:
```bash
npm ci --only=production
npx prisma generate
npm run build
```

### 3. **Inicialização**
```bash
# Comando definido no Dockerfile:
dumb-init node dist/main
```

### 4. **Health Check**
- URL: `http://seu-dominio:3003/api/health/check`
- Deve retornar status 200

## 🔍 Troubleshooting

### ❌ **Erro de Conexão com Banco**
```
PrismaClientInitializationError: Can't reach database server
```

**Soluções:**
1. Verificar `DATABASE_URL` no painel
2. Confirmar que MySQL está rodando
3. Testar conectividade entre serviços

### ❌ **Erro de Build**
```
npm ERR! Cannot resolve dependency
```

**Soluções:**
1. Verificar se `package-lock.json` está no repositório
2. Limpar cache: adicionar `RUN npm cache clean --force`

### ❌ **Aplicação não Inicia**
```
Error: Cannot find module
```

**Soluções:**
1. Verificar se o build foi concluído
2. Confirmar variáveis de ambiente
3. Verificar logs do container

## 📱 URLs de Acesso

Após o deploy bem-sucedido:

- **Aplicação**: `https://seu-dominio:3003`
- **API**: `https://seu-dominio:3003/api`
- **Documentação**: `https://seu-dominio:3003/api/docs`
- **Health Check**: `https://seu-dominio:3003/api/health/check`

## 🔐 Segurança Pós-Deploy

### 1. **JWT Secret**
```bash
# Gere uma chave única e segura:
openssl rand -hex 64
```

### 2. **Variáveis de Ambiente**
- ❌ Nunca commitar `.env` no repositório
- ✅ Configurar todas as variáveis no painel EasyPanel
- ✅ Usar valores diferentes de desenvolvimento

### 3. **CORS**
A aplicação já está configurada para aceitar múltiplas origens. Ajuste conforme necessário em `src/main.ts`.

## ✅ Checklist de Deploy

- [ ] MySQL rodando no EasyPanel
- [ ] Banco `roadmap_db` criado e populado
- [ ] Dockerfile na raiz do projeto
- [ ] Variáveis de ambiente configuradas
- [ ] Repositório GitHub acessível
- [ ] Porta 3003 configurada
- [ ] JWT_SECRET seguro configurado
- [ ] Health check funcionando

---

**🎉 Sucesso!** Sua aplicação Roadmap App estará rodando em produção no EasyPanel!
