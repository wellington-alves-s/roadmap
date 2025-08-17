# 🚀 Roadmap App - Setup e Configuração

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MySQL (XAMPP ou servidor MySQL)
- npm ou yarn

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do Banco de Dados
DATABASE_URL="mysql://root:@localhost:3306/roadmap_db"

# Configuração da Aplicação
PORT=3000

# Configuração de Segurança
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### 3. Configurar Banco de Dados MySQL

1. Abra o XAMPP e inicie o MySQL
2. Acesse o phpMyAdmin (http://localhost/phpmyadmin)
3. Crie um banco de dados chamado `roadmap_db`

### 4. Executar Migrações do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Visualizar dados no Prisma Studio
npx prisma studio
```

### 5. Popular o Banco com Dados de Exemplo

```bash
# Executar seed via script
npm run seed

# OU via API (após iniciar a aplicação)
curl -X POST http://localhost:3000/api/seed
```

### 6. Iniciar a Aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run start:prod
```

## 🎮 Funcionalidades Implementadas

### Usuários

- ✅ Criação de usuários com senha criptografada
- ✅ Listagem de usuários
- ✅ Busca de usuário por ID
- ✅ Remoção de usuários

### Níveis

- ✅ Criação de níveis com XP necessário
- ✅ Listagem de níveis ordenados por XP
- ✅ Atualização de níveis
- ✅ Remoção de níveis

### Tópicos

- ✅ Criação de tópicos com XP e nível
- ✅ Listagem de tópicos por nível
- ✅ Atualização de tópicos
- ✅ Remoção de tópicos

### Progresso e Gamificação

- ✅ Marcar tópicos como concluídos
- ✅ Sistema de XP por tópico
- ✅ Cálculo de nível atual e próximo nível
- ✅ Estatísticas de progresso do usuário
- ✅ Progresso percentual para próximo nível

## 📡 Endpoints da API

### Usuários

- `POST /api/users` - Criar usuário
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `DELETE /api/users/:id` - Remover usuário

### Níveis

- `POST /api/levels` - Criar nível
- `GET /api/levels` - Listar níveis
- `GET /api/levels/:id` - Buscar nível
- `PATCH /api/levels/:id` - Atualizar nível
- `DELETE /api/levels/:id` - Remover nível

### Tópicos

- `POST /api/topics` - Criar tópico
- `GET /api/topics` - Listar tópicos
- `GET /api/topics/level/:levelId` - Listar tópicos por nível
- `GET /api/topics/:id` - Buscar tópico
- `PATCH /api/topics/:id` - Atualizar tópico
- `DELETE /api/topics/:id` - Remover tópico

### Progresso

- `POST /api/progress` - Criar progresso
- `GET /api/progress` - Listar progresso
- `GET /api/progress/user/:userId` - Progresso do usuário
- `GET /api/progress/user/:userId/stats` - Estatísticas do usuário
- `POST /api/progress/complete/:userId/:topicId` - Marcar tópico como concluído
- `PATCH /api/progress/:id` - Atualizar progresso
- `DELETE /api/progress/:id` - Remover progresso

### Seed

- `POST /api/seed` - Popular banco com dados de exemplo

## 🎯 Exemplo de Uso

### 1. Criar um usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "123456"
  }'
```

### 2. Criar um nível

```bash
curl -X POST http://localhost:3000/api/levels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nível 1 - Fundamentos",
    "xpNeeded": 100
  }'
```

### 3. Criar um tópico

```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Internet - Como funciona",
    "xp": 50,
    "levelId": 1
  }'
```

### 4. Marcar tópico como concluído

```bash
curl -X POST http://localhost:3000/api/progress/complete/1/1
```

### 5. Ver estatísticas do usuário

```bash
curl http://localhost:3000/api/progress/user/1/stats
```

### 6. Executar seed

```bash
curl -X POST http://localhost:3000/api/seed
```

## 📊 Dados de Exemplo (Seed)

Após executar o seed, você terá:

### Usuário de Exemplo

- **Email**: dev@roadmap.com
- **Senha**: 123456

### Níveis Criados

1. **Nível 1 - Fundamentos** (100 XP)
2. **Nível 2 - HTML & CSS** (250 XP)
3. **Nível 3 - JavaScript** (450 XP)
4. **Nível 4 - Backend** (700 XP)
5. **Nível 5 - Frameworks** (1000 XP)
6. **Nível 6 - DevOps** (1300 XP)
7. **Nível 7 - Especialização** (1600 XP)

### Tópicos de Exemplo

- **Nível 1**: Internet, HTTP/HTTPS
- **Nível 2**: HTML, CSS, Flexbox, Grid, Responsive Design
- **Nível 3**: JavaScript, DOM, ES6+, Async, Modules, Error Handling
- **Nível 4**: Node.js, Express, APIs, Autenticação, Banco de Dados, ORM
- **Nível 5**: React, Vue, Angular, Next.js, Nuxt.js
- **Nível 6**: Git, Linux, Docker, CI/CD, Cloud Platforms
- **Nível 7**: TypeScript, Testing, Performance, Security, Architecture

## 🎮 Sistema de Gamificação

### Como Funciona

1. **XP por Tópico**: Cada tópico tem um valor de XP específico
2. **Progresso por Nível**: XP total determina o nível atual
3. **Conquistas**: Marcar tópicos como concluídos ganha XP
4. **Evolução**: Níveis mais altos exigem mais XP

### Exemplo de Progresso

- **Nível 1**: 0-100 XP (Fundamentos)
- **Nível 2**: 101-250 XP (HTML & CSS)
- **Nível 3**: 251-450 XP (JavaScript)
- E assim por diante...

## 🔮 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Criar interface web (Frontend)
- [ ] Adicionar notificações de conquistas
- [ ] Implementar sistema de badges
- [ ] Adicionar histórico de atividades
- [ ] Criar dashboard administrativo

## 🛠️ Tecnologias Utilizadas

- **Backend**: NestJS (Node.js)
- **Banco de Dados**: MySQL com Prisma ORM
- **Validação**: class-validator
- **Criptografia**: bcrypt
- **Linguagem**: TypeScript

## 📞 Suporte

Para dúvidas ou problemas, verifique:

1. Se o MySQL está rodando
2. Se as variáveis de ambiente estão configuradas
3. Se as migrações foram executadas
4. Se todas as dependências foram instaladas
5. Se o seed foi executado com sucesso

## 🚀 Deploy

### Para Easypanel + Cloudflare Tunnel

1. Configure o banco de dados MySQL no Easypanel
2. Atualize a DATABASE_URL no .env
3. Configure o Cloudflare Tunnel para acessar remotamente
4. Deploy da aplicação no Easypanel
