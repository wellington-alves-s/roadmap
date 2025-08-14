# 🎯 Configuração Completa - EasyPanel Roadmap App

## 📋 Suas Informações do Banco de Dados
- **Usuário**: mysql
- **Senha**: 61ebffc6e00b52add90f
- **Nome do Banco**: roadmap_db
- **Host Interno**: app_database_roadmap
- **Porta**: 3306

---

## 🔧 Variáveis de Ambiente para o EasyPanel

### Cole EXATAMENTE estas configurações no seu serviço de aplicação:

#### **1. DATABASE_URL**
```
Nome: DATABASE_URL
Valor: mysql://mysql:61ebffc6e00b52add90f@app_database_roadmap:3306/roadmap_db
```

#### **2. JWT_SECRET**
```
Nome: JWT_SECRET
Valor: roadmap-jwt-secret-2024-super-seguro-61ebffc6e00b52add90f-xyz789
```

#### **3. NODE_ENV**
```
Nome: NODE_ENV
Valor: production
```

#### **4. PORT**
```
Nome: PORT
Valor: 3000
```

---

## 📋 Formato de Cópia Rápida

Para facilitar, aqui estão as variáveis no formato chave=valor:

```env
DATABASE_URL=mysql://mysql:61ebffc6e00b52add90f@app_database_roadmap:3306/roadmap_db
JWT_SECRET=roadmap-jwt-secret-2024-super-seguro-61ebffc6e00b52add90f-xyz789
NODE_ENV=production
PORT=3000
```

---

## ✅ Passo a Passo no EasyPanel

### 1. **Acesse seu serviço de aplicação**
   - Vá para "Services" no EasyPanel
   - Clique no serviço da aplicação Roadmap (NÃO no MySQL)

### 2. **Configure as variáveis de ambiente**
   - Procure pela aba "Environment" ou "Environment Variables"
   - Adicione uma por uma:

   ```
   ┌─────────────────┬──────────────────────────────────────────────────────────┐
   │ Key             │ Value                                                    │
   ├─────────────────┼──────────────────────────────────────────────────────────┤
   │ DATABASE_URL    │ mysql://mysql:61ebffc6e00b52add90f@app_database_roadmap… │
   │ JWT_SECRET      │ roadmap-jwt-secret-2024-super-seguro-61ebffc6e00b52add…  │
   │ NODE_ENV        │ production                                               │
   │ PORT            │ 3000                                                     │
   └─────────────────┴──────────────────────────────────────────────────────────┘
   ```

### 3. **Salvar e Reiniciar**
   - Clique em "Save" ou "Salvar"
   - Reinicie o serviço da aplicação
   - Aguarde alguns minutos para o deploy

---

## 🔍 Verificação da Configuração

### **Teste 1: Health Check**
Após o deploy, acesse:
```
https://seu-app.easypanel.host/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-08-14T...",
  "service": "roadmap-app"
}
```

### **Teste 2: Swagger Documentation**
```
https://seu-app.easypanel.host/api/docs
```

### **Teste 3: API Endpoints**
```
https://seu-app.easypanel.host/api/levels
https://seu-app.easypanel.host/api/topics
```

---

## 🗄️ Verificação do Banco de Dados

### **Via phpMyAdmin:**
- **URL**: Seu phpMyAdmin no EasyPanel
- **Usuário**: mysql
- **Senha**: 61ebffc6e00b52add90f
- **Banco**: roadmap_db

### **Verificar se existem as tabelas:**
- users
- levels
- topics
- progress
- achievements
- badges
- notifications

---

## 🚨 Troubleshooting

### **Se der erro "Cannot connect to database":**
1. Verifique se o serviço MySQL está rodando
2. Confirme se o nome do host é exatamente `app_database_roadmap`
3. Teste a conexão via phpMyAdmin

### **Se der erro "Module not found":**
1. Aguarde o build completar (pode levar alguns minutos)
2. Verifique os logs do serviço no EasyPanel
3. Reinicie o serviço se necessário

### **Se der erro 404 nos endpoints:**
1. Verifique se a aplicação subiu corretamente
2. Confirme se está acessando `/api/` antes dos endpoints
3. Aguarde alguns minutos após o deploy

---

## 📊 Logs para Monitorar

No EasyPanel, verifique os logs da aplicação. Você deve ver:

```
[NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api/docs
```

---

## 🎯 Resumo da Configuração

✅ **DATABASE_URL** configurada com suas credenciais reais  
✅ **JWT_SECRET** gerado com base na sua senha para ser único  
✅ **NODE_ENV** definido como production  
✅ **PORT** configurado para 3000  
✅ **Host do banco** usando o nome interno correto: `app_database_roadmap`  

**Está tudo pronto para o deploy! 🚀**
