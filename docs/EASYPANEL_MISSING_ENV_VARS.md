# 🔧 Solução: Variáveis de Ambiente Não Encontradas no EasyPanel

> **Guia rápido para resolver erro: "Environment variable not found: DATABASE_URL"**

## 📋 **Erro Encontrado**

```
PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL.

  -->  schema.prisma:23

   | 
22 |   provider = "mysql"
23 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
```

## 🎯 **Causa do Problema**

A variável de ambiente `DATABASE_URL` não está configurada no serviço da aplicação no EasyPanel. Esta variável é **obrigatória** para o Prisma se conectar ao banco de dados MySQL.

## ✅ **Solução Rápida (3 Passos)**

### **Passo 1: Acessar EasyPanel**
1. Faça login no painel do EasyPanel
2. Navegue até seu projeto **Roadmap App**
3. Clique no serviço da **Aplicação** (não no MySQL)

### **Passo 2: Configurar Variáveis de Ambiente**
1. Clique na aba **"Environment"** ou **"Env"**
2. Clique em **"Add Variable"** ou **"+"**
3. Adicione as seguintes variáveis:

#### **Variável 1: DATABASE_URL**
```
Nome: DATABASE_URL
Valor: mysql://[usuario]:[senha]@[hostname]:3306/[banco]
```

**Exemplo real:**
```
DATABASE_URL=mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
```

**Onde encontrar os valores:**
- `[usuario]`: Nome do usuário MySQL (geralmente `mysql`)
- `[senha]`: Senha do usuário MySQL (consulte o serviço MySQL no EasyPanel)
- `[hostname]`: Nome do serviço MySQL no EasyPanel (ex: `app_database_roadmap` ou `app_roadmap_db`)
- `[banco]`: Nome do banco de dados (geralmente `roadmap_db`)

#### **Variável 2: JWT_SECRET** (também obrigatória)
```
Nome: JWT_SECRET
Valor: [sua-chave-secreta-aleatoria]
```

**Exemplo:**
```
JWT_SECRET=Ue9vN#p$3@rGz^XqW8mT!cDfL1bKsZjV
```

#### **Variável 3: NODE_ENV** (opcional, mas recomendada)
```
Nome: NODE_ENV
Valor: production
```

#### **Variável 4: PORT** (opcional, padrão é 3003)
```
Nome: PORT
Valor: 3003
```

### **Passo 3: Salvar e Reiniciar**
1. Clique em **"Save"** ou **"Salvar"**
2. Clique em **"Deploy"** ou **"Rebuild"** para reiniciar o serviço
3. Aguarde o build completar (2-5 minutos)

## 🔍 **Como Encontrar os Valores Corretos**

### **1. Nome do Serviço MySQL (hostname)**
1. No EasyPanel, vá para o serviço **MySQL Database**
2. O nome do serviço aparece no topo (ex: `app_database_roadmap`)
3. **IMPORTANTE**: Use este nome, NÃO use `localhost`!

### **2. Credenciais do MySQL**
1. No serviço MySQL, vá para a aba **"Environment"**
2. Procure por:
   - `MYSQL_USER` ou `MYSQL_ROOT_USER` → usuário
   - `MYSQL_PASSWORD` ou `MYSQL_ROOT_PASSWORD` → senha
   - `MYSQL_DATABASE` → nome do banco

### **3. Exemplo de Configuração Completa**

Se seu serviço MySQL tem:
- **Nome do serviço**: `app_database_roadmap`
- **Usuário**: `mysql`
- **Senha**: `6b5d1cccdf5c7805c506`
- **Banco**: `roadmap_db`

Então sua `DATABASE_URL` deve ser:
```
DATABASE_URL=mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
```

## 📊 **Estrutura da DATABASE_URL**

```
mysql://[usuario]:[senha]@[hostname]:[porta]/[banco]
│       │        │        │          │      │
│       │        │        │          │      └── roadmap_db
│       │        │        │          └──────── 3306
│       │        │        └─────────────────── app_database_roadmap
│       │        └──────────────────────────── senha123
│       └────────────────────────────────────── mysql
└─────────────────────────────────────────────── protocolo
```

## ⚠️ **Erros Comuns e Soluções**

### **Erro 1: "Can't reach database server"**
**Causa**: Hostname incorreto (usando `localhost` em vez do nome do serviço)

**Solução**: 
- ❌ `DATABASE_URL=mysql://...@localhost:3306/...`
- ✅ `DATABASE_URL=mysql://...@app_database_roadmap:3306/...`

### **Erro 2: "Access denied for user"**
**Causa**: Credenciais incorretas (usuário ou senha)

**Solução**: 
- Verifique as credenciais no serviço MySQL do EasyPanel
- Certifique-se de que não há espaços extras na URL
- Use URL encoding se a senha tiver caracteres especiais

### **Erro 3: "Unknown database"**
**Causa**: Banco de dados não existe

**Solução**: 
1. Acesse o PHPMyAdmin
2. Crie o banco `roadmap_db`
3. Execute as migrações: `npx prisma migrate deploy`

### **Erro 4: Variável não é salva**
**Causa**: Formato incorreto ou caracteres especiais

**Solução**: 
- Não use aspas na variável
- Use URL encoding para caracteres especiais na senha
- Certifique-se de salvar antes de fazer deploy

## 📋 **Checklist de Verificação**

Após configurar, verifique:

- [ ] `DATABASE_URL` está definida no serviço da aplicação
- [ ] `JWT_SECRET` está definida
- [ ] Hostname usa o nome do serviço MySQL (não `localhost`)
- [ ] Credenciais estão corretas
- [ ] Porta está como `3306`
- [ ] Nome do banco está correto
- [ ] Variáveis foram salvas
- [ ] Serviço foi reiniciado após salvar

## 🚀 **Verificar se Funcionou**

Após o restart, verifique os logs do serviço. Você deve ver:

```
✅ Todas as variáveis de ambiente obrigatórias estão configuradas
🔌 Conectando ao banco de dados...
✅ Conectado ao banco de dados com sucesso!
🚀 Application is running on: http://localhost:3003
📚 Swagger documentation: http://localhost:3003/api/docs
```

Se ainda houver erros, consulte:
- [EASYPANEL_DATABASE_CONNECTION_FIX.md](./EASYPANEL_DATABASE_CONNECTION_FIX.md) - Problemas de conexão
- [EASYPANEL_DEPLOY.md](./EASYPANEL_DEPLOY.md) - Guia completo de deploy

## 🆘 **Ainda com Problemas?**

1. **Verifique os logs** do serviço da aplicação
2. **Confirme as credenciais** no serviço MySQL
3. **Teste a conexão** usando PHPMyAdmin
4. **Verifique o nome do serviço** MySQL no EasyPanel
5. **Consulte a documentação** do EasyPanel: [https://easypanel.io/docs](https://easypanel.io/docs)

---

**📅 Criado em:** Janeiro 2025  
**🔧 Status:** Solução Validada  
**📋 Categoria:** Deploy & Configuração  
**🎯 Público:** Desenvolvedores e DevOps

