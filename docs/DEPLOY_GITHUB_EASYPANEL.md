# 🚀 Guia de Deploy - GitHub + Easypanel

Este guia explica como fazer o deploy do Roadmap App no Easypanel usando o GitHub como repositório.

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Repositório criado no GitHub
- ✅ Conta no Easypanel
- ✅ Banco de dados MySQL já configurado no Easypanel (conforme mencionado)

## 🔧 Passo 1: Preparar o Repositório GitHub

### 1.1. Inicializar Git (se ainda não foi feito)

```bash
# Verificar se já é um repositório Git
git status

# Se não for, inicializar:
git init
```

### 1.2. Adicionar arquivos ao Git

```bash
# Adicionar todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Fazer commit inicial
git commit -m "Initial commit - Roadmap App ready for deployment"
```

### 1.3. Conectar ao GitHub

```bash
# Adicionar repositório remoto (substitua com sua URL do GitHub)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Ou se usar SSH:
git remote add origin git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git

# Fazer push
git branch -M main
git push -u origin main
```

## 🐳 Passo 2: Configurar no Easypanel

### 2.1. Criar Novo Serviço

1. Acesse o painel do Easypanel
2. Clique em **"+ Serviço"** ou **"Novo Serviço"**
3. Selecione **"App"** ou **"Aplicação"**

### 2.2. Configurar Fonte (Source)

1. Na aba **"Fonte"**, selecione **"Git"**
2. Preencha os campos:
   - **URL do Repositório**: `https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git`
     - Ou use SSH: `git@github.com:SEU_USUARIO/SEU_REPOSITORIO.git`
   - **Ramo (Branch)**: `main` (ou `master` se for o caso)
   - **Caminho de Build**: `/` (raiz do projeto)
3. Clique em **"Salvar"**

### 2.3. Configurar Chave SSH (se usar repositório privado)

Se seu repositório for privado:

1. No Easypanel, clique em **"Gerar Chave SSH"**
2. Copie a chave pública gerada
3. No GitHub:
   - Vá em **Settings** → **Deploy keys**
   - Clique em **"Add deploy key"**
   - Cole a chave pública
   - Marque **"Allow write access"** (se necessário)
   - Clique em **"Add key"**

### 2.4. Configurar Variáveis de Ambiente

No Easypanel, adicione as seguintes variáveis de ambiente:

**📋 Variáveis de ambiente necessárias:**

```env
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://[USER]:[PASSWORD]@[HOST]:3306/[DATABASE]
JWT_SECRET=[SUA_CHAVE_JWT_SECRETA]
JWT_EXPIRES_IN=7d
```

**💡 Dica:** Consulte os arquivos na pasta `docs/sensitive/` para obter as credenciais reais:
- `EASYPANEL_ENV_VARIABLES.txt` - Variáveis formatadas para copiar/colar
- `env.easypanel` - Arquivo de exemplo com todas as variáveis

**⚠️ IMPORTANTE:**
- As credenciais reais estão na pasta `docs/sensitive/` (não versionada)
- Substitua `[USER]`, `[PASSWORD]`, `[HOST]`, `[DATABASE]` pelas credenciais do seu banco MySQL no Easypanel
- O `JWT_SECRET` deve ser uma chave forte e única (32 bytes aleatórios)
- O `DATABASE_URL` usa o host interno do Easypanel (geralmente `app_roadmap_db`)

### 2.5. Configurar Porta

- Certifique-se de que a porta está configurada como **3003** no Easypanel
- O Dockerfile já está configurado para usar a porta 3003

### 2.6. Configurar Build

O Easypanel deve detectar automaticamente o `Dockerfile` na raiz do projeto. Se não detectar:

1. Vá em **"Configurações"** ou **"Settings"**
2. Verifique se o **"Dockerfile"** está sendo usado
3. O caminho deve ser: `/Dockerfile`

## 🚀 Passo 3: Fazer Deploy

### 3.1. Deploy Inicial

1. No Easypanel, clique em **"Deploy"** ou **"Iniciar Deploy"**
2. O Easypanel irá:
   - Clonar o repositório do GitHub
   - Construir a imagem Docker usando o Dockerfile
   - Iniciar o container

### 3.2. Verificar Logs

Após o deploy, verifique os logs para garantir que tudo está funcionando:

- Procure por: `🚀 Application is running on: http://localhost:3003`
- Se houver erros, verifique:
  - Conexão com o banco de dados
  - Variáveis de ambiente configuradas corretamente
  - Porta disponível

### 3.3. Executar Migrações do Prisma

Após o primeiro deploy, você pode precisar executar as migrações do Prisma:

**Opção 1: Via terminal do Easypanel**
```bash
npx prisma migrate deploy
```

**Opção 2: Via endpoint da API (se disponível)**
```
POST /api/v1/seed
```

## ✅ Passo 4: Verificar Funcionamento

### 4.1. Health Check

Acesse o endpoint de health check:
```
http://seu-dominio:3003/api/v1/health/check
```

Deve retornar: `{"status":"ok"}`

### 4.2. Documentação da API

Acesse a documentação Swagger:
```
http://seu-dominio:3003/api/docs
```

### 4.3. Frontend

Acesse o frontend:
```
http://seu-dominio:3003
```

## 🔄 Atualizações Futuras

Para atualizar o app após fazer alterações:

1. Faça commit e push das alterações para o GitHub:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin main
   ```

2. No Easypanel:
   - O Easypanel pode fazer deploy automático se configurado
   - Ou clique em **"Redeploy"** ou **"Deploy"** manualmente

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"

**Solução:**
- Verifique se o serviço MySQL está rodando no Easypanel
- Confirme que o `DATABASE_URL` está correto
- Verifique se o host do banco está acessível (geralmente é o nome do serviço MySQL no Easypanel)

### Erro: "Prisma Client not initialized"

**Solução:**
- O Dockerfile já executa `npx prisma generate` automaticamente
- Se persistir, verifique os logs do build

### Erro: "Port already in use"

**Solução:**
- Verifique se a porta 3003 está configurada corretamente
- Certifique-se de que não há outro serviço usando a mesma porta

### Build falha

**Solução:**
- Verifique os logs do build no Easypanel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Node.js 18 está sendo usado (conforme Dockerfile)

## 📚 Recursos Adicionais

- **Documentação do Easypanel**: [https://easypanel.io/docs](https://easypanel.io/docs)
- **Dockerfile**: Veja o arquivo `Dockerfile` na raiz do projeto
- **Variáveis de Ambiente**: Veja `.env.example` para referência

## 🔒 Segurança

- **NUNCA** commite arquivos `.env` com credenciais reais
- Use variáveis de ambiente no Easypanel para credenciais
- Mantenha o `.gitignore` atualizado
- Use chaves JWT fortes e únicas em produção

---

**✅ Pronto!** Seu Roadmap App está configurado para deploy no Easypanel via GitHub! 🎉

