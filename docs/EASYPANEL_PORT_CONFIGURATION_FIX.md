# 🔧 Correção: Problema de Acesso via localhost:3001

> **Guia para resolver problema de acesso após deploy bem-sucedido**

## 📋 **Problema Identificado**

A aplicação está rodando com sucesso, mas não é possível acessar via `localhost:3001`.

### **Causa Raiz**
Há uma **inconsistência entre a porta da aplicação e o mapeamento de portas no EasyPanel**:

1. **Aplicação está rodando na porta 3001** (por causa da variável `PORT=3001`)
2. **Mapeamento de porta está incorreto**: `3001 (host) → 80 (container)`
3. **A aplicação não está escutando na porta 80**, está escutando na porta 3001

## ✅ **Solução 1: Corrigir Mapeamento de Porta (Recomendado)**

### **Passo 1: Acessar Configuração de Portas**
1. No EasyPanel, vá para o serviço **roadmap**
2. Clique na aba **"Portas"** ou **"Ports"**

### **Passo 2: Editar Mapeamento de Porta**
1. Clique em **"Editar"** na porta existente
2. Altere a configuração:
   - **Publicado (Published)**: `3001`
   - **Alvo (Target)**: `3001` ⚠️ **MUDAR DE 80 PARA 3001**
3. Clique em **"Salvar"**

### **Configuração Correta:**
```
Protocolo: tcp
Publicado: 3001
Alvo: 3001  ← DEVE SER 3001, NÃO 80
```

### **Passo 3: Reiniciar Serviço**
1. Clique em **"Implantar"** ou **"Rebuild"**
2. Aguarde o restart completar

## ✅ **Solução 2: Usar Porta 80 no Container (Alternativa)**

Se preferir manter o mapeamento `3001 → 80`, altere a variável de ambiente:

### **Passo 1: Alterar Variável PORT**
1. No EasyPanel, vá para **"Ambiente"** ou **"Environment"**
2. Edite a variável `PORT`
3. Altere o valor de `3001` para `80`
4. Salve

### **Configuração:**
```
PORT=80
```

### **Passo 2: Atualizar Mapeamento de Porta**
1. Vá para **"Portas"**
2. Edite a porta
3. Configure:
   - **Publicado**: `3001`
   - **Alvo**: `80`
4. Salve

### **Passo 3: Reiniciar**
1. Clique em **"Implantar"** ou **"Rebuild"**

## ✅ **Solução 3: Usar Configuração de Domínio (Recomendado para Produção)**

Para acesso mais confiável, use a aba **"Domínios"**:

### **Passo 1: Configurar Domínio**
1. Vá para a aba **"Domínios"** ou **"Domains"**
2. Clique em **"Adicionar Domínio"** ou **"Add Domain"**

### **Passo 2: Configurar Proxy**
1. **HTTPS**: Desligado (para desenvolvimento local)
2. **Host**: `localhost`
3. **Caminho**: `/` (raiz, não `/3001`)
4. **Protocolo**: `HTTP`
5. **Porta**: `3001` (porta que a aplicação está escutando)
6. **Caminho**: `/` (raiz)

### **Configuração Correta:**
```
HTTPS: Desligado
Host: localhost
Caminho: /  ← DEVE SER /, NÃO /3001

Destino:
Protocolo: HTTP
Porta: 3001  ← Porta que a aplicação está escutando
Caminho: /
```

### **Passo 3: Acessar**
Após configurar, acesse:
- `http://localhost` (sem porta, se configurado corretamente)
- OU `http://localhost:3001` (se mantiver a porta)

## 🔍 **Verificação**

Após aplicar uma das soluções:

1. **Verifique os logs** - devem mostrar:
   ```
   🚀 Application is running on: http://localhost:3001
   ```

2. **Teste o acesso**:
   - `http://localhost:3001` - Frontend
   - `http://localhost:3001/api/health/check` - Health check
   - `http://localhost:3001/api/docs` - Swagger

3. **Se ainda não funcionar**, verifique:
   - Firewall não está bloqueando a porta 3001
   - Nenhum outro serviço está usando a porta 3001
   - O serviço está realmente rodando (verifique logs)

## 📊 **Resumo das Configurações**

### **Opção A: Porta Direta (Solução 1)**
```
Variável PORT: 3001
Mapeamento: 3001 (host) → 3001 (container)
Acesso: http://localhost:3001
```

### **Opção B: Porta 80 no Container (Solução 2)**
```
Variável PORT: 80
Mapeamento: 3001 (host) → 80 (container)
Acesso: http://localhost:3001
```

### **Opção C: Domínio/Proxy (Solução 3)**
```
Variável PORT: 3001
Proxy: localhost → porta 3001
Acesso: http://localhost (ou http://localhost:3001)
```

## ⚠️ **Problemas Comuns**

### **Erro: "Connection reset"**
- **Causa**: Mapeamento de porta incorreto
- **Solução**: Use Solução 1 ou 2

### **Erro: "Connection refused"**
- **Causa**: Aplicação não está escutando na porta correta
- **Solução**: Verifique variável PORT e mapeamento

### **Erro: "404 Not Found"**
- **Causa**: Caminho do domínio incorreto
- **Solução**: Use `/` como caminho, não `/3001`

## 🎯 **Recomendação Final**

Para desenvolvimento local, use a **Solução 1** (mais simples):
1. Variável `PORT=3001`
2. Mapeamento `3001 → 3001`
3. Acesso via `http://localhost:3001`

Para produção, use a **Solução 3** (mais profissional):
1. Configure domínio/domínio personalizado
2. Use proxy reverso
3. Configure SSL/HTTPS

---

**📅 Criado em:** Janeiro 2025  
**🔧 Status:** Solução Validada  
**📋 Categoria:** Deploy & Configuração  
**🎯 Público:** Desenvolvedores e DevOps

