# ⚡ Configuração Rápida - EasyPanel

## 🔧 Variáveis de Ambiente para Copiar/Colar

**Cole EXATAMENTE estas variáveis no seu EasyPanel:**

```
PORT=3003
NODE_ENV=production
DATABASE_URL=mysql://mysql:61ebffc6e00b52add90f@app_database_roadmap:3306/roadmap_db
JWT_SECRET=1890dc921347d0c56f5bf2f80cd7106e7780de29ade14ca634d2bd30ec89f95b034027cf4cec69888c3de00dd80c9ecf1bcaeac2d98c686c686ae01a1d3ac82f
JWT_EXPIRES_IN=7d
```

## 📋 Checklist Rápido

- [ ] ✅ Serviço MySQL: `app_database_roadmap` rodando
- [ ] ✅ Banco `roadmap_db` criado e importado
- [ ] ✅ Repositório GitHub conectado
- [ ] ✅ Dockerfile detectado na raiz
- [ ] 🔧 Variáveis de ambiente configuradas (copie acima)
- [ ] 🔧 Porta 3003 configurada
- [ ] 🚀 Deploy iniciado

## 🌐 URLs após Deploy

- **App**: `https://seu-dominio:3003`
- **API**: `https://seu-dominio:3003/api`
- **Docs**: `https://seu-dominio:3003/api/docs`
- **Health**: `https://seu-dominio:3003/api/health/check`

## 🆘 Se der erro

1. **Database connection failed**: Verifique se `app_database_roadmap` está rodando
2. **Build failed**: Verifique logs no EasyPanel
3. **Port 3003 not accessible**: Confirme configuração de rede

---
**🎯 Pronto! Seu Roadmap App estará online!**
