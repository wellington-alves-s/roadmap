# 🚀 Guia de Instalação - Roadmap App com XAMPP

Este guia vai te ajudar a executar o projeto **Roadmap App** na sua máquina local usando **XAMPP**.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- ✅ **XAMPP** instalado e funcionando - [Download aqui](https://www.apachefriends.org/)
- ✅ **Git** (opcional, para clonar repositórios)
- ✅ **Banco de dados importado** (você já fez isso! ✅)

---

## 📋 Passo a Passo

### **1. Verificar Instalação do Node.js**

Abra o terminal (PowerShell, CMD ou Git Bash) e verifique se o Node.js está instalado:

```bash
node --version
npm --version
```

Se aparecer a versão (ex: `v18.17.0`), está tudo certo! ✅

---

### **2. Iniciar o MySQL no XAMPP**

1. Abra o **XAMPP Control Panel**
2. Clique em **Start** no módulo **MySQL**
3. Aguarde até aparecer a cor **verde** (MySQL está rodando)
4. Verifique se a porta está como **3306** (padrão)

> 💡 **Dica:** Se a porta 3306 estiver ocupada, você precisará alterar a porta no XAMPP ou liberar a porta.

---

### **3. Verificar o Banco de Dados**

1. Abra o **phpMyAdmin** (http://localhost/phpmyadmin)
2. Verifique se o banco `roadmap_db` existe
3. Confirme que as tabelas foram importadas corretamente

> ✅ Você já fez isso! O banco está pronto.

---

### **4. Navegar até a Pasta do Projeto**

Abra o terminal e navegue até a pasta do projeto:

```bash
cd "C:\Users\Ton\Desktop\Nova pasta (3)\roadmap local"
```

Ou use o caminho completo do seu projeto.

---

### **5. Instalar as Dependências do Projeto**

Execute o comando para instalar todas as dependências:

```bash
npm install
```

> ⏳ Isso pode levar alguns minutos. Aguarde a conclusão.

**O que está sendo instalado:**
- NestJS e todas as dependências do backend
- Prisma ORM
- TypeScript e ferramentas de build
- Todas as bibliotecas necessárias

---

### **6. Criar Arquivo de Configuração (.env)**

Crie um arquivo chamado `.env` na **raiz do projeto** (mesma pasta onde está o `package.json`).

**Conteúdo do arquivo `.env`:**

```env
# Configuração do Banco de Dados MySQL (XAMPP)
DATABASE_URL="mysql://root:@localhost:3306/roadmap_db"

# Porta da Aplicação
PORT=3003

# Configuração de Segurança JWT
JWT_SECRET=seu-secret-key-super-seguro-aqui-123456789
JWT_EXPIRES_IN=7d

# Ambiente
NODE_ENV=development
```

> ⚠️ **IMPORTANTE:**
> - Se o MySQL do XAMPP tiver senha, use: `mysql://root:SUA_SENHA@localhost:3306/roadmap_db`
> - Se a porta for diferente de 3306, ajuste no DATABASE_URL
> - O `JWT_SECRET` pode ser qualquer string longa e aleatória

**Como criar o arquivo `.env`:**
- No Windows: Crie um novo arquivo de texto e renomeie para `.env` (sem extensão)
- Ou use o comando no terminal:
  ```bash
  echo DATABASE_URL="mysql://root:@localhost:3306/roadmap_db" > .env
  echo PORT=3003 >> .env
  echo JWT_SECRET=seu-secret-key-super-seguro-aqui-123456789 >> .env
  echo JWT_EXPIRES_IN=7d >> .env
  echo NODE_ENV=development >> .env
  ```

---

### **7. Gerar o Cliente Prisma**

O Prisma precisa gerar o cliente para se conectar ao banco:

```bash
npx prisma generate
```

> ✅ Isso cria os tipos TypeScript baseados no seu schema do Prisma.

---

### **8. Verificar Conexão com o Banco**

Execute o comando para verificar se a conexão está funcionando:

```bash
npx prisma db pull
```

Ou abra o Prisma Studio para visualizar os dados:

```bash
npx prisma studio
```

> 🌐 O Prisma Studio abrirá em: http://localhost:5555

---

### **9. (Opcional) Executar Seed - Popular Dados**

Se você quiser popular o banco com dados de exemplo (níveis, tópicos, usuário de teste):

```bash
npm run seed
```

> ⚠️ **Atenção:** Se você já importou o `roadmap_db.sql`, pode pular este passo, pois o banco já está populado.

**Usuário de teste criado pelo seed:**
- **Email:** `dev@roadmap.com`
- **Senha:** `123456`

---

### **10. Iniciar a Aplicação**

Agora é só iniciar o servidor em modo desenvolvimento:

```bash
npm run start:dev
```

> ✅ Você verá mensagens como:
> ```
> 🚀 Application is running on: http://localhost:3003
> 📚 Swagger documentation: http://localhost:3003/api/docs
> ```

---

### **11. Acessar a Aplicação**

Abra seu navegador e acesse:

- **Frontend (Aplicação):** http://localhost:3003
- **API Swagger (Documentação):** http://localhost:3003/api/docs
- **Health Check:** http://localhost:3003/api/v1/health/check

---

## 🎯 Testando a Aplicação

### **1. Fazer Login**

1. Acesse http://localhost:3003
2. Se você executou o seed, use:
   - **Email:** `dev@roadmap.com`
   - **Senha:** `123456`
3. Ou crie uma nova conta clicando em "Criar conta"

### **2. Explorar o Dashboard**

Após o login, você verá:
- Dashboard com estatísticas
- Timeline de níveis
- Progresso do usuário
- Badges e conquistas

### **3. Testar a API**

Acesse a documentação Swagger:
- http://localhost:3003/api/docs

Lá você pode testar todos os endpoints da API.

---

## 🔧 Solução de Problemas Comuns

### **Erro: "Cannot connect to database"**

**Solução:**
1. Verifique se o MySQL está rodando no XAMPP
2. Verifique se a porta 3306 está correta
3. Verifique o `DATABASE_URL` no arquivo `.env`
4. Teste a conexão no phpMyAdmin

### **Erro: "Port 3003 already in use"**

**Solução:**
1. Altere a porta no arquivo `.env`:
   ```env
   PORT=3004
   ```
2. Ou feche o processo que está usando a porta 3003

### **Erro: "Prisma Client not generated"**

**Solução:**
```bash
npx prisma generate
```

### **Erro: "Module not found"**

**Solução:**
```bash
npm install
```

### **Erro: "Database schema is not in sync"**

**Solução:**
Como você já importou o SQL, apenas gere o cliente:
```bash
npx prisma generate
```

Não execute `prisma migrate dev` se já importou o SQL manualmente.

---

## 📝 Comandos Úteis

### **Desenvolvimento**
```bash
# Iniciar em modo desenvolvimento (com hot-reload)
npm run start:dev

# Iniciar em modo produção
npm run start:prod

# Build do projeto
npm run build
```

### **Banco de Dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Ver schema do banco
npx prisma db pull
```

### **Utilitários**
```bash
# Popular banco com dados
npm run seed

# Executar testes
npm test

# Formatar código
npm run format

# Verificar código
npm run lint
```

---

## 🎉 Pronto!

Seu projeto está rodando! 🚀

### **Resumo do que foi feito:**

1. ✅ Node.js instalado e verificado
2. ✅ MySQL do XAMPP iniciado
3. ✅ Banco de dados importado (você já fez)
4. ✅ Dependências instaladas (`npm install`)
5. ✅ Arquivo `.env` criado e configurado
6. ✅ Cliente Prisma gerado (`npx prisma generate`)
7. ✅ Aplicação iniciada (`npm run start:dev`)
8. ✅ Acessando em http://localhost:3003

---

## 📚 Próximos Passos

- Explore o dashboard da aplicação
- Teste os endpoints na documentação Swagger
- Crie novos usuários
- Complete tópicos e ganhe XP
- Explore o sistema de badges e conquistas

---

## 💡 Dicas

1. **Mantenha o XAMPP rodando** enquanto usar a aplicação
2. **Não feche o terminal** onde o servidor está rodando
3. **Use o Prisma Studio** para visualizar dados do banco facilmente
4. **Consulte a documentação Swagger** para entender a API
5. **Verifique os logs** no terminal para debug

---

**Boa sorte com o projeto! 🎯**

Se tiver algum problema, verifique a seção "Solução de Problemas" acima.

