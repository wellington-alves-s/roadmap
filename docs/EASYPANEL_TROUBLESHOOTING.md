# 🔧 Troubleshooting - Deploy EasyPanel

> **Guia para resolver problemas comuns no deploy do Roadmap App no EasyPanel**

## 🚨 **Erro: "Connection Reset" ou Aplicação não Responde**

Este erro indica que a aplicação está **crashando ao iniciar**. Siga os passos abaixo para diagnosticar e resolver.

---

## 📋 **Passo 1: Verificar Logs no EasyPanel**

### **Como Acessar os Logs:**

1. Acesse o painel do EasyPanel
2. Vá para o serviço **Roadmap App** (não o MySQL)
3. Clique na aba **"Logs"** ou **"Logs"**
4. Procure por mensagens de erro

### **O que Procurar nos Logs:**

#### ✅ **Logs de Sucesso (Aplicação Funcionando):**
```
✅ Todas as variáveis de ambiente obrigatórias estão configuradas
🔌 Conectando ao banco de dados...
✅ Conectado ao banco de dados com sucesso!
🚀 Application is running on: http://localhost:3003
📚 Swagger documentation: http://localhost:3003/api/docs
```

#### ❌ **Erros Comuns:**

**1. Variáveis de Ambiente Faltando:**
```
❌ Variáveis de ambiente obrigatórias não encontradas:
   - DATABASE_URL
   - JWT_SECRET
```
**Solução:** Configure as variáveis de ambiente (veja Passo 2)

**2. Erro de Conexão com Banco:**
```
❌ Erro ao conectar ao banco de dados:
   Can't reach database server at app_roadmap_db:3306
```
**Solução:** Verifique o nome do serviço MySQL e as credenciais (veja Passo 3)

**3. Erro do Prisma:**
```
PrismaClientInitializationError: Unable to require(`/app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node`)
Error loading shared library libssl.so.1.1
```
**Solução:** ✅ JÁ CORRIGIDO - Dockerfile atualizado para Debian Slim com OpenSSL

**4. Erro de Build:**
```
ERROR: failed to build: failed to solve
npm ci can only install packages when your package.json and package-lock.json are in sync
```
**Solução:** ✅ JÁ CORRIGIDO - package-lock.json atualizado e commitado

---

## 🔧 **Passo 2: Verificar Variáveis de Ambiente**

### **Variáveis Obrigatórias:**

Certifique-se de que estas variáveis estão configuradas no EasyPanel:

```bash
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://mysql:e667a649230e5688ce69@app_roadmap_db:3306/roadmap_db
JWT_SECRET=iNTKkQRqT4dCLUSxFYO9t+3X/prcvspcKu3j1fle5i0=
JWT_EXPIRES_IN=7d
```

### **Como Configurar:**

1. No EasyPanel, vá para o serviço **Roadmap App**
2. Clique na aba **"Environment"** ou **"Env"**
3. Verifique se todas as variáveis acima estão presentes
4. **IMPORTANTE:** 
   - Não use aspas nas variáveis
   - O `DATABASE_URL` deve usar o nome do serviço MySQL (não `localhost`)
   - O nome do serviço MySQL no seu caso é: `app_roadmap_db`

### **Verificar Nome do Serviço MySQL:**

1. No EasyPanel, vá para o serviço **MySQL**
2. Veja o nome do serviço (geralmente aparece no topo)
3. Use esse nome no `DATABASE_URL` como hostname
4. Exemplo: Se o serviço se chama `app_roadmap_db`, use:
   ```
   DATABASE_URL=mysql://mysql:senha@app_roadmap_db:3306/roadmap_db
   ```

---

## 🗄️ **Passo 3: Verificar Conexão com Banco de Dados**

### **Verificar se o MySQL está Rodando:**

1. No EasyPanel, vá para o serviço **MySQL**
2. Verifique se o status está como **"Running"** ou **"Rodando"**
3. Se não estiver, clique em **"Start"** ou **"Iniciar"**

