# ⚙️ Configuração de Variáveis de Ambiente - EasyPanel

> **Guia rápido para configurar as variáveis de ambiente no EasyPanel**

## 📋 **Variáveis Configuradas**

As variáveis abaixo estão configuradas com os dados do seu ambiente:

### **🔴 Variáveis Obrigatórias**

```bash
# ⚠️ IMPORTANTE: Substitua pelos valores do seu ambiente
DATABASE_URL=mysql://[usuario]:[senha]@[hostname]:3306/[banco]
JWT_SECRET=[sua-chave-secreta-jwt-aleatoria]
NODE_ENV=production
PORT=3003
```

**📋 Exemplo com valores do seu ambiente:**
```bash
DATABASE_URL=mysql://mysql:ea7af4e53743e2802fb0@dev_roadmap_db:3306/db_roadmap
JWT_SECRET=Ue9vN#p$3@rGz^XqW8mT!cDfL1bKsZjV7aBcDeFgHiJkLmNoPqRsTuVwXyZ
NODE_ENV=production
PORT=3003
```

> 🔒 **NOTA DE SEGURANÇA**: As credenciais acima são apenas exemplos. Use suas próprias credenciais no EasyPanel.

### **🟡 Variáveis Opcionais (Recomendadas)**

```bash
JWT_EXPIRES_IN=7d
```

## 🚀 **Como Configurar no EasyPanel**

### **Passo 1: Acessar o Serviço**
1. Faça login no EasyPanel
2. Navegue até o projeto **Roadmap App**
3. Clique no serviço da **Aplicação** (não no MySQL)

### **Passo 2: Adicionar Variáveis**
1. Clique na aba **"Environment"** ou **"Env"**
2. Para cada variável abaixo, clique em **"Add Variable"** ou **"+"**:

#### **Variável 1: DATABASE_URL**
- **Nome**: `DATABASE_URL`
- **Valor**: `mysql://[usuario]:[senha]@[hostname]:3306/[banco]`
- **Exemplo**: `mysql://mysql:ea7af4e53743e2802fb0@dev_roadmap_db:3306/db_roadmap`

#### **Variável 2: JWT_SECRET**
- **Nome**: `JWT_SECRET`
- **Valor**: `[sua-chave-secreta-jwt-aleatoria]` (mínimo 32 caracteres)
- **Exemplo**: `Ue9vN#p$3@rGz^XqW8mT!cDfL1bKsZjV7aBcDeFgHiJkLmNoPqRsTuVwXyZ`

#### **Variável 3: NODE_ENV**
- **Nome**: `NODE_ENV`
- **Valor**: `production`

#### **Variável 4: PORT**
- **Nome**: `PORT`
- **Valor**: `3003`

#### **Variável 5: JWT_EXPIRES_IN** (Opcional)
- **Nome**: `JWT_EXPIRES_IN`
- **Valor**: `7d`

### **Passo 3: Salvar e Reiniciar**
1. Clique em **"Save"** ou **"Salvar"**
2. Clique em **"Deploy"** ou **"Rebuild"** para reiniciar o serviço
3. Aguarde o build completar (2-5 minutos)

## 📊 **Detalhes das Configurações**

### **DATABASE_URL - Estrutura**
```
mysql://mysql:ea7af4e53743e2802fb0@dev_roadmap_db:3306/db_roadmap
│       │     │                    │                │    │
│       │     │                    │                │    └── Nome do banco
│       │     │                    │                └─────── Porta MySQL
│       │     │                    └──────────────────────── Hostname do serviço
│       │     └──────────────────────────────────────────── Senha do usuário
│       └────────────────────────────────────────────────── Usuário MySQL
└────────────────────────────────────────────────────────── Protocolo
```

### **Credenciais do Banco de Dados**
> 🔒 **IMPORTANTE**: Use as credenciais do seu próprio ambiente EasyPanel

- **Usuário**: Consulte o serviço MySQL no EasyPanel
- **Senha**: Consulte o serviço MySQL no EasyPanel
- **Hostname**: Nome do serviço MySQL no EasyPanel (ex: `dev_roadmap_db`)
- **Porta**: `3306` (padrão MySQL)
- **Banco de Dados**: Nome do banco criado (ex: `db_roadmap`)

**Exemplo de valores:**
- **Usuário**: `mysql`
- **Senha**: `[sua-senha]`
- **Hostname**: `dev_roadmap_db`
- **Banco**: `db_roadmap`

### **JWT_SECRET**
- Chave secreta gerada para assinar tokens JWT
- **IMPORTANTE**: Mantenha esta chave segura e não a compartilhe
- Usada para autenticação de usuários

## ✅ **Verificação**

Após configurar e reiniciar, verifique os logs do serviço. Você deve ver:

```
✅ Todas as variáveis de ambiente obrigatórias estão configuradas
🔌 Conectando ao banco de dados...
✅ Conectado ao banco de dados com sucesso!
🚀 Application is running on: http://localhost:3003
📚 Swagger documentation: http://localhost:3003/api/docs
```

## 📋 **Checklist**

Antes de fazer deploy, verifique:

- [ ] `DATABASE_URL` está configurada corretamente
- [ ] `JWT_SECRET` está configurada
- [ ] `NODE_ENV` está como `production`
- [ ] `PORT` está como `3003`
- [ ] Hostname usa `dev_roadmap_db` (não `localhost`)
- [ ] Nome do banco está como `db_roadmap`
- [ ] Todas as variáveis foram salvas
- [ ] Serviço foi reiniciado após salvar

## ⚠️ **Importante**

1. **Hostname**: Use `dev_roadmap_db` (nome do serviço MySQL), **NÃO** use `localhost`
2. **Segurança**: Mantenha `JWT_SECRET` segura e não a compartilhe publicamente
3. **Banco de Dados**: Certifique-se de que o banco `db_roadmap` existe no MySQL
4. **Migrações**: Após conectar, execute as migrações se necessário

## 🆘 **Troubleshooting**

### **Erro: "Can't reach database server"**
- Verifique se o serviço MySQL está rodando
- Confirme que o hostname está como `dev_roadmap_db`
- Não use `localhost` em ambientes Docker

### **Erro: "Access denied for user"**
- Verifique se a senha está correta: `ea7af4e53743e2802fb0`
- Certifique-se de que não há espaços extras na URL

### **Erro: "Unknown database 'db_roadmap'"**
- Acesse o PHPMyAdmin
- Crie o banco `db_roadmap` se não existir
- Execute as migrações: `npx prisma migrate deploy`

## 📁 **Arquivo de Referência**

Você também pode copiar as variáveis do arquivo `easypanel-env-vars.txt` na raiz do projeto.

---

**📅 Criado em:** Janeiro 2025  
**🔧 Status:** Configurado com dados do ambiente  
**📋 Categoria:** Deploy & Configuração  
**🎯 Público:** Desenvolvedores e DevOps

