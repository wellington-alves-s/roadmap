# 🔧 Guia de Correção: Problema de Conexão com Banco de Dados no EasyPanel

> **Documentação oficial para resolver erros de conexão MySQL no deploy EasyPanel**

## 📋 **Descrição do Problema**

### **Erro Encontrado**
```
PrismaClientInitializationError: Can't reach database server at `localhost:3306`

Please make sure your database server is running at `localhost:3306`.
```

### **Causa Raiz**
O erro ocorre quando a aplicação tenta se conectar ao banco de dados usando `localhost:3306`, mas no ambiente Docker do EasyPanel, os serviços rodam em containers separados e se comunicam através dos **nomes dos serviços**, não por `localhost`.

### **Contexto**
- ✅ Projeto funcionava perfeitamente antes
- ❌ Após formatação e novo deploy, erro de conexão
- 🐳 Problema específico de ambiente containerizado (Docker)

## 🎯 **Solução Definitiva**

### **🔴 Configuração Incorreta**
```bash
DATABASE_URL=mysql://mysql:21962bc3215df991a82a@localhost:3306/roadmap_db
#                                           ^^^^^^^^^ 
#                                           PROBLEMA AQUI
```

### **🟢 Configuração Correta**
```bash
DATABASE_URL=mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
#                                                ^^^^^^^^^^^^^^^^^^ 
#                                                HOSTNAME CORRETO
```

## 📊 **Configurações do Ambiente EasyPanel**

### **Serviço MySQL Database**
```
Usuário: mysql
Senha: 6b5d1cccdf5c7805c506
Nome do Banco: roadmap_db
Senha Root: 6c98c24b7890943d47f9
Nome do Serviço: app_database_roadmap
Porta Interna: 3306
```

### **Serviço PHPMyAdmin**
```
PMA_ARBITRARY=1
PMA_HOST=app_database_roadmap
PMA_PORT=3306
PMA_USER=mysql
PMA_PASSWORD=6b5d1cccdf5c7805c506

Protocolo: TCP
Publicado: 8080
Alvo: 80
```

### **Serviço Aplicação - Environment Variables**
```bash
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
JWT_SECRET=Ue9vN#p$3@rGz^XqW8mT!cDfL1bKsZjV
JWT_EXPIRES_IN=7d
```

## 🔍 **Anatomia da DATABASE_URL**

### **Estrutura Padrão**
```
mysql://[usuário]:[senha]@[hostname]:[porta]/[banco_de_dados]
```

### **Explicação dos Componentes**
```bash
mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
│       │     │                    │                   │    │
│       │     │                    │                   │    └── Nome do banco
│       │     │                    │                   └─────── Porta MySQL
│       │     │                    └─────────────────────────── Hostname do container
│       │     └──────────────────────────────────────────────── Senha do usuário
│       └────────────────────────────────────────────────────── Usuário MySQL
└────────────────────────────────────────────────────────────── Protocolo
```

## 🚀 **Passo a Passo para Correção**

### **Passo 1: Acessar EasyPanel**
1. Faça login no EasyPanel
2. Navegue até o projeto **Roadmap App**
3. Clique no serviço **Aplicação**

### **Passo 2: Editar Environment Variables**
1. Vá para a aba **Environment**
2. Localize a variável `DATABASE_URL`
3. Substitua o valor atual por:
   ```bash
   DATABASE_URL=mysql://mysql:6b5d1cccdf5c7805c506@app_database_roadmap:3306/roadmap_db
   ```

### **Passo 3: Salvar e Redeploy**
1. Clique em **Save** para salvar as alterações
2. Clique em **Deploy** ou **Rebuild** para reiniciar o serviço
3. Aguarde o processo de build completar (3-5 minutos)

### **Passo 4: Verificar Logs**
1. Vá para a aba **Logs** do serviço Aplicação
2. Procure pela mensagem de sucesso:
   ```
   🚀 Application is running on: http://localhost:3003
   📚 Swagger documentation: http://localhost:3003/api/docs
   ```