### **Verificar Credenciais do MySQL:**

1. No serviço MySQL, vá para **"Environment"** ou **"Env"**
2. Anote:
   - **MYSQL_USER** (geralmente `mysql`)
   - **MYSQL_PASSWORD** (a senha configurada)
   - **MYSQL_DATABASE** (geralmente `roadmap_db`)

### **Testar Conexão via PHPMyAdmin:**

1. No EasyPanel, vá para o serviço MySQL
2. Clique em **"Open"** ou **"Abrir"** no PHPMyAdmin
3. Tente fazer login com as credenciais
4. Se conseguir, a conexão está OK

---

## 🐳 **Passo 4: Verificar Build do Docker**

### **Verificar se o Build Foi Bem-Sucedido:**

1. No EasyPanel, vá para o serviço **Roadmap App**
2. Clique na aba **"Deployments"** ou **"Deploys"**
3. Veja o último deploy
4. Se houver erro de build, você verá mensagens como:
   - `ERROR: failed to build`
   - `npm ci failed`
   - `Cannot find module`

### **Se o Build Falhar:**

1. Verifique se o `Dockerfile` está na raiz do repositório
2. Verifique se o `package-lock.json` está commitado
3. Verifique os logs de build para ver o erro específico

---

## 🔄 **Passo 5: Reiniciar o Serviço**

Após fazer qualquer alteração:

1. **Salve todas as variáveis de ambiente**
2. Vá para o serviço **Roadmap App**
3. Clique em **"Restart"** ou **"Reiniciar"**
4. Aguarde alguns segundos
5. Verifique os logs novamente

---

## 📊 **Checklist Completo**

Use este checklist para garantir que tudo está configurado:

- [ ] **MySQL está rodando** (status "Running")
- [ ] **Variável `DATABASE_URL` configurada** com nome correto do serviço MySQL
- [ ] **Variável `JWT_SECRET` configurada**
- [ ] **Variável `PORT=3003` configurada**
- [ ] **Variável `NODE_ENV=production` configurada**
- [ ] **Todas as variáveis foram salvas**
- [ ] **Serviço foi reiniciado** após configurar variáveis
- [ ] **Build foi bem-sucedido** (sem erros)
- [ ] **Logs mostram "Application is running"**

---

## 🆘 **Problemas Específicos**

### **Problema 1: "Cannot GET /3003"**

**Causa:** URL incorreta

**Solução:** Use `http://localhost:3003` (com dois pontos `:`) e não `http://localhost/3003` (com barra `/`)

### **Problema 2: "Connection Reset"**

**Causa:** Aplicação crashando ao iniciar

**Solução:** 
1. Verifique os logs (Passo 1)
2. Verifique variáveis de ambiente (Passo 2)
3. Verifique conexão com banco (Passo 3)
4. Reinicie o serviço (Passo 5)

### **Problema 3: "Can't reach database server"**

**Causa:** Nome do serviço MySQL incorreto no `DATABASE_URL`

**Solução:**
- ❌ `DATABASE_URL=mysql://...@localhost:3306/...`
- ✅ `DATABASE_URL=mysql://...@app_roadmap_db:3306/...`

### **Problema 4: "Access denied for user"**

**Causa:** Credenciais incorretas

**Solução:**
1. Verifique as credenciais no serviço MySQL
2. Certifique-se de que não há espaços extras na URL
3. Use URL encoding se a senha tiver caracteres especiais

---

## 📞 **Ainda com Problemas?**

Se após seguir todos os passos o problema persistir:

1. **Copie os logs completos** do EasyPanel
2. **Verifique a versão do Node.js** (deve ser 20)
3. **Verifique se o Dockerfile está atualizado** (deve usar `node:20-slim`)
4. **Verifique se o `package-lock.json` está commitado** no repositório

---

**📅 Criado em:** Dezembro 2025  
**🔧 Status:** Guia Atualizado  
**📋 Categoria:** Deploy & Troubleshooting  
**🎯 Público:** Desenvolvedores e DevOps

