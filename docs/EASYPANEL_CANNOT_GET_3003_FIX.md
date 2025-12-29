# 🔧 Correção: Erro "Cannot GET /3003" no EasyPanel

> **Solução para o erro: `NotFoundException: Cannot GET /3003`**

## 📋 **Problema Identificado**

A aplicação está rodando corretamente, mas ao acessar aparece o erro:
```
NotFoundException: Cannot GET /3003
```

### **Causa Raiz**

O erro ocorre quando alguém tenta acessar `http://dominio/3003` (com **barra** `/`) ao invés de `http://dominio:3003` (com **dois pontos** `:`).

Isso geralmente acontece por:
1. **Configuração de porta incorreta** no EasyPanel
2. **Configuração de domínio/proxy** com caminho errado
3. **Acesso via URL incorreta**

---

## ✅ **Solução 1: Corrigir Mapeamento de Porta (Recomendado)**

### **Passo 1: Acessar Configuração de Portas**

1. No EasyPanel, vá para o serviço **Roadmap App**
2. Clique na aba **"Portas"** ou **"Ports"**

### **Passo 2: Verificar/Corrigir Mapeamento**

Verifique se a configuração está assim:

```
Protocolo: tcp
Publicado (Published): 3003
Alvo (Target): 3003  ← DEVE SER 3003, NÃO 80
```

**Se estiver diferente:**
1. Clique em **"Editar"** na porta existente
2. Altere **"Alvo (Target)"** para `3003`
3. Clique em **"Salvar"**

### **Passo 3: Reiniciar Serviço**

1. Clique em **"Restart"** ou **"Reiniciar"**
2. Aguarde alguns segundos

### **Passo 4: Acessar Corretamente**

Após corrigir, acesse usando **dois pontos** (`:`) e não barra (`/`):

- ✅ **CORRETO**: `http://localhost:3003`
- ✅ **CORRETO**: `http://seu-dominio:3003`
- ❌ **ERRADO**: `http://localhost/3003`
- ❌ **ERRADO**: `http://seu-dominio/3003`

---

## ✅ **Solução 2: Configurar Domínio/Proxy Corretamente**

Se você está usando a aba **"Domínios"** ou **"Domains"**:

### **Passo 1: Acessar Configuração de Domínio**

1. No EasyPanel, vá para o serviço **Roadmap App**
2. Clique na aba **"Domínios"** ou **"Domains"**

### **Passo 2: Verificar/Corrigir Configuração**

A configuração deve estar assim:

```
HTTPS: Desligado (ou Ligado, se tiver SSL)
Host: localhost (ou seu domínio)
Caminho: /  ← DEVE SER /, NÃO /3003

Destino:
Protocolo: HTTP
Porta: 3003  ← Porta que a aplicação está escutando
Caminho: /
```

**⚠️ IMPORTANTE:**
- O **Caminho** deve ser `/` (raiz), **NÃO** `/3003`
- A **Porta** deve ser `3003` (porta que a aplicação está escutando)

### **Passo 3: Remover Configuração de Domínio (Se Não Precisar)**

Se você não precisa de domínio personalizado, **remova** a configuração de domínio e use apenas o mapeamento de porta direto (Solução 1).

---

## ✅ **Solução 3: Usar Porta 80 no Container (Alternativa)**

Se preferir manter o mapeamento `3003 → 80`:

### **Passo 1: Alterar Variável PORT**

1. No EasyPanel, vá para **"Environment"** ou **"Ambiente"**
2. Edite a variável `PORT`
3. Altere o valor de `3003` para `80`
4. Salve

### **Passo 2: Atualizar Mapeamento de Porta**

1. Vá para **"Portas"**
2. Edite a porta
3. Configure:
   - **Publicado**: `3003`
   - **Alvo**: `80`
4. Salve

### **Passo 3: Reiniciar**

1. Clique em **"Restart"** ou **"Reiniciar"**

---

## 🔍 **Verificação**

Após aplicar uma das soluções:

### **1. Verifique os Logs**

Os logs devem mostrar:
```
🚀 Application is running on: http://localhost:3003
📚 Swagger documentation: http://localhost:3003/api/docs
```

### **2. Teste o Acesso**

Use estas URLs (com **dois pontos** `:`):

- ✅ `http://localhost:3003` - Frontend
- ✅ `http://localhost:3003/api` - API
- ✅ `http://localhost:3003/api/docs` - Swagger
- ✅ `http://localhost:3003/api/v1/health/check` - Health Check

### **3. URLs que NÃO Funcionam**

Estas URLs **NÃO** funcionam (causam o erro `Cannot GET /3003`):

- ❌ `http://localhost/3003`
- ❌ `http://seu-dominio/3003`
- ❌ `http://localhost:3003/3003`

---

## 📊 **Resumo das Configurações**

### **Opção A: Porta Direta (Solução 1 - Recomendada)**

```
Variável PORT: 3003
Mapeamento: 3003 (host) → 3003 (container)
Acesso: http://localhost:3003
```

### **Opção B: Porta 80 no Container (Solução 3)**

```
Variável PORT: 80
Mapeamento: 3003 (host) → 80 (container)
Acesso: http://localhost:3003
```

### **Opção C: Domínio/Proxy (Solução 2)**

```
Variável PORT: 3003
Proxy: localhost → porta 3003, caminho /
Acesso: http://localhost (ou http://localhost:3003)
```

---

## ⚠️ **Problemas Comuns**

### **Erro: "Cannot GET /3003"**

**Causa**: Acessando com barra `/3003` ao invés de dois pontos `:3003`

**Solução**: 
- Use `http://localhost:3003` (com dois pontos)
- Verifique configuração de domínio (caminho deve ser `/`, não `/3003`)

### **Erro: "Connection reset"**

**Causa**: Mapeamento de porta incorreto

**Solução**: Use Solução 1 ou 3

### **Erro: "404 Not Found" em todas as rotas**

**Causa**: Caminho do domínio incorreto

**Solução**: 
- Use `/` como caminho no domínio, não `/3003`
- Ou remova a configuração de domínio e use apenas porta direta

---

## 🎯 **Recomendação Final**

Para resolver o erro `Cannot GET /3003`:

1. **Use a Solução 1** (mais simples e direta)
2. **Acesse usando dois pontos**: `http://localhost:3003`
3. **NÃO use barra**: `http://localhost/3003` ❌

---

**📅 Criado em:** Dezembro 2025  
**🔧 Status:** Solução Validada  
**📋 Categoria:** Deploy & Configuração  
**🎯 Público:** Desenvolvedores e DevOps

