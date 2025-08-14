# 🔧 Configuração de Variáveis de Ambiente no EasyPanel

## 📍 Onde Configurar

No EasyPanel, as variáveis de ambiente são configuradas na seção **"Environment"** do seu serviço de aplicação.

### Passo a Passo:

1. **Acesse seu serviço de aplicação** no EasyPanel
2. Vá para a aba **"Environment"** ou **"Variáveis de Ambiente"**
3. Adicione cada variável uma por vez

## 🔑 Variáveis Obrigatórias

### 1. DATABASE_URL
```
Nome: DATABASE_URL
Valor: mysql://roadmap_user:SUA_SENHA_MYSQL@database_roadmap:3306/roadmap_db
```

**⚠️ IMPORTANTE**: 
- Substitua `SUA_SENHA_MYSQL` pela senha que você definiu no seu serviço MySQL
- Se o nome do seu serviço MySQL for diferente de `database_roadmap`, use o nome correto
- O formato é: `mysql://usuario:senha@nome_do_servico_mysql:3306/nome_do_banco`

### 2. JWT_SECRET
```
Nome: JWT_SECRET
Valor: minha-chave-jwt-super-secreta-e-muito-longa-para-producao-123456789
```

**⚠️ IMPORTANTE**: 
- Esta chave deve ser ÚNICA e MUITO SEGURA
- Use pelo menos 32 caracteres
- Misture letras, números e símbolos
- NUNCA compartilhe esta chave

### 3. NODE_ENV
```
Nome: NODE_ENV
Valor: production
```

### 4. PORT
```
Nome: PORT
Valor: 3000
```

## 🔗 Como Descobrir o Nome do Serviço MySQL

1. No EasyPanel, vá para **"Services"** (Serviços)
2. Encontre seu serviço MySQL
3. O **nome do serviço** aparece na lista (ex: `database_roadmap`, `mysql-service`, etc.)
4. Use este nome exato na DATABASE_URL

## 📋 Exemplo Completo de Configuração

Se o seu serviço MySQL se chama `database_roadmap` e a senha é `minhasenha123`:

```
DATABASE_URL = mysql://roadmap_user:minhasenha123@database_roadmap:3306/roadmap_db
JWT_SECRET = minha-super-chave-secreta-jwt-2024-roadmap-app-xyz789
NODE_ENV = production
PORT = 3000
```

## 🎯 Formato Visual no EasyPanel

```
┌─────────────────────────────────────────────────────────────────┐
│ Environment Variables                                           │
├─────────────────────────────────────────────────────────────────┤
│ Key: DATABASE_URL                                               │
│ Value: mysql://roadmap_user:senha@database_roadmap:3306/...     │
├─────────────────────────────────────────────────────────────────┤
│ Key: JWT_SECRET                                                 │
│ Value: minha-chave-jwt-super-secreta...                         │
├─────────────────────────────────────────────────────────────────┤
│ Key: NODE_ENV                                                   │
│ Value: production                                               │
├─────────────────────────────────────────────────────────────────┤
│ Key: PORT                                                       │
│ Value: 3000                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔍 Verificando a Configuração do MySQL

### Opção 1: Pelo phpMyAdmin
1. Acesse seu phpMyAdmin no EasyPanel
2. Faça login com as credenciais do MySQL
3. Verifique se o banco `roadmap_db` existe
4. Confirme se o usuário `roadmap_user` tem acesso

### Opção 2: Verificar no Serviço MySQL
1. Vá para o serviço MySQL no EasyPanel
2. Verifique as variáveis de ambiente configuradas:
   - `MYSQL_DATABASE` deve ser `roadmap_db`
   - `MYSQL_USER` deve ser `roadmap_user`
   - `MYSQL_PASSWORD` é a senha que você deve usar

## 🚨 Troubleshooting

### Erro: "Connection refused" ou "Host not found"
- Verifique se o nome do serviço MySQL está correto na DATABASE_URL
- Confirme se o serviço MySQL está rodando

### Erro: "Access denied for user"
- Verifique se a senha está correta
- Confirme se o usuário `roadmap_user` existe no MySQL

### Erro: "Unknown database"
- Verifique se o banco `roadmap_db` foi criado
- Confirme se você importou o backup corretamente

## ✅ Teste Final

Após configurar as variáveis:

1. **Salve a configuração** no EasyPanel
2. **Restart o serviço** da aplicação
3. **Acesse os logs** para verificar se não há erros
4. **Teste o health check**: `https://seu-app.easypanel.host/api/health`

### Resposta esperada do health check:
```json
{
  "status": "ok",
  "timestamp": "2024-08-14T05:00:00.000Z",
  "service": "roadmap-app"
}
```

## 🔐 Segurança

### Boas Práticas:
- ✅ Sempre use senhas fortes
- ✅ Mantenha o JWT_SECRET seguro
- ✅ Não compartilhe as variáveis de ambiente
- ✅ Use HTTPS em produção

### Nunca faça:
- ❌ Não coloque senhas no código
- ❌ Não use senhas padrão como "123456"
- ❌ Não compartilhe o JWT_SECRET publicamente

## 📞 Em caso de problemas

Se ainda assim não funcionar:
1. Verifique os **logs da aplicação** no EasyPanel
2. Verifique os **logs do MySQL**
3. Teste a **conexão do banco** via phpMyAdmin
4. Confirme se todas as **variáveis estão salvas** corretamente
