# Guia de Deploy no EasyPanel - Roadmap App

## ⚠️ Problemas Identificados e Correções

### Problemas Corrigidos:
1. **Dockerfile inconsistente**: Corrigido uso misto de npm/yarn
2. **Endpoint de health check**: Adicionado `/api/health` além do `/health`
3. **Build dependencies**: Adicionadas ferramentas de build necessárias
4. **Configuração EasyPanel**: Simplificada para compatibilidade

## 📋 Pré-requisitos no EasyPanel

### 1. Serviço MySQL
- Nome: `database_roadmap`
- Versão: MySQL 8.0
- Database: `roadmap_db`
- Usuário: `roadmap_user`
- Senha: (defina uma senha segura)

### 2. Variáveis de Ambiente Necessárias
Configure estas variáveis no seu serviço EasyPanel:

```bash
DATABASE_URL=mysql://roadmap_user:SUA_SENHA@database_roadmap:3306/roadmap_db
JWT_SECRET=sua-chave-jwt-muito-segura-e-longa-aqui
NODE_ENV=production
PORT=3000
```

## 🚀 Passos para Deploy

### Opção 1: Upload de Arquivo ZIP

1. **Preparar o projeto**:
   - Certifique-se de que todos os arquivos foram corrigidos
   - Remova a pasta `node_modules` se existir
   - Crie um ZIP do projeto

2. **Configurar no EasyPanel**:
   - Vá para "Serviços" → "Novo Serviço"
   - Escolha "Upload"
   - Faça upload do arquivo ZIP
   - Configure as variáveis de ambiente acima

3. **Configurações importantes**:
   - Build Path: `./`
   - Dockerfile: `Dockerfile`
   - Port: `3000`
   - Health Check: `/api/health`

### Opção 2: Deploy via GitHub

1. **Configurar Repositório**:
   ```bash
   git add .
   git commit -m "Fix EasyPanel deploy configuration"
   git push origin main
   ```

2. **Configurar no EasyPanel**:
   - Conecte seu repositório GitHub
   - Branch: `main` (ou sua branch principal)
   - Build Path: `./`
   - Configure as variáveis de ambiente

## 🗄️ Configuração do Banco de Dados

### 1. Importar Schema
Execute estas queries no seu phpMyAdmin:

```sql
-- Primeiro, certifique-se de que está usando o database correto
USE roadmap_db;

-- Execute o script de migração do Prisma
-- (Use o conteúdo do arquivo prisma/migrations/migration.sql)
```

### 2. URL de Conexão
A URL do banco deve seguir este formato:
```
mysql://roadmap_user:SUA_SENHA@database_roadmap:3306/roadmap_db
```

**Importante**: Substitua `SUA_SENHA` pela senha que você definiu no MySQL.

## 🔍 Verificação do Deploy

### 1. Health Check
Após o deploy, teste:
- `https://seu-app.easypanel.host/health`
- `https://seu-app.easypanel.host/api/health`

### 2. Logs
Monitore os logs no EasyPanel para identificar possíveis erros.

### 3. Teste da API
Teste alguns endpoints:
- `GET /api/levels`
- `GET /api/topics`

## 🛠️ Troubleshooting

### Erro de Build
Se o build falhar:
1. Verifique se todas as dependências estão no `package.json`
2. Confirme que o Dockerfile está correto
3. Verifique os logs de build no EasyPanel

### Erro de Conexão com Database
1. Verifique a `DATABASE_URL`
2. Confirme que o serviço MySQL está rodando
3. Teste a conexão no phpMyAdmin

### Erro 502/503
1. Verifique se a aplicação está escutando na porta 3000
2. Confirme o health check
3. Verifique os logs da aplicação

## 📝 Checklist Final

- [ ] Serviço MySQL criado e configurado
- [ ] Database `roadmap_db` importado
- [ ] Variáveis de ambiente configuradas
- [ ] Aplicação deployada
- [ ] Health checks funcionando
- [ ] Endpoints da API respondendo

## 🔧 Comandos Úteis

### Para testar localmente com Docker:
```bash
docker build -t roadmap-app .
docker run -p 3000:3000 -e DATABASE_URL="sua_url_aqui" roadmap-app
```

### Para verificar health:
```bash
curl http://localhost:3000/api/health
```