## ⚠️ **Problemas Comuns e Soluções**

### **Problema 1: Senha Incorreta**
```
Access denied for user 'mysql'@'%' (using password: YES)
```
**Solução:** Verifique se a senha na DATABASE_URL corresponde exatamente à senha configurada no serviço MySQL.

### **Problema 2: Banco de Dados Não Existe**
```
Unknown database 'roadmap_db'
```
**Solução:** 
1. Acesse o PHPMyAdmin
2. Crie o banco `roadmap_db`
3. Execute as migrações: `npx prisma migrate deploy`

### **Problema 3: Hostname Incorreto**
```
getaddrinfo ENOTFOUND localhost
```
**Solução:** Certifique-se de usar `app_database_roadmap` em vez de `localhost`.

## 🔧 **Comandos Úteis para Debug**

### **Testar Conexão com Banco**
```bash
# No container da aplicação
npx prisma db pull
```

### **Verificar Status do Prisma**
```bash
npx prisma generate
npx prisma migrate status
```

### **Reset Completo (se necessário)**
```bash
npx prisma migrate reset --force
npx prisma db seed
```

## 📋 **Checklist de Verificação**

### **Antes do Deploy**
- [ ] DATABASE_URL usa `app_database_roadmap` como hostname
- [ ] Senha na DATABASE_URL corresponde à senha do MySQL
- [ ] Nome do banco está correto (`roadmap_db`)
- [ ] Porta está configurada como `3306`
- [ ] Todas as environment variables estão definidas

### **Após o Deploy**
- [ ] Logs mostram conexão bem-sucedida
- [ ] Aplicação inicia sem erros
- [ ] Endpoint de health check responde
- [ ] Frontend carrega corretamente
- [ ] Login funciona normalmente

## 🛡️ **Boas Práticas de Segurança**

### **Senhas e Secrets**
- ✅ Use senhas fortes e únicas
- ✅ Mantenha JWT_SECRET seguro e complexo
- ✅ Nunca exponha credenciais em logs
- ✅ Rotacione senhas periodicamente

### **Configuração de Rede**
- ✅ Use hostnames internos entre containers
- ✅ Configure CORS adequadamente
- ✅ Limite acesso externo apenas ao necessário

## 📚 **Documentação Relacionada**

### **Links Úteis**
- [EASYPANEL_DEPLOY.md](./EASYPANEL_DEPLOY.md) - Guia completo de deploy
- [EASYPANEL_CONFIG.md](./EASYPANEL_CONFIG.md) - Configuração rápida
- [SETUP.md](./SETUP.md) - Configuração de desenvolvimento

### **Arquivos de Configuração**
- `deploy.config.env` - Template de variáveis de ambiente
- `Dockerfile` - Configuração de container
- `prisma/schema.prisma` - Schema do banco de dados

## 🆘 **Suporte e Troubleshooting**

### **Se o Problema Persistir**
1. **Verifique os logs** de todos os serviços (MySQL, PHPMyAdmin, Aplicação)
2. **Teste a conectividade** usando PHPMyAdmin
3. **Confirme as credenciais** no painel do EasyPanel
4. **Recrie os serviços** se necessário (último recurso)

### **Contatos de Suporte**
- Documentação EasyPanel: [https://easypanel.io/docs](https://easypanel.io/docs)
- Prisma Troubleshooting: [https://www.prisma.io/docs/guides/troubleshooting](https://www.prisma.io/docs/guides/troubleshooting)

## ✅ **Conclusão**

Este problema é **comum** em ambientes containerizados e tem uma **solução simples**: usar o hostname correto do container MySQL (`app_database_roadmap`) em vez de `localhost` na DATABASE_URL.

Após aplicar esta correção, o **Roadmap App** deve funcionar perfeitamente no EasyPanel, como funcionava anteriormente.

---

**📅 Criado em:** Janeiro 2025  
**🔧 Status:** Solução Validada  
**📋 Categoria:** Deploy & Infraestrutura  
**🎯 Público:** Desenvolvedores e DevOps
